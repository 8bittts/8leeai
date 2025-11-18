/**
 * Comprehensive Query Pattern Recognition for Zendesk Operations
 * Maps natural language queries to Zendesk API operations
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
 * Comprehensive pattern library covering all Zendesk API operations
 * Organized by functional category for maintainability
 */
export const QUERY_PATTERNS: QueryPattern[] = [
  // ============================================================================
  // TICKET RETRIEVAL & SEARCH
  // ============================================================================
  {
    category: "retrieval",
    operation: "list_tickets",
    patterns: [
      /\b(show|list|display|get|view|find)\s+(all\s+)?(my\s+)?(tickets?|issues?)\b/i,
      /\b(what|which)\s+tickets?\b/i,
      /\btop\s+\d+\s+tickets?\b/i,
      /\brecent|latest|newest\s+tickets?\b/i,
    ],
    description: "List all tickets or recent tickets",
  },
  {
    category: "retrieval",
    operation: "get_ticket_by_id",
    patterns: [
      /\b(show|display|get|view|find|open)\s+(ticket\s*)?#?(\d+)\b/i,
      /\bticket\s*#?(\d+)\b/i,
      /\b#(\d+)\b/,
    ],
    description: "Get specific ticket by ID (e.g., 'show ticket #473')",
  },
  {
    category: "retrieval",
    operation: "search_tickets",
    patterns: [
      /\b(search|find|filter|lookup|query)\s+(for\s+)?(tickets?|issues?)\b/i,
      /\btickets?\s+(with|containing|about|regarding|matching)\b/i,
      /\b(high|urgent|low|normal)\s+priority\s+tickets?\b/i,
      /\b(open|closed|pending|solved|new)\s+tickets?\b/i,
    ],
    description: "Search tickets with filters or keywords",
  },
  {
    category: "retrieval",
    operation: "count_tickets",
    patterns: [
      /\bhow many\s+(total\s+)?(tickets?|issues?)\b/i,
      /\b(ticket|issue)\s+count\b/i,
      /\bnumber of\s+tickets?\b/i,
      /\bcount\s+(all\s+)?(tickets?|issues?)\b/i,
    ],
    description: "Get total ticket count",
  },

  // ============================================================================
  // TICKET STATUS OPERATIONS
  // ============================================================================
  {
    category: "status",
    operation: "update_status",
    patterns: [
      /\b(close|solve|resolve|finish|complete)\s+(the\s+)?(ticket|issue)\b/i,
      /\b(mark|set|update|change)\s+(as|to|status)\s+(closed|solved|open|pending|new)\b/i,
      /\b(reopen|re-open)\s+(the\s+)?(ticket|issue)\b/i,
      /\bset\s+status\s+(to|as)\s+\w+/i,
      /\bstatus\s+(to|is|should be)\s+\w+/i,
    ],
    requiresContext: true,
    description: "Update ticket status (close, solve, reopen, etc.)",
  },

  // ============================================================================
  // TICKET PRIORITY OPERATIONS
  // ============================================================================
  {
    category: "priority",
    operation: "update_priority",
    patterns: [
      /\b(set|change|update|mark)\s+(priority|importance|urgency)\s+(to|as)\s+(urgent|high|normal|low)\b/i,
      /\b(make|mark)\s+(it\s+)?(urgent|high|normal|low)\s+priority\b/i,
      /\bpriority\s+(to|is|should be)\s+(urgent|high|normal|low)\b/i,
      /\b(escalate|raise|increase|bump)\s+priority\b/i,
      /\b(de-escalate|lower|decrease|reduce)\s+priority\b/i,
    ],
    requiresContext: true,
    description: "Update ticket priority level",
  },

  // ============================================================================
  // TICKET CREATION
  // ============================================================================
  {
    category: "creation",
    operation: "create_ticket",
    patterns: [
      /\b(create|make|open|submit|new)\s+(a\s+)?(ticket|issue)\b/i,
      /\b(file|log|report)\s+(a\s+)?(ticket|issue|bug|problem)\b/i,
      /\bnew\s+(support\s+)?(ticket|issue|request)\b/i,
    ],
    description: "Create a new ticket",
  },

  // ============================================================================
  // TICKET DELETION & SPAM
  // ============================================================================
  {
    category: "deletion",
    operation: "delete_ticket",
    patterns: [
      /\b(delete|remove|trash)\s+(the\s+)?(ticket|issue)\b/i,
      /\b(get rid of|discard)\s+(the\s+)?(ticket|issue)\b/i,
    ],
    requiresContext: true,
    requiresConfirmation: true,
    description: "Delete ticket (soft delete, recoverable)",
  },
  {
    category: "deletion",
    operation: "mark_spam",
    patterns: [
      /\b(mark|flag|label)\s+(as\s+)?spam\b/i,
      /\b(spam|junk)\s+(ticket|this)\b/i,
      /\bis\s+spam\b/i,
    ],
    requiresContext: true,
    requiresConfirmation: true,
    description: "Mark ticket as spam (suspends requester)",
  },
  {
    category: "deletion",
    operation: "restore_ticket",
    patterns: [
      /\b(restore|recover|undelete|bring back)\s+(the\s+)?(ticket|issue)\b/i,
      /\bundelete\s+ticket\b/i,
    ],
    description: "Restore deleted ticket",
  },

  // ============================================================================
  // TICKET MERGING
  // ============================================================================
  {
    category: "merge",
    operation: "merge_tickets",
    patterns: [
      /\b(merge|combine|consolidate)\s+(tickets?|issues?)\b/i,
      /\bmerge\s+#?\d+\s+(into|with|to)\s+#?\d+/i,
      /\bcombine\s+(multiple\s+)?tickets?\b/i,
    ],
    requiresContext: true,
    requiresConfirmation: true,
    description: "Merge multiple tickets into one",
  },

  // ============================================================================
  // TICKET ASSIGNMENT
  // ============================================================================
  {
    category: "assignment",
    operation: "assign_ticket",
    patterns: [
      /\b(assign|give|delegate|hand|transfer)\s+(to|ticket to)\b/i,
      /\bset\s+assignee\s+(to|as)\b/i,
      /\bmake\s+\w+\s+(the\s+)?assignee\b/i,
      /\b(assignee|assigned to)\s+(is|should be)\b/i,
    ],
    requiresContext: true,
    description: "Assign ticket to an agent",
  },
  {
    category: "assignment",
    operation: "assign_to_group",
    patterns: [
      /\bassign\s+to\s+(the\s+)?(\w+\s+)?group\b/i,
      /\bset\s+group\s+(to|as)\b/i,
      /\bmove\s+to\s+(\w+\s+)?group\b/i,
    ],
    requiresContext: true,
    description: "Assign ticket to an agent group",
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
    description: "Add tags to ticket",
  },
  {
    category: "tags",
    operation: "remove_tags",
    patterns: [/\b(remove|delete|untag|clear)\s+(the\s+)?(tag|label)s?\b/i, /\bremove\s+tag\b/i],
    requiresContext: true,
    description: "Remove tags from ticket",
  },

  // ============================================================================
  // COLLABORATION
  // ============================================================================
  {
    category: "collaboration",
    operation: "add_cc",
    patterns: [
      /\b(add|include|cc)\s+(user|email|person|someone)\b/i,
      /\bcc\s+\w+@\w+/i,
      /\badd\s+collaborator\b/i,
    ],
    requiresContext: true,
    description: "Add CC (collaborator) to ticket",
  },
  {
    category: "collaboration",
    operation: "remove_cc",
    patterns: [
      /\b(remove|delete)\s+(cc|collaborator)\b/i,
      /\buncc\s/i,
      /\bremove\s+\w+@\w+\s+from\s+(cc|collaborators?)/i,
    ],
    requiresContext: true,
    description: "Remove CC from ticket",
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
      /\breply\s+to\s+(ticket|this|that)\b/i,
      /\brespond\s+to\s+(ticket|customer|user)\b/i,
      /\banswer\s+(the\s+)?(ticket|customer|user|question)\b/i,
    ],
    requiresContext: true,
    description: "Generate and post AI reply to ticket",
  },

  // ============================================================================
  // ANALYTICS & REPORTING
  // ============================================================================
  {
    category: "analytics",
    operation: "status_breakdown",
    patterns: [
      /\b(status|ticket)\s+(breakdown|summary|distribution|stats|statistics)\b/i,
      /\bhow many\s+(tickets?\s+are\s+)?(open|closed|pending|solved|new)\b/i,
      /\bcount\s+by\s+status\b/i,
      /\b(show|display|get)\s+ticket\s+stats\b/i,
    ],
    description: "Get ticket status breakdown and statistics",
  },
  {
    category: "analytics",
    operation: "priority_breakdown",
    patterns: [
      /\bpriority\s+(breakdown|summary|distribution|stats)\b/i,
      /\bhow many\s+(urgent|high|normal|low)\s+priority\b/i,
      /\bcount\s+by\s+priority\b/i,
    ],
    description: "Get ticket priority breakdown",
  },
  {
    category: "analytics",
    operation: "age_analysis",
    patterns: [
      /\b(old|oldest|aging|stale)\s+tickets?\b/i,
      /\btickets?\s+older than\b/i,
      /\b(age|aging)\s+(analysis|report|breakdown)\b/i,
      /\bhow long\s+have\s+tickets\s+been\s+open\b/i,
    ],
    description: "Analyze ticket age and aging patterns",
  },

  // ============================================================================
  // ORGANIZATION & USER QUERIES
  // ============================================================================
  {
    category: "organization",
    operation: "list_organizations",
    patterns: [
      /\b(show|list|display|get)\s+(all\s+)?(organizations?|orgs?|companies)\b/i,
      /\bwhat\s+organizations?\b/i,
    ],
    description: "List organizations",
  },
  {
    category: "organization",
    operation: "org_tickets",
    patterns: [
      /\b(tickets?\s+for|from)\s+(the\s+)?organization\b/i,
      /\borganization'?s?\s+tickets?\b/i,
      /\ball\s+\w+\s+tickets?\b/i,
    ],
    description: "Get all tickets for an organization",
  },
  {
    category: "users",
    operation: "list_users",
    patterns: [
      /\b(show|list|display|get)\s+(all\s+)?(users?|agents?|people)\b/i,
      /\bwho\s+(are|is)\s+(the\s+)?(users?|agents?)\b/i,
    ],
    description: "List users or agents",
  },
  {
    category: "users",
    operation: "user_tickets",
    patterns: [
      /\b(tickets?\s+for|from|by)\s+(\w+|user|agent)\b/i,
      /\b(\w+)'?s?\s+tickets?\b/i,
      /\btickets?\s+assigned to\s+\w+/i,
      /\btickets?\s+requested by\s+\w+/i,
    ],
    description: "Get tickets for specific user",
  },

  // ============================================================================
  // SYSTEM OPERATIONS
  // ============================================================================
  {
    category: "system",
    operation: "refresh",
    patterns: [
      /\b(refresh|reload|update|sync|fetch|pull)\s+(data|cache|tickets?|all)?\b/i,
      /\bget\s+latest\s+(data|tickets?)\b/i,
      /\bupdate\s+cache\b/i,
    ],
    description: "Refresh ticket cache from Zendesk",
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

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================
  {
    category: "bulk",
    operation: "bulk_update",
    patterns: [
      /\b(update|change|modify)\s+(all|multiple|many|these|those)\s+tickets?\b/i,
      /\bbulk\s+(update|change|modify)\b/i,
      /\b(close|solve|delete)\s+(all|multiple|many)\b/i,
    ],
    requiresContext: true,
    requiresConfirmation: true,
    description: "Bulk update multiple tickets",
  },
  {
    category: "bulk",
    operation: "bulk_assign",
    patterns: [
      /\bassign\s+(all|multiple|many|these|those)\s+(to|tickets)\b/i,
      /\bbulk\s+assign\b/i,
      /\bmove\s+(all|multiple|many)\s+to\s+\w+/i,
    ],
    requiresContext: true,
    requiresConfirmation: true,
    description: "Bulk assign multiple tickets",
  },
]

/**
 * Extract ticket ID from query (e.g., "ticket #473" → 473)
 */
export function extractTicketId(query: string): number | null {
  // Match patterns: "ticket #473", "#473", "ticket 473"
  const match = query.match(/(?:ticket\s*)?#?(\d+)\b/i)
  if (!match?.[1]) return null

  const id = Number.parseInt(match[1], 10)
  return Number.isNaN(id) ? null : id
}

/**
 * Extract ticket IDs from query (e.g., "merge #473 and #472" → [473, 472])
 */
export function extractTicketIds(query: string): number[] {
  const matches = query.matchAll(/(?:ticket\s*)?#?(\d+)\b/gi)
  const ids: number[] = []

  for (const match of matches) {
    if (match[1]) {
      const id = Number.parseInt(match[1], 10)
      if (!Number.isNaN(id)) {
        ids.push(id)
      }
    }
  }

  return ids
}

/**
 * Extract status from query (e.g., "close the ticket" → "closed")
 */
export function extractStatus(query: string): string | null {
  const statusMap: Record<string, string> = {
    close: "closed",
    closed: "closed",
    solve: "solved",
    solved: "solved",
    resolve: "solved",
    resolved: "solved",
    reopen: "open",
    "re-open": "open",
    open: "open",
    pending: "pending",
    hold: "hold",
    new: "new",
  }

  for (const [keyword, status] of Object.entries(statusMap)) {
    if (new RegExp(`\\b${keyword}\\b`, "i").test(query)) {
      return status
    }
  }

  return null
}

/**
 * Extract priority from query (e.g., "make it urgent" → "urgent")
 */
export function extractPriority(query: string): string | null {
  const priorities = ["urgent", "high", "normal", "low"]

  for (const priority of priorities) {
    if (new RegExp(`\\b${priority}\\b`, "i").test(query)) {
      return priority
    }
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

  // Ticket ID queries are high priority
  const ticketIdMatch = matches.find((m) => m.operation === "get_ticket_by_id")
  if (ticketIdMatch && extractTicketId(query)) return ticketIdMatch

  // Return first match otherwise
  return matches[0] || null
}
