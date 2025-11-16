/**
 * Query Classifier
 * Identifies queries that can be answered instantly from cache without AI
 * Returns discrete answers for common questions in <100ms
 */

import { loadTicketCache } from "./ticket-cache"

export interface ClassifiedQuery {
  matched: boolean
  answer?: string
  source: "cache" | "ai"
  confidence: number
  processingTime: number
}

/**
 * Check if query is asking about total ticket count
 * Excludes complex queries that need AI analysis
 */
function isTotalCountQuery(query: string): boolean {
  // Don't match if query has complex conditions (words, characters, contains, mention, etc.)
  if (/\b(words?|characters?|contains?|mention|longer|shorter|more than|less than|review|analyze)\b/i.test(query)) {
    return false
  }

  return /\b(total|how many|count|altogether|in total)\b.*\b(tickets?|issues?|cases?|items?)\b/i.test(
    query
  )
}

/**
 * Check if query is asking about tickets by status
 */
function isStatusQuery(query: string): { matched: boolean; statuses: string[] } {
  const statusPatterns: Record<string, string[]> = {
    open: ["open", "active", "ongoing", "in progress", "waiting"],
    closed: ["closed", "done", "finished", "resolved", "completed"],
    pending: ["pending", "waiting", "hold", "on hold", "paused"],
    solved: ["solved", "fixed", "resolved", "answer"],
    new: ["new", "fresh", "recent", "just created"],
  }

  const matched: string[] = []

  for (const [status, keywords] of Object.entries(statusPatterns)) {
    if (keywords.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(query))) {
      matched.push(status)
    }
  }

  return {
    matched: matched.length > 0,
    statuses: matched,
  }
}

/**
 * Check if query is asking about tickets by priority
 * Excludes complex queries that need AI analysis (review, prioritize, analyze, etc.)
 */
function isPriorityQuery(query: string): { matched: boolean; priorities: string[] } {
  // Don't match if query asks for review, analysis, or prioritization
  if (/\b(review|analyze|prioritize|which ones|tell me which|need attention|recommend)\b/i.test(query)) {
    return { matched: false, priorities: [] }
  }

  const priorityPatterns: Record<string, string[]> = {
    urgent: ["urgent", "critical", "asap"],
    high: ["high", "important", "major"],
    normal: ["normal", "medium", "regular", "standard"],
    low: ["low", "minor", "trivial"],
  }

  const matched: string[] = []

  for (const [priority, keywords] of Object.entries(priorityPatterns)) {
    if (keywords.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(query))) {
      matched.push(priority)
    }
  }

  return {
    matched: matched.length > 0,
    priorities: matched,
  }
}

/**
 * Check if query is asking about ticket age/recency
 */
function isAgeQuery(query: string): { matched: boolean; period: string | null } {
  if (/\b(recent|new|today|last 24|24 hour|yesterday)\b/i.test(query)) {
    return { matched: true, period: "lessThan24h" }
  }
  if (/\b(week|7 day|past week|last week|within 7)\b/i.test(query)) {
    return { matched: true, period: "lessThan7d" }
  }
  if (/\b(month|30 day|past month|last month|within 30)\b/i.test(query)) {
    return { matched: true, period: "lessThan30d" }
  }
  if (/\b(old|ancient|long|older|30\+ day)\b/i.test(query)) {
    return { matched: true, period: "olderThan30d" }
  }

  return { matched: false, period: null }
}

/**
 * Classify query and attempt instant answer from cache
 */
export async function classifyQuery(query: string): Promise<ClassifiedQuery> {
  const startTime = Date.now()

  try {
    // Load cache for analysis
    const cache = await loadTicketCache()
    if (!cache) {
      return {
        matched: false,
        source: "ai",
        confidence: 0,
        processingTime: Date.now() - startTime,
      }
    }

    // Check for total count query
    if (isTotalCountQuery(query)) {
      return {
        matched: true,
        answer: `We have **${cache.ticketCount}** tickets in total.`,
        source: "cache",
        confidence: 0.99,
        processingTime: Date.now() - startTime,
      }
    }

    // Check for status query
    const statusMatch = isStatusQuery(query)
    if (statusMatch.matched) {
      const statusBreakdown = statusMatch.statuses
        .map((status) => {
          const count = cache.stats.byStatus[status] || 0
          return `**${status}**: ${count}`
        })
        .join(" | ")

      return {
        matched: true,
        answer: `Status breakdown: ${statusBreakdown}`,
        source: "cache",
        confidence: 0.95,
        processingTime: Date.now() - startTime,
      }
    }

    // Check for priority query
    const priorityMatch = isPriorityQuery(query)
    if (priorityMatch.matched) {
      const priorityBreakdown = priorityMatch.priorities
        .map((priority) => {
          const count = cache.stats.byPriority[priority] || 0
          return `**${priority}**: ${count}`
        })
        .join(" | ")

      return {
        matched: true,
        answer: `Priority breakdown: ${priorityBreakdown}`,
        source: "cache",
        confidence: 0.95,
        processingTime: Date.now() - startTime,
      }
    }

    // Check for age query
    const ageMatch = isAgeQuery(query)
    if (ageMatch.matched && ageMatch.period) {
      const ageKey = ageMatch.period as keyof typeof cache.stats.byAge
      const count = cache.stats.byAge[ageKey] || 0
      const periodLabel = {
        lessThan24h: "in the last 24 hours",
        lessThan7d: "in the last 7 days",
        lessThan30d: "in the last 30 days",
        olderThan30d: "older than 30 days",
      }[ageMatch.period]

      return {
        matched: true,
        answer: `**${count}** tickets created ${periodLabel}.`,
        source: "cache",
        confidence: 0.95,
        processingTime: Date.now() - startTime,
      }
    }

    // No discrete answer found - needs AI analysis
    return {
      matched: false,
      source: "ai",
      confidence: 0,
      processingTime: Date.now() - startTime,
    }
  } catch (error) {
    console.error("[ClassifyQuery] Error:", error)
    return {
      matched: false,
      source: "ai",
      confidence: 0,
      processingTime: Date.now() - startTime,
    }
  }
}
