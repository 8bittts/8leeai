/**
 * Intercom Reply Endpoint
 * POST /api/intercom/reply
 *
 * Generates AI-powered replies to support tickets and posts them to Intercom
 */

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getIntercomAPIClient } from "@/app/intercom/lib/intercom-api-client"

const ReplyRequestSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  customInstructions: z.string().optional(),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { ticketId, customInstructions } = ReplyRequestSchema.parse(body)

    console.log(`[ReplyEndpoint] Generating reply for ticket ${ticketId}`)

    // Fetch ticket details from Intercom
    const client = getIntercomAPIClient()
    const ticket = await client.getTicket(ticketId)

    const subject = ticket.ticket_attributes._default_title_
    const description = ticket.ticket_attributes._default_description_

    console.log(`[ReplyEndpoint] Ticket fetched: "${subject}" (${ticket.state})`)

    // Generate AI reply using OpenAI
    const systemPrompt = `You are a professional, empathetic customer support agent for a Intercom-powered support team.

Your task is to write a helpful, professional reply to a support ticket that will be AUTOMATICALLY POSTED to the customer.

**CRITICAL INSTRUCTIONS:**
- DO NOT include any disclaimers, notes, or meta-commentary
- DO NOT say things like "I can't post replies" or "please copy this message"
- Write ONLY the actual reply text that will be sent to the customer
- This reply WILL be posted directly to Intercom without any human review
- Be warm, professional, and empathetic
- Acknowledge the customer's issue clearly
- Provide clear, actionable solutions when possible
- If you can't fully solve the issue, explain next steps
- Keep replies concise (2-4 paragraphs maximum)
- Use a friendly but professional tone
- Sign off with "Best regards" or "Thank you" followed by a signature

**Ticket Information:**
Subject: ${subject}
Description: ${description}
Status: ${ticket.state}
${customInstructions ? `\n**Additional Instructions:** ${customInstructions}` : ""}

**Example Format:**
Hello [Customer Name],

Thank you for reaching out to us about [issue]. I understand [acknowledge their problem].

[Provide solution or next steps here]

If you have any questions or need further assistance, please don't hesitate to reach out.

Best regards,
Support Team`

    const { text: replyBody } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt:
        "Write the support ticket reply now. Output ONLY the reply text with no additional commentary.",
      temperature: 0.7,
    })

    console.log(`[ReplyEndpoint] AI reply generated (${replyBody.length} chars)`)

    // Post the reply to Intercom ticket
    await client.addTicketComment(ticketId, replyBody)

    // Build direct link to the ticket
    const subdomain = process.env["INTERCOM_SUBDOMAIN"] || "app"
    const ticketLink = `https://${subdomain}.intercom.com/a/tickets/${ticketId}`

    console.log(`[ReplyEndpoint] Reply posted successfully to ticket ${ticketId}`)

    return NextResponse.json({
      success: true,
      ticketId,
      replyBody,
      ticketLink,
      ticket: {
        id: ticket.id,
        subject,
        status: ticket.state,
      },
    })
  } catch (error) {
    console.error("[ReplyEndpoint] Error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${error.issues[0]?.message}`,
        },
        { status: 400 }
      )
    }

    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    )
  }
}
