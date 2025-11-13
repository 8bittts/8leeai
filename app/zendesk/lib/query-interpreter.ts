import type { APICall, ParsedQuery, QueryIntent } from "./types"

/**
 * Query Interpreter
 * Converts natural language queries into Zendesk API calls.
 * Uses pattern matching for ~80% of queries, fallback to Claude for complex queries.
 */

// Query patterns for different intents
const QUERY_PATTERNS = {
  help: /^(help|commands|what can|show commands|list commands|available commands)/i,
  ticket_status:
    /^(how many|count|total).*(tickets?|issues?).*(open|close[d]?|pending|solved|on.hold|new)/i,
  recent_tickets: /^(show|get|last|recent).*(convo|conversation|ticket|message|activity|update)/i,
  problem_areas:
    /(area|areas|topic|topics|tag|category).*(need|help|attention|focus|issues?|problem)/i,
  raw_data: /^(show|display|return).*(raw|json|data|response)/i,
  ticket_list:
    /^(show|list|get|display)\s+(all\s+)?(open|closed|pending|solved)?\s*(support\s+)?(tickets|issues)/i,
  ticket_filter: /ticket.*(status|priority|type|assignee|tag|organization)/i,
  analytics:
    /^(show|what's|whats|what is|display).*(statistic|metric|average|total|count|performance|analytics|summary)/i,
  user_query: /(find|show|list).*(user|agent|customer|contact)/i,
  organization_query: /(find|show|list).*(organization|customer|account|company)/i,
  chat_query: /(chat|conversation|message).*(session|history|active)/i,
  call_query: /(call|phone|voice).*(log|history|missed|incoming|outgoing)/i,
  help_article: /(find|search).*(article|help|knowledge|doc|faq)/i,
  automation: /(show|list|create).*(automation|rule|workflow|macro)/i,
}

/**
 * Extracts filters from natural language query
 */
function extractFilters(query: string): Record<string, unknown> {
  const filters: Record<string, unknown> = {}

  // Status filters
  const statusMatch = query.match(/\b(open|closed|pending|solved|on-hold)\b/i)
  if (statusMatch && statusMatch[1]) {
    filters["status"] = statusMatch[1].toLowerCase()
  }

  // Priority filters
  const priorityMatch = query.match(/\b(urgent|high|normal|low)\s+(priority)?\b/i)
  if (priorityMatch && priorityMatch[1]) {
    filters["priority"] = priorityMatch[1].toLowerCase()
  }

  // Type filters
  const typeMatch = query.match(/\b(problem|incident|question|task)\b/i)
  if (typeMatch && typeMatch[1]) {
    filters["type"] = typeMatch[1].toLowerCase()
  }

  // Assignee filters
  if (/assigned to me|my tickets|for me/i.test(query)) {
    filters["assignee"] = "me"
  }

  // Organization/customer filters
  const orgMatch = query.match(/from\s+(\w+(?:\s+\w+)?)\b|organization:\s*(\S+)/i)
  if (orgMatch && (orgMatch[1] || orgMatch[2])) {
    filters["organization"] = orgMatch[1] || orgMatch[2]
  }

  // Time-based filters
  if (/today|last 24 hours?/i.test(query)) {
    filters["created_date"] = "today"
  } else if (/this week|last 7 days?|7d/i.test(query)) {
    filters["created_date"] = "this_week"
  } else if (/this month|last 30 days?|30d/i.test(query)) {
    filters["created_date"] = "this_month"
  }

  // Age/duration filters
  const ageMatch = query.match(/older than|not updated in|(\d+)\s*(hours?|days?|weeks?|months?)/i)
  if (ageMatch) {
    filters["age_filter"] = ageMatch[0]
  }

  // Tag filters
  const tagMatch = query.match(/tag(?:ged)?\s+with\s+(\w+)|tagged:\s*(\S+)/i)
  if (tagMatch && (tagMatch[1] || tagMatch[2])) {
    filters["tags"] = tagMatch[1] || tagMatch[2]
  }

  return filters
}

/**
 * Determines the suggested display format for results
 */
function suggestFormat(intent: QueryIntent): "table" | "metrics" | "list" | "timeline" {
  switch (intent) {
    case "analytics":
      return "metrics"
    case "chat_query":
    case "call_query":
      return "timeline"
    case "help_article":
      return "list"
    default:
      return "table"
  }
}

/**
 * Builds Zendesk API call from parsed query
 */
function buildAPICall(intent: QueryIntent, filters: Record<string, unknown>): APICall {
  switch (intent) {
    case "ticket_list":
    case "ticket_filter":
      return {
        method: "GET",
        endpoint: "/api/v2/tickets",
        params: {
          query: buildZQL(filters),
          sort_by: "created_at",
          sort_order: "desc",
          per_page: 50,
        },
      }

    case "analytics":
      return {
        method: "GET",
        endpoint: "/api/v2/incremental/tickets",
        params: {
          start_time: Math.floor(Date.now() / 1000) - 86400 * 30, // Last 30 days
        },
      }

    case "user_query":
      return {
        method: "GET",
        endpoint: "/api/v2/users",
        params: {
          per_page: 100,
        },
      }

    case "organization_query":
      return {
        method: "GET",
        endpoint: "/api/v2/organizations",
        params: {
          per_page: 100,
        },
      }

    case "help_article":
      return {
        method: "GET",
        endpoint: "/api/v2/help_center/articles",
        params: {
          per_page: 25,
        },
      }

    case "automation":
      return {
        method: "GET",
        endpoint: "/api/v2/automations",
        params: {
          per_page: 100,
        },
      }

    default:
      return {
        method: "GET",
        endpoint: "/api/v2/tickets",
        params: {
          per_page: 50,
        },
      }
  }
}

/**
 * Builds Zendesk Query Language (ZQL) string from filters
 */
function buildZQL(filters: Record<string, unknown>): string {
  const clauses: string[] = []

  if (filters["status"]) {
    clauses.push(`status:${filters["status"]}`)
  }
  if (filters["priority"]) {
    clauses.push(`priority:${filters["priority"]}`)
  }
  if (filters["type"]) {
    clauses.push(`type:${filters["type"]}`)
  }
  if (filters["assignee"]) {
    clauses.push(`assignee:${filters["assignee"]}`)
  }
  if (filters["organization"]) {
    clauses.push(`organization:"${filters["organization"]}"`)
  }
  if (filters["tags"]) {
    clauses.push(`tags:${filters["tags"]}`)
  }

  return clauses.join(" ")
}

/**
 * Main query interpretation function
 * Takes a natural language query and returns a structured API call
 */
export function interpretQuery(query: string): ParsedQuery {
  // Determine intent by matching patterns
  let intent: QueryIntent = "unknown"
  let confidence = 0

  for (const [patternIntent, pattern] of Object.entries(QUERY_PATTERNS)) {
    if (pattern.test(query)) {
      intent = patternIntent as QueryIntent
      confidence = 0.9 // High confidence for pattern matches
      break
    }
  }

  // Extract filters from query
  const filters = extractFilters(query)

  // Build API call
  const apiCall = buildAPICall(intent, filters)

  // Suggest display format
  const suggestedFormat = suggestFormat(intent)

  return {
    intent,
    apiCall,
    suggestedFormat,
    confidence,
    filters,
  }
}

/**
 * Fallback: Send query to Claude for interpretation
 * (To be implemented with actual API call)
 */
export async function interpretQueryWithAI(query: string): Promise<ParsedQuery> {
  // TODO: Implement Claude API call for complex query interpretation
  // This is the fallback for queries that don't match patterns

  console.log("Using AI interpretation for:", query)

  // For now, return the pattern-matched interpretation
  return interpretQuery(query)
}

/**
 * Validates that the query makes sense
 */
export function validateQuery(query: string): {
  valid: boolean
  message?: string
} {
  if (query.length < 3) {
    return { valid: false, message: "Query too short" }
  }

  // Check for potential SQL injection or malicious patterns
  if (/;|'|"|`|<|>/g.test(query)) {
    return {
      valid: false,
      message: "Query contains suspicious characters",
    }
  }

  return { valid: true }
}
