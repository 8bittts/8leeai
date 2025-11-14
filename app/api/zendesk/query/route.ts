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

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { handleSmartQuery } from "@/app/zendesk/lib/smart-query-handler"

const QueryRequestSchema = z.object({
  query: z.string().min(1).max(500),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { query } = QueryRequestSchema.parse(body)

    console.log(`[QueryEndpoint] Processing: "${query}"`)

    // Use smart query handler
    const response = await handleSmartQuery(query)

    console.log(
      `[QueryEndpoint] Completed in ${response.processingTime}ms (source: ${response.source}, confidence: ${response.confidence})`
    )

    return NextResponse.json({
      success: true,
      answer: response.answer,
      source: response.source,
      confidence: response.confidence,
      processingTime: response.processingTime,
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
