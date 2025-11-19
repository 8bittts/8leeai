/**
 * Comprehensive Query Pattern Recognition for Intercom Operations
 * Maps natural language queries to Intercom API operations
 * Supports both Conversations (primary) and Tickets (secondary)
 */

export interface QueryPattern {
  category: string
  operation: string
  patterns: RegExp[]
  requiresContext?: boolean
  requiresConfirmation?: boolean
  description: string
}

/**
 * Comprehensive pattern library covering all Intercom API operations
 * Organized by functional category for maintainability
 */
export const QUERY_PATTERNS: QueryPattern[] = [
  // ============================================================================
  // CONVERSATION RETRIEVAL & SEARCH (Primary entity in Intercom)
  // ============================================================================
  {
    category: "retrieval",
    operation: "list_conversations",
    patterns: [
      /\b(show|list|display|get|view|find)\s+(all\s+)?(my\s+)?(conversations?|tickets?|issues?)\b/i,
      /\b(what|which)\s+(conversations?|tickets?)\b/i,
      /\btop\s+\d+\s+(conversations?|tickets?)\b/i,
      /\brecent|latest|newest\s+(conversations?|tickets?)\b/i,
      /\bopen\s+(conversations?|tickets?)\b/i,
    ],
    description: "List all conversations or recent conversations",
  },
  {
    category: "retrieval",
    operation: "get_conversation_by_id",
    patterns: [
      /\b(show|display|get|view|find|open)\s+(conversation|ticket)\s*#?(\d+)\b/i,
      /\b(conversation|ticket)\s*#?(\d+)\b/i,
      /\b#(\d+)\b/,
    ],
    description: "Get specific conversation by ID (e.g., 'show conversation #473')",
  },
  {
    category: "retrieval",
    operation: "search_conversations",
    patterns: [
      /\b(search|find|filter|lookup|query)\s+(for\s+)?(conversations?|tickets?|issues?)\b/i,
      /\b(conversations?|tickets?)\s+(with|containing|about|regarding|matching)\b/i,
      /\b(high|urgent)\s+priority\s+(conversations?|tickets?)\b/i,
      /\b(open|closed|snoozed)\s+(conversations?|tickets?)\b/i,
    ],
    description: "Search conversations with filters or keywords",
  },
  {
    category: "retrieval",
    operation: "count_conversations",
    patterns: [
      /\bhow many\s+(total\s+)?(conversations?|tickets?|issues?)\b/i,
      /\b(conversation|ticket|issue)\s+count\b/i,
      /\bnumber of\s+(conversations?|tickets?)\b/i,
      /\bcount\s+(all\s+)?(conversations?|tickets?|issues?)\b/i,
    ],
    description: "Get total conversation count",
  },

  // ============================================================================
  // CONVERSATION STATUS OPERATIONS
  // ============================================================================
  {
    category: "status",
    operation: "update_status",
    patterns: [
      /\b(close|resolve|finish|complete)\s+(the\s+)?(conversation|ticket|issue)\b/i,
      /\b(mark|set|update|change)\s+(as|to|status)\s+(closed|open|snoozed)\b/i,
      /\b(reopen|re-open)\s+(the\s+)?(conversation|ticket|issue)\b/i,
      /\bsnooze\s+(the\s+)?(conversation|ticket)\b/i,
      /\bset\s+status\s+(to|as)\s+\w+/i,
      /\bstatus\s+(to|is|should be)\s+\w+/i,
    ],
    requiresContext: true,
    description: "Update conversation status (close, open, snooze, etc.)",
  },

  // ============================================================================
  // CONVERSATION PRIORITY OPERATIONS (Boolean in Intercom)
  // ============================================================================
  {
    category: "priority",
    operation: "update_priority",
    patterns: [
      /\b(set|change|update|mark)\s+(priority|importance|urgency)\b/i,
      /\b(make|mark)\s+(it\s+)?priority\b/i,
      /\bpriority\s+(to|is|should be)\s+(true|false|yes|no)\b/i,
      /\b(flag|mark)\s+(as\s+)?priority\b/i,
      /\b(remove|clear|unset)\s+priority\b/i,
    ],
    requiresContext: true,
    description: "Update conversation priority (boolean flag)",
  },

  // ============================================================================
  // TICKET CREATION (Formal tickets in Intercom)
  // ============================================================================
  {
    category: "creation",
    operation: "create_ticket",
    patterns: [
      /\b(create|make|open|submit|new)\s+(a\s+)?(ticket|issue)\b/i,
      /\b(file|log|report)\s+(a\s+)?(ticket|issue|bug|problem)\b/i,
      /\bnew\s+(support\s+)?(ticket|issue|request)\b/i,
    ],
    description: "Create a new formal ticket",
  },

  // ============================================================================
  // CONVERSATION ASSIGNMENT (Admins and Teams)
  // ============================================================================
  {
    category: "assignment",
    operation: "assign_conversation",
    patterns: [
      /\b(assign|give|delegate|hand|transfer)\s+(to|conversation to)\b/i,
      /\bset\s+assignee\s+(to|as)\b/i,
      /\bmake\s+\w+\s+(the\s+)?assignee\b/i,
      /\b(assignee|assigned to)\s+(is|should be)\b/i,
    ],
    requiresContext: true,
    description: "Assign conversation to an admin",
  },
  {
    category: "assignment",
    operation: "assign_to_team",
    patterns: [
      /\bassign\s+to\s+(the\s+)?(\w+\s+)?team\b/i,
      /\bset\s+team\s+(to|as)\b/i,
      /\bmove\s+to\s+(\w+\s+)?team\b/i,
    ],
    requiresContext: true,
    description: "Assign conversation to a team",
  },

  // ============================================================================
  // TAG OPERATIONS
  // ============================================================================
  {
    category: "tags",
    operation: "add_tags",
    patterns: [
      /\b(add|attach|apply|include)\s+(the\s+)?(tag|label)s?\b/i,
      /\btag\s+(with|as)\b/i,
      /\b(label|tag)\s+(it|this|that)\s+(as|with)\b/i,
    ],
    requiresContext: true,
    description: "Add tags to conversation",
  },
  {
    category: "tags",
    operation: "remove_tags",
    patterns: [/\b(remove|delete|untag|clear)\s+(the\s+)?(tag|label)s?\b/i, /\bremove\s+tag\b/i],
    requiresContext: true,
    description: "Remove tags from conversation",
  },
  {
    category: "tags",
    operation: "list_tags",
    patterns: [
      /\b(show|list|display|get)\s+(all\s+)?tags?\b/i,
      /\bwhat\s+tags?\b/i,
      /\bavailable\s+tags?\b/i,
    ],
    description: "List all tags",
  },

  // ============================================================================
  // REPLY GENERATION
  // ============================================================================
  {
    category: "reply",
    operation: "generate_reply",
    patterns: [
      /\b(build|create|generate|write|compose|draft)\s+(a\s+)?(reply|response|answer|message)\b/i,
      /\b(send|post)\s+(a\s+)?(reply|response|comment)\b/i,
      /\breply\s+to\s+(conversation|ticket|this|that)\b/i,
      /\brespond\s+to\s+(conversation|ticket|customer|user|contact)\b/i,
      /\banswer\s+(the\s+)?(conversation|ticket|customer|user|contact|question)\b/i,
    ],
    requiresContext: true,
    description: "Generate and post AI reply to conversation",
  },

  // ============================================================================
  // ANALYTICS & REPORTING
  // ============================================================================
  {
    category: "analytics",
    operation: "status_breakdown",
    patterns: [
      /\b(status|conversation|ticket)\s+(breakdown|summary|distribution|stats|statistics)\b/i,
      /\bhow many\s+(conversations?|tickets?\s+are\s+)?(open|closed|snoozed)\b/i,
      /\bcount\s+by\s+status\b/i,
      /\b(show|display|get)\s+(conversation|ticket)\s+stats\b/i,
    ],
    description: "Get conversation status breakdown and statistics",
  },
  {
    category: "analytics",
    operation: "priority_breakdown",
    patterns: [
      /\bpriority\s+(breakdown|summary|distribution|stats)\b/i,
      /\bhow many\s+priority\s+(conversations?|tickets?)\b/i,
      /\bcount\s+by\s+priority\b/i,
      /\bpriority\s+(conversations?|tickets?)\b/i,
    ],
    description: "Get priority conversation breakdown",
  },
  {
    category: "analytics",
    operation: "tag_breakdown",
    patterns: [
      /\btag\s+(breakdown|summary|distribution|stats)\b/i,
      /\bcount\s+by\s+tag\b/i,
      /\bmost\s+common\s+tags?\b/i,
      /\b(conversations?|tickets?)\s+by\s+tag\b/i,
    ],
    description: "Get tag distribution statistics",
  },
  {
    category: "analytics",
    operation: "assignee_breakdown",
    patterns: [
      /\b(conversations?|tickets?)\s+by\s+(assignee|admin|team)\b/i,
      /\bassignee\s+(breakdown|summary|distribution)\b/i,
      /\bwho\s+has\s+the\s+most\s+(conversations?|tickets?)\b/i,
      /\bworkload\s+(breakdown|distribution)\b/i,
    ],
    description: "Get assignee workload distribution",
  },
  {
    category: "analytics",
    operation: "response_times",
    patterns: [
      /\b(response|reply)\s+time(s)?\b/i,
      /\baverage\s+time\s+to\s+(respond|reply|answer)\b/i,
      /\btime\s+to\s+(first\s+)?(response|reply)\b/i,
      /\bhow\s+(fast|quick)\s+(are\s+we\s+)?responding\b/i,
    ],
    description: "Get response time statistics",
  },

  // ============================================================================
  // CONTACT & ADMIN QUERIES
  // ============================================================================
  {
    category: "contacts",
    operation: "list_contacts",
    patterns: [
      /\b(show|list|display|get)\s+(all\s+)?(contacts?|users?|customers?)\b/i,
      /\bwhat\s+contacts?\b/i,
    ],
    description: "List contacts",
  },
  {
    category: "contacts",
    operation: "search_contacts",
    patterns: [
      /\b(search|find|lookup)\s+(for\s+)?contacts?\b/i,
      /\bcontacts?\s+(with|matching|named)\b/i,
    ],
    description: "Search contacts",
  },
  {
    category: "admins",
    operation: "list_admins",
    patterns: [
      /\b(show|list|display|get)\s+(all\s+)?(admins?|agents?|teammates?)\b/i,
      /\bwho\s+(are|is)\s+(the\s+)?(admins?|agents?|teammates?)\b/i,
      /\bteam\s+members?\b/i,
    ],
    description: "List admins or agents",
  },
  {
    category: "teams",
    operation: "list_teams",
    patterns: [
      /\b(show|list|display|get)\s+(all\s+)?teams?\b/i,
      /\bwhat\s+teams?\b/i,
      /\bavailable\s+teams?\b/i,
    ],
    description: "List teams",
  },

  // ============================================================================
  // SYSTEM OPERATIONS
  // ============================================================================
  {
    category: "system",
    operation: "refresh",
    patterns: [
      /\b(refresh|reload|update|sync|fetch|pull)\s+(data|cache|conversations?|tickets?|all)?\b/i,
      /\bget\s+latest\s+(data|conversations?|tickets?)\b/i,
      /\bupdate\s+cache\b/i,
    ],
    description: "Refresh conversation cache from Intercom",
  },
  {
    category: "system",
    operation: "help",
    patterns: [
      /\b(help|commands?|guide|how|usage|instructions?)\b/i,
      /\bwhat can (you|I)\b/i,
      /\bavailable\s+(commands?|operations?|features?)\b/i,
    ],
    description: "Show help and available commands",
  },
]

/**
 * Extract conversation/ticket ID from query (e.g., "conversation #473" → "473")
 */
export function extractConversationId(query: string): string | null {
  // Match patterns: "conversation #473", "#473", "ticket 473"
  const match = query.match(/(?:conversation|ticket)\s*#?(\d+)\b/i)
  if (!match?.[1]) {
    // Try just #number
    const simpleMatch = query.match(/#(\d+)\b/)
    return simpleMatch?.[1] || null
  }
  return match[1]
}

/**
 * Extract multiple conversation IDs from query
 */
export function extractConversationIds(query: string): string[] {
  const matches = query.matchAll(/(?:conversation|ticket)\s*#?(\d+)\b/gi)
  const ids: string[] = []

  for (const match of matches) {
    if (match[1]) {
      ids.push(match[1])
    }
  }

  return ids
}

/**
 * Extract status from query (e.g., "close the conversation" → "closed")
 */
export function extractStatus(query: string): string | null {
  const statusMap: Record<string, string> = {
    close: "closed",
    closed: "closed",
    resolve: "closed",
    resolved: "closed",
    reopen: "open",
    "re-open": "open",
    open: "open",
    snooze: "snoozed",
    snoozed: "snoozed",
  }

  for (const [keyword, status] of Object.entries(statusMap)) {
    if (new RegExp(`\\b${keyword}\\b`, "i").test(query)) {
      return status
    }
  }

  return null
}

/**
 * Extract priority from query (boolean in Intercom)
 */
export function extractPriority(query: string): boolean | null {
  if (/\b(set|mark|flag|enable)\s+(as\s+)?priority\b/i.test(query)) {
    return true
  }
  if (/\b(remove|clear|unset|disable)\s+priority\b/i.test(query)) {
    return false
  }
  return null
}

/**
 * Extract email addresses from query
 */
export function extractEmails(query: string): string[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  return query.match(emailRegex) || []
}

/**
 * Extract tags from query (e.g., "tag it as billing" → ["billing"])
 */
export function extractTags(query: string): string[] {
  // Match quoted tags: tag "customer support"
  const quotedMatch = query.match(/(tag|label)s?\s+(as\s+|with\s+)?["']([^"']+)["']/i)
  if (quotedMatch?.[3]) {
    return [quotedMatch[3]]
  }

  // Match simple tags: tag it as billing
  const simpleMatch = query.match(/(tag|label)s?\s+(as\s+|with\s+)?(\w+)/i)
  if (simpleMatch?.[3]) {
    return [simpleMatch[3]]
  }

  // Match comma-separated: tag with billing, urgent, escalated
  const listMatch = query.match(/(tag|label)s?\s+(with\s+)?([a-z0-9_,\s]+)/i)
  if (listMatch?.[3]) {
    return listMatch[3].split(",").map((tag) => tag.trim())
  }

  return []
}

/**
 * Find matching patterns for a query
 */
export function matchQuery(query: string): QueryPattern[] {
  const matches: QueryPattern[] = []

  for (const pattern of QUERY_PATTERNS) {
    if (pattern.patterns.some((regex) => regex.test(query))) {
      matches.push(pattern)
    }
  }

  return matches
}

/**
 * Get best matching operation for a query (highest priority match)
 */
export function getBestMatch(query: string): QueryPattern | null {
  const matches = matchQuery(query)

  if (matches.length === 0) return null

  // Prioritize specific operations over general ones
  // Reply operations are high priority
  const replyMatch = matches.find((m) => m.operation === "generate_reply")
  if (replyMatch) return replyMatch

  // Conversation ID queries are high priority
  const conversationIdMatch = matches.find((m) => m.operation === "get_conversation_by_id")
  if (conversationIdMatch && extractConversationId(query)) return conversationIdMatch

  // Return first match otherwise
  return matches[0] || null
}

// Legacy exports for backwards compatibility
export const extractTicketId = extractConversationId
export const extractTicketIds = extractConversationIds
