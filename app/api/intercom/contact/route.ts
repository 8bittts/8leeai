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

    // Send contact form message - Intercom will auto-create contact from email
    // This is simpler than trying to create contact first
    const submitResponse = await fetch(`${INTERCOM_API_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Intercom-Version": INTERCOM_VERSION,
      },
      body: JSON.stringify({
        message_type: "inbound",
        from: {
          type: "contact",
          email,
        },
        body: `Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    })

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text()
      console.error(
        `Failed to submit contact form: ${submitResponse.status} ${submitResponse.statusText}`
      )
      console.error("Response body:", errorText)
      console.error(
        "Request payload:",
        JSON.stringify({
          message_type: "inbound",
          from: { type: "contact", email },
          body: `Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        })
      )
      throw new Error(
        `Failed to submit form: ${submitResponse.status} - ${errorText || submitResponse.statusText}`
      )
    }

    const submitData = await submitResponse.json()

    return NextResponse.json(
      {
        success: true,
        messageId: submitData.id,
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
