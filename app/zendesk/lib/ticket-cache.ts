/**
 * Zendesk Ticket Cache Manager
 * Persists full ticket dataset locally for fast queries
 * Can be refreshed on-demand via "refresh" or "update" commands
 */

import { existsSync, mkdirSync } from "fs"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
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

const CACHE_DIR = join(process.cwd(), ".zendesk-cache")
const CACHE_FILE = join(CACHE_DIR, "tickets.json")
const CACHE_TTL = 60 * 60 * 1000 // 1 hour in milliseconds

/**
 * Ensure cache directory exists
 */
function ensureCacheDir(): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true })
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
 * Load cached tickets from disk
 */
export async function loadTicketCache(): Promise<TicketCacheData | null> {
  try {
    ensureCacheDir()

    if (!existsSync(CACHE_FILE)) {
      console.log("[TicketCache] No cache file found")
      return null
    }

    const data = await readFile(CACHE_FILE, "utf-8")
    const cache = JSON.parse(data) as TicketCacheData

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
 * Save tickets to cache
 */
export async function saveTicketCache(tickets: CachedTicket[]): Promise<boolean> {
  try {
    ensureCacheDir()

    const cacheData: TicketCacheData = {
      lastUpdated: new Date().toISOString(),
      ticketCount: tickets.length,
      tickets,
      stats: calculateStats(tickets),
    }

    await writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2), "utf-8")
    console.log(`[TicketCache] Saved ${tickets.length} tickets to cache`)
    return true
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

    // Fetch all tickets (Zendesk API supports pagination, we'll get them in batches)
    const tickets: CachedTicket[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      try {
        const pageTickets = await client.getTickets({ limit: 100 })

        if (!pageTickets || pageTickets.length === 0) {
          hasMore = false
          break
        }

        // Convert to cached format
        const cachedTickets = pageTickets.map((t: unknown) => {
          const ticket = t as Record<string, unknown>
          return {
          id: t.id,
          subject: t.subject,
          description: t.description || "",
          status: t.status,
          priority: t.priority,
          created_at: t.created_at,
          updated_at: t.updated_at,
          assignee_id: t.assignee_id,
          requester_id: t.requester_id,
          tags: t.tags || [],
          organization_id: t.organization_id,
          group_id: t.group_id,
        }))

        tickets.push(...cachedTickets)

        // If we got fewer than the limit, we've reached the end
        if (pageTickets.length < 100) {
          hasMore = false
        }

        page++
      } catch (error) {
        console.error(`[TicketCache] Error fetching page ${page}:`, error)
        hasMore = false
      }
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
