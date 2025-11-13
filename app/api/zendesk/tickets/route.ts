import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getZendeskClient } from "@/app/zendesk/lib/zendesk-api-client"

const TicketsRequestSchema = z.object({
  filters: z.record(z.string(), z.unknown()).optional(),
  stats: z.boolean().optional(),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { filters, stats } = TicketsRequestSchema.parse(body)

    console.log(
      `[TicketsAPI] Request - filters: ${"${JSON.stringify(filters)}"}, stats: ${"${stats}"}`
    )

    const client = getZendeskClient()

    if (stats) {
      try {
        const ticketStats = await client.getTicketStats()
        return NextResponse.json({ success: true, stats: ticketStats })
      } catch (error) {
        console.error("[TicketsAPI] Error fetching stats:", error)
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch statistics",
          },
          { status: 500 }
        )
      }
    }

    try {
      const apiFilters: {
        status?: string
        priority?: string
        limit?: number
      } = {}

      if (filters) {
        if (typeof filters["status"] === "string") apiFilters.status = filters["status"] as string
        if (typeof filters["priority"] === "string")
          apiFilters.priority = filters["priority"] as string
        if (typeof filters["limit"] === "number") apiFilters.limit = filters["limit"] as number
      }

      if (!apiFilters.limit) apiFilters.limit = 25

      console.log("[TicketsAPI] Fetching tickets with filters:", apiFilters)
      const tickets = await client.getTickets(apiFilters)

      return NextResponse.json({
        success: true,
        tickets,
        count: tickets.length,
      })
    } catch (error) {
      console.error("[TicketsAPI] Error fetching tickets:", error)

      if (error instanceof Error) {
        if (error.message.includes("Unauthorized")) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Zendesk authentication failed. Check your ZENDESK_EMAIL and ZENDESK_API_TOKEN.",
            },
            { status: 401 }
          )
        }
        if (error.message.includes("ZENDESK_SUBDOMAIN")) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Zendesk subdomain not configured. Set ZENDESK_SUBDOMAIN environment variable.",
            },
            { status: 500 }
          )
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Failed to fetch tickets",
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[TicketsAPI] Request validation failed:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${"${error.issues[0]?.message}"}`,
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
    const client = getZendeskClient()
    const cacheStats = client.getCacheStats()

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
