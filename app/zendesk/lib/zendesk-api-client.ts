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
      const params: Record<string, unknown> = {}

      // Build ZQL query if filters provided
      if (filters) {
        const conditions: string[] = []
        if (filters.status) conditions.push(`status:${filters.status}`)
        if (filters.priority) conditions.push(`priority:${filters.priority}`)

        if (conditions.length > 0) {
          params["query"] = conditions.join(" AND ")
        }

        if (filters.limit) {
          params["per_page"] = filters.limit
        }
      }

      const response = await this.request<{ tickets: ZendeskTicket[] }>("/tickets.json", { params })
      const tickets = response.tickets || []

      this.setCache(cacheKey, tickets)
      return tickets
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
   */
  async getUsers(filters?: { role?: string; active?: boolean }): Promise<ZendeskUser[]> {
    const cacheKey = this.getCacheKey("/users.json", filters)
    const cached = this.getFromCache(cacheKey, this.cacheTTL["users"] || 60 * 60 * 1000)
    if (cached) return cached as ZendeskUser[]

    try {
      const params: Record<string, unknown> = {}
      if (filters?.role) params["role"] = filters.role
      if (filters?.active !== undefined) params["active"] = filters.active

      const response = await this.request<{ users: ZendeskUser[] }>("/users.json", { params })
      const users = response.users || []

      this.setCache(cacheKey, users)
      return users
    } catch (error) {
      console.error("[ZendeskAPI] Error fetching users:", error)
      throw error
    }
  }

  /**
   * Get all organizations
   */
  async getOrganizations(): Promise<ZendeskOrganization[]> {
    const cacheKey = this.getCacheKey("/organizations.json")
    const cached = this.getFromCache(cacheKey, this.cacheTTL["organizations"] || 60 * 60 * 1000)
    if (cached) return cached as ZendeskOrganization[]

    try {
      const response = await this.request<{ organizations: ZendeskOrganization[] }>(
        "/organizations.json"
      )
      const orgs = response.organizations || []

      this.setCache(cacheKey, orgs)
      return orgs
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
          const response = await this.request<{ count: number }>("/tickets/count.json", {
            params: { query: `status:${status}` },
          })
          stats[status] = response.count || 0
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
   */
  async searchTickets(query: string, limit = 25): Promise<ZendeskTicket[]> {
    const cacheKey = this.getCacheKey("/search.json", { query, limit })
    const cached = this.getFromCache(cacheKey, this.cacheTTL["tickets"] || 5 * 60 * 1000)
    if (cached) return cached as ZendeskTicket[]

    try {
      const response = await this.request<{ results: ZendeskTicket[] }>("/search.json", {
        params: {
          query,
          per_page: limit,
        },
      })

      const tickets = response.results || []
      this.setCache(cacheKey, tickets)
      return tickets
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
