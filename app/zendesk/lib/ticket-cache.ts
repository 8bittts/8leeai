/**
 * Zendesk Ticket Cache Manager - SIMPLIFIED
 * Stores ticket data in /tmp/zendesk-cache.json
 * Uses /tmp for Vercel compatibility (writable in serverless)
 * Cache survives warm container, resets on cold starts
 */

import { readFileSync, writeFileSync, existsSync } from "fs"
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

const CACHE_FILE = "/tmp/zendesk-cache.json"
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
 * Load tickets from cache file
 */
export async function loadTicketCache(): Promise<TicketCacheData | null> {
  try {
    // Check if cache file exists (might not on cold start)
    if (!existsSync(CACHE_FILE)) {
      console.log("[TicketCache] No cache file found (cold start or first run)")
      return null
    }

    console.log(`[TicketCache] Loading from ${CACHE_FILE}`)
    const content = readFileSync(CACHE_FILE, "utf-8")
    const cache = JSON.parse(content) as TicketCacheData

    if (!cache.lastUpdated) {
      console.log("[TicketCache] Cache file exists but no data (corrupted?)")
      return null
    }

    // Check if cache is still fresh
    const cacheAge = Date.now() - new Date(cache.lastUpdated).getTime()
    if (cacheAge > CACHE_TTL) {
      console.log(`[TicketCache] Cache is stale (${Math.round(cacheAge / 1000)}s old)`)
      return cache // Return it anyway, but it's marked as stale
    }

    console.log(`[TicketCache] ✅ Loaded ${cache.tickets.length} cached tickets (${Math.round(cacheAge / 1000)}s old)`)
    return cache
  } catch (error) {
    console.error("[TicketCache] Error loading cache:", error)
    return null
  }
}

/**
 * Save tickets to cache file
 */
export async function saveTicketCache(tickets: CachedTicket[]): Promise<boolean> {
  try {
    const cacheData: TicketCacheData = {
      lastUpdated: new Date().toISOString(),
      ticketCount: tickets.length,
      tickets,
      stats: calculateStats(tickets),
    }

    const jsonData = JSON.stringify(cacheData, null, 2)
    const sizeKB = (jsonData.length / 1024).toFixed(2)

    console.log(`[TicketCache] Saving ${tickets.length} tickets to ${CACHE_FILE} (${sizeKB} KB)`)

    try {
      writeFileSync(CACHE_FILE, jsonData, "utf-8")
      console.log(`[TicketCache] ✅ Saved successfully`)
      return true
    } catch (writeError) {
      const errorMsg = writeError instanceof Error ? writeError.message : String(writeError)
      console.error(`[TicketCache] ❌ Write failed: ${errorMsg}`)
      console.error(`[TicketCache] Error details:`, writeError)
      return false
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`[TicketCache] ❌ Error preparing cache: ${errorMsg}`)
    console.error(`[TicketCache] Error details:`, error)
    return false
  }
}

/**
 * Refresh cache from Zendesk API
 * Fetches ALL tickets using pagination and saves to cache file
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

    // Save to cache file
    const saved = await saveTicketCache(tickets)

    if (!saved) {
      return {
        success: false,
        ticketCount: 0,
        message: "Failed to save tickets to cache file",
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
 * Get cache stats without loading all tickets
 */
export async function getCacheStats(): Promise<TicketCacheData["stats"] | null> {
  const cache = await loadTicketCache()
  return cache?.stats || null
}
