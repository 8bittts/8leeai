/**
 * Smart Query Handler
 * Fast response system with two-tier approach:
 * 1. Instant: Check classifier for discrete answers from cache (<100ms)
 * 2. Fallback: Use OpenAI with cached context for complex queries (2-3s)
 */

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { classifyQuery } from "./classify-query"
import { buildSystemPromptWithContext, invalidateCache } from "./cached-ai-context"
import { loadTicketCache, refreshTicketCache } from "./ticket-cache"

interface QueryResponse {
  answer: string
  source: "cache" | "live" | "ai"
  confidence: number
  processingTime: number
}

interface TicketStats {
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  byAge: {
    lessThan24h: number
    lessThan7d: number
    lessThan30d: number
    olderThan30d: number
  }
}

interface Ticket {
  id: number
  subject: string
  priority: string
  status: string
}

interface TicketCacheData {
  lastUpdated: string
  ticketCount: number
  tickets: Ticket[]
  stats: TicketStats
}

/**
 * Check if query is asking for a refresh
 */
function isRefreshQuery(query: string): boolean {
  return /^(refresh|update|sync|reload|fetch|pull)\b/i.test(query)
}

/**
 * Check if query is asking for help
 */
function isHelpQuery(query: string): boolean {
  return /^(help|commands|what can|how do|available|guide)\b/i.test(query)
}

/**
 * Generate help text
 */
function generateHelpText(): string {
  return `
ZENDESK INTELLIGENCE PORTAL - HELP
==================================

EXAMPLE QUERIES YOU CAN ASK:
────────────────────────────

📊 STATUS & COUNTS:
  "How many tickets do we have?"
  "How many tickets are open?"
  "Show me ticket status breakdown"
  "What's the total number of pending tickets?"

🏷️ PRIORITY & CLASSIFICATION:
  "How many urgent tickets are there?"
  "Show high priority tickets"
  "What's the priority distribution?"

📅 TIME-BASED:
  "Which tickets were created today?"
  "Show recent tickets"
  "What's the oldest ticket?"

🔍 SEARCH & FILTER:
  "Find tickets about login"
  "Show me support issues"
  "What topics appear most?"

🤖 INTELLIGENT ANALYSIS:
  "What are the main problems?"
  "Which areas need attention?"
  "Analyze our support trends"

🔄 DATA MANAGEMENT:
  "refresh" - Update cache with latest tickets
  "update" - Refresh ticket data from Zendesk

💡 TIP: Ask natural questions. The AI understands context!

Examples:
  "How many tickets do we have in total?"
  "Show me all urgent tickets"
  "What's been created in the last week?"
`
}

/**
 * Format ticket statistics for display
 */
function formatTicketStats(cache: TicketCacheData | null): string {
  if (!cache?.stats) return ""

  let output = "TICKET STATISTICS\n"
  output += "=================\n\n"

  if (cache.stats.byStatus && Object.keys(cache.stats.byStatus).length > 0) {
    output += "BY STATUS:\n"
    for (const [status, count] of Object.entries(cache.stats.byStatus)) {
      output += `  ${String(status).padEnd(12)} ${count}\n`
    }
    output += "\n"
  }

  if (cache.stats.byPriority && Object.keys(cache.stats.byPriority).length > 0) {
    output += "BY PRIORITY:\n"
    for (const [priority, count] of Object.entries(cache.stats.byPriority)) {
      output += `  ${String(priority).padEnd(12)} ${count}\n`
    }
    output += "\n"
  }

  if (cache.stats.byAge) {
    output += "BY AGE:\n"
    output += `  < 24 hours      ${cache.stats.byAge.lessThan24h}\n`
    output += `  < 7 days        ${cache.stats.byAge.lessThan7d}\n`
    output += `  < 30 days       ${cache.stats.byAge.lessThan30d}\n`
    output += `  > 30 days       ${cache.stats.byAge.olderThan30d}\n`
  }

  output += `\nLAST UPDATED: ${cache.lastUpdated}\n`
  output += `TOTAL TICKETS: ${cache.ticketCount}\n`

  return output
}

/**
 * Main smart query handler - Two-tier approach for fast responses
 * Tier 1: Instant answers from cache (discrete queries)
 * Tier 2: AI-powered analysis with cached context (complex queries)
 */
export async function handleSmartQuery(query: string): Promise<QueryResponse> {
  const startTime = Date.now()

  try {
    // Check for refresh command
    if (isRefreshQuery(query)) {
      console.log("[SmartQuery] Handling refresh request")
      const refreshResult = await refreshTicketCache()
      invalidateCache() // Clear cached context after refresh
      const processingTime = Date.now() - startTime

      return {
        answer: refreshResult.success
          ? `✅ Cache refreshed successfully!\n\nUpdated with ${refreshResult.ticketCount} tickets from Zendesk.\nMessage: ${refreshResult.message}`
          : `❌ Failed to refresh cache\n\nError: ${refreshResult.error}\n${refreshResult.message}`,
        source: "cache",
        confidence: refreshResult.success ? 1 : 0,
        processingTime,
      }
    }

    // Check for help command
    if (isHelpQuery(query)) {
      console.log("[SmartQuery] Handling help request")
      const processingTime = Date.now() - startTime

      return {
        answer: generateHelpText(),
        source: "cache",
        confidence: 1,
        processingTime,
      }
    }

    // TIER 1: Try instant answer from classifier
    console.log("[SmartQuery] Checking cache classifier for instant answer...")
    const classified = await classifyQuery(query)

    if (classified.matched && classified.answer) {
      console.log(`[SmartQuery] Instant answer matched (${classified.processingTime}ms)`)
      return {
        answer: classified.answer,
        source: "cache",
        confidence: classified.confidence,
        processingTime: classified.processingTime,
      }
    }

    // TIER 2: Fall back to AI with cached context
    console.log("[SmartQuery] Falling back to AI analysis with cached context...")

    // Validate cache exists before AI processing
    const cache = await loadTicketCache()
    if (!cache || cache.tickets.length === 0) {
      const processingTime = Date.now() - startTime
      return {
        answer:
          "❌ No tickets found in cache\n\nTry 'refresh' or 'update' to sync with Zendesk",
        source: "cache",
        confidence: 0,
        processingTime,
      }
    }

    // Build AI prompt with cached context
    const systemPrompt = await buildSystemPromptWithContext()

    const { text: aiAnswer } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: query,
      temperature: 0.7,
    })

    const processingTime = Date.now() - startTime

    return {
      answer: aiAnswer,
      source: "ai",
      confidence: 0.85,
      processingTime,
    }
  } catch (error) {
    const processingTime = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : String(error)

    console.error("[SmartQuery] Error:", error)

    return {
      answer: `❌ Error processing query\n\nError: ${errorMsg}\n\nPlease try again or use 'help' for available commands.`,
      source: "live",
      confidence: 0,
      processingTime,
    }
  }
}

/**
 * Quick stat lookup from cache (no AI needed)
 */
export async function getQuickStats(): Promise<string | null> {
  const cache = await loadTicketCache()
  if (!cache) return null

  return formatTicketStats(cache)
}
