/**
 * Zendesk Analysis Endpoint
 * POST /api/zendesk/analyze
 *
 * Provides comprehensive AI-powered analysis of support data
 * Handles: ticket counts, recent conversations, problem area identification, raw data display
 */

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getZendeskClient } from "@/app/zendesk/lib/zendesk-api-client"

const AnalysisRequestSchema = z.object({
  intent: z.enum([
    "help",
    "ticket_status",
    "recent_tickets",
    "problem_areas",
    "raw_data",
    "analytics",
  ]),
  query: z.string().min(1),
  filters: z.record(z.string(), z.unknown()).optional(),
})

/**
 * Generate help documentation with all available commands
 */
function generateHelpText(): string {
  const help = `
ZENDESK SUPPORT AI - AVAILABLE COMMANDS
========================================

TICKET STATUS QUERIES:
  "how many tickets are open"
  "how many tickets are closed"
  "count pending tickets"
  "total solved issues"
  → Shows ticket count breakdown by status

RECENT ACTIVITY:
  "show last conversation"
  "what is the most recent ticket"
  "get latest activity"
  "show recent updates"
  → Displays most recent support activity

PROBLEM AREAS:
  "what areas need help"
  "what areas need attention"
  "which topics have issues"
  "problem areas"
  → Analyzes tickets to identify common problems

ANALYTICS & STATISTICS:
  "show ticket statistics"
  "display analytics"
  "show metrics"
  → Comprehensive ticket statistics by status

RAW DATA:
  "show raw data"
  "display raw json"
  "return response data"
  → Display unformatted API responses

ALL TICKETS:
  "show all tickets"
  "list open tickets"
  "display closed issues"
  → List tickets with optional filtering

GENERAL QUERIES:
  "help" or "commands" or "available commands"
  → Display this help screen

EXAMPLES:
  "how many tickets are open or closed"
  "what is the last convo"
  "what area needs the most help"
  "show raw data"
`
  return help
}

/**
 * Get ticket status breakdown
 */
async function getTicketStatusInfo(client: any): Promise<string> {
  try {
    const stats = await client.getTicketStats()

    let output = "TICKET STATUS SUMMARY\n"
    output += "======================\n\n"
    output += "Status      | Count\n"
    output += "------------|-------\n"

    let total = 0
    for (const [status, count] of Object.entries(stats)) {
      output += `${String(status).padEnd(10)} | ${count}\n`
      total += Number(count)
    }

    output += "------------|-------\n"
    output += `Total      | ${total}\n`

    return output
  } catch (error) {
    return `Error fetching ticket status: ${error instanceof Error ? error.message : "Unknown error"}`
  }
}

/**
 * Get recent ticket activity
 */
async function getRecentActivity(client: any): Promise<string> {
  try {
    const tickets = await client.getTickets({ limit: 5 })

    if (tickets.length === 0) {
      return "No recent activity found."
    }

    let output = "RECENT ACTIVITY\n"
    output += "===============\n\n"

    for (let i = 0; i < Math.min(5, tickets.length); i++) {
      const ticket = tickets[i]
      const updated = new Date(ticket.updated_at).toLocaleString()
      output += `[${ticket.status.toUpperCase()}] Ticket #${ticket.id}\n`
      output += `  Subject: ${ticket.subject}\n`
      output += `  Priority: ${ticket.priority}\n`
      output += `  Updated: ${updated}\n\n`
    }

    return output
  } catch (error) {
    return `Error fetching recent activity: ${error instanceof Error ? error.message : "Unknown error"}`
  }
}

/**
 * Analyze problem areas using AI
 */
async function analyzeProblemAreas(client: any): Promise<string> {
  try {
    const tickets = await client.getTickets({ limit: 50 })

    if (tickets.length === 0) {
      return "No tickets available for analysis."
    }

    // Extract key information
    const subjects = tickets.map((t: any) => t.subject).join("\n")
    const priorityCount = {
      urgent: tickets.filter((t: any) => t.priority === "urgent").length,
      high: tickets.filter((t: any) => t.priority === "high").length,
      normal: tickets.filter((t: any) => t.priority === "normal").length,
      low: tickets.filter((t: any) => t.priority === "low").length,
    }

    const statusCount = {
      new: tickets.filter((t: any) => t.status === "new").length,
      open: tickets.filter((t: any) => t.status === "open").length,
      pending: tickets.filter((t: any) => t.status === "pending").length,
      hold: tickets.filter((t: any) => t.status === "hold").length,
      solved: tickets.filter((t: any) => t.status === "solved").length,
      closed: tickets.filter((t: any) => t.status === "closed").length,
    }

    // Use OpenAI to analyze problem areas
    const { text: analysis } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert support analyst. Analyze the following ticket data and identify the main problem areas. Be concise and actionable.",
      prompt: `
TICKET SUBJECTS:
${subjects}

PRIORITY BREAKDOWN:
- Urgent: ${priorityCount.urgent}
- High: ${priorityCount.high}
- Normal: ${priorityCount.normal}
- Low: ${priorityCount.low}

STATUS BREAKDOWN:
- New: ${statusCount.new}
- Open: ${statusCount.open}
- Pending: ${statusCount.pending}
- On Hold: ${statusCount.hold}
- Solved: ${statusCount.solved}
- Closed: ${statusCount.closed}

Based on this data, identify:
1. The main problem areas/themes
2. Priority distribution insights
3. Recommendations for support team

Keep the analysis brief and actionable.`,
      temperature: 0.7,
    })

    let output = "PROBLEM AREA ANALYSIS\n"
    output += "====================\n\n"
    output += analysis
    output += "\n\nPRIORITY DISTRIBUTION:\n"
    output += "- Urgent: " + priorityCount.urgent + "\n"
    output += "- High: " + priorityCount.high + "\n"
    output += "- Normal: " + priorityCount.normal + "\n"
    output += "- Low: " + priorityCount.low + "\n"

    return output
  } catch (error) {
    return `Error analyzing problem areas: ${error instanceof Error ? error.message : "Unknown error"}`
  }
}

/**
 * Get raw data response
 */
async function getRawData(client: any): Promise<string> {
  try {
    const stats = await client.getTicketStats()
    const tickets = await client.getTickets({ limit: 10 })

    const data = {
      stats,
      tickets: tickets.slice(0, 5), // Return first 5 for brevity
      timestamp: new Date().toISOString(),
    }

    return JSON.stringify(data, null, 2)
  } catch (error) {
    return `Error fetching raw data: ${error instanceof Error ? error.message : "Unknown error"}`
  }
}

/**
 * POST handler for analysis requests
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { intent, query } = AnalysisRequestSchema.parse(body)

    console.log(`[ZendeskAnalyze] Intent: ${intent}, Query: "${query}"`)

    const client = getZendeskClient()
    let responseContent = ""

    switch (intent) {
      case "help": {
        responseContent = generateHelpText()
        break
      }

      case "ticket_status": {
        responseContent = await getTicketStatusInfo(client)
        break
      }

      case "recent_tickets": {
        responseContent = await getRecentActivity(client)
        break
      }

      case "problem_areas": {
        responseContent = await analyzeProblemAreas(client)
        break
      }

      case "raw_data": {
        responseContent = await getRawData(client)
        break
      }

      case "analytics": {
        responseContent = await getTicketStatusInfo(client)
        break
      }

      default: {
        responseContent = "Unknown analysis type. Type 'help' for available commands."
      }
    }

    return NextResponse.json({
      success: true,
      intent,
      content: responseContent,
    })
  } catch (error) {
    console.error("[ZendeskAnalyze] Error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${error.issues[0]?.message}`,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to analyze",
      },
      { status: 500 }
    )
  }
}
