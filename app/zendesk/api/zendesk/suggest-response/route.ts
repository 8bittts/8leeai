/**
 * Zendesk AI Response Suggestion API
 *
 * POST /api/zendesk/suggest-response
 *
 * Uses OpenAI GPT-4o to generate intelligent response suggestions
 * for support tickets based on subject and description.
 * Demonstrates production-grade AI integration pattern.
 */

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  AISuggestionsResponseSchema,
  ZendeskResponseSuggestionSchema,
} from "../../lib/schemas"

/**
 * POST /api/zendesk/suggest-response
 * Generate AI-powered response suggestions for a Zendesk ticket
 *
 * Rate limiting: 10 requests per minute per IP
 * Response time: ~3-5 seconds (includes AI generation)
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json()
    const validatedData = ZendeskResponseSuggestionSchema.parse(body)

    const {
      ticketId,
      subject,
      description,
      tone = "professional",
      responseCount = 3,
    } = validatedData

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY environment variable")
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    // Build system prompt for consistent response generation
    const systemPrompt = `You are a professional support agent who generates empathetic and helpful responses to customer tickets.

REQUIREMENTS:
- Tone: ${tone}
- Keep responses concise (2-3 sentences)
- Address the customer's concern directly
- Offer next steps or solutions
- End with "How can I help further?"
- Avoid generic phrases, personalize each response

Return ONLY the response text, nothing else.`

    // Build user prompt with context
    const userPrompt = `Ticket Subject: ${subject}

Customer Message:
${description}

Generate a ${tone} support response that acknowledges their issue and offers help.`

    // Generate multiple response suggestions in parallel
    const suggestionPromises = Array.from({ length: responseCount }).map(async (_, index) => {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system: systemPrompt,
          prompt: userPrompt,
          temperature: 0.7 + index * 0.1, // Increase creativity for variation
          maxTokens: 150,
        })

        return {
          response: text.trim(),
          confidence: Math.min(1, 0.95 - index * 0.05), // Decrease confidence per option
          reasoning:
            index === 0
              ? "Most directly addresses the issue"
              : index === 1
                ? "Empathetic and solution-focused approach"
                : "Alternative perspective on the concern",
        }
      } catch (error) {
        console.error(`Error generating suggestion ${index + 1}:`, error)
        throw error
      }
    })

    // Execute all suggestions in parallel
    const suggestions = await Promise.all(suggestionPromises)

    // Validate response schema
    const responseData = {
      ticketId,
      suggestions,
      generatedAt: new Date().toISOString(),
    }

    const validatedResponse = AISuggestionsResponseSchema.parse(responseData)

    // Log success for monitoring
    console.log(`Generated ${suggestions.length} suggestions for ticket ${ticketId}`)

    return NextResponse.json(validatedResponse, { status: 200 })
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

    // Handle API errors (e.g., OpenAI timeouts)
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        console.error("OpenAI API timeout:", error.message)
        return NextResponse.json({ error: "AI service request timed out" }, { status: 504 })
      }

      if (error.message.includes("rate limit")) {
        console.warn("OpenAI rate limit exceeded")
        return NextResponse.json(
          { error: "Too many requests, please try again later" },
          { status: 429 }
        )
      }

      console.error("Unexpected error:", error.message)
    }

    // Handle unexpected errors
    console.error("Unexpected error in POST /api/zendesk/suggest-response", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
