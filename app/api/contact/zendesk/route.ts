import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    // Create Resend instance with API key from environment
    // biome-ignore lint/complexity/useLiteralKeys: Required for TypeScript strict mode
    const resend = new Resend(process.env["RESEND_API_KEY"])

    const body: ContactFormData = await request.json()

    const { name, email, message } = body

    // Validate required fields
    if (!(name && email && message)) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Send email via Resend
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // Must be verified sender in Resend
      to: "support@8lee.zendesk.com", // Zendesk support email
      replyTo: email, // Set reply-to as visitor's email
      subject: `Support Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 10px; border-radius: 3px;">${message}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Reply to this email to respond directly to the visitor.
          </p>
        </div>
      `,
    })

    if (response.error) {
      console.error("Resend error:", response.error)
      return NextResponse.json({ message: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json(
      { message: "Email sent successfully", id: response.data?.id },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
