/**
 * Enhanced Query Classifier - Research-Based Classification System
 *
 * Two-tier decision tree for support ticket queries:
 * - TIER 1 (Fast Path <100ms): Discrete queries answered from pre-computed cache
 * - TIER 2 (AI Path 2-10s): Complex queries requiring reasoning and analysis
 *
 * Based on research from Intercom analytics patterns, customer support dashboards,
 * and natural language query interfaces.
 */

import { loadConversationCache } from "./intercom-conversation-cache"

export interface ClassifiedQuery {
  matched: boolean
  answer?: string
  source: "cache" | "ai"
  confidence: number
  processingTime: number
  reasoning?: string // Debug info: why this path was chosen
}

// ============================================
// DISCRETE QUERY INDICATORS (Cache/Fast Path)
// ============================================

const DISCRETE_INDICATORS = {
  // Counting queries - simple aggregation
  counting: [
    "how many",
    "count",
    "total",
    "number of",
    "altogether",
    "in total",
    "how much",
    "quantity",
  ],

  // Showing/listing - display aggregated data
  showing: ["show", "list", "display", "get", "give me", "what are", "tell me", "fetch"],

  // Checking status - boolean or simple lookup
  checking: ["what is", "is there", "do we have", "are there any", "check if"],

  // Breakdown requests - group by aggregation
  breakdown: ["breakdown", "distribution", "split", "categorize", "segment"],

  // Simple attributes - filterable dimensions
  status: [
    "open",
    "closed",
    "pending",
    "solved",
    "on hold",
    "active",
    "resolved",
    "new",
    "waiting",
  ],

  priority: ["urgent", "high", "critical", "asap", "important", "normal", "medium", "low", "minor"],

  // Ticket types - filterable dimensions
  ticketType: ["question", "incident", "problem", "task"],

  // Tags - filterable dimensions
  tags: [
    "billing",
    "technical",
    "feature-request",
    "bug",
    "urgent",
    "high-priority",
    "customer-success",
    "needs-review",
    "in-progress",
    "waiting-on-customer",
  ],

  // Time periods - temporal filters
  timeRecent: ["today", "recent", "new", "latest", "last 24", "yesterday"],
  timeWeekly: ["this week", "past week", "last week", "last 7 days", "7d"],
  timeMonthly: ["this month", "past month", "last month", "last 30 days", "30d"],
  timeOld: ["old", "older", "ancient", "stale", "30+ days"],
}

// ============================================
// COMPLEX QUERY INDICATORS (AI/Slow Path)
// ============================================

const COMPLEX_INDICATORS = {
  // Analysis verbs - deep investigation needed
  analysis: [
    "analyze",
    "review",
    "investigate",
    "examine",
    "assess",
    "evaluate",
    "study",
    "understand",
  ],

  // Content inspection - need to read ticket descriptions
  contentSearch: [
    "mentions",
    "contains",
    "includes",
    "talks about",
    "discusses",
    "regarding",
    "about",
    "related to",
  ],

  // Length-based filters - require content analysis
  lengthBased: [
    "longer than",
    "shorter than",
    "more than",
    "less than",
    "words",
    "characters",
    "lengthy",
    "detailed",
  ],

  // Comparative analysis - ranking/sorting
  ranking: ["most", "least", "top", "bottom", "best", "worst", "highest", "lowest"],

  // Trend detection - cross-ticket analysis
  trends: [
    "trending",
    "trend",
    "pattern",
    "common",
    "frequent",
    "recurring",
    "increasing",
    "decreasing",
  ],

  // Recommendation queries - action suggestions
  recommendations: [
    "should",
    "recommend",
    "suggest",
    "prioritize",
    "focus on",
    "needs attention",
    "next steps",
  ],

  // Action verbs requiring reasoning
  actionVerbs: ["which ones", "tell me which", "need attention", "require action", "must address"],

  // Why/insight questions
  why: ["why", "what's causing", "reason for", "root cause", "explain"],

  // Conditional logic - complex filtering
  conditionals: ["if", "when", "where", "with more than", "with less than", "without"],

  // Sentiment analysis
  sentiment: ["angry", "frustrated", "happy", "satisfied", "upset", "negative", "positive"],
}

/**
 * Main decision tree: Should this query use AI or cache?
 */
function shouldUseAI(query: string): { useAI: boolean; reasoning: string } {
  const q = query.toLowerCase()

  // STAGE 1: Explicit exclusions (ALWAYS CACHE)
  if (/^(refresh|update|sync|help|commands)\b/i.test(q)) {
    return { useAI: false, reasoning: "System command handled by cache" }
  }

  // STAGE 2: Strong AI signals (ALWAYS AI)

  // Content inspection needed (mentions, contains, about, etc.)
  if (COMPLEX_INDICATORS.contentSearch.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return { useAI: true, reasoning: "Requires content inspection" }
  }

  // Analysis/reasoning requests
  if (COMPLEX_INDICATORS.analysis.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return { useAI: true, reasoning: "Requires analysis/reasoning" }
  }

  // Why/insight questions
  if (COMPLEX_INDICATORS.why.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return { useAI: true, reasoning: "Requires explanation/insight" }
  }

  // Trend/pattern detection
  if (COMPLEX_INDICATORS.trends.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return { useAI: true, reasoning: "Requires pattern recognition" }
  }

  // Sentiment analysis
  if (COMPLEX_INDICATORS.sentiment.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return { useAI: true, reasoning: "Requires sentiment analysis" }
  }

  // STAGE 3: Complex modifiers on otherwise simple queries

  // Length-based filtering (word count, character count)
  if (COMPLEX_INDICATORS.lengthBased.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return { useAI: true, reasoning: "Requires length/word count analysis" }
  }

  // Action/recommendation verbs
  if (COMPLEX_INDICATORS.recommendations.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return { useAI: true, reasoning: "Requires recommendations/prioritization" }
  }

  if (COMPLEX_INDICATORS.actionVerbs.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return { useAI: true, reasoning: "Requires action recommendations" }
  }

  // Complex conditionals
  if (COMPLEX_INDICATORS.conditionals.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return { useAI: true, reasoning: "Requires complex filtering logic" }
  }

  // STAGE 4: Ambiguous comparatives
  // "most" is complex UNLESS it's a simple count comparison
  if (COMPLEX_INDICATORS.ranking.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    // Check if it's a simple count comparison like "which status has most tickets"
    const isSimpleCountComparison =
      /\b(which|what)\b.*\b(status|priority|type)\b.*\b(has|have)\b.*\b(most|least)\b/i.test(q)

    if (!isSimpleCountComparison) {
      return { useAI: true, reasoning: "Requires comparative analysis" }
    }
    // Otherwise fall through to cache - it's a simple aggregation
  }

  // STAGE 5: Default to cache for performance
  return { useAI: false, reasoning: "Simple discrete query" }
}

/**
 * Check for time-based patterns and return matching result
 */
function tryTimeBasedMatch(
  q: string,
  cache: NonNullable<Awaited<ReturnType<typeof loadConversationCache>>>
): { answer: string; confidence: number; reasoning: string } | null {
  if (DISCRETE_INDICATORS.timeRecent.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return {
      answer: `**${cache.stats.byAge.lessThan24h}** tickets created in the last 24 hours.`,
      confidence: 0.95,
      reasoning: "Time filter: last 24 hours",
    }
  }

  if (DISCRETE_INDICATORS.timeWeekly.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return {
      answer: `**${cache.stats.byAge.lessThan7d}** tickets created in the last 7 days.`,
      confidence: 0.95,
      reasoning: "Time filter: last 7 days",
    }
  }

  if (DISCRETE_INDICATORS.timeMonthly.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return {
      answer: `**${cache.stats.byAge.lessThan30d}** tickets created in the last 30 days.`,
      confidence: 0.95,
      reasoning: "Time filter: last 30 days",
    }
  }

  if (DISCRETE_INDICATORS.timeOld.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return {
      answer: `**${cache.stats.byAge.olderThan30d}** tickets older than 30 days.`,
      confidence: 0.95,
      reasoning: "Time filter: older than 30 days",
    }
  }

  return null
}

/**
 * Check for breakdown/distribution patterns and return matching result
 */
function tryBreakdownMatch(
  q: string,
  cache: NonNullable<Awaited<ReturnType<typeof loadConversationCache>>>
): { answer: string; confidence: number; reasoning: string } | null {
  if (!DISCRETE_INDICATORS.breakdown.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q))) {
    return null
  }

  if (/\b(status|state)\b/i.test(q)) {
    const breakdown = Object.entries(cache.stats.byStatus)
      .map(([status, count]) => `**${status}**: ${count}`)
      .join(" | ")
    return {
      answer: `Status breakdown: ${breakdown}`,
      confidence: 0.95,
      reasoning: "Status distribution",
    }
  }

  if (/\b(priority|priorities)\b/i.test(q)) {
    const breakdown = Object.entries(cache.stats.byPriority)
      .map(([priority, count]) => `**${priority}**: ${count}`)
      .join(" | ")
    return {
      answer: `Priority breakdown: ${breakdown}`,
      confidence: 0.95,
      reasoning: "Priority distribution",
    }
  }

  if (/\b(type|types|ticket type)\b/i.test(q)) {
    const breakdown = Object.entries(cache.stats.byType)
      .map(([type, count]) => `**${type}**: ${count}`)
      .join(" | ")
    return {
      answer: `Ticket type breakdown: ${breakdown}`,
      confidence: 0.95,
      reasoning: "Type distribution",
    }
  }

  return null
}

/**
 * Check for tag-based patterns and return matching result
 */
function tryTagMatch(
  q: string,
  cache: NonNullable<Awaited<ReturnType<typeof loadConversationCache>>>
): { answer: string; confidence: number; reasoning: string } | null {
  const tagMatch = DISCRETE_INDICATORS.tags.find((tag) => new RegExp(`\\b${tag}\\b`, "i").test(q))
  if (tagMatch && /\b(tag(ged)?|tickets?|issues?)\b/i.test(q)) {
    // Count tickets that have this tag
    const count = cache.tickets.filter((ticket) => ticket.tags.includes(tagMatch)).length
    return {
      answer: `Tickets with tag **${tagMatch}**: ${count}`,
      confidence: 0.95,
      reasoning: `Tag filter: ${tagMatch}`,
    }
  }
  return null
}

/**
 * Try to match discrete patterns and generate instant answers
 */
function tryDiscreteMatch(
  query: string,
  cache: Awaited<ReturnType<typeof loadConversationCache>>
): { answer: string; confidence: number; reasoning: string } | null {
  if (!cache) return null

  const q = query.toLowerCase()

  // Check specific queries BEFORE general total count
  // This prevents "how many incident tickets?" from matching total count

  // Tag queries (most specific - check first)
  const tagMatch = tryTagMatch(q, cache)
  if (tagMatch) return tagMatch

  // Type query (specific)
  const typeMatch = DISCRETE_INDICATORS.ticketType.find((type) =>
    new RegExp(`\\b${type}\\b`, "i").test(q)
  )
  if (typeMatch && /\b(tickets?|issues?)\b/i.test(q)) {
    const count = cache.stats.byType[typeMatch] || 0
    return {
      answer: `Ticket type breakdown: **${typeMatch}**: ${count}`,
      confidence: 0.95,
      reasoning: `Type filter: ${typeMatch}`,
    }
  }

  // Priority query (specific)
  const priorityMatch = DISCRETE_INDICATORS.priority.find((priority) =>
    new RegExp(`\\b${priority}\\b`, "i").test(q)
  )
  if (priorityMatch && /\b(tickets?|issues?)\b/i.test(q)) {
    const count = cache.stats.byPriority[priorityMatch] || 0
    return {
      answer: `Priority breakdown: **${priorityMatch}**: ${count}`,
      confidence: 0.95,
      reasoning: `Priority filter: ${priorityMatch}`,
    }
  }

  // Status query (specific)
  const statusMatch = DISCRETE_INDICATORS.status.find((status) =>
    new RegExp(`\\b${status}\\b`, "i").test(q)
  )
  if (statusMatch && /\b(tickets?|issues?)\b/i.test(q)) {
    const count = cache.stats.byStatus[statusMatch] || 0
    return {
      answer: `Status breakdown: **${statusMatch}**: ${count}`,
      confidence: 0.95,
      reasoning: `Status filter: ${statusMatch}`,
    }
  }

  // Time-based queries (specific)
  const timeMatch = tryTimeBasedMatch(q, cache)
  if (timeMatch) return timeMatch

  // Breakdown/distribution requests (specific)
  const breakdownMatch = tryBreakdownMatch(q, cache)
  if (breakdownMatch) return breakdownMatch

  // Total count query (general - check LAST as fallback)
  if (
    DISCRETE_INDICATORS.counting.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(q)) &&
    /\b(tickets?|issues?|cases?)\b/i.test(q)
  ) {
    return {
      answer: `We have **${cache.ticketCount}** tickets in total.`,
      confidence: 0.99,
      reasoning: "Total count from cache",
    }
  }

  return null
}

/**
 * Main classification function with comprehensive decision tree
 */
export async function classifyQuery(query: string): Promise<ClassifiedQuery> {
  const startTime = Date.now()

  try {
    // Load cache for analysis
    const cache = await loadConversationCache()
    if (!cache) {
      return {
        matched: false,
        source: "ai",
        confidence: 0,
        processingTime: Date.now() - startTime,
        reasoning: "No cache available",
      }
    }

    // Run decision tree
    const decision = shouldUseAI(query)

    if (decision.useAI) {
      return {
        matched: false,
        source: "ai",
        confidence: 0,
        processingTime: Date.now() - startTime,
        reasoning: decision.reasoning,
      }
    }

    // Try discrete pattern matching
    const discreteAnswer = await tryDiscreteMatch(query, cache)

    if (discreteAnswer) {
      return {
        matched: true,
        answer: discreteAnswer.answer,
        source: "cache",
        confidence: discreteAnswer.confidence,
        processingTime: Date.now() - startTime,
        reasoning: discreteAnswer.reasoning,
      }
    }

    // No match - defer to AI
    return {
      matched: false,
      source: "ai",
      confidence: 0,
      processingTime: Date.now() - startTime,
      reasoning: "No discrete pattern matched",
    }
  } catch (error) {
    console.error("[ClassifyQuery] Error:", error)
    return {
      matched: false,
      source: "ai",
      confidence: 0,
      processingTime: Date.now() - startTime,
      reasoning: "Error during classification",
    }
  }
}
