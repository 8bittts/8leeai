import { type NextRequest, NextResponse } from "next/server"

/**
 * Submits contact form to Intercom via email
 * POST /api/intercom/contact
 * Body: { name: string, email: string, message: string }
 *
 * This endpoint forwards contact form submissions to Intercom's
 * email endpoint, which creates a conversation in the inbox.
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

    // Send email to Intercom inbox
    // Intercom's email endpoint accepts emails and automatically creates conversations
    const emailContent = `Name: ${name}
Email: ${email}

${message}`

    // Use Resend API to send email (no credentials needed, uses API key from env)
    // biome-ignore lint/complexity/useLiteralKeys: Next.js environment variable inlining requires bracket notation
    const resendApiKey = (process.env as Record<string, string | undefined>)["RESEND_API_KEY"]

    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "noreply@8lee.ai",
          replyTo: email,
          to: "amihb4cq@deathnote.intercom-mail.com",
          subject: `Contact Form: ${name}`,
          text: emailContent,
          html: `<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br>")}</p>`,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Failed to send email: ${response.status}`, errorText)
        throw new Error(`Failed to send email: ${response.status}`)
      }

      console.log(`Email sent to Intercom for: ${name} (${email})`)
    } else {
      // Fallback: just log the submission and return success
      // User can manually check the form data or set up Resend
      console.log(`Contact form submitted: ${name} (${email}): ${message}`)
      console.warn("RESEND_API_KEY not configured - email not sent to Intercom")
    }

    console.log(`Contact form submitted by ${name} (${email})`)

    return NextResponse.json(
      {
        success: true,
        message: `Thank you ${name}! Your message has been received.`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
