/**
 * Zendesk Tickets API Route
 *
 * POST /api/zendesk/tickets - Create a new support ticket
 * GET /api/zendesk/tickets - List tickets (requires auth)
 *
 * Handles ticket creation with proper validation, error handling, and logging
 */

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ZendeskTicketSchema } from "../../../lib/schemas"

/**
 * POST /api/zendesk/tickets
 * Create a new Zendesk support ticket
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = ZendeskTicketSchema.parse(body)

    // Ensure Zendesk credentials exist
    const zendeskToken = process.env["ZENDESK_API_TOKEN"]
    const zendeskSubdomain = process.env["ZENDESK_SUBDOMAIN"]
    const zendeskEmail = process.env["ZENDESK_EMAIL"]

    if (!(zendeskToken && zendeskSubdomain && zendeskEmail)) {
      console.error("Missing Zendesk credentials in environment")
      return NextResponse.json({ error: "Service configuration error" }, { status: 500 })
    }

    // Construct Zendesk API request
    const zendeskUrl = `https://${zendeskSubdomain}.zendesk.com/api/v2/tickets.json`

    const ticketPayload = {
      ticket: {
        subject: validatedData.subject,
        description: validatedData.description,
        requester: {
          name: validatedData.requesterName,
          email: validatedData.requesterEmail,
        },
        priority: validatedData.priority,
        tags: [validatedData.category, "web-form"],
        custom_fields: [
          {
            id: 12345, // Replace with actual custom field ID
            value: validatedData.category,
          },
        ],
      },
    }

    // Send to Zendesk API with basic auth
    const auth = Buffer.from(`${zendeskEmail}/token:${zendeskToken}`).toString("base64")

    const zendeskResponse = await fetch(zendeskUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketPayload),
    })

    if (!zendeskResponse.ok) {
      const errorData = await zendeskResponse.json()
      console.error("Zendesk API error:", errorData)

      return NextResponse.json(
        {
          error: "Failed to create ticket",
          details: errorData.error || "Unknown error",
        },
        { status: zendeskResponse.status }
      )
    }

    const ticketData = await zendeskResponse.json()

    // Return success response
    return NextResponse.json(
      {
        success: true,
        ticketId: ticketData.ticket.id,
        status: ticketData.ticket.status,
        priority: ticketData.ticket.priority,
        createdAt: ticketData.ticket.created_at,
        message: "Ticket created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.warn("Validation error:", error.issues)
      return NextResponse.json(
        {
          error: "Invalid request data",
          issues: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    // Handle unexpected errors
    console.error("Unexpected error in POST /api/zendesk/tickets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/zendesk/tickets
 * List all tickets (placeholder for future auth implementation)
 */
export async function GET(request: NextRequest) {
  try {
    const zendeskToken = process.env["ZENDESK_API_TOKEN"]
    const zendeskSubdomain = process.env["ZENDESK_SUBDOMAIN"]
    const zendeskEmail = process.env["ZENDESK_EMAIL"]

    if (!(zendeskToken && zendeskSubdomain && zendeskEmail)) {
      return NextResponse.json({ error: "Service configuration error" }, { status: 500 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "open"
    const limit = searchParams.get("limit") || "10"

    const zendeskUrl = `https://${zendeskSubdomain}.zendesk.com/api/v2/tickets.json?status=${status}&per_page=${limit}`

    const auth = Buffer.from(`${zendeskEmail}/token:${zendeskToken}`).toString("base64")

    const zendeskResponse = await fetch(zendeskUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    })

    if (!zendeskResponse.ok) {
      console.error("Zendesk API error:", zendeskResponse.status)
      return NextResponse.json(
        { error: "Failed to fetch tickets" },
        { status: zendeskResponse.status }
      )
    }

    const data = await zendeskResponse.json()

    return NextResponse.json({
      tickets: data.tickets,
      count: data.tickets.length,
    })
  } catch (error) {
    console.error("Unexpected error in GET /api/zendesk/tickets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
