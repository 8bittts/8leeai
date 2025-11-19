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
  private baseUrl = "https://api.intercom.io"
  private cache: Map<string, { data: unknown; timestamp: number }>
  private cacheTTL: Record<string, number> = {
    conversations: 24 * 60 * 60 * 1000, // 1 day
    tickets: 24 * 60 * 60 * 1000, // 1 day
    contacts: 24 * 60 * 60 * 1000, // 1 day
    admins: 24 * 60 * 60 * 1000, // 1 day
    teams: 24 * 60 * 60 * 1000, // 1 day
    tags: 24 * 60 * 60 * 1000, // 1 day
  }

  constructor() {
    this.accessToken = process.env["INTERCOM_ACCESS_TOKEN"] || ""
    this.cache = new Map()
    this.validateConfig()
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
   */
  private getAuthHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Intercom-Version": "2.11",
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
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = { ...this.getAuthHeaders(), ...options.headers }

    try {
      const response = await fetch(url, { ...options, headers })

      // Handle rate limiting (429)
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After")
        const waitTime = retryAfter ? Number.parseInt(retryAfter, 10) * 1000 : 60000
        console.warn(`Rate limit hit. Waiting ${waitTime}ms before retry...`)
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
  async addTicketComment(id: string, body: string): Promise<void> {
    await this.request(`/tickets/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({
        message_type: "comment",
        type: "admin",
        body,
      }),
    })

    // Invalidate cache
    this.cache.delete(this.getCacheKey(`/tickets/${id}`))
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
