import { type NextRequest, NextResponse } from "next/server"

const INTERCOM_API_URL = "https://api.intercom.io"

/**
 * Creates a new conversation/ticket in Intercom from contact form
 * POST /api/intercom/contact
 * Body: { name: string, email: string, message: string }
 *
 * This endpoint sends contact form data to Intercom's REST API
 * and stores the submission for processing by the support team.
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

    // Create a contact with the form data
    // Intercom will auto-create or update the contact based on email
    const contactResponse = await fetch(`${INTERCOM_API_URL}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Intercom-Version": "2.14",
      },
      body: JSON.stringify({
        role: "user",
        email,
        name,
      }),
    })

    const contactResponseData = await contactResponse.json()

    let contactId = contactResponseData.id

    if (!contactResponse.ok) {
      // If contact already exists (409), try to get the ID from response
      if (contactResponse.status === 409 && contactResponseData.id) {
        contactId = contactResponseData.id
      } else {
        console.error(`Contact creation failed: ${contactResponse.status}`, contactResponseData)
        throw new Error(`Failed to create contact: ${contactResponse.status}`)
      }
    }

    if (!contactId) {
      throw new Error("Failed to get contact ID from Intercom response")
    }

    // Success! Return the submitted contact information
    return NextResponse.json(
      {
        success: true,
        message: `Thank you ${name}! Your message has been received.`,
        contactId,
        submittedData: {
          name,
          email,
          message,
        },
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
