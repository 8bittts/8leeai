/**
 * Intercom Contacts API Route
 *
 * POST /api/intercom/conversations - Create a support contact/ticket
 *
 * Creates a contact in Intercom that represents a support request or issue.
 * Contacts with email and name become visible as support tickets in the Intercom dashboard.
 */

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { IntercomConversationSchema } from "../../../lib/schemas"

async function createConversation(
  contactId: string,
  initialMessage: string,
  visitorName: string,
  accessToken: string
): Promise<string | null> {
  try {
    const conversationUrl = "https://api.intercom.io/conversations"
    const conversationPayload = {
      contact_id: contactId,
      body: initialMessage || `Support request from ${visitorName}`,
    }

    const conversationResponse = await fetch(conversationUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Intercom-Version": "2.14",
      },
      body: JSON.stringify(conversationPayload),
    })

    const conversationData = await conversationResponse.json()

    if (conversationResponse.ok) {
      return conversationData.id
    }

    console.warn("Intercom conversation creation warning:", conversationData)
    return null
  } catch (error) {
    console.error("Error creating conversation:", error)
    return null
  }
}

async function createTicket(
  contactEmail: string,
  _message: string,
  _visitorName: string,
  accessToken: string
): Promise<string | null> {
  try {
    // Get or create a default ticket type first
    let ticketTypeId = "1" // Default to ID 1 (common default)

    // Try to get existing ticket types to find one we can use
    try {
      const ticketTypesUrl = "https://api.intercom.io/ticket_types"
      const typesResponse = await fetch(ticketTypesUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Intercom-Version": "2.14",
        },
      })

      if (typesResponse.ok) {
        const typesData = await typesResponse.json()
        if (typesData.data && typesData.data.length > 0) {
          ticketTypeId = typesData.data[0].id
        }
      }
    } catch {
      // If fetching fails, use default ID "1"
      console.log("Could not fetch ticket types, using default ticket type ID")
    }

    // Create the ticket
    const ticketUrl = "https://api.intercom.io/tickets"
    const ticketPayload = {
      contacts: [
        {
          email: contactEmail,
        },
      ],
      ticket_type_id: ticketTypeId,
      // Only include ticket_attributes if there are custom fields defined
      // Most basic ticket types don't have custom attributes
    }

    const ticketResponse = await fetch(ticketUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Intercom-Version": "2.14",
      },
      body: JSON.stringify(ticketPayload),
    })

    const ticketData = await ticketResponse.json()

    if (ticketResponse.ok) {
      console.log(`[INTERCOM] Ticket created successfully: ${ticketData.id}`)
      return ticketData.id
    }

    // If it fails, log but don't fail the whole request
    console.warn("Intercom ticket creation warning:", ticketData)
    return null
  } catch (error) {
    console.error("Error creating ticket:", error)
    return null
  }
}

/**
 * POST /api/intercom/conversations
 * Create a contact in Intercom (support ticket)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = IntercomConversationSchema.parse(body)

    // Ensure Intercom credentials exist
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for process.env
    const intercomAccessToken = process.env["INTERCOM_ACCESS_TOKEN"]
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for process.env
    const intercomWorkspaceId = process.env["INTERCOM_WORKSPACE_ID"]

    if (!(intercomAccessToken && intercomWorkspaceId)) {
      console.error("Missing Intercom credentials in environment")
      return NextResponse.json({ error: "Service configuration error" }, { status: 500 })
    }

    // Create or find the contact
    const contactUrl = "https://api.intercom.io/contacts"

    // Minimal payload - only email and name are required/supported
    const contactPayload = {
      email: validatedData.visitorEmail,
      name: validatedData.visitorName,
    }

    const contactResponse = await fetch(contactUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${intercomAccessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Intercom-Version": "2.14",
      },
      body: JSON.stringify(contactPayload),
    })

    const contactData = await contactResponse.json()

    // For 409 (conflict), need to fetch the existing contact
    let contactId: string | null = null

    if (contactResponse.status === 409) {
      // Contact already exists - fetch it
      console.log("Contact already exists, fetching...")
      const getContactUrl = `https://api.intercom.io/contacts?email=${encodeURIComponent(validatedData.visitorEmail)}`
      const getResponse = await fetch(getContactUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${intercomAccessToken}`,
          "Intercom-Version": "2.14",
        },
      })

      if (getResponse.ok) {
        const contactsData = await getResponse.json()
        contactId = contactsData.data?.[0]?.id
      }
    } else if (contactResponse.ok) {
      // Contact created successfully
      contactId = contactData.id
    } else {
      // Error
      console.error("Intercom contact API error:", contactData)
      return NextResponse.json(
        { error: "Failed to create contact", details: contactData },
        { status: contactResponse.status }
      )
    }

    if (!contactId) {
      console.error("Could not extract contact ID from response:", contactData)
      return NextResponse.json(
        { error: "Could not extract contact ID from Intercom response" },
        { status: 500 }
      )
    }

    // Step 2: Create a conversation for this contact
    const conversationId = await createConversation(
      contactId,
      validatedData.initialMessage || `Support request from ${validatedData.visitorName}`,
      validatedData.visitorName,
      intercomAccessToken
    )

    // Step 3: Create a ticket for this contact
    const ticketId = await createTicket(
      validatedData.visitorEmail,
      validatedData.initialMessage || `Support request from ${validatedData.visitorName}`,
      validatedData.visitorName,
      intercomAccessToken
    )

    // Success: Contact created, conversation and ticket attempted
    return NextResponse.json(
      {
        success: true,
        contactId,
        conversationId: conversationId || contactId,
        ticketId: ticketId || null,
        visitorEmail: validatedData.visitorEmail,
        visitorName: validatedData.visitorName,
        message: "Support request received! Your ticket has been created.",
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
