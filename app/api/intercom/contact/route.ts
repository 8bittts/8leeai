import { type NextRequest, NextResponse } from "next/server"

const INTERCOM_API_URL = "https://api.intercom.io"

/**
 * Creates a contact and sends them a message via Intercom
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
      return NextResponse.json({ error: "Intercom credentials not configured" }, { status: 500 })
    }

    // Create or find contact by email
    const contactResponse = await fetch(`${INTERCOM_API_URL}/contacts/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: {
          field: "email",
          operator: "=",
          value: email,
        },
      }),
    })

    if (!contactResponse.ok) {
      throw new Error(
        `Failed to search contacts: ${contactResponse.status} ${contactResponse.statusText}`
      )
    }

    const contactData = await contactResponse.json()
    let contactId: string

    // If contact exists, use it; otherwise create new one
    if (contactData.data && contactData.data.length > 0) {
      contactId = contactData.data[0].id
    } else {
      // Create new contact
      const createResponse = await fetch(`${INTERCOM_API_URL}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          role: "user",
          email,
          name,
        }),
      })

      if (!createResponse.ok) {
        throw new Error(
          `Failed to create contact: ${createResponse.status} ${createResponse.statusText}`
        )
      }

      const newContact = await createResponse.json()
      contactId = newContact.id
    }

    // Send message to the contact
    const messageResponse = await fetch(`${INTERCOM_API_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from: {
          type: "contact",
          id: contactId,
        },
        body: message,
      }),
    })

    if (!messageResponse.ok) {
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
