/**
 * Intercom REST API Client
 * Handles authentication, requests, caching, and error handling for Intercom APIs
 * Based on MASTER.md architecture (lines 272-307)
 */

import type {
  IntercomAdmin,
  IntercomContact,
  IntercomConversation,
  IntercomSearchQuery,
  IntercomTag,
  IntercomTeam,
  IntercomTicket,
  IntercomTicketType,
} from "./intercom-types"

interface IntercomAPIError {
  error: string
  description?: string
  status: number
}

interface ConversationFilters {
  state?: "open" | "closed" | "snoozed"
  priority?: boolean
  limit?: number
}

interface TicketData {
  ticket_type_id: string
  contacts: Array<{ id: string } | { email: string }>
  ticket_attributes: {
    _default_title_: string
    _default_description_: string
    [key: string]: unknown
  }
  state?: "submitted" | "open" | "waiting_on_customer" | "resolved"
  admin_assignee_id?: string
}

interface TicketUpdate {
  state?: string
  priority?: string
  admin_assignee_id?: string
  tags?: string[]
}

interface ConversationUpdate {
  state?: "open" | "closed" | "snoozed"
  admin_assignee_id?: string
  team_assignee_id?: string
  priority?: boolean
}

interface ContactData {
  email?: string
  name?: string
  role?: "user" | "lead"
  custom_attributes?: Record<string, unknown>
}

/**
 * Intercom API Client
 * Implements Bearer token authentication, caching, rate limiting, and error handling
 */
export class IntercomAPIClient {
  private accessToken: string
  private baseUrl: string
  private cache: Map<string, { data: unknown; timestamp: number }>
  private cacheTTL: Record<string, number> = {
    conversations: 24 * 60 * 60 * 1000, // 1 day
    tickets: 24 * 60 * 60 * 1000, // 1 day
    contacts: 24 * 60 * 60 * 1000, // 1 day
    admins: 24 * 60 * 60 * 1000, // 1 day
    teams: 24 * 60 * 60 * 1000, // 1 day
    tags: 24 * 60 * 60 * 1000, // 1 day
  }

  // Rate limit tracking (Intercom: 10,000 requests/minute)
  private rateLimitInfo = {
    limit: 10000,
    remaining: 10000,
    reset: Date.now() + 60000, // Reset in 1 minute
  }

  constructor() {
    this.accessToken = process.env["INTERCOM_ACCESS_TOKEN"] || ""
    this.baseUrl = this.getRegionalEndpoint()
    this.cache = new Map()
    this.validateConfig()
  }

  /**
   * Get regional API endpoint based on INTERCOM_REGION environment variable
   * Supports: US (default), EU, AU
   */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Method is called in constructor (line 89), false positive in Biome 2.3.6
  private getRegionalEndpoint(): string {
    const region = (process.env["INTERCOM_REGION"] || "US").toUpperCase()
    const endpoints: Record<string, string> = {
      US: "https://api.intercom.io",
      EU: "https://api.eu.intercom.io",
      AU: "https://api.au.intercom.io",
    }
    const endpoint = endpoints[region] ?? endpoints["US"] ?? "https://api.intercom.io"
    console.log(`[API] Using ${region} endpoint: ${endpoint}`)
    return endpoint
  }

  /**
   * Update rate limit information from response headers
   */
  private updateRateLimitInfo(headers: Headers): void {
    const limit = headers.get("X-RateLimit-Limit")
    const remaining = headers.get("X-RateLimit-Remaining")
    const reset = headers.get("X-RateLimit-Reset")

    if (limit) this.rateLimitInfo.limit = Number.parseInt(limit, 10)
    if (remaining) this.rateLimitInfo.remaining = Number.parseInt(remaining, 10)
    if (reset) this.rateLimitInfo.reset = Number.parseInt(reset, 10) * 1000 // Convert to ms

    // Log warning if approaching rate limit (< 100 requests remaining)
    if (this.rateLimitInfo.remaining < 100) {
      const resetDate = new Date(this.rateLimitInfo.reset)
      console.warn(
        `[API] ⚠️ Approaching rate limit! Remaining: ${this.rateLimitInfo.remaining}/${this.rateLimitInfo.limit}. Resets at ${resetDate.toLocaleTimeString()}`
      )
    }
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus(): {
    limit: number
    remaining: number
    resetAt: string
    percentageUsed: number
  } {
    const percentageUsed =
      ((this.rateLimitInfo.limit - this.rateLimitInfo.remaining) / this.rateLimitInfo.limit) * 100
    return {
      limit: this.rateLimitInfo.limit,
      remaining: this.rateLimitInfo.remaining,
      resetAt: new Date(this.rateLimitInfo.reset).toISOString(),
      percentageUsed: Number(percentageUsed.toFixed(2)),
    }
  }

  /**
   * Validate that required environment variables are configured
   */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Method is called in constructor (line 83), false positive in Biome 2.3.6
  private validateConfig(): void {
    if (!this.accessToken) {
      throw new Error("INTERCOM_ACCESS_TOKEN environment variable not configured")
    }
  }

  /**
   * Build Authorization header using Bearer token
   * Using Intercom API v2.14 (latest as of November 2025)
   */
  private getAuthHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Intercom-Version": "2.14",
    }
  }

  /**
   * Generate cache key
   */
  private getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
    let key = endpoint
    if (params) {
      const queryString = Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join("&")
      key = `${endpoint}?${queryString}`
    }
    return key
  }

  /**
   * Get cached data if available and not expired
   */
  private getFromCache<T>(key: string, category: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const ttl = this.cacheTTL[category] || 5 * 60 * 1000
    const isExpired = Date.now() - cached.timestamp > ttl

    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  /**
   * Store data in cache
   */
  private setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * Make authenticated request to Intercom API
   * Automatically tracks rate limit headers for proactive monitoring
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = { ...this.getAuthHeaders(), ...options.headers }

    try {
      const response = await fetch(url, { ...options, headers })

      // Update rate limit tracking from response headers
      this.updateRateLimitInfo(response.headers)

      // Handle rate limiting (429)
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After")
        const waitTime = retryAfter ? Number.parseInt(retryAfter, 10) * 1000 : 60000
        console.warn(`[API] 🛑 Rate limit hit (429). Waiting ${waitTime / 1000}s before retry...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        return this.request<T>(endpoint, options)
      }

      if (!response.ok) {
        const errorData = await response.json()
        const error: IntercomAPIError = {
          error: errorData.type || "API Error",
          description: errorData.errors?.[0]?.message || response.statusText,
          status: response.status,
        }
        throw error
      }

      return await response.json()
    } catch (error) {
      if (error && typeof error === "object" && "status" in error) {
        throw error
      }
      throw {
        error: "Network Error",
        description: error instanceof Error ? error.message : "Unknown error",
        status: 0,
      } as IntercomAPIError
    }
  }

  /**
   * Fetch with automatic pagination
   */
  private async fetchAllPages<T>(endpoint: string): Promise<T[]> {
    const results: T[] = []
    let hasMore = true
    let startingAfter: string | null = null

    while (hasMore) {
      const params: string = startingAfter ? `?starting_after=${startingAfter}` : ""
      const response = await this.request<{
        type: string
        data: T[]
        pages?: { next?: { starting_after: string }; page?: number; total_pages?: number }
      }>(`${endpoint}${params}`)

      if (response.data) {
        results.push(...response.data)
      }

      // Check pagination
      if (response.pages?.next?.starting_after) {
        startingAfter = response.pages.next.starting_after
      } else {
        hasMore = false
      }
    }

    return results
  }

  // ============================================================================
  // CONVERSATIONS API (Primary for Intercom)
  // ============================================================================

  /**
   * List all conversations
   * GET /conversations
   */
  async getConversations(filters?: ConversationFilters): Promise<IntercomConversation[]> {
    const cacheKey = this.getCacheKey("/conversations", filters as Record<string, unknown>)
    const cached = this.getFromCache<IntercomConversation[]>(cacheKey, "conversations")
    if (cached) {
      console.log(`[API] Using cached conversations (${cached.length} conversations)`)
      return cached
    }

    console.log("[API] Fetching conversations from Intercom API...")
    const conversations = await this.fetchAllPages<IntercomConversation>("/conversations")

    // Apply filters if provided
    let filtered = conversations
    if (filters?.state) {
      filtered = filtered.filter((c) => c.state === filters.state)
    }
    if (filters?.priority !== undefined) {
      filtered = filtered.filter((c) => c.priority === filters.priority)
    }
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit)
    }

    this.setCache(cacheKey, filtered)
    console.log(`[API] Cached ${filtered.length} conversations`)
    return filtered
  }

  /**
   * Search conversations with structured query
   * POST /conversations/search
   */
  async searchConversations(query: IntercomSearchQuery): Promise<IntercomConversation[]> {
    const response = await this.request<{ type: string; conversations: IntercomConversation[] }>(
      "/conversations/search",
      {
        method: "POST",
        body: JSON.stringify(query),
      }
    )

    return response.conversations || []
  }

  /**
   * Get conversation details
   * GET /conversations/{id}
   */
  async getConversation(id: string): Promise<IntercomConversation> {
    const cacheKey = this.getCacheKey(`/conversations/${id}`)
    const cached = this.getFromCache<IntercomConversation>(cacheKey, "conversations")
    if (cached) return cached

    const conversation = await this.request<IntercomConversation>(`/conversations/${id}`)
    this.setCache(cacheKey, conversation)
    return conversation
  }

  /**
   * Reply to conversation
   * POST /conversations/{id}/reply
   */
  async replyToConversation(id: string, body: string): Promise<void> {
    await this.request(`/conversations/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({
        message_type: "comment",
        type: "admin",
        body,
      }),
    })

    // Invalidate conversation cache
    this.cache.delete(this.getCacheKey(`/conversations/${id}`))
  }

  /**
   * Update conversation (state, assignment, etc.)
   * PUT /conversations/{id}
   */
  async updateConversation(id: string, updates: ConversationUpdate): Promise<IntercomConversation> {
    const conversation = await this.request<IntercomConversation>(`/conversations/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })

    // Invalidate cache
    this.cache.delete(this.getCacheKey(`/conversations/${id}`))
    this.cache.delete(this.getCacheKey("/conversations"))

    return conversation
  }

  /**
   * Add tags to conversation
   * POST /conversations/{id}/tags
   * Note: Fetches first available admin ID automatically if not provided
   */
  async tagConversation(id: string, tags: string[], adminId?: string): Promise<void> {
    // If no admin ID provided, fetch the first available admin
    let actualAdminId = adminId
    if (!actualAdminId) {
      const admins = await this.getAdmins()
      if (admins.length === 0) {
        throw new Error("No admins found - cannot tag conversation")
      }
      const firstAdmin = admins[0]
      if (!firstAdmin) {
        throw new Error("Failed to retrieve admin")
      }
      actualAdminId = firstAdmin.id
    }

    await this.request(`/conversations/${id}/tags`, {
      method: "POST",
      body: JSON.stringify({ admin_id: actualAdminId, tag_names: tags }),
    })

    // Invalidate conversation cache
    this.cache.delete(this.getCacheKey(`/conversations/${id}`))
  }

  // ============================================================================
  // TICKETS API
  // ============================================================================

  /**
   * Create ticket
   * POST /tickets
   */
  async createTicket(data: TicketData): Promise<IntercomTicket> {
    const ticket = await this.request<IntercomTicket>("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    })

    // Invalidate tickets cache
    this.cache.delete(this.getCacheKey("/tickets"))

    return ticket
  }

  /**
   * Get ticket details
   * GET /tickets/{id}
   */
  async getTicket(id: string): Promise<IntercomTicket> {
    const cacheKey = this.getCacheKey(`/tickets/${id}`)
    const cached = this.getFromCache<IntercomTicket>(cacheKey, "tickets")
    if (cached) return cached

    const ticket = await this.request<IntercomTicket>(`/tickets/${id}`)
    this.setCache(cacheKey, ticket)
    return ticket
  }

  /**
   * Update ticket
   * PUT /tickets/{id}
   */
  async updateTicket(id: string, updates: TicketUpdate): Promise<IntercomTicket> {
    const ticket = await this.request<IntercomTicket>(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })

    // Invalidate cache
    this.cache.delete(this.getCacheKey(`/tickets/${id}`))
    this.cache.delete(this.getCacheKey("/tickets"))

    return ticket
  }

  /**
   * Add comment to ticket
   * POST /tickets/{id}/reply
   */
  async addTicketComment(id: string, body: string, adminId?: string): Promise<void> {
    // Get admin_id if not provided
    let actualAdminId = adminId
    if (!actualAdminId) {
      const admins = await this.getAdmins()
      if (admins.length === 0) throw new Error("No admins found")
      const firstAdmin = admins[0]
      if (!firstAdmin) throw new Error("Failed to retrieve admin")
      actualAdminId = firstAdmin.id
    }

    await this.request(`/tickets/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({
        message_type: "comment",
        type: "admin",
        body,
        admin_id: actualAdminId,
      }),
    })

    // Invalidate cache
    this.cache.delete(this.getCacheKey(`/tickets/${id}`))
  }

  /**
   * Add tags to ticket
   * PUT /tickets/{id} with tags array
   */
  async tagTicket(id: string, tags: string[]): Promise<IntercomTicket> {
    // Get current ticket to merge with existing tags
    const currentTicket = await this.getTicket(id)
    const existingTags = currentTicket.tags || []
    const newTags = [...existingTags, ...tags].filter(
      (tag, index, arr) => arr.indexOf(tag) === index
    )

    const ticket = await this.updateTicket(id, { tags: newTags })

    console.log(`[API] Added tags to ticket ${id}: ${tags.join(", ")}`)
    return ticket
  }

  /**
   * Remove tags from ticket
   * PUT /tickets/{id} with filtered tags array
   */
  async untagTicket(id: string, tagsToRemove: string[]): Promise<IntercomTicket> {
    // Get current ticket to filter existing tags
    const currentTicket = await this.getTicket(id)
    const existingTags = currentTicket.tags || []
    const newTags = existingTags.filter((tag: string) => !tagsToRemove.includes(tag))

    const ticket = await this.updateTicket(id, { tags: newTags })

    console.log(`[API] Removed tags from ticket ${id}: ${tagsToRemove.join(", ")}`)
    return ticket
  }

  /**
   * Replace all tags on ticket
   * PUT /tickets/{id} with new tags array (overwrites existing)
   */
  async replaceTicketTags(id: string, tags: string[]): Promise<IntercomTicket> {
    const ticket = await this.updateTicket(id, { tags })

    console.log(`[API] Replaced tags on ticket ${id} with: ${tags.join(", ")}`)
    return ticket
  }

  /**
   * Bulk tag multiple tickets
   * Applies same tags to multiple tickets in parallel
   * Returns array of updated tickets with success/failure status
   */
  async bulkTagTickets(
    ticketIds: string[],
    tags: string[]
  ): Promise<Array<{ id: string; success: boolean; error?: string }>> {
    console.log(`[API] Bulk tagging ${ticketIds.length} tickets with: ${tags.join(", ")}`)

    const results = await Promise.allSettled(ticketIds.map((id) => this.tagTicket(id, tags)))

    return results.map((result, index) => {
      const id = ticketIds[index]
      if (!id) {
        return { id: "unknown", success: false, error: "Missing ticket ID" }
      }

      if (result.status === "fulfilled") {
        return { id, success: true }
      }
      return {
        id,
        success: false,
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      }
    })
  }

  /**
   * Bulk update multiple tickets
   * Applies same updates to multiple tickets in parallel
   * Returns array of results with success/failure status
   */
  async bulkUpdateTickets(
    ticketIds: string[],
    updates: TicketUpdate
  ): Promise<Array<{ id: string; success: boolean; error?: string }>> {
    console.log(`[API] Bulk updating ${ticketIds.length} tickets`)

    const results = await Promise.allSettled(ticketIds.map((id) => this.updateTicket(id, updates)))

    return results.map((result, index) => {
      const id = ticketIds[index]
      if (!id) {
        return { id: "unknown", success: false, error: "Missing ticket ID" }
      }

      if (result.status === "fulfilled") {
        return { id, success: true }
      }
      return {
        id,
        success: false,
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      }
    })
  }

  /**
   * Bulk assign multiple tickets to admin
   * Assigns multiple tickets to same admin in parallel
   * Returns array of results with success/failure status
   */
  async bulkAssignTickets(
    ticketIds: string[],
    adminId: string
  ): Promise<Array<{ id: string; success: boolean; error?: string }>> {
    console.log(`[API] Bulk assigning ${ticketIds.length} tickets to admin ${adminId}`)

    return await this.bulkUpdateTickets(ticketIds, { admin_assignee_id: adminId })
  }

  /**
   * Bulk close multiple tickets
   * Sets state to 'resolved' for multiple tickets in parallel
   * Returns array of results with success/failure status
   */
  async bulkCloseTickets(
    ticketIds: string[]
  ): Promise<Array<{ id: string; success: boolean; error?: string }>> {
    console.log(`[API] Bulk closing ${ticketIds.length} tickets`)

    return await this.bulkUpdateTickets(ticketIds, { state: "resolved" })
  }

  /**
   * Bulk set priority for multiple tickets
   * Sets priority for multiple tickets in parallel
   * Returns array of results with success/failure status
   */
  async bulkSetPriority(
    ticketIds: string[],
    priority: string
  ): Promise<Array<{ id: string; success: boolean; error?: string }>> {
    console.log(`[API] Bulk setting priority to '${priority}' for ${ticketIds.length} tickets`)

    return await this.bulkUpdateTickets(ticketIds, { priority })
  }

  /**
   * Search tickets with automatic pagination
   * POST /tickets/search
   */
  async searchTickets(query: IntercomSearchQuery): Promise<IntercomTicket[]> {
    // Check cache first (cache key based on query)
    const cacheKey = this.getCacheKey(
      "/tickets/search",
      query as unknown as Record<string, unknown>
    )
    const cached = this.getFromCache<IntercomTicket[]>(cacheKey, "tickets")
    if (cached) {
      console.log(`[API] Using cached tickets (${cached.length} tickets)`)
      return cached
    }

    console.log("[API] Fetching tickets from Intercom API...")
    const allTickets: IntercomTicket[] = []
    let hasMore = true
    let page = 1

    while (hasMore) {
      const queryWithPagination: IntercomSearchQuery = {
        ...query,
        pagination: {
          ...query.pagination,
          per_page: query.pagination?.per_page || 150,
          page,
        },
      }

      const response = await this.request<{
        type: string
        tickets: IntercomTicket[]
        pages?: { total_pages: number; page: number }
      }>("/tickets/search", {
        method: "POST",
        body: JSON.stringify(queryWithPagination),
      })

      const tickets = response.tickets || []
      allTickets.push(...tickets)

      hasMore = response.pages ? response.pages.page < response.pages.total_pages : false
      page++
    }

    // Cache the results
    this.setCache(cacheKey, allTickets)
    console.log(`[API] Cached ${allTickets.length} tickets`)

    return allTickets
  }

  /**
   * Get ticket types
   * GET /ticket_types
   */
  async getTicketTypes(): Promise<IntercomTicketType[]> {
    const cacheKey = this.getCacheKey("/ticket_types")
    const cached = this.getFromCache<IntercomTicketType[]>(cacheKey, "tickets")
    if (cached) return cached

    const response = await this.request<{ data: IntercomTicketType[] }>("/ticket_types")
    this.setCache(cacheKey, response.data)
    return response.data
  }

  // ============================================================================
  // CONTACTS API
  // ============================================================================

  /**
   * Get contact details
   * GET /contacts/{id}
   */
  async getContact(id: string): Promise<IntercomContact> {
    const cacheKey = this.getCacheKey(`/contacts/${id}`)
    const cached = this.getFromCache<IntercomContact>(cacheKey, "contacts")
    if (cached) return cached

    const contact = await this.request<IntercomContact>(`/contacts/${id}`)
    this.setCache(cacheKey, contact)
    return contact
  }

  /**
   * Search contacts
   * POST /contacts/search
   */
  async searchContacts(query: IntercomSearchQuery): Promise<IntercomContact[]> {
    const response = await this.request<{ type: string; data: IntercomContact[] }>(
      "/contacts/search",
      {
        method: "POST",
        body: JSON.stringify(query),
      }
    )

    return response.data || []
  }

  /**
   * Create contact
   * POST /contacts
   */
  async createContact(data: ContactData): Promise<IntercomContact> {
    const contact = await this.request<IntercomContact>("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    })

    return contact
  }

  // ============================================================================
  // TEAMS & ADMINS API
  // ============================================================================

  /**
   * Get all admins
   * GET /admins
   */
  async getAdmins(): Promise<IntercomAdmin[]> {
    const cacheKey = this.getCacheKey("/admins")
    const cached = this.getFromCache<IntercomAdmin[]>(cacheKey, "admins")
    if (cached) return cached

    const response = await this.request<{ type: string; admins: IntercomAdmin[] }>("/admins")
    this.setCache(cacheKey, response.admins)
    return response.admins
  }

  /**
   * Get all teams
   * GET /teams
   */
  async getTeams(): Promise<IntercomTeam[]> {
    const cacheKey = this.getCacheKey("/teams")
    const cached = this.getFromCache<IntercomTeam[]>(cacheKey, "teams")
    if (cached) return cached

    const response = await this.request<{ type: string; teams: IntercomTeam[] }>("/teams")
    this.setCache(cacheKey, response.teams)
    return response.teams
  }

  /**
   * Get contacts with pagination
   * GET /contacts
   */
  async getContacts(options?: { per_page?: number }): Promise<IntercomContact[]> {
    const params = new URLSearchParams()
    if (options?.per_page) params.set("per_page", String(options.per_page))

    const url = `/contacts${params.toString() ? `?${params.toString()}` : ""}`
    const cacheKey = this.getCacheKey(url)
    const cached = this.getFromCache<IntercomContact[]>(cacheKey, "contacts")
    if (cached) return cached

    const response = await this.request<{ type: string; data: IntercomContact[] }>(url)
    this.setCache(cacheKey, response.data)
    return response.data
  }

  // ============================================================================
  // TAGS API
  // ============================================================================

  /**
   * Get all tags
   * GET /tags
   */
  async getTags(): Promise<IntercomTag[]> {
    const cacheKey = this.getCacheKey("/tags")
    const cached = this.getFromCache<IntercomTag[]>(cacheKey, "tags")
    if (cached) return cached

    const response = await this.request<{ type: string; data: IntercomTag[] }>("/tags")
    this.setCache(cacheKey, response.data)
    return response.data
  }

  /**
   * Create tag
   * POST /tags
   */
  async createTag(name: string): Promise<IntercomTag> {
    const tag = await this.request<IntercomTag>("/tags", {
      method: "POST",
      body: JSON.stringify({ name }),
    })

    // Invalidate tags cache
    this.cache.delete(this.getCacheKey("/tags"))

    return tag
  }

  // ============================================================================
  // CONVENIENCE METHODS (for backwards compatibility with analyze route)
  // ============================================================================

  /**
   * Get conversation statistics by state
   * Compatible with analyze route expectations
   */
  async getTicketStats(): Promise<Record<string, number>> {
    const conversations = await this.getConversations()
    const stats: Record<string, number> = {}

    for (const conv of conversations) {
      stats[conv.state] = (stats[conv.state] || 0) + 1
    }

    return stats
  }

  // ============================================================================
  // BUSINESS ANALYTICS METHODS (for business owner queries)
  // ============================================================================

  /**
   * Get ticket volume trends over time periods
   * Returns ticket counts by day, week, or month
   */
  async getTicketVolumeTrends(period: "day" | "week" | "month" = "day"): Promise<{
    labels: string[]
    counts: number[]
    totalTickets: number
  }> {
    const tickets = await this.searchTickets({
      query: { operator: "AND", value: [] },
      pagination: { per_page: 150 },
    })

    const now = Date.now()
    const periodMs = period === "day" ? 86400000 : period === "week" ? 604800000 : 2592000000 // 30 days
    const periods = 7 // Last 7 periods

    const buckets: number[] = new Array(periods).fill(0)
    const labels: string[] = []

    // Create labels
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(now - i * periodMs)
      labels.push(date.toISOString().split("T")[0] ?? "unknown")
    }

    // Count tickets in each period
    for (const ticket of tickets) {
      const ticketTime = ticket.created_at * 1000
      const periodIndex = Math.floor((now - ticketTime) / periodMs)

      if (periodIndex >= 0 && periodIndex < periods) {
        const bucketIndex = periods - 1 - periodIndex
        if (buckets[bucketIndex] !== undefined) {
          buckets[bucketIndex]++
        }
      }
    }

    return {
      labels,
      counts: buckets,
      totalTickets: tickets.length,
    }
  }

  /**
   * Get resolution time statistics
   * Returns avg, median, and percentiles for ticket resolution
   */
  async getResolutionTimeStats(): Promise<{
    avgResolutionHours: number
    medianResolutionHours: number
    p90ResolutionHours: number
    totalResolved: number
  }> {
    const tickets = await this.searchTickets({
      query: { operator: "AND", value: [] },
      pagination: { per_page: 150 },
    })

    const resolvedTickets = tickets.filter((t) => t.state === "resolved")
    const resolutionTimes: number[] = []

    for (const ticket of resolvedTickets) {
      const resolutionTimeMs = (ticket.updated_at - ticket.created_at) * 1000
      const resolutionTimeHours = resolutionTimeMs / (1000 * 60 * 60)
      resolutionTimes.push(resolutionTimeHours)
    }

    if (resolutionTimes.length === 0) {
      return {
        avgResolutionHours: 0,
        medianResolutionHours: 0,
        p90ResolutionHours: 0,
        totalResolved: 0,
      }
    }

    resolutionTimes.sort((a, b) => a - b)

    const avg = resolutionTimes.reduce((sum, t) => sum + t, 0) / resolutionTimes.length
    const median = resolutionTimes[Math.floor(resolutionTimes.length / 2)] ?? 0
    const p90 = resolutionTimes[Math.floor(resolutionTimes.length * 0.9)] ?? 0

    return {
      avgResolutionHours: Number(avg.toFixed(2)),
      medianResolutionHours: Number(median.toFixed(2)),
      p90ResolutionHours: Number(p90.toFixed(2)),
      totalResolved: resolvedTickets.length,
    }
  }

  /**
   * Get team performance metrics
   * Returns tickets handled per admin with resolution stats
   */
  async getTeamPerformance(): Promise<
    Array<{
      adminId: string
      adminName: string
      ticketsAssigned: number
      ticketsResolved: number
      avgResolutionHours: number
    }>
  > {
    const [tickets, admins] = await Promise.all([
      this.searchTickets({
        query: { operator: "AND", value: [] },
        pagination: { per_page: 150 },
      }),
      this.getAdmins(),
    ])

    const adminStats = new Map<
      string,
      {
        name: string
        assigned: number
        resolved: number
        resolutionTimes: number[]
      }
    >()

    // Initialize admin stats
    for (const admin of admins) {
      adminStats.set(admin.id, {
        name: admin.name,
        assigned: 0,
        resolved: 0,
        resolutionTimes: [],
      })
    }

    // Count tickets per admin
    for (const ticket of tickets) {
      if (ticket.admin_assignee_id) {
        const stats = adminStats.get(ticket.admin_assignee_id)
        if (stats) {
          stats.assigned++

          if (ticket.state === "resolved") {
            stats.resolved++
            const resolutionTimeHours =
              ((ticket.updated_at - ticket.created_at) * 1000) / (1000 * 60 * 60)
            stats.resolutionTimes.push(resolutionTimeHours)
          }
        }
      }
    }

    // Build result array
    const result: Array<{
      adminId: string
      adminName: string
      ticketsAssigned: number
      ticketsResolved: number
      avgResolutionHours: number
    }> = []

    for (const [adminId, stats] of adminStats) {
      const avgResolution =
        stats.resolutionTimes.length > 0
          ? stats.resolutionTimes.reduce((sum, t) => sum + t, 0) / stats.resolutionTimes.length
          : 0

      result.push({
        adminId,
        adminName: stats.name,
        ticketsAssigned: stats.assigned,
        ticketsResolved: stats.resolved,
        avgResolutionHours: Number(avgResolution.toFixed(2)),
      })
    }

    // Sort by tickets assigned (descending)
    return result.sort((a, b) => b.ticketsAssigned - a.ticketsAssigned)
  }

  /**
   * Get SLA compliance metrics
   * Returns tickets meeting/breaching SLA targets
   */
  async getSLACompliance(
    responseTimeSLAHours = 24,
    resolutionTimeSLAHours = 72
  ): Promise<{
    totalTickets: number
    responseTimeCompliant: number
    responseTimeBreached: number
    resolutionTimeCompliant: number
    resolutionTimeBreached: number
    complianceRate: number
  }> {
    const tickets = await this.searchTickets({
      query: { operator: "AND", value: [] },
      pagination: { per_page: 150 },
    })

    let responseCompliant = 0
    let responseBreached = 0
    let resolutionCompliant = 0
    let resolutionBreached = 0

    for (const ticket of tickets) {
      // Response time check (assuming first update is first response)
      const responseTimeHours = ((ticket.updated_at - ticket.created_at) * 1000) / (1000 * 60 * 60)

      if (responseTimeHours <= responseTimeSLAHours) {
        responseCompliant++
      } else {
        responseBreached++
      }

      // Resolution time check (only for resolved tickets)
      if (ticket.state === "resolved") {
        const resolutionTimeHours =
          ((ticket.updated_at - ticket.created_at) * 1000) / (1000 * 60 * 60)

        if (resolutionTimeHours <= resolutionTimeSLAHours) {
          resolutionCompliant++
        } else {
          resolutionBreached++
        }
      }
    }

    const totalTickets = tickets.length
    const totalCompliant = responseCompliant + resolutionCompliant
    const totalChecks = totalTickets * 2 // Each ticket checked for both response and resolution
    const complianceRate =
      totalChecks > 0 ? Number(((totalCompliant / totalChecks) * 100).toFixed(2)) : 0

    return {
      totalTickets,
      responseTimeCompliant: responseCompliant,
      responseTimeBreached: responseBreached,
      resolutionTimeCompliant: resolutionCompliant,
      resolutionTimeBreached: resolutionBreached,
      complianceRate,
    }
  }

  /**
   * Get recent conversations (tickets)
   * Compatible with analyze route expectations
   */
  async getTickets(options?: { limit?: number; status?: string; priority?: string }): Promise<
    Array<{
      id: number
      subject: string
      priority: string
      status: string
      updated_at: string
    }>
  > {
    const limit = options?.limit || 25
    let conversations = await this.getConversations()

    // Apply filters if provided
    if (options?.status) {
      conversations = conversations.filter((conv) => conv.state === options.status)
    }
    if (options?.priority && options.priority === "high") {
      conversations = conversations.filter((conv) => conv.priority === true)
    }

    return conversations.slice(0, limit).map((conv) => ({
      id: Number.parseInt(conv.id, 10),
      subject: conv.source.subject || "No subject",
      priority: conv.priority ? "high" : "normal",
      status: conv.state,
      updated_at: new Date(conv.updated_at * 1000).toISOString(),
    }))
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Invalidate all cache
   */
  invalidateCache(): void {
    this.cache.clear()
  }

  /**
   * Invalidate specific cache category
   */
  invalidateCacheCategory(category: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(`/${category}`)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number
    keys: string[]
    timestamp: string
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timestamp: new Date().toISOString(),
    }
  }
}

// Singleton instance
let clientInstance: IntercomAPIClient | null = null

export function getIntercomAPIClient(): IntercomAPIClient {
  if (!clientInstance) {
    clientInstance = new IntercomAPIClient()
  }
  return clientInstance
}
