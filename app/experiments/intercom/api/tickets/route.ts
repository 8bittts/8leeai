import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getIntercomAPIClient } from "@/app/experiments/intercom/lib/intercom-api-client"

const TicketsRequestSchema = z.object({
  filters: z.record(z.string(), z.unknown()).optional(),
  stats: z.boolean().optional(),
})

interface ApiFilters {
  status?: string
  priority?: string
  limit?: number
}

/**
 * Extract and validate filter parameters from request
 */
function parseFilters(filters?: Record<string, unknown>): ApiFilters {
  const apiFilters: ApiFilters = {}

  if (!filters) return apiFilters

  if (typeof filters["status"] === "string") {
    apiFilters.status = filters["status"] as string
  }
  if (typeof filters["priority"] === "string") {
    apiFilters.priority = filters["priority"] as string
  }
  if (typeof filters["limit"] === "number") {
    apiFilters.limit = filters["limit"] as number
  }

  if (!apiFilters.limit) {
    apiFilters.limit = 25
  }

  return apiFilters
}

/**
 * Handle error responses with appropriate status codes
 */
function handleError(error: unknown): NextResponse {
  console.error("[TicketsAPI] Error fetching tickets:", error)

  if (error instanceof Error) {
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Intercom authentication failed. Check your INTERCOM_EMAIL and INTERCOM_API_TOKEN.",
        },
        { status: 401 }
      )
    }
    if (error.message.includes("INTERCOM_SUBDOMAIN")) {
      return NextResponse.json(
        {
          success: false,
          error: "Intercom subdomain not configured. Set INTERCOM_SUBDOMAIN environment variable.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: "Failed to fetch tickets",
    },
    { status: 500 }
  )
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { filters, stats } = TicketsRequestSchema.parse(body)

    console.log(`[TicketsAPI] Request - filters: ${JSON.stringify(filters)}, stats: ${stats}`)

    const client = getIntercomAPIClient()

    // Handle stats request
    if (stats) {
      try {
        const ticketStats = await client.getTicketStats()
        return NextResponse.json({ success: true, stats: ticketStats })
      } catch (error) {
        return handleError(error)
      }
    }

    // Handle ticket fetch request
    try {
      const apiFilters = parseFilters(filters)
      console.log("[TicketsAPI] Fetching tickets with filters:", apiFilters)
      const tickets = await client.getTickets(apiFilters)

      return NextResponse.json({
        success: true,
        tickets,
        count: tickets.length,
      })
    } catch (error) {
      return handleError(error)
    }
  } catch (error) {
    console.error("[TicketsAPI] Request validation failed:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${error.issues[0]?.message}`,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      { status: 400 }
    )
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const client = getIntercomAPIClient()
    const cacheStats = await client.getCacheStats()

    return NextResponse.json({
      status: "ok",
      cache: cacheStats,
    })
  } catch (error) {
    console.error("[TicketsAPI] Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
