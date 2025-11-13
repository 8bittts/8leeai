/**
 * Zendesk Sunshine Conversations API Route
 *
 * POST /api/zendesk/tickets - Create a new support conversation
 * GET /api/zendesk/tickets - List conversations (requires auth)
 *
 * Uses the modern Zendesk Sunshine Conversations API for creating conversations
 * Handles conversation creation with proper validation, error handling, and logging
 */

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ZendeskTicketSchema } from "../../../lib/schemas"

/**
 * POST /api/zendesk/tickets
 * Create a new Zendesk Sunshine Conversation
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = ZendeskTicketSchema.parse(body)

    // Ensure Zendesk Sunshine Conversations credentials exist
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for process.env
    const appId = process.env["ZENDESK_APP_ID"]
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for process.env
    const keyId = process.env["ZENDESK_KEY_ID"]
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for process.env
    const secret = process.env["ZENDESK_SECRET"]

    if (!(appId && keyId && secret)) {
      console.error("Missing Zendesk Sunshine Conversations credentials in environment")
      return NextResponse.json({ error: "Service configuration error" }, { status: 500 })
    }

    // Create Basic Auth for Sunshine Conversations API
    const auth = Buffer.from(`${keyId}:${secret}`).toString("base64")

    // Construct Sunshine Conversations API request
    const zendeskUrl = `https://api.zendesk.com/v2/apps/${appId}/conversations`

    console.log(`[ZENDESK] Creating Sunshine Conversation for: ${validatedData.requesterEmail}`)

    // For Sunshine Conversations, we create a conversation with metadata
    const conversationPayload = {
      participants: [
        {
          userExternalId: validatedData.requesterEmail,
        },
      ],
      metadata: {
        subject: validatedData.subject,
        description: validatedData.description,
        requesterName: validatedData.requesterName,
        requesterEmail: validatedData.requesterEmail,
        category: validatedData.category,
        priority: validatedData.priority,
      },
    }

    const zendeskResponse = await fetch(zendeskUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conversationPayload),
    })

    if (!zendeskResponse.ok) {
      const errorText = await zendeskResponse.text()
      console.error("Zendesk Sunshine Conversations API error (status:", zendeskResponse.status, "):", errorText)

      // Check for redirect responses (301, 302, etc.) - indicates auth failure
      if (zendeskResponse.status >= 300 && zendeskResponse.status < 400) {
        console.error("Received redirect response - this likely indicates invalid credentials or app configuration")
        return NextResponse.json(
          {
            error: "Zendesk configuration error",
            details: "Invalid App ID, Key ID, or Secret. Please verify credentials in Zendesk Admin panel.",
            status: zendeskResponse.status,
          },
          { status: 500 }
        )
      }

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText }
      }

      return NextResponse.json(
        {
          error: "Failed to create conversation",
          details: errorData.error || "Unknown error",
        },
        { status: zendeskResponse.status }
      )
    }

    const conversationData = await zendeskResponse.json()

    // Return success response
    return NextResponse.json(
      {
        success: true,
        ticketId: conversationData.conversation.id,
        conversationId: conversationData.conversation.id,
        createdAt: conversationData.conversation.createdAt,
        message: "Conversation created successfully",
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
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for process.env
    const zendeskToken = process.env["ZENDESK_API_TOKEN"]
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for process.env
    const zendeskSubdomain = process.env["ZENDESK_SUBDOMAIN"]
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for process.env
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
