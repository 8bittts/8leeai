/**
 * Intercom Conversations API Route
 *
 * POST /api/intercom/conversations - Start a new conversation
 * GET /api/intercom/conversations - List conversations (requires auth)
 *
 * Handles conversation management with visitor tracking and context
 */

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { IntercomConversationSchema } from "../../lib/schemas"

/**
 * POST /api/intercom/conversations
 * Start a new conversation with a visitor
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = IntercomConversationSchema.parse(body)

    // Ensure Intercom credentials exist
    const intercomAccessToken = process.env.INTERCOM_ACCESS_TOKEN
    const intercomWorkspaceId = process.env.INTERCOM_WORKSPACE_ID

    if (!(intercomAccessToken && intercomWorkspaceId)) {
      console.error("Missing Intercom credentials in environment")
      return NextResponse.json({ error: "Service configuration error" }, { status: 500 })
    }

    // First, create or find the contact (visitor)
    const contactUrl = "https://api.intercom.io/contacts"

    const contactPayload = {
      role: "user",
      email: validatedData.visitorEmail,
      name: validatedData.visitorName,
      custom_attributes: {
        page_url: validatedData.pageUrl,
        page_title: validatedData.pageTitle,
      },
    }

    const contactResponse = await fetch(contactUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${intercomAccessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(contactPayload),
    })

    if (!contactResponse.ok && contactResponse.status !== 409) {
      // 409 means contact already exists
      const errorData = await contactResponse.json()
      console.error("Intercom contact API error:", errorData)
      return NextResponse.json(
        { error: "Failed to create contact" },
        { status: contactResponse.status }
      )
    }

    const contactData = await contactResponse.json()
    const contactId = contactData.id

    // Now create a conversation with initial message
    const conversationUrl = "https://api.intercom.io/conversations"

    const conversationPayload = {
      from: {
        type: "contact",
        id: contactId,
      },
      body: validatedData.initialMessage,
      type: "user",
      custom_attributes: {
        topic: validatedData.topic,
      },
    }

    const conversationResponse = await fetch(conversationUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${intercomAccessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(conversationPayload),
    })

    if (!conversationResponse.ok) {
      const errorData = await conversationResponse.json()
      console.error("Intercom conversation API error:", errorData)
      return NextResponse.json(
        { error: "Failed to create conversation" },
        { status: conversationResponse.status }
      )
    }

    const conversation = await conversationResponse.json()

    // Return success response
    return NextResponse.json(
      {
        success: true,
        conversationId: conversation.id,
        visitorEmail: validatedData.visitorEmail,
        visitorName: validatedData.visitorName,
        createdAt: conversation.created_at,
        topic: validatedData.topic,
        status: "open",
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
    console.error("Unexpected error in POST /api/intercom/conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/intercom/conversations
 * List conversations for a specific contact/visitor
 */
export async function GET(request: NextRequest) {
  try {
    const intercomAccessToken = process.env.INTERCOM_ACCESS_TOKEN

    if (!intercomAccessToken) {
      return NextResponse.json({ error: "Service configuration error" }, { status: 500 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get("contactId")
    const limit = searchParams.get("limit") || "10"

    if (!contactId) {
      return NextResponse.json({ error: "contactId query parameter is required" }, { status: 400 })
    }

    // Fetch conversations for the contact
    const conversationsUrl = `https://api.intercom.io/contacts/${contactId}/conversations?per_page=${limit}`

    const conversationsResponse = await fetch(conversationsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${intercomAccessToken}`,
        Accept: "application/json",
      },
    })

    if (!conversationsResponse.ok) {
      console.error("Intercom conversations fetch error:", conversationsResponse.status)
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: conversationsResponse.status }
      )
    }

    const data = await conversationsResponse.json()

    return NextResponse.json({
      conversations: data.conversations || [],
      count: data.conversations?.length || 0,
    })
  } catch (error) {
    console.error("Unexpected error in GET /api/intercom/conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
