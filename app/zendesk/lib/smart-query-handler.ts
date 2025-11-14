/**
 * Smart Query Handler
 * Uses cached ticket data + OpenAI to answer ANY natural language query
 * Intelligent fallback system for queries about support tickets
 */

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
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
 * Load and validate cache for queries
 */
async function loadAndValidateCache(startTime: number): Promise<QueryResponse | null> {
  console.log("[SmartQuery] Loading ticket cache...")
  let cache = await loadTicketCache()

  if (!cache) {
    console.log("[SmartQuery] Cache not found, refreshing from Zendesk...")
    const refreshResult = await refreshTicketCache()
    if (!refreshResult.success) {
      const processingTime = Date.now() - startTime
      return {
        answer: `❌ Unable to load ticket data\n\nError: ${refreshResult.error}\n\nPlease try the 'refresh' command to sync with Zendesk.`,
        source: "live",
        confidence: 0,
        processingTime,
      }
    }
    cache = await loadTicketCache()
  }

  if (!cache || cache.tickets.length === 0) {
    const processingTime = Date.now() - startTime
    return {
      answer: "❌ No tickets found in cache\n\nTry 'refresh' to sync with Zendesk",
      source: "cache",
      confidence: 0,
      processingTime,
    }
  }

  return null
}

/**
 * Main smart query handler
 * Uses cached data + AI to understand and answer queries
 */
export async function handleSmartQuery(query: string): Promise<QueryResponse> {
  const startTime = Date.now()

  try {
    // Check for refresh command
    if (isRefreshQuery(query)) {
      console.log("[SmartQuery] Handling refresh request")
      const refreshResult = await refreshTicketCache()
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

    // Load and validate cache
    const validationError = await loadAndValidateCache(startTime)
    if (validationError) {
      return validationError
    }

    const cache = await loadTicketCache()

    // Build context for AI
    const ticketSummaries = cache.tickets
      .slice(0, 50) // Use first 50 for context (to keep token count reasonable)
      .map((t: Ticket) => `[${t.priority}/${t.status}] #${t.id}: ${t.subject}`)
      .join("\n")

    const totalCount = cache.ticketCount
    const stats = cache.stats

    // Use AI to understand and answer the query
    console.log("[SmartQuery] Using AI to process query...")
    const { text: aiAnswer } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are a helpful support analytics assistant. Answer questions about support tickets based on the data provided.

Be concise and direct. If asked for statistics, provide specific numbers. If asked to analyze, provide actionable insights.

CONTEXT DATA:
- Total tickets: ${totalCount}
- Status breakdown: ${Object.entries(stats?.byStatus || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")}
- Priority breakdown: ${Object.entries(stats?.byPriority || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")}
- Age distribution: <24h: ${stats?.byAge?.lessThan24h}, <7d: ${stats?.byAge?.lessThan7d}, <30d: ${stats?.byAge?.lessThan30d}, >30d: ${stats?.byAge?.olderThan30d}

Recent ticket subjects for reference:
${ticketSummaries}

Answer the user's question based on this data. Be accurate with numbers.`,
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
