// @ts-nocheck
/**
 * Zendesk REST API Client
 * Handles authentication, requests, caching, and error handling for Zendesk APIs
 */

export interface ZendeskTicket {
  id: number
  subject: string
  description: string
  status: "new" | "open" | "pending" | "hold" | "solved" | "closed"
  priority: "urgent" | "high" | "normal" | "low"
  created_at: string
  updated_at: string
  assignee_id: number | null
  requester_id: number
  tags: string[]
  custom_fields?: Record<string, unknown>
}

interface ZendeskUser {
  id: number
  name: string
  email: string
  role: "admin" | "agent" | "end-user"
  active: boolean
}

interface ZendeskOrganization {
  id: number
  name: string
  domain_names?: string[]
  created_at: string
  updated_at: string
}

interface ZendeskAPIError {
  error: string
  description: string
  status: number
}

/**
 * Zendesk API Client
 * Implements authentication, caching, rate limiting, and error handling
 */
export class ZendeskAPIClient {
  private subdomain: string
  private email: string
  private apiToken: string
  private baseUrl: string
  private cache: Map<string, { data: unknown; timestamp: number }>
  private cacheTTL: Record<string, number> = {
    tickets: 5 * 60 * 1000, // 5 minutes
    users: 60 * 60 * 1000, // 1 hour
    organizations: 60 * 60 * 1000, // 1 hour
    analytics: 5 * 60 * 1000, // 5 minutes
  }

  constructor() {
    this.subdomain = process.env["ZENDESK_SUBDOMAIN"] || ""
    this.email = process.env["ZENDESK_EMAIL"] || ""
    this.apiToken = process.env["ZENDESK_API_TOKEN"] || ""
    this.baseUrl = `https://${this.subdomain}.zendesk.com/api/v2`
    this.cache = new Map()

    this.validateConfig()
  }

  /**
   * Validate that required environment variables are configured
   */
  private validateConfig(): void {
    if (!this.subdomain) {
      throw new Error("ZENDESK_SUBDOMAIN environment variable not configured")
    }
    if (!this.email) {
      throw new Error("ZENDESK_EMAIL environment variable not configured")
    }
    if (!this.apiToken) {
      throw new Error("ZENDESK_API_TOKEN environment variable not configured")
    }
  }

  /**
   * Build Authorization header using Basic Auth
   */
  private getAuthHeader(): string {
    const credentials = `${this.email}/token:${this.apiToken}`
    const encoded = Buffer.from(credentials).toString("base64")
    return `Basic ${encoded}`
  }

  /**
   * Generate cache key
   */
  private getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
    let key = endpoint
    if (params) {
      const queryString = Object.entries(params)
        .sort()
        .map(([k, v]) => `${k}=${v}`)
        .join("&")
      key = `${endpoint}?${queryString}`
    }
    return key
  }

  /**
   * Get cached data if available and fresh
   */
  private getFromCache(key: string, ttl: number): unknown | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp < ttl) {
      console.log(`[ZendeskAPI] Cache hit: ${key}`)
      return cached.data
    }

    this.cache.delete(key)
    return null
  }

  /**
   * Store data in cache
   */
  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  /**
   * Make authenticated HTTP request to Zendesk API
   */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: API error handling requires comprehensive status code checking
  private async request<T>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE"
      body?: Record<string, unknown>
      params?: Record<string, unknown>
    } = {}
  ): Promise<T> {
    const { method = "GET", body, params } = options

    // Build URL - handle both relative paths and full URLs
    // next_page URLs from Zendesk are already complete URLs
    let url: string
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      // Already a full URL (like next_page) - use as-is
      url = endpoint
    } else {
      // Relative path - append to base URL
      url = `${this.baseUrl}${endpoint}`
      if (params && method === "GET") {
        const queryString = new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
        url = `${url}?${queryString}`
      }
    }

    // Build request options
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: this.getAuthHeader(),
      },
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, fetchOptions)

      if (!response.ok) {
        const error = await response.json()
        throw {
          status: response.status,
          error: error.error || "Unknown error",
          description: error.description || response.statusText,
        } as ZendeskAPIError
      }

      return (await response.json()) as T
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError) {
        throw new Error(`Network error: ${error.message}`)
      }

      // Handle API errors
      if (typeof error === "object" && error !== null && "status" in error) {
        const apiError = error as ZendeskAPIError
        if (apiError.status === 401) {
          throw new Error("Unauthorized: Invalid Zendesk credentials")
        }
        if (apiError.status === 403) {
          throw new Error("Forbidden: Insufficient permissions")
        }
        if (apiError.status === 404) {
          throw new Error("Not found: Resource does not exist")
        }
        if (apiError.status === 429) {
          throw new Error("Rate limited: Too many requests, please try again later")
        }
        throw new Error(`API Error: ${apiError.error} - ${apiError.description}`)
      }

      throw error
    }
  }

  /**
   * Get tickets with optional filters
   * Implements pagination to fetch ALL tickets, not just first page
   */
  async getTickets(filters?: {
    status?: string
    priority?: string
    limit?: number
  }): Promise<ZendeskTicket[]> {
    const cacheKey = this.getCacheKey("/tickets.json", filters)
    const cached = this.getFromCache(cacheKey, this.cacheTTL["tickets"] || 5 * 60 * 1000)
    if (cached) return cached as ZendeskTicket[]

    try {
      const allTickets: ZendeskTicket[] = []
      const perPage = filters?.limit || 100
      let nextPageUrl: string | null = "/tickets.json"

      // Build ZQL query params
      const queryParams: Record<string, unknown> = {
        per_page: perPage,
      }

      const conditions: string[] = []
      if (filters?.status) conditions.push(`status:${filters.status}`)
      if (filters?.priority) conditions.push(`priority:${filters.priority}`)

      if (conditions.length > 0) {
        queryParams["query"] = conditions.join(" AND ")
      }

      // Paginate through all results
      let pageCount = 0
      while (nextPageUrl) {
        pageCount++
        console.log(`[ZendeskAPI] Fetching tickets page ${pageCount}...`)

        interface PageResponse {
          tickets: ZendeskTicket[]
          next_page?: string
        }
        const response: PageResponse = await this.request<PageResponse>(nextPageUrl, {
          params: pageCount === 1 ? queryParams : {},
        })

        const pageTickets = response.tickets || []
        allTickets.push(...pageTickets)
        console.log(
          `[ZendeskAPI] Page ${pageCount}: ${pageTickets.length} tickets (total: ${allTickets.length})`
        )

        // Check for next page
        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allTickets)
      console.log(
        `[ZendeskAPI] Pagination complete: ${allTickets.length} total tickets across ${pageCount} pages`
      )
      return allTickets
    } catch (error) {
      console.error("[ZendeskAPI] Error fetching tickets:", error)
      throw error
    }
  }

  /**
   * Get a single ticket by ID
   */
  async getTicket(ticketId: number): Promise<ZendeskTicket> {
    const cacheKey = this.getCacheKey(`/tickets/${ticketId}.json`)
    const cached = this.getFromCache(cacheKey, this.cacheTTL["tickets"] || 5 * 60 * 1000)
    if (cached) return cached as ZendeskTicket

    try {
      const response = await this.request<{ ticket: ZendeskTicket }>(`/tickets/${ticketId}.json`)
      const ticket = response.ticket

      this.setCache(cacheKey, ticket)
      return ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error fetching ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Get all users (support agents, admins, etc.)
   * Implements pagination to fetch ALL users
   */
  async getUsers(filters?: { role?: string; active?: boolean }): Promise<ZendeskUser[]> {
    const cacheKey = this.getCacheKey("/users.json", filters)
    const cached = this.getFromCache(cacheKey, this.cacheTTL["users"] || 60 * 60 * 1000)
    if (cached) return cached as ZendeskUser[]

    try {
      const allUsers: ZendeskUser[] = []
      let nextPageUrl: string | null = "/users.json"
      const queryParams: Record<string, unknown> = {
        per_page: 100,
      }

      if (filters?.role) queryParams["role"] = filters.role
      if (filters?.active !== undefined) queryParams["active"] = filters.active

      // Paginate through all results
      let pageCount = 0
      while (nextPageUrl) {
        pageCount++
        console.log(`[ZendeskAPI] Fetching users page ${pageCount}...`)

        const response = await this.request<{
          users: ZendeskUser[]
          next_page?: string
        }>(nextPageUrl, { params: pageCount === 1 ? queryParams : {} })

        const pageUsers = response.users || []
        allUsers.push(...pageUsers)
        console.log(
          `[ZendeskAPI] Page ${pageCount}: ${pageUsers.length} users (total: ${allUsers.length})`
        )

        // Check for next page
        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allUsers)
      console.log(
        `[ZendeskAPI] User pagination complete: ${allUsers.length} total users across ${pageCount} pages`
      )
      return allUsers
    } catch (error) {
      console.error("[ZendeskAPI] Error fetching users:", error)
      throw error
    }
  }

  /**
   * Get all organizations
   * Implements pagination to fetch ALL organizations
   */
  async getOrganizations(): Promise<ZendeskOrganization[]> {
    const cacheKey = this.getCacheKey("/organizations.json")
    const cached = this.getFromCache(cacheKey, this.cacheTTL["organizations"] || 60 * 60 * 1000)
    if (cached) return cached as ZendeskOrganization[]

    try {
      const allOrgs: ZendeskOrganization[] = []
      let nextPageUrl: string | null = "/organizations.json"
      const queryParams: Record<string, unknown> = { per_page: 100 }

      // Paginate through all results
      let pageCount = 0
      while (nextPageUrl) {
        pageCount++
        console.log(`[ZendeskAPI] Fetching organizations page ${pageCount}...`)

        const response = await this.request<{
          organizations: ZendeskOrganization[]
          next_page?: string
        }>(nextPageUrl, { params: pageCount === 1 ? queryParams : {} })

        const pageOrgs = response.organizations || []
        allOrgs.push(...pageOrgs)
        console.log(
          `[ZendeskAPI] Page ${pageCount}: ${pageOrgs.length} organizations (total: ${allOrgs.length})`
        )

        // Check for next page
        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allOrgs)
      console.log(
        `[ZendeskAPI] Organizations pagination complete: ${allOrgs.length} total organizations across ${pageCount} pages`
      )
      return allOrgs
    } catch (error) {
      console.error("[ZendeskAPI] Error fetching organizations:", error)
      throw error
    }
  }

  /**
   * Get ticket count by status (basic analytics)
   */
  async getTicketStats(): Promise<Record<string, number>> {
    const cacheKey = "/ticket-stats"
    const cached = this.getFromCache(cacheKey, this.cacheTTL["analytics"] || 5 * 60 * 1000)
    if (cached) return cached as Record<string, number>

    try {
      const statuses = ["new", "open", "pending", "hold", "solved", "closed"]
      const stats: Record<string, number> = {}

      // Fetch count for each status in parallel
      const promises = statuses.map(async (status) => {
        try {
          const response = await this.request<{ count: { value: number } }>("/tickets/count.json", {
            params: { query: `status:${status}` },
          })
          // The Zendesk API returns count as an object with a 'value' property
          stats[status] = response.count?.value || 0
        } catch {
          stats[status] = 0
        }
      })

      await Promise.all(promises)

      this.setCache(cacheKey, stats)
      return stats
    } catch (error) {
      console.error("[ZendeskAPI] Error fetching ticket stats:", error)
      throw error
    }
  }

  /**
   * Add a comment/reply to an existing ticket
   * POST /api/v2/tickets/{ticket_id}.json
   */
  async addTicketComment(
    ticketId: number,
    commentBody: string,
    isPublic = true
  ): Promise<{
    ticket: ZendeskTicket
    comment: { id: number; body: string; public: boolean; created_at: string }
  }> {
    try {
      console.log(`[ZendeskAPI] Adding comment to ticket ${ticketId}`)

      const response = await this.request<{
        ticket: ZendeskTicket
        audit: {
          events: Array<{
            type: string
            id: number
            body: string
            public: boolean
            created_at: string
          }>
        }
      }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            comment: {
              body: commentBody,
              public: isPublic,
            },
          },
        },
      })

      // Extract the comment from the audit events
      const commentEvent = response.audit.events.find((e) => e.type === "Comment")
      const comment = commentEvent
        ? {
            id: commentEvent.id,
            body: commentEvent.body,
            public: commentEvent.public,
            created_at: commentEvent.created_at,
          }
        : {
            id: 0,
            body: commentBody,
            public: isPublic,
            created_at: new Date().toISOString(),
          }

      console.log(`[ZendeskAPI] Comment added successfully to ticket ${ticketId}`)

      // Clear cache for this ticket since it was updated
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))

      return {
        ticket: response.ticket,
        comment,
      }
    } catch (error) {
      console.error(`[ZendeskAPI] Error adding comment to ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Search tickets using Zendesk Query Language
   * Implements pagination to fetch ALL search results
   */
  async searchTickets(query: string, limit = 25): Promise<ZendeskTicket[]> {
    const cacheKey = this.getCacheKey("/search.json", { query, limit })
    const cached = this.getFromCache(cacheKey, this.cacheTTL["tickets"] || 5 * 60 * 1000)
    if (cached) return cached as ZendeskTicket[]

    try {
      const allResults: ZendeskTicket[] = []
      let nextPageUrl: string | null = "/search.json"
      const queryParams: Record<string, unknown> = {
        query,
        per_page: limit,
      }

      // Paginate through all search results
      let pageCount = 0
      while (nextPageUrl) {
        pageCount++
        console.log(`[ZendeskAPI] Searching tickets page ${pageCount}...`)

        const response = await this.request<{
          results: ZendeskTicket[]
          next_page?: string
        }>(nextPageUrl, { params: pageCount === 1 ? queryParams : {} })

        const pageResults = response.results || []
        allResults.push(...pageResults)
        console.log(
          `[ZendeskAPI] Page ${pageCount}: ${pageResults.length} results (total: ${allResults.length})`
        )

        // Check for next page
        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allResults)
      console.log(
        `[ZendeskAPI] Search pagination complete: ${allResults.length} total results across ${pageCount} pages`
      )
      return allResults
    } catch (error) {
      console.error("[ZendeskAPI] Error searching tickets:", error)
      throw error
    }
  }

  /**
   * Create a new ticket
   * POST /api/v2/tickets.json
   */
  async createTicket(ticketData: {
    subject: string
    comment: { body: string; html_body?: string }
    requester_id?: number
    requester_email?: string
    assignee_id?: number
    assignee_email?: string
    group_id?: number
    priority?: "urgent" | "high" | "normal" | "low"
    status?: "new" | "open" | "pending" | "hold" | "solved" | "closed"
    type?: "problem" | "incident" | "question" | "task"
    tags?: string[]
    custom_fields?: Array<{ id: number; value: string | number | boolean }>
    organization_id?: number
  }): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Creating ticket: ${ticketData.subject}`)

      const response = await this.request<{
        ticket: ZendeskTicket
        audit: { events: Array<{ type: string }> }
      }>("/tickets.json", {
        method: "POST",
        body: { ticket: ticketData },
      })

      console.log(`[ZendeskAPI] Ticket created successfully: #${response.ticket.id}`)

      // Clear tickets cache since we added a new ticket
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error("[ZendeskAPI] Error creating ticket:", error)
      throw error
    }
  }

  /**
   * Update an existing ticket
   * PUT /api/v2/tickets/{ticket_id}.json
   */
  async updateTicket(
    ticketId: number,
    updates: {
      subject?: string
      comment?: { body: string; public?: boolean; html_body?: string }
      assignee_id?: number | null
      assignee_email?: string
      group_id?: number | null
      priority?: "urgent" | "high" | "normal" | "low"
      status?: "new" | "open" | "pending" | "hold" | "solved" | "closed"
      type?: "problem" | "incident" | "question" | "task"
      tags?: string[]
      custom_fields?: Array<{ id: number; value: string | number | boolean }>
      organization_id?: number
      due_at?: string
    }
  ): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Updating ticket ${ticketId}`)

      const response = await this.request<{
        ticket: ZendeskTicket
        audit: { events: Array<{ type: string }> }
      }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: { ticket: updates },
      })

      console.log(`[ZendeskAPI] Ticket ${ticketId} updated successfully`)

      // Clear cache for this ticket and ticket lists
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error updating ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Delete a ticket (soft delete - can be restored)
   * DELETE /api/v2/tickets/{ticket_id}.json
   */
  async deleteTicket(ticketId: number): Promise<void> {
    try {
      console.log(`[ZendeskAPI] Deleting ticket ${ticketId}`)

      await this.request<void>(`/tickets/${ticketId}.json`, {
        method: "DELETE",
      })

      console.log(`[ZendeskAPI] Ticket ${ticketId} deleted successfully`)

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }
    } catch (error) {
      console.error(`[ZendeskAPI] Error deleting ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Restore a deleted ticket
   * PUT /api/v2/tickets/{ticket_id}/restore.json
   */
  async restoreTicket(ticketId: number): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Restoring ticket ${ticketId}`)

      const response = await this.request<{ ticket: ZendeskTicket }>(
        `/tickets/${ticketId}/restore.json`,
        {
          method: "PUT",
        }
      )

      console.log(`[ZendeskAPI] Ticket ${ticketId} restored successfully`)

      // Clear cache
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error restoring ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Merge tickets into a target ticket
   * PUT /api/v2/tickets/{target_ticket_id}/merge.json
   */
  async mergeTickets(targetTicketId: number, sourceTicketIds: number[]): Promise<ZendeskTicket> {
    try {
      console.log(
        `[ZendeskAPI] Merging tickets ${sourceTicketIds.join(", ")} into ${targetTicketId}`
      )

      const response = await this.request<{ ticket: ZendeskTicket }>(
        `/tickets/${targetTicketId}/merge.json`,
        {
          method: "PUT",
          body: {
            ids: sourceTicketIds,
            target_id: targetTicketId,
          },
        }
      )

      console.log(`[ZendeskAPI] Tickets merged successfully into ${targetTicketId}`)

      // Clear cache for all affected tickets
      this.cache.delete(this.getCacheKey(`/tickets/${targetTicketId}.json`))
      for (const id of sourceTicketIds) {
        this.cache.delete(this.getCacheKey(`/tickets/${id}.json`))
      }
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error("[ZendeskAPI] Error merging tickets:", error)
      throw error
    }
  }

  /**
   * Mark a ticket as spam
   * PUT /api/v2/tickets/{ticket_id}/mark_as_spam.json
   */
  async markAsSpam(ticketId: number): Promise<void> {
    try {
      console.log(`[ZendeskAPI] Marking ticket ${ticketId} as spam`)

      await this.request<void>(`/tickets/${ticketId}/mark_as_spam.json`, {
        method: "PUT",
      })

      console.log(`[ZendeskAPI] Ticket ${ticketId} marked as spam`)

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }
    } catch (error) {
      console.error(`[ZendeskAPI] Error marking ticket ${ticketId} as spam:`, error)
      throw error
    }
  }

  /**
   * Bulk update multiple tickets
   * PUT /api/v2/tickets/update_many.json
   */
  async updateManyTickets(
    ticketIds: number[],
    updates: {
      status?: "new" | "open" | "pending" | "hold" | "solved" | "closed"
      priority?: "urgent" | "high" | "normal" | "low"
      assignee_id?: number | null
      group_id?: number | null
      additional_tags?: string[]
      remove_tags?: string[]
    }
  ): Promise<{ job_status_id: string }> {
    try {
      console.log(`[ZendeskAPI] Bulk updating ${ticketIds.length} tickets`)

      const response = await this.request<{ job_status: { id: string } }>(
        `/tickets/update_many.json?ids=${ticketIds.join(",")}`,
        {
          method: "PUT",
          body: { ticket: updates },
        }
      )

      console.log(`[ZendeskAPI] Bulk update job started: ${response.job_status.id}`)

      // Clear all ticket caches
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets")) {
          this.cache.delete(key)
        }
      }

      return { job_status_id: response.job_status.id }
    } catch (error) {
      console.error("[ZendeskAPI] Error bulk updating tickets:", error)
      throw error
    }
  }

  /**
   * Get multiple tickets by IDs
   * GET /api/v2/tickets/show_many.json?ids=1,2,3
   */
  async getTicketsByIds(ticketIds: number[]): Promise<ZendeskTicket[]> {
    try {
      console.log(`[ZendeskAPI] Fetching ${ticketIds.length} tickets by IDs`)

      const response = await this.request<{ tickets: ZendeskTicket[] }>(
        `/tickets/show_many.json?ids=${ticketIds.join(",")}`
      )

      console.log(`[ZendeskAPI] Retrieved ${response.tickets.length} tickets`)

      return response.tickets
    } catch (error) {
      console.error("[ZendeskAPI] Error fetching tickets by IDs:", error)
      throw error
    }
  }

  /**
   * Bulk create tickets
   * POST /api/v2/tickets/create_many.json
   */
  async createManyTickets(
    tickets: Array<{
      subject: string
      comment: { body: string }
      priority?: "urgent" | "high" | "normal" | "low"
      status?: "new" | "open" | "pending" | "hold" | "solved" | "closed"
      requester_email?: string
    }>
  ): Promise<{ job_status_id: string }> {
    try {
      console.log(`[ZendeskAPI] Bulk creating ${tickets.length} tickets`)

      const response = await this.request<{ job_status: { id: string } }>(
        "/tickets/create_many.json",
        {
          method: "POST",
          body: { tickets },
        }
      )

      console.log(`[ZendeskAPI] Bulk create job started: ${response.job_status.id}`)

      // Clear all ticket caches
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets")) {
          this.cache.delete(key)
        }
      }

      return { job_status_id: response.job_status.id }
    } catch (error) {
      console.error("[ZendeskAPI] Error bulk creating tickets:", error)
      throw error
    }
  }

  /**
   * Bulk delete tickets (soft delete)
   * DELETE /api/v2/tickets/destroy_many.json?ids=1,2,3
   */
  async deleteManyTickets(ticketIds: number[]): Promise<void> {
    try {
      console.log(`[ZendeskAPI] Bulk deleting ${ticketIds.length} tickets`)

      await this.request<void>(`/tickets/destroy_many.json?ids=${ticketIds.join(",")}`, {
        method: "DELETE",
      })

      console.log(`[ZendeskAPI] Bulk deleted ${ticketIds.length} tickets`)

      // Clear all ticket caches
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets")) {
          this.cache.delete(key)
        }
      }
    } catch (error) {
      console.error("[ZendeskAPI] Error bulk deleting tickets:", error)
      throw error
    }
  }

  /**
   * Bulk restore tickets
   * PUT /api/v2/tickets/restore_many.json?ids=1,2,3
   */
  async restoreManyTickets(ticketIds: number[]): Promise<void> {
    try {
      console.log(`[ZendeskAPI] Bulk restoring ${ticketIds.length} tickets`)

      await this.request<void>(`/tickets/restore_many.json?ids=${ticketIds.join(",")}`, {
        method: "PUT",
      })

      console.log(`[ZendeskAPI] Bulk restored ${ticketIds.length} tickets`)

      // Clear all ticket caches
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets")) {
          this.cache.delete(key)
        }
      }
    } catch (error) {
      console.error("[ZendeskAPI] Error bulk restoring tickets:", error)
      throw error
    }
  }

  /**
   * Permanently delete a ticket (cannot be restored)
   * DELETE /api/v2/tickets/{ticket_id}/destroy.json
   */
  async deleteTicketPermanent(ticketId: number): Promise<void> {
    try {
      console.log(`[ZendeskAPI] Permanently deleting ticket ${ticketId}`)

      await this.request<void>(`/tickets/${ticketId}/destroy.json`, {
        method: "DELETE",
      })

      console.log(`[ZendeskAPI] Ticket ${ticketId} permanently deleted`)

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }
    } catch (error) {
      console.error(`[ZendeskAPI] Error permanently deleting ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Bulk permanently delete tickets
   * DELETE /api/v2/tickets/destroy_many.json?ids=1,2,3&destroy=true
   */
  async deleteManyTicketsPermanent(ticketIds: number[]): Promise<void> {
    try {
      console.log(`[ZendeskAPI] Permanently deleting ${ticketIds.length} tickets`)

      await this.request<void>(
        `/tickets/destroy_many.json?ids=${ticketIds.join(",")}&destroy=true`,
        {
          method: "DELETE",
        }
      )

      console.log(`[ZendeskAPI] Permanently deleted ${ticketIds.length} tickets`)

      // Clear all ticket caches
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets")) {
          this.cache.delete(key)
        }
      }
    } catch (error) {
      console.error("[ZendeskAPI] Error permanently deleting tickets:", error)
      throw error
    }
  }

  /**
   * Bulk mark tickets as spam
   * PUT /api/v2/tickets/mark_many_as_spam.json?ids=1,2,3
   */
  async markManyAsSpam(ticketIds: number[]): Promise<void> {
    try {
      console.log(`[ZendeskAPI] Marking ${ticketIds.length} tickets as spam`)

      await this.request<void>(`/tickets/mark_many_as_spam.json?ids=${ticketIds.join(",")}`, {
        method: "PUT",
      })

      console.log(`[ZendeskAPI] Marked ${ticketIds.length} tickets as spam`)

      // Clear all ticket caches
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets")) {
          this.cache.delete(key)
        }
      }
    } catch (error) {
      console.error("[ZendeskAPI] Error marking tickets as spam:", error)
      throw error
    }
  }

  /**
   * Get tickets for a specific organization
   * GET /api/v2/organizations/{organization_id}/tickets.json
   */
  async getOrganizationTickets(organizationId: number): Promise<ZendeskTicket[]> {
    const cacheKey = this.getCacheKey(`/organizations/${organizationId}/tickets.json`)
    const cached = this.getFromCache(cacheKey, this.cacheTTL["tickets"] || 5 * 60 * 1000)
    if (cached) return cached as ZendeskTicket[]

    try {
      const allTickets: ZendeskTicket[] = []
      let nextPageUrl: string | null = `/organizations/${organizationId}/tickets.json`

      let pageCount = 0
      while (nextPageUrl) {
        pageCount++
        console.log(`[ZendeskAPI] Fetching org ${organizationId} tickets page ${pageCount}...`)

        const response = await this.request<{
          tickets: ZendeskTicket[]
          next_page?: string
        }>(nextPageUrl)

        const pageTickets = response.tickets || []
        allTickets.push(...pageTickets)

        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allTickets)
      return allTickets
    } catch (error) {
      console.error(`[ZendeskAPI] Error fetching org ${organizationId} tickets:`, error)
      throw error
    }
  }

  /**
   * Get tickets requested by a specific user
   * GET /api/v2/users/{user_id}/tickets/requested.json
   */
  async getUserTicketsRequested(userId: number): Promise<ZendeskTicket[]> {
    const cacheKey = this.getCacheKey(`/users/${userId}/tickets/requested.json`)
    const cached = this.getFromCache(cacheKey, this.cacheTTL["tickets"] || 5 * 60 * 1000)
    if (cached) return cached as ZendeskTicket[]

    try {
      const allTickets: ZendeskTicket[] = []
      let nextPageUrl: string | null = `/users/${userId}/tickets/requested.json`

      let _pageCount = 0
      while (nextPageUrl) {
        _pageCount++

        const response = await this.request<{
          tickets: ZendeskTicket[]
          next_page?: string
        }>(nextPageUrl)

        const pageTickets = response.tickets || []
        allTickets.push(...pageTickets)

        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allTickets)
      return allTickets
    } catch (error) {
      console.error(`[ZendeskAPI] Error fetching user ${userId} requested tickets:`, error)
      throw error
    }
  }

  /**
   * Get tickets assigned to a specific user
   * GET /api/v2/users/{user_id}/tickets/assigned.json
   */
  async getUserTicketsAssigned(userId: number): Promise<ZendeskTicket[]> {
    const cacheKey = this.getCacheKey(`/users/${userId}/tickets/assigned.json`)
    const cached = this.getFromCache(cacheKey, this.cacheTTL["tickets"] || 5 * 60 * 1000)
    if (cached) return cached as ZendeskTicket[]

    try {
      const allTickets: ZendeskTicket[] = []
      let nextPageUrl: string | null = `/users/${userId}/tickets/assigned.json`

      let _pageCount = 0
      while (nextPageUrl) {
        _pageCount++

        const response = await this.request<{
          tickets: ZendeskTicket[]
          next_page?: string
        }>(nextPageUrl)

        const pageTickets = response.tickets || []
        allTickets.push(...pageTickets)

        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allTickets)
      return allTickets
    } catch (error) {
      console.error(`[ZendeskAPI] Error fetching user ${userId} assigned tickets:`, error)
      throw error
    }
  }

  /**
   * Get tickets where user is CC'd
   * GET /api/v2/users/{user_id}/tickets/ccd.json
   */
  async getUserTicketsCCd(userId: number): Promise<ZendeskTicket[]> {
    const cacheKey = this.getCacheKey(`/users/${userId}/tickets/ccd.json`)
    const cached = this.getFromCache(cacheKey, this.cacheTTL["tickets"] || 5 * 60 * 1000)
    if (cached) return cached as ZendeskTicket[]

    try {
      const allTickets: ZendeskTicket[] = []
      let nextPageUrl: string | null = `/users/${userId}/tickets/ccd.json`

      let _pageCount = 0
      while (nextPageUrl) {
        _pageCount++

        const response = await this.request<{
          tickets: ZendeskTicket[]
          next_page?: string
        }>(nextPageUrl)

        const pageTickets = response.tickets || []
        allTickets.push(...pageTickets)

        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allTickets)
      return allTickets
    } catch (error) {
      console.error(`[ZendeskAPI] Error fetching user ${userId} CC'd tickets:`, error)
      throw error
    }
  }

  /**
   * Get total ticket count
   * GET /api/v2/tickets/count.json
   */
  async getTicketCount(query?: string): Promise<number> {
    try {
      const params = query ? { query } : {}
      const response = await this.request<{ count: { value: number } }>("/tickets/count.json", {
        params,
      })

      return response.count.value
    } catch (error) {
      console.error("[ZendeskAPI] Error getting ticket count:", error)
      throw error
    }
  }

  /**
   * Get deleted tickets
   * GET /api/v2/deleted_tickets.json
   */
  async getDeletedTickets(): Promise<ZendeskTicket[]> {
    try {
      const response = await this.request<{ deleted_tickets: ZendeskTicket[] }>(
        "/deleted_tickets.json"
      )

      return response.deleted_tickets
    } catch (error) {
      console.error("[ZendeskAPI] Error fetching deleted tickets:", error)
      throw error
    }
  }

  /**
   * Get ticket collaborators
   * GET /api/v2/tickets/{ticket_id}/collaborators.json
   */
  async getTicketCollaborators(ticketId: number): Promise<ZendeskUser[]> {
    try {
      const response = await this.request<{ users: ZendeskUser[] }>(
        `/tickets/${ticketId}/collaborators.json`
      )

      return response.users
    } catch (error) {
      console.error(`[ZendeskAPI] Error fetching ticket ${ticketId} collaborators:`, error)
      throw error
    }
  }

  /**
   * Get ticket incidents (for problem tickets)
   * GET /api/v2/tickets/{ticket_id}/incidents.json
   */
  async getTicketIncidents(ticketId: number): Promise<ZendeskTicket[]> {
    try {
      const allTickets: ZendeskTicket[] = []
      let nextPageUrl: string | null = `/tickets/${ticketId}/incidents.json`

      let _pageCount = 0
      while (nextPageUrl) {
        _pageCount++

        const response = await this.request<{
          tickets: ZendeskTicket[]
          next_page?: string
        }>(nextPageUrl)

        const pageTickets = response.tickets || []
        allTickets.push(...pageTickets)

        nextPageUrl = response.next_page || null
      }

      return allTickets
    } catch (error) {
      console.error(`[ZendeskAPI] Error fetching ticket ${ticketId} incidents:`, error)
      throw error
    }
  }

  /**
   * Get similar/related tickets (autocomplete for problems)
   * GET /api/v2/tickets/problems/autocomplete.json?text=search_term
   */
  async searchProblemTickets(searchText: string): Promise<ZendeskTicket[]> {
    try {
      const response = await this.request<{ tickets: ZendeskTicket[] }>(
        `/tickets/problems/autocomplete.json?text=${encodeURIComponent(searchText)}`
      )

      return response.tickets
    } catch (error) {
      console.error("[ZendeskAPI] Error searching problem tickets:", error)
      throw error
    }
  }

  /**
   * Get recent tickets (agent's recently viewed)
   * GET /api/v2/tickets/recent.json
   */
  async getRecentTickets(): Promise<ZendeskTicket[]> {
    try {
      const response = await this.request<{ tickets: ZendeskTicket[] }>("/tickets/recent.json")

      return response.tickets
    } catch (error) {
      console.error("[ZendeskAPI] Error fetching recent tickets:", error)
      throw error
    }
  }

  /**
   * Add tags to a ticket
   * PUT /api/v2/tickets/{ticket_id}.json with additional_tags
   */
  async addTicketTags(ticketId: number, tags: string[]): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Adding tags to ticket ${ticketId}: ${tags.join(", ")}`)

      const response = await this.request<{
        ticket: ZendeskTicket
      }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            additional_tags: tags,
          },
        },
      })

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error adding tags to ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Remove tags from a ticket
   * PUT /api/v2/tickets/{ticket_id}.json with remove_tags
   */
  async removeTicketTags(ticketId: number, tags: string[]): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Removing tags from ticket ${ticketId}: ${tags.join(", ")}`)

      const response = await this.request<{
        ticket: ZendeskTicket
      }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            remove_tags: tags,
          },
        },
      })

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error removing tags from ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Set ticket tags (replaces all existing tags)
   * PUT /api/v2/tickets/{ticket_id}.json with tags
   */
  async setTicketTags(ticketId: number, tags: string[]): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Setting tags for ticket ${ticketId}: ${tags.join(", ")}`)

      const response = await this.request<{
        ticket: ZendeskTicket
      }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            tags,
          },
        },
      })

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error setting tags for ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Assign ticket to a specific agent by ID
   * PUT /api/v2/tickets/{ticket_id}.json with assignee_id
   */
  async assignTicketById(ticketId: number, assigneeId: number): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Assigning ticket ${ticketId} to agent ${assigneeId}`)

      const response = await this.request<{
        ticket: ZendeskTicket
      }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            assignee_id: assigneeId,
          },
        },
      })

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error assigning ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Assign ticket to a group
   * PUT /api/v2/tickets/{ticket_id}.json with group_id
   */
  async assignTicketToGroup(ticketId: number, groupId: number): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Assigning ticket ${ticketId} to group ${groupId}`)

      const response = await this.request<{
        ticket: ZendeskTicket
      }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            group_id: groupId,
          },
        },
      })

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error assigning ticket ${ticketId} to group:`, error)
      throw error
    }
  }

  /**
   * Update ticket priority
   * PUT /api/v2/tickets/{ticket_id}.json with priority
   */
  async updateTicketPriority(
    ticketId: number,
    priority: "urgent" | "high" | "normal" | "low"
  ): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Updating ticket ${ticketId} priority to ${priority}`)

      const response = await this.request<{
        ticket: ZendeskTicket
      }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            priority,
          },
        },
      })

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error updating ticket ${ticketId} priority:`, error)
      throw error
    }
  }

  /**
   * Update ticket status
   * PUT /api/v2/tickets/{ticket_id}.json with status
   */
  async updateTicketStatus(
    ticketId: number,
    status: "new" | "open" | "pending" | "hold" | "solved" | "closed"
  ): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Updating ticket ${ticketId} status to ${status}`)

      const response = await this.request<{
        ticket: ZendeskTicket
      }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            status,
          },
        },
      })

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error updating ticket ${ticketId} status:`, error)
      throw error
    }
  }

  /**
   * Assign ticket to an agent
   * PUT /api/v2/tickets/{id}.json
   */
  async assignTicket(ticketId: number, assigneeEmail: string): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Assigning ticket ${ticketId} to ${assigneeEmail}`)

      const response = await this.request<{ ticket: ZendeskTicket }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            assignee_email: assigneeEmail,
          },
        },
      })

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error assigning ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Add tags to a ticket
   * PUT /api/v2/tickets/{id}.json
   */
  async addTags(ticketId: number, tags: string[]): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Adding tags to ticket ${ticketId}:`, tags)

      const response = await this.request<{ ticket: ZendeskTicket }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            additional_tags: tags,
          },
        },
      })

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error adding tags to ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Remove tags from a ticket
   * PUT /api/v2/tickets/{id}.json
   */
  async removeTags(ticketId: number, tags: string[]): Promise<ZendeskTicket> {
    try {
      console.log(`[ZendeskAPI] Removing tags from ticket ${ticketId}:`, tags)

      const response = await this.request<{ ticket: ZendeskTicket }>(`/tickets/${ticketId}.json`, {
        method: "PUT",
        body: {
          ticket: {
            remove_tags: tags,
          },
        },
      })

      // Clear cache
      this.cache.delete(this.getCacheKey(`/tickets/${ticketId}.json`))
      for (const key of this.cache.keys()) {
        if (key.includes("/tickets.json")) {
          this.cache.delete(key)
        }
      }

      return response.ticket
    } catch (error) {
      console.error(`[ZendeskAPI] Error removing tags from ticket ${ticketId}:`, error)
      throw error
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
    console.log("[ZendeskAPI] Cache cleared")
  }

  /**
   * Get cache stats for monitoring
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    }
  }
}

// Singleton instance
let client: ZendeskAPIClient | null = null

/**
 * Get or create API client instance
 */
export function getZendeskClient(): ZendeskAPIClient {
  if (!client) {
    client = new ZendeskAPIClient()
  }
  return client
}
