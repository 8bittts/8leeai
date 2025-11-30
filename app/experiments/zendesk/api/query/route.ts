/**
 * Unified Zendesk Query Endpoint
 * POST /api/zendesk/query
 *
 * Smart query processing that:
 * 1. Checks for refresh/update commands
 * 2. Loads cached ticket data
 * 3. Uses OpenAI to understand natural language queries
 * 4. Returns intelligent responses based on full dataset
 */

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { handleSmartQuery } from "@/app/experiments/zendesk/lib/zendesk-smart-query-handler"

const ContextSchema = z.object({
  lastTickets: z
    .array(
      z.object({
        id: z.number(),
        subject: z.string(),
        description: z.string(),
        status: z.string(),
        priority: z.string(),
      })
    )
    .optional(),
  lastQuery: z.string().optional(),
})

const QueryRequestSchema = z.object({
  query: z.string().min(1).max(500),
  context: ContextSchema.optional(),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { query, context } = QueryRequestSchema.parse(body)

    console.log(`[QueryEndpoint] Processing: "${query}"`)

    // Use smart query handler with context
    const response = await handleSmartQuery(query, context)

    console.log(
      `[QueryEndpoint] Completed in ${response.processingTime}ms (source: ${response.source}, confidence: ${response.confidence})`
    )

    return NextResponse.json({
      success: true,
      answer: response.answer,
      source: response.source,
      confidence: response.confidence,
      processingTime: response.processingTime,
      tickets: response.tickets,
    })
  } catch (error) {
    console.error("[QueryEndpoint] Error:", error)

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
