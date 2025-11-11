import { type NextRequest, NextResponse } from "next/server"

const INTERCOM_API_URL = "https://api.intercom.io"
const INTERCOM_VERSION = "2.14"

/**
 * Creates a conversation and sends a message via Intercom
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

    // First, create a conversation with the contact
    const conversationResponse = await fetch(`${INTERCOM_API_URL}/conversations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Intercom-Version": INTERCOM_VERSION,
      },
      body: JSON.stringify({
        type: "customer_initiated",
        participants: [
          {
            role: "user",
            external_id: email,
          },
        ],
        messages: [
          {
            from: {
              type: "user",
              external_id: email,
            },
            body: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
          },
        ],
      }),
    })

    if (!conversationResponse.ok) {
      const errorData = await conversationResponse.text()
      console.error(
        `Intercom API error: ${conversationResponse.status} ${conversationResponse.statusText}`,
        errorData
      )
      throw new Error(
        `Failed to create conversation: ${conversationResponse.status} ${conversationResponse.statusText}`
      )
    }

    const conversationData = await conversationResponse.json()

    return NextResponse.json(
      {
        success: true,
        conversationId: conversationData.id,
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
