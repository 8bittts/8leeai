/**
 * Cached AI Context Handler
 * Manages persistent context for AI queries to reduce token usage
 * Caches serialized ticket data and system prompts across requests
 */

import { loadTicketCache } from "./ticket-cache"

interface CachedContext {
  ticketSummaries: string
  statsSummary: string
  cacheTimestamp: number
  cacheFileTimestamp: number
}

// In-memory cache for context (persists across requests in same process)
let cachedContext: CachedContext | null = null

/**
 * Build serialized context from cache file
 */
function buildContextFromCache(
  cacheData: Awaited<ReturnType<typeof loadTicketCache>>
): CachedContext {
  if (!cacheData) {
    throw new Error("Cache data is required")
  }

  // Build comprehensive ticket summaries with descriptions and word counts
  // Include ALL tickets (not just first 50) so AI can do complex analysis
  const ticketSummaries = cacheData.tickets
    .map((t) => {
      const wordCount = t.description.split(/\s+/).length
      const descPreview = t.description.substring(0, 100).replace(/\n/g, " ")
      return `#${t.id} [${t.priority}/${t.status}] ${t.subject} | ${wordCount} words | "${descPreview}..."`
    })
    .join("\n")

  // Build stats summary
  const statsSummary = `
TICKET STATISTICS:
- Total: ${cacheData.ticketCount}
- By Status: ${Object.entries(cacheData.stats.byStatus)
    .map(([k, v]) => `${k}:${v}`)
    .join(" | ")}
- By Priority: ${Object.entries(cacheData.stats.byPriority)
    .map(([k, v]) => `${k}:${v}`)
    .join(" | ")}
- By Age: <24h:${cacheData.stats.byAge.lessThan24h} | <7d:${cacheData.stats.byAge.lessThan7d} | <30d:${cacheData.stats.byAge.lessThan30d} | >30d:${cacheData.stats.byAge.olderThan30d}
`

  return {
    ticketSummaries,
    statsSummary,
    cacheTimestamp: Date.now(),
    cacheFileTimestamp: new Date(cacheData.lastUpdated).getTime(),
  }
}

/**
 * Check if cached context is still valid
 * Invalidates if cache file has been updated
 */
async function isCacheValid(): Promise<boolean> {
  if (!cachedContext) return false

  try {
    const cache = await loadTicketCache()
    if (!cache) return false

    const newTimestamp = new Date(cache.lastUpdated).getTime()
    return cachedContext.cacheFileTimestamp === newTimestamp
  } catch {
    return false
  }
}

/**
 * Get or rebuild cached context
 * Reuses context if cache file hasn't changed, rebuilds if needed
 */
export async function getCachedContext(): Promise<CachedContext> {
  // Check if we have valid cached context
  if (cachedContext && (await isCacheValid())) {
    console.log("[CachedAIContext] Using existing context (cache file unchanged)")
    return cachedContext
  }

  // Load cache and build new context
  console.log("[CachedAIContext] Building new context from cache")
  const cache = await loadTicketCache()
  if (!cache) {
    throw new Error("Unable to load ticket cache for context building")
  }

  cachedContext = buildContextFromCache(cache)
  console.log(`[CachedAIContext] Context built with ${cache.ticketCount} tickets`)

  return cachedContext
}

/**
 * Build complete system prompt with injected context
 * Uses cached ticket data to provide grounding for AI
 */
export async function buildSystemPromptWithContext(): Promise<string> {
  const context = await getCachedContext()

  return `You are a helpful support analytics assistant. Answer questions about support tickets based on the provided data.

Be concise and direct. If asked for statistics, provide specific numbers. If asked to analyze, provide actionable insights.

CURRENT TICKET DATA (automatically updated):
${context.statsSummary}

ALL TICKET DETAILS (with word counts and descriptions):
${context.ticketSummaries}

CAPABILITIES:
- You have access to ALL tickets with full metadata (subject, status, priority, word count, description preview)
- You can count tickets based on any criteria (status, priority, word count, content, etc.)
- You can analyze patterns, trends, and prioritize tickets based on context
- You can search ticket content and identify common issues

INSTRUCTIONS:
- Answer the user's question based on the provided ticket data
- Be accurate with numbers - count carefully
- When analyzing trends or problems, reference specific ticket IDs
- For word count queries, use the "X words" metadata provided for each ticket
- For prioritization queries, consider priority, status, subject, and description content
- If you don't have data to answer a question, say so clearly

RESPONSE FORMATTING:
- Use markdown formatting (**, ##, bullets) for structure and readability
- Keep individual lines under 250 characters for readability (use line breaks appropriately)
- Use bullet points (- or •) for lists of 3+ items
- Break long content into paragraphs with blank lines between sections
- Use domain language: say "ticket" not "record" or "entry", "status" not "state"
- Avoid technical implementation terms: don't mention "cache", "database", "API", "JSON", "query", or code-specific terminology
- Be professional but conversational: no apologies, disclaimers, or preambles like "Based on the data..."
- Start with the answer immediately, then provide supporting details`
}

/**
 * Clear cached context (used when manually refreshing)
 */
export function invalidateCache(): void {
  cachedContext = null
  console.log("[CachedAIContext] Cache invalidated")
}

/**
 * Get context statistics for debugging
 */
export function getContextStats(): {
  cached: boolean
  ticketsInContext: number
  cacheAge: number
} {
  if (!cachedContext) {
    return { cached: false, ticketsInContext: 0, cacheAge: 0 }
  }

  const summaryLines = cachedContext.ticketSummaries.split("\n").length
  const cacheAge = Date.now() - cachedContext.cacheTimestamp

  return {
    cached: true,
    ticketsInContext: summaryLines,
    cacheAge,
  }
}
