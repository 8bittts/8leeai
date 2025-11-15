/**
 * Zendesk REST API Client
 * Handles authentication, requests, caching, and error handling for Zendesk APIs
 */

interface ZendeskTicket {
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
  private async request<T>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE"
      body?: Record<string, unknown>
      params?: Record<string, unknown>
    } = {}
  ): Promise<T> {
    const { method = "GET", body, params } = options

    // Build URL
    let url = `${this.baseUrl}${endpoint}`
    if (params && method === "GET") {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
      url = `${url}?${queryString}`
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

      if (filters) {
        const conditions: string[] = []
        if (filters.status) conditions.push(`status:${filters.status}`)
        if (filters.priority) conditions.push(`priority:${filters.priority}`)

        if (conditions.length > 0) {
          queryParams["query"] = conditions.join(" AND ")
        }
      }

      // Paginate through all results
      let pageCount = 0
      while (nextPageUrl) {
        pageCount++
        console.log(`[ZendeskAPI] Fetching tickets page ${pageCount}...`)

        const response = await this.request<{
          tickets: ZendeskTicket[]
          next_page?: string
        }>(nextPageUrl, { params: pageCount === 1 ? queryParams : {} })

        const pageTickets = response.tickets || []
        allTickets.push(...pageTickets)
        console.log(`[ZendeskAPI] Page ${pageCount}: ${pageTickets.length} tickets (total: ${allTickets.length})`)

        // Check for next page
        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allTickets)
      console.log(`[ZendeskAPI] Pagination complete: ${allTickets.length} total tickets across ${pageCount} pages`)
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
        console.log(`[ZendeskAPI] Page ${pageCount}: ${pageUsers.length} users (total: ${allUsers.length})`)

        // Check for next page
        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allUsers)
      console.log(`[ZendeskAPI] User pagination complete: ${allUsers.length} total users across ${pageCount} pages`)
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
        console.log(`[ZendeskAPI] Page ${pageCount}: ${pageOrgs.length} organizations (total: ${allOrgs.length})`)

        // Check for next page
        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allOrgs)
      console.log(`[ZendeskAPI] Organizations pagination complete: ${allOrgs.length} total organizations across ${pageCount} pages`)
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
        console.log(`[ZendeskAPI] Page ${pageCount}: ${pageResults.length} results (total: ${allResults.length})`)

        // Check for next page
        nextPageUrl = response.next_page || null
      }

      this.setCache(cacheKey, allResults)
      console.log(`[ZendeskAPI] Search pagination complete: ${allResults.length} total results across ${pageCount} pages`)
      return allResults
    } catch (error) {
      console.error("[ZendeskAPI] Error searching tickets:", error)
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
