import { type NextRequest, NextResponse } from "next/server"

const INTERCOM_API_URL = "https://api.intercom.io"
const INTERCOM_VERSION = "2.14"

/**
 * Creates a contact and sends a message via Intercom
 * Uses the Contact Model API which is simpler for contact form submissions
 * POST /api/intercom/contact
 * Body: { name: string, email: string, message: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate input
    if (!(name && email && message)) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      )
    }

    // biome-ignore lint/complexity/useLiteralKeys: Next.js environment variable inlining requires bracket notation
    const accessToken = (process.env as Record<string, string | undefined>)["INTERCOM_ACCESS_TOKEN"]
    if (!accessToken) {
      console.error("INTERCOM_ACCESS_TOKEN not found in environment")
      return NextResponse.json({ error: "Intercom credentials not configured" }, { status: 500 })
    }

    // Step 1: Create or update contact using Contact Model API
    const contactResponse = await fetch(`${INTERCOM_API_URL}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Intercom-Version": INTERCOM_VERSION,
      },
      body: JSON.stringify({
        email,
        name,
        role: "user",
      }),
    })

    if (!contactResponse.ok) {
      const errorData = await contactResponse.text()
      console.error(
        `Failed to create/update contact: ${contactResponse.status} ${contactResponse.statusText}`,
        errorData
      )
      throw new Error(
        `Failed to create contact: ${contactResponse.status} ${contactResponse.statusText}`
      )
    }

    const contactData = await contactResponse.json()
    const contactId = contactData.id

    // Step 2: Send message as admin to the contact
    const messageResponse = await fetch(`${INTERCOM_API_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Intercom-Version": INTERCOM_VERSION,
      },
      body: JSON.stringify({
        from: {
          type: "admin",
          id: "0", // System/automated message
        },
        to: {
          type: "contact",
          id: contactId,
        },
        body: `New contact form submission from ${name} (${email}):\n\n${message}`,
      }),
    })

    if (!messageResponse.ok) {
      const errorData = await messageResponse.text()
      console.error(
        `Failed to send message: ${messageResponse.status} ${messageResponse.statusText}`,
        errorData
      )
      throw new Error(
        `Failed to send message: ${messageResponse.status} ${messageResponse.statusText}`
      )
    }

    const messageData = await messageResponse.json()

    return NextResponse.json(
      {
        success: true,
        contactId,
        messageId: messageData.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing Intercom contact form:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
