/**
 * Zendesk Ticket Fetcher - ULTRA SIMPLIFIED
 * No cache, no complexity - just fetch fresh data from Zendesk every time
 * Perfect for experimental/demo purposes
 */

import { getZendeskClient } from "./zendesk-api-client"

interface CachedTicket {
  id: number
  subject: string
  description: string
  status: string
  priority: string
  type: string // question, incident, problem, task
  created_at: string
  updated_at: string
  assignee_id: number | null
  requester_id: number
  tags: string[]
  organization_id?: number
  group_id?: number
}

interface TicketCacheData {
  lastUpdated: string
  ticketCount: number
  tickets: CachedTicket[]
  stats: {
    byStatus: Record<string, number>
    byPriority: Record<string, number>
    byType: Record<string, number>
    byAge: {
      lessThan24h: number
      lessThan7d: number
      lessThan30d: number
      olderThan30d: number
    }
  }
}

/**
 * Calculate ticket age-based statistics
 */
function calculateAgeStats(tickets: CachedTicket[]): TicketCacheData["stats"]["byAge"] {
  const now = Date.now()
  const stats = {
    lessThan24h: 0,
    lessThan7d: 0,
    lessThan30d: 0,
    olderThan30d: 0,
  }

  for (const ticket of tickets) {
    const age = now - new Date(ticket.created_at).getTime()
    const days = age / (1000 * 60 * 60 * 24)

    if (days < 1) stats.lessThan24h++
    else if (days < 7) stats.lessThan7d++
    else if (days < 30) stats.lessThan30d++
    else stats.olderThan30d++
  }

  return stats
}

/**
 * Calculate ticket statistics
 */
function calculateStats(tickets: CachedTicket[]): TicketCacheData["stats"] {
  const byStatus: Record<string, number> = {}
  const byPriority: Record<string, number> = {}
  const byType: Record<string, number> = {}

  for (const ticket of tickets) {
    byStatus[ticket.status] = (byStatus[ticket.status] || 0) + 1
    byPriority[ticket.priority] = (byPriority[ticket.priority] || 0) + 1
    byType[ticket.type] = (byType[ticket.type] || 0) + 1
  }

  return {
    byStatus,
    byPriority,
    byType,
    byAge: calculateAgeStats(tickets),
  }
}

/**
 * Load tickets - ALWAYS fetches fresh from Zendesk API
 * No cache, no file I/O, no complexity
 */
export async function loadTicketCache(): Promise<TicketCacheData | null> {
  try {
    console.log("[TicketFetcher] Fetching fresh data from Zendesk API...")
    const client = getZendeskClient()

    const pageTickets = await client.getTickets()

    if (!pageTickets || pageTickets.length === 0) {
      console.log("[TicketFetcher] No tickets found")
      return null
    }

    // Convert to cached format
    const tickets = pageTickets.map((t: unknown) => {
      const ticket = t as Record<string, unknown>
      const cached: CachedTicket = {
        id: ticket["id"] as number,
        subject: ticket["subject"] as string,
        description: (ticket["description"] as string) || "",
        status: ticket["status"] as string,
        priority: ticket["priority"] as string,
        type: (ticket["type"] as string) || "question", // Default to question if not specified
        created_at: ticket["created_at"] as string,
        updated_at: ticket["updated_at"] as string,
        assignee_id: ticket["assignee_id"] as number | null,
        requester_id: ticket["requester_id"] as number,
        tags: (ticket["tags"] as string[]) || [],
      }

      if (ticket["organization_id"]) {
        cached.organization_id = ticket["organization_id"] as number
      }
      if (ticket["group_id"]) {
        cached.group_id = ticket["group_id"] as number
      }

      return cached
    })

    const data: TicketCacheData = {
      lastUpdated: new Date().toISOString(),
      ticketCount: tickets.length,
      tickets,
      stats: calculateStats(tickets),
    }

    console.log(`[TicketFetcher] ✅ Fetched ${tickets.length} tickets`)
    return data
  } catch (error) {
    console.error("[TicketFetcher] Error fetching tickets:", error)
    return null
  }
}

/**
 * Get cache stats - same as loadTicketCache but different name for compatibility
 */
export async function getCacheStats(): Promise<TicketCacheData["stats"] | null> {
  const data = await loadTicketCache()
  return data?.stats || null
}

/**
 * Refresh cache - just an alias for loadTicketCache (no actual caching)
 */
export async function refreshTicketCache(): Promise<{
  success: boolean
  ticketCount: number
  message: string
  error?: string
}> {
  try {
    const data = await loadTicketCache()

    if (!data) {
      return {
        success: false,
        ticketCount: 0,
        message: "Failed to fetch tickets from Zendesk",
        error: "No data returned",
      }
    }

    return {
      success: true,
      ticketCount: data.ticketCount,
      message: `Successfully fetched ${data.ticketCount} tickets from Zendesk`,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      ticketCount: 0,
      message: "Failed to fetch tickets",
      error: errorMsg,
    }
  }
}
