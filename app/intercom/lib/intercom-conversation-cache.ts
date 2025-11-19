/**
 * Intercom Data Fetcher - COMPREHENSIVE
 * Fetches conversations AND tickets from Intercom
 * Provides complete view of all customer interactions
 */

import { getIntercomAPIClient } from "./intercom-api-client"
import type { IntercomConversation, IntercomTicket } from "./intercom-types"

interface CachedConversation {
  id: string
  state: "open" | "closed" | "snoozed"
  priority: boolean
  created_at: number
  updated_at: number
  waiting_since: number | null
  admin_assignee_id: string | null
  team_assignee_id: string | null
  tags: string[]
  contact_ids: string[]
  statistics:
    | {
        time_to_assignment?: number
        time_to_admin_reply?: number
        time_to_first_close?: number
        median_time_to_reply?: number
      }
    | undefined
}

interface CachedTicket {
  id: string
  ticket_type_id: string
  ticket_type_name: string
  state: string
  title: string
  description: string
  created_at: number
  updated_at: number
  admin_assignee_id: string | null
  contact_emails: string[]
  priority: string | null
}

interface ConversationCacheData {
  lastUpdated: string
  conversationCount: number
  ticketCount: number
  conversations: CachedConversation[]
  tickets: CachedTicket[]
  stats: {
    byState: Record<string, number>
    byPriority: { priority: number; noPriority: number }
    byTag: Record<string, number>
    byAssignee: Record<string, number>
    byTeam: Record<string, number>
    byAge: {
      lessThan24h: number
      lessThan7d: number
      lessThan30d: number
      olderThan30d: number
    }
    responseTime: {
      avgTimeToAssignment: number
      avgTimeToReply: number
      avgTimeToClose: number
    }
  }
}

// In-memory cache with TTL (1 day)
let cachedData: ConversationCacheData | null = null
let cacheTimestamp = 0
const CACHE_TTL = 24 * 60 * 60 * 1000 // 1 day

/**
 * Calculate conversation age-based statistics
 */
function calculateAgeStats(
  conversations: CachedConversation[]
): ConversationCacheData["stats"]["byAge"] {
  const now = Date.now()
  const stats = {
    lessThan24h: 0,
    lessThan7d: 0,
    lessThan30d: 0,
    olderThan30d: 0,
  }

  for (const conv of conversations) {
    const age = now - conv.created_at * 1000 // Convert Unix timestamp to milliseconds
    const days = age / (1000 * 60 * 60 * 24)

    if (days < 1) stats.lessThan24h++
    else if (days < 7) stats.lessThan7d++
    else if (days < 30) stats.lessThan30d++
    else stats.olderThan30d++
  }

  return stats
}

/**
 * Calculate response time statistics
 */
function calculateResponseTimeStats(
  conversations: CachedConversation[]
): ConversationCacheData["stats"]["responseTime"] {
  let totalTimeToAssignment = 0
  let totalTimeToReply = 0
  let totalTimeToClose = 0
  let assignmentCount = 0
  let replyCount = 0
  let closeCount = 0

  for (const conv of conversations) {
    if (conv.statistics?.time_to_assignment) {
      totalTimeToAssignment += conv.statistics.time_to_assignment
      assignmentCount++
    }
    if (conv.statistics?.time_to_admin_reply) {
      totalTimeToReply += conv.statistics.time_to_admin_reply
      replyCount++
    }
    if (conv.statistics?.time_to_first_close) {
      totalTimeToClose += conv.statistics.time_to_first_close
      closeCount++
    }
  }

  return {
    avgTimeToAssignment: assignmentCount > 0 ? totalTimeToAssignment / assignmentCount : 0,
    avgTimeToReply: replyCount > 0 ? totalTimeToReply / replyCount : 0,
    avgTimeToClose: closeCount > 0 ? totalTimeToClose / closeCount : 0,
  }
}

/**
 * Calculate conversation statistics
 */
function calculateStats(conversations: CachedConversation[]): ConversationCacheData["stats"] {
  const byState: Record<string, number> = {}
  const byPriority = { priority: 0, noPriority: 0 }
  const byTag: Record<string, number> = {}
  const byAssignee: Record<string, number> = {}
  const byTeam: Record<string, number> = {}

  for (const conv of conversations) {
    // State counts
    byState[conv.state] = (byState[conv.state] || 0) + 1

    // Priority counts
    if (conv.priority) {
      byPriority.priority++
    } else {
      byPriority.noPriority++
    }

    // Tag counts
    for (const tag of conv.tags) {
      byTag[tag] = (byTag[tag] || 0) + 1
    }

    // Assignee counts
    if (conv.admin_assignee_id) {
      byAssignee[conv.admin_assignee_id] = (byAssignee[conv.admin_assignee_id] || 0) + 1
    } else {
      byAssignee["unassigned"] = (byAssignee["unassigned"] || 0) + 1
    }

    // Team counts
    if (conv.team_assignee_id) {
      byTeam[conv.team_assignee_id] = (byTeam[conv.team_assignee_id] || 0) + 1
    }
  }

  return {
    byState,
    byPriority,
    byTag,
    byAssignee,
    byTeam,
    byAge: calculateAgeStats(conversations),
    responseTime: calculateResponseTimeStats(conversations),
  }
}

/**
 * Convert IntercomConversation to CachedConversation
 */
function convertToCached(conv: IntercomConversation): CachedConversation {
  return {
    id: conv.id,
    state: conv.state,
    priority: conv.priority,
    created_at: conv.created_at,
    updated_at: conv.updated_at,
    waiting_since: conv.waiting_since,
    admin_assignee_id: conv.admin_assignee_id || null,
    team_assignee_id: conv.team_assignee_id || null,
    tags: conv.tags?.tags.map((t) => t.name) || [],
    contact_ids: conv.contacts?.contacts.map((c) => c.id) || [],
    statistics: conv.statistics
      ? {
          ...(conv.statistics.time_to_assignment !== undefined && {
            time_to_assignment: conv.statistics.time_to_assignment,
          }),
          ...(conv.statistics.time_to_admin_reply !== undefined && {
            time_to_admin_reply: conv.statistics.time_to_admin_reply,
          }),
          ...(conv.statistics.time_to_first_close !== undefined && {
            time_to_first_close: conv.statistics.time_to_first_close,
          }),
          ...(conv.statistics.median_time_to_reply !== undefined && {
            median_time_to_reply: conv.statistics.median_time_to_reply,
          }),
        }
      : undefined,
  }
}

/**
 * Convert IntercomTicket to CachedTicket
 */
function convertTicketToCached(ticket: IntercomTicket): CachedTicket {
  // Note: API returns ticket_state not state
  const state = (ticket as { ticket_state?: string }).ticket_state || ticket.state

  // Extract contacts from nested structure
  const contactsList =
    (ticket.contacts as { contacts?: Array<{ email?: string; id?: string }> })?.contacts || []
  const contactEmails = contactsList
    .map((c: { email?: string; id?: string }) => c.email || c.id || "")
    .filter((e: string) => e)

  // Extract priority with proper typing
  const priorityValue = ticket.ticket_attributes["priority"]
  const priority = typeof priorityValue === "string" ? priorityValue : null

  return {
    id: ticket.id,
    ticket_type_id: ticket.ticket_type.id,
    ticket_type_name: ticket.ticket_type.name,
    state,
    title: ticket.ticket_attributes._default_title_ || "Untitled",
    description: ticket.ticket_attributes._default_description_ || "",
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    admin_assignee_id: ticket.admin_assignee_id || null,
    contact_emails: contactEmails,
    priority,
  }
}

/**
 * Fetch fresh data from Intercom API and update cache
 */
async function fetchFreshData(): Promise<ConversationCacheData | null> {
  try {
    console.log("[DataFetcher] Fetching fresh data from Intercom API...")
    const client = getIntercomAPIClient()

    // Fetch conversations and tickets in parallel
    const [rawConversations, rawTickets] = await Promise.all([
      client.getConversations(),
      // Search for all tickets across all states
      client.searchTickets({
        query: {
          operator: "OR",
          value: [
            { field: "state", operator: "=", value: "submitted" },
            { field: "state", operator: "=", value: "open" },
            { field: "state", operator: "=", value: "waiting_on_customer" },
            { field: "state", operator: "=", value: "resolved" },
          ],
        },
      }),
    ])

    const conversationCount = rawConversations?.length || 0
    const ticketCount = rawTickets?.length || 0

    console.log(
      `[DataFetcher] Fetched ${conversationCount} conversations and ${ticketCount} tickets`
    )

    // Convert to cached format
    const conversations = (rawConversations || []).map(convertToCached)
    const tickets = (rawTickets || []).map(convertTicketToCached)

    const data: ConversationCacheData = {
      lastUpdated: new Date().toISOString(),
      conversationCount: conversations.length,
      ticketCount: tickets.length,
      conversations,
      tickets,
      stats: calculateStats(conversations),
    }

    // Update cache
    cachedData = data
    cacheTimestamp = Date.now()

    console.log(
      `[DataFetcher] ✅ Cached ${conversations.length} conversations and ${tickets.length} tickets`
    )
    console.log(
      `[DataFetcher] Stats: ${data.stats.byState["open"] || 0} open, ${data.stats.byState["closed"] || 0} closed, ${data.stats.byState["snoozed"] || 0} snoozed`
    )
    return data
  } catch (error) {
    console.error("[DataFetcher] Error fetching data:", error)
    return null
  }
}

/**
 * Load conversations AND tickets - Uses in-memory cache with 5min TTL
 * Only fetches fresh data if cache is expired or doesn't exist
 */
export async function loadConversationCache(): Promise<ConversationCacheData | null> {
  // Check if cache is valid
  const cacheAge = Date.now() - cacheTimestamp
  const isCacheValid = cachedData && cacheAge < CACHE_TTL

  if (isCacheValid) {
    console.log(
      `[DataFetcher] Using cached data (age: ${Math.round(cacheAge / 1000)}s, ${cachedData?.conversationCount} conversations, ${cachedData?.ticketCount} tickets)`
    )
    return cachedData
  }

  // Cache expired or doesn't exist - fetch fresh
  if (cachedData) {
    console.log(
      `[DataFetcher] Cache expired (age: ${Math.round(cacheAge / 1000)}s), fetching fresh data`
    )
  }

  return await fetchFreshData()
}

/**
 * Get cache stats - same as loadConversationCache but different name for compatibility
 */
export async function getCacheStats(): Promise<ConversationCacheData["stats"] | null> {
  const data = await loadConversationCache()
  return data?.stats || null
}

/**
 * Refresh cache - FORCE fetches fresh data from Intercom (ignores cache)
 */
export async function refreshConversationCache(): Promise<{
  success: boolean
  conversationCount: number
  ticketCount: number
  message: string
  stats?: ConversationCacheData["stats"]
  error?: string
}> {
  try {
    // Force fresh fetch by invalidating cache
    console.log("[DataFetcher] Manual refresh requested - invalidating cache")
    cachedData = null
    cacheTimestamp = 0

    const data = await fetchFreshData()

    if (!data) {
      return {
        success: false,
        conversationCount: 0,
        ticketCount: 0,
        message: "Failed to fetch data from Intercom",
        error: "No data returned",
      }
    }

    return {
      success: true,
      conversationCount: data.conversationCount,
      ticketCount: data.ticketCount,
      message: `Successfully fetched ${data.conversationCount} conversations and ${data.ticketCount} tickets from Intercom`,
      stats: data.stats,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      conversationCount: 0,
      ticketCount: 0,
      message: "Failed to fetch data",
      error: errorMsg,
    }
  }
}

// Alias exports for ticket-style naming (Intercom has both conversations and tickets)
export const loadTicketCache = loadConversationCache
export const refreshTicketCache = refreshConversationCache
