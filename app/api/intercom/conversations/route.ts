/**
 * Intercom Contacts API Route
 *
 * POST /api/intercom/conversations - Create/register a contact
 *
 * Simplified approach: Just create contacts in Intercom.
 * Users then reach out via email (amihb4cq@8lee.intercom-mail.com)
 * for direct messaging. No webhook needed.
 */

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { IntercomConversationSchema } from "../../../lib/schemas"

/**
 * POST /api/intercom/conversations
 * Create a contact in Intercom
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

    // Success: Contact created or already exists
    return NextResponse.json(
      {
        success: true,
        contactId,
        visitorEmail: validatedData.visitorEmail,
        visitorName: validatedData.visitorName,
        message:
          "Contact registered. You can now email amihb4cq@8lee.intercom-mail.com to start a conversation.",
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
