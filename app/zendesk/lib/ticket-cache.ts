/**
 * Zendesk Ticket Cache Manager
 * Persists full ticket dataset using Vercel Edge Config (production)
 * Falls back to filesystem for local development
 * Can be refreshed on-demand via "refresh" or "update" commands
 */

import { loadCacheFromStorage, saveCacheToStorage } from "./edge-config-store"
import { getZendeskClient } from "./zendesk-api-client"

interface CachedTicket {
  id: number
  subject: string
  description: string
  status: string
  priority: string
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
    byAge: {
      lessThan24h: number
      lessThan7d: number
      lessThan30d: number
      olderThan30d: number
    }
  }
}

const CACHE_TTL = 60 * 60 * 1000 // 1 hour in milliseconds

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
    const createdTime = new Date(ticket.created_at).getTime()
    const ageMs = now - createdTime
    const ageDays = ageMs / (1000 * 60 * 60 * 24)

    if (ageDays < 1) stats.lessThan24h++
    else if (ageDays < 7) stats.lessThan7d++
    else if (ageDays < 30) stats.lessThan30d++
    else stats.olderThan30d++
  }

  return stats
}

/**
 * Calculate statistics for the cached tickets
 */
function calculateStats(tickets: CachedTicket[]): TicketCacheData["stats"] {
  const byStatus: Record<string, number> = {}
  const byPriority: Record<string, number> = {}

  for (const ticket of tickets) {
    byStatus[ticket.status] = (byStatus[ticket.status] || 0) + 1
    byPriority[ticket.priority] = (byPriority[ticket.priority] || 0) + 1
  }

  return {
    byStatus,
    byPriority,
    byAge: calculateAgeStats(tickets),
  }
}

/**
 * Load cached tickets from Vercel Edge Config or filesystem fallback
 */
export async function loadTicketCache(): Promise<TicketCacheData | null> {
  try {
    const cache = await loadCacheFromStorage<TicketCacheData>()

    if (!cache) {
      console.log("[TicketCache] No cache found")
      return null
    }

    // Check if cache is still fresh
    const cacheAge = Date.now() - new Date(cache.lastUpdated).getTime()
    if (cacheAge > CACHE_TTL) {
      console.log(`[TicketCache] Cache is stale (${Math.round(cacheAge / 1000)}s old)`)
      return cache // Return it anyway, but it's marked as stale
    }

    console.log(`[TicketCache] Loaded ${cache.tickets.length} cached tickets`)
    return cache
  } catch (error) {
    console.error("[TicketCache] Error loading cache:", error)
    return null
  }
}

/**
 * Save tickets to Vercel Edge Config or filesystem fallback
 */
export async function saveTicketCache(tickets: CachedTicket[]): Promise<boolean> {
  try {
    const cacheData: TicketCacheData = {
      lastUpdated: new Date().toISOString(),
      ticketCount: tickets.length,
      tickets,
      stats: calculateStats(tickets),
    }

    const success = await saveCacheToStorage(cacheData)

    if (success) {
      console.log(`[TicketCache] Saved ${tickets.length} tickets to cache`)
      return true
    }

    console.error("[TicketCache] Failed to save cache")
    return false
  } catch (error) {
    console.error("[TicketCache] Error saving cache:", error)
    return false
  }
}

/**
 * Refresh cache from Zendesk API
 * Fetches ALL tickets and updates local cache
 */
export async function refreshTicketCache(): Promise<{
  success: boolean
  ticketCount: number
  message: string
  error?: string
}> {
  try {
    console.log("[TicketCache] Starting refresh from Zendesk API...")
    const client = getZendeskClient()
    const tickets: CachedTicket[] = []

    // Fetch all tickets from Zendesk API
    // Note: getTickets() now implements proper pagination internally
    // and fetches ALL tickets across all pages
    try {
      const pageTickets = await client.getTickets()

      if (!pageTickets || pageTickets.length === 0) {
        console.log("[TicketCache] No tickets found from Zendesk API")
      } else {
        // Convert to cached format
        const cachedTickets = pageTickets.map((t: unknown) => {
          const ticket = t as Record<string, unknown>
          const cached: CachedTicket = {
            id: ticket["id"] as number,
            subject: ticket["subject"] as string,
            description: (ticket["description"] as string) || "",
            status: ticket["status"] as string,
            priority: ticket["priority"] as string,
            created_at: ticket["created_at"] as string,
            updated_at: ticket["updated_at"] as string,
            assignee_id: ticket["assignee_id"] as number | null,
            requester_id: ticket["requester_id"] as number,
            tags: (ticket["tags"] as string[]) || [],
          }

          // Only add optional fields if they have values
          if (ticket["organization_id"]) {
            cached.organization_id = ticket["organization_id"] as number
          }
          if (ticket["group_id"]) {
            cached.group_id = ticket["group_id"] as number
          }

          return cached
        })

        tickets.push(...cachedTickets)
        console.log(`[TicketCache] Fetched ${cachedTickets.length} tickets from Zendesk API`)
      }
    } catch (error) {
      console.error("[TicketCache] Error fetching tickets from Zendesk API:", error)
      throw error
    }

    // Save to cache
    const saved = await saveTicketCache(tickets)

    if (!saved) {
      return {
        success: false,
        ticketCount: 0,
        message: "Failed to save tickets to cache",
        error: "Write error",
      }
    }

    return {
      success: true,
      ticketCount: tickets.length,
      message: `Successfully refreshed cache with ${tickets.length} tickets`,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("[TicketCache] Refresh failed:", error)
    return {
      success: false,
      ticketCount: 0,
      message: "Failed to refresh ticket cache",
      error: errorMsg,
    }
  }
}

/**
 * Get cache file path (for debugging/inspection)
 */
export function getCacheFilePath(): string {
  return CACHE_FILE
}

/**
 * Check if cache exists and is fresh
 */
export async function isCacheFresh(): Promise<boolean> {
  if (!existsSync(CACHE_FILE)) return false

  const cache = await loadTicketCache()
  if (!cache) return false

  const cacheAge = Date.now() - new Date(cache.lastUpdated).getTime()
  return cacheAge < CACHE_TTL
}

/**
 * Get cache stats without loading all tickets
 */
export async function getCacheStats(): Promise<TicketCacheData["stats"] | null> {
  const cache = await loadTicketCache()
  return cache?.stats || null
}
