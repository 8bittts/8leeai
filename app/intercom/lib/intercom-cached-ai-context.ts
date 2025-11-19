/**
 * Cached AI Context Handler
 * Manages persistent context for AI queries to reduce token usage
 * Caches serialized ticket data and system prompts across requests
 */

import { loadConversationCache } from "./intercom-conversation-cache"

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
  cacheData: Awaited<ReturnType<typeof loadConversationCache>>
): CachedContext {
  if (!cacheData) {
    throw new Error("Cache data is required")
  }

  // Build comprehensive conversation summaries with subject and preview
  // Include ALL conversations (not just first 50) so AI can do complex analysis
  const conversationSummaries = cacheData.conversations
    .map((conv) => {
      const priority = conv.priority ? "high" : "normal"
      const tags = conv.tags.length > 0 ? `[${conv.tags.join(", ")}]` : ""
      const subject = conv.source?.subject || "No subject"
      const bodyPreview = conv.source?.body ? ` - ${conv.source.body.substring(0, 150)}...` : ""
      return `CONV #${conv.id} [${priority}/${conv.state}] ${tags} "${subject}"${bodyPreview}`
    })
    .join("\n")

  // Build comprehensive ticket summaries with title and description
  const ticketSummaries = cacheData.tickets
    .map((ticket) => {
      const priority = ticket.priority || "normal"
      const description = ticket.description ? ` - ${ticket.description.substring(0, 150)}...` : ""
      return `TICKET #${ticket.id} [${priority}/${ticket.state}] "${ticket.title}"${description}`
    })
    .join("\n")

  // Combine both conversations and tickets
  const allItemSummaries = [conversationSummaries, ticketSummaries]
    .filter((s) => s.length > 0)
    .join("\n")

  // Build stats summary
  const statsSummary = `
CACHE STATISTICS:
- Conversations: ${cacheData.conversationCount}
- Tickets: ${cacheData.ticketCount}
- Total Items: ${cacheData.conversationCount + cacheData.ticketCount}
- By State: ${Object.entries(cacheData.stats.byState)
    .map(([k, v]) => `${k}:${v}`)
    .join(" | ")}
- By Priority: high:${cacheData.stats.byPriority.priority} | normal:${cacheData.stats.byPriority.noPriority}
- By Age: <24h:${cacheData.stats.byAge.lessThan24h} | <7d:${cacheData.stats.byAge.lessThan7d} | <30d:${cacheData.stats.byAge.lessThan30d} | >30d:${cacheData.stats.byAge.olderThan30d}
`

  return {
    ticketSummaries: allItemSummaries,
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
    const cache = await loadConversationCache()
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
  const cache = await loadConversationCache()
  if (!cache) {
    throw new Error("Unable to load ticket cache for context building")
  }

  cachedContext = buildContextFromCache(cache)
  console.log(
    `[CachedAIContext] Context built with ${cache.conversationCount} conversations and ${cache.ticketCount} tickets`
  )

  return cachedContext
}

/**
 * Build complete system prompt with injected context
 * Uses cached ticket data to provide grounding for AI
 */
export async function buildSystemPromptWithContext(): Promise<string> {
  const context = await getCachedContext()

  return `You are a helpful support analytics assistant. Answer questions about Intercom tickets and conversations based on the provided data.

Be concise and direct. If asked for statistics, provide specific numbers. If asked to analyze, provide actionable insights.

CURRENT DATA (automatically updated):
${context.statsSummary}

ALL ITEMS (Tickets and Conversations):
${context.ticketSummaries}

CAPABILITIES:
- You have access to ALL tickets and conversations with full metadata (title/subject, state, priority, descriptions)
- You can count items based on any criteria (state, priority, type, content, etc.)
- You can analyze patterns, trends, and prioritize items based on context
- You can search content and identify common issues
- Intercom has TICKETS (formal support requests) and CONVERSATIONS (informal chat interactions)

INSTRUCTIONS:
- Answer the user's question based on the provided data
- Be accurate with numbers - count carefully
- When listing tickets or conversations, ALWAYS include the title/subject and description/body preview, not just IDs
- Example: "TICKET #123: Password reset not working - User unable to reset password via email"
- For prioritization queries, consider priority, state, title/subject, and description content
- If you don't have data to answer a question, say so clearly
- Distinguish between tickets and conversations when relevant

RESPONSE FORMATTING:
- Use markdown formatting (**, ##, bullets) for structure and readability
- Keep individual lines under 250 characters for readability (use line breaks appropriately)
- Use bullet points (- or •) for lists of 3+ items
- Break long content into paragraphs with blank lines between sections
- Use correct terminology: "ticket" for tickets, "conversation" for conversations, "state" for Intercom items
- Avoid technical implementation terms: don't mention "cache", "database", "API", "JSON", "query", or code-specific terminology
- Be professional but conversational: no apologies, disclaimers, or preambles like "Based on the data..."
- Start with the answer immediately, then provide supporting details
- IMPORTANT: Never show just ticket/conversation IDs - always include the title and a brief description`
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
