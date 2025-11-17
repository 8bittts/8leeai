/**
 * Zendesk Reply Endpoint
 * POST /api/zendesk/reply
 *
 * Generates AI-powered replies to support tickets and posts them to Zendesk
 */

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getZendeskClient } from "@/app/zendesk/lib/zendesk-api-client"

const ReplyRequestSchema = z.object({
  ticketId: z.number().positive(),
  customInstructions: z.string().optional(),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { ticketId, customInstructions } = ReplyRequestSchema.parse(body)

    console.log(`[ReplyEndpoint] Generating reply for ticket ${ticketId}`)

    // Fetch ticket details from Zendesk
    const client = getZendeskClient()
    const ticket = await client.getTicket(ticketId)

    console.log(
      `[ReplyEndpoint] Ticket fetched: "${ticket.subject}" (${ticket.status}, ${ticket.priority})`
    )

    // Generate AI reply using OpenAI
    const systemPrompt = `You are a professional, empathetic customer support agent for a Zendesk-powered support team.

Your task is to write a helpful, professional reply to a support ticket that will be AUTOMATICALLY POSTED to the customer.

**CRITICAL INSTRUCTIONS:**
- DO NOT include any disclaimers, notes, or meta-commentary
- DO NOT say things like "I can't post replies" or "please copy this message"
- Write ONLY the actual reply text that will be sent to the customer
- This reply WILL be posted directly to Zendesk without any human review
- Be warm, professional, and empathetic
- Acknowledge the customer's issue clearly
- Provide clear, actionable solutions when possible
- If you can't fully solve the issue, explain next steps
- Keep replies concise (2-4 paragraphs maximum)
- Use a friendly but professional tone
- Sign off with "Best regards" or "Thank you" followed by a signature

**Ticket Information:**
Subject: ${ticket.subject}
Description: ${ticket.description}
Priority: ${ticket.priority}
Status: ${ticket.status}
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

    // Post the reply to Zendesk
    const { ticket: updatedTicket, comment } = await client.addTicketComment(
      ticketId,
      replyBody,
      true
    )

    // Build direct link to the ticket
    const subdomain = process.env["ZENDESK_SUBDOMAIN"] || ""
    const ticketLink = `https://${subdomain}.zendesk.com/agent/tickets/${ticketId}`

    console.log(`[ReplyEndpoint] Reply posted successfully to ticket ${ticketId}`)

    return NextResponse.json({
      success: true,
      ticketId,
      commentId: comment.id,
      replyBody,
      ticketLink,
      ticket: {
        id: updatedTicket.id,
        subject: updatedTicket.subject,
        status: updatedTicket.status,
        priority: updatedTicket.priority,
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
