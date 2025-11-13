/**
 * API endpoint for interpreting Zendesk queries
 * POST /api/zendesk/interpret-query
 *
 * Accepts both pattern-matched and OpenAI-based query interpretation.
 * Uses pattern matching for 80% of queries, falls back to OpenAI for complex ones.
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { interpretQuery } from "@/app/zendesk/lib/query-interpreter"
import { interpretComplexQuery, testConnection } from "@/app/zendesk/lib/openai-client"

// Request validation schema
const QueryRequestSchema = z.object({
  query: z.string().min(1, "Query cannot be empty").max(500, "Query too long"),
})

// Response type
interface QueryInterpretationResponse {
  success: boolean
  intent: string
  filters: Record<string, unknown>
  confidence: number
  method: "pattern_match" | "openai"
  reasoning?: string
  error?: string
}

// Simple in-memory cache to minimize API calls
// In production, use Redis or similar
const interpretationCache = new Map<string, QueryInterpretationResponse>()

/**
 * Generate cache key from query
 */
function getCacheKey(query: string): string {
  return `query:${query.toLowerCase().trim().replace(/\s+/g, " ")}`
}

/**
 * Interpret a query using pattern matching first, then fallback to OpenAI
 */
async function interpretQueryWithFallback(
  query: string
): Promise<QueryInterpretationResponse> {
  // Check cache first
  const cacheKey = getCacheKey(query)
  const cached = interpretationCache.get(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Step 1: Try pattern matching (fast, no API cost)
    const patternResult = interpretQuery(query)

    // If confidence is high enough, use pattern matching result
    if (patternResult.confidence >= 0.8) {
      const response: QueryInterpretationResponse = {
        success: true,
        intent: patternResult.intent,
        filters: patternResult.filters,
        confidence: patternResult.confidence,
        method: "pattern_match",
        reasoning: `Pattern match for ${patternResult.intent}`,
      }

      // Cache it
      interpretationCache.set(cacheKey, response)
      return response
    }

    // Step 2: Pattern matching confidence too low, try OpenAI
    console.log(`[QueryInterpreter] Pattern match confidence low (${patternResult.confidence}), using OpenAI`)

    const openaiResult = await interpretComplexQuery(query)

    const response: QueryInterpretationResponse = {
      success: true,
      intent: openaiResult.intent,
      filters: openaiResult.filters,
      confidence: openaiResult.confidence,
      method: "openai",
      reasoning: openaiResult.reasoning,
    }

    // Cache it
    interpretationCache.set(cacheKey, response)
    return response
  } catch (error) {
    console.error("[QueryInterpreter] Error interpreting query:", error)

    // If OpenAI fails, fall back to pattern match result even with lower confidence
    const patternResult = interpretQuery(query)
    const response: QueryInterpretationResponse = {
      success: true,
      intent: patternResult.intent,
      filters: patternResult.filters,
      confidence: Math.max(0.3, patternResult.confidence), // Boost confidence since we have no other option
      method: "pattern_match",
      reasoning: `Pattern match (OpenAI fallback) for ${patternResult.intent}`,
    }

    return response
  }
}

/**
 * POST handler for query interpretation
 */
export async function POST(request: NextRequest): Promise<NextResponse<QueryInterpretationResponse>> {
  try {
    // Parse and validate request
    const body = await request.json()
    const { query } = QueryRequestSchema.parse(body)

    console.log(`[QueryInterpreter] Processing: "${query}"`)

    // Interpret the query
    const result = await interpretQueryWithFallback(query)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[QueryInterpreter] Request failed:", error)

    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]?.message || "Invalid request"
      return NextResponse.json(
        {
          success: false,
          intent: "unknown",
          filters: {},
          confidence: 0,
          method: "pattern_match",
          error: `Validation error: ${firstError}`,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        intent: "unknown",
        filters: {},
        confidence: 0,
        method: "pattern_match",
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}

/**
 * GET handler for testing/health check
 * Returns cache size and OpenAI connection status
 */
export async function GET(): Promise<NextResponse<{ status: string; cacheSize: number; openaiConnected: boolean }>> {
  try {
    // Test OpenAI connection
    const { success } = await testConnection()

    return NextResponse.json({
      status: "ok",
      cacheSize: interpretationCache.size,
      openaiConnected: success,
    })
  } catch (error) {
    console.error("[QueryInterpreter] Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        cacheSize: interpretationCache.size,
        openaiConnected: false,
      },
      { status: 500 }
    )
  }
}
