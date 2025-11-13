/**
 * OpenAI client wrapper for interpreting complex Zendesk queries
 * Uses the @ai-sdk/openai package and follows the pattern from /api/zendesk/suggest-response
 */

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import type { QueryIntent } from "./types"

interface QueryInterpretationResult {
  intent: QueryIntent
  filters: Record<string, unknown>
  confidence: number
  reasoning: string
}

/**
 * Validate that required environment variables are configured
 */
function validateEnvironment(): void {
  if (!process.env["OPENAI_API_KEY"]) {
    throw new Error(
      "OPENAI_API_KEY environment variable is not set. " +
        "Please configure it in .env.local"
    )
  }
}

/**
 * System prompt for query interpretation
 */
const SYSTEM_PROMPT = `You are an expert at interpreting natural language queries for a Zendesk support ticketing system.

Your task is to analyze support queries and extract:
1. The intent (what the user is asking for)
2. Filters that should be applied
3. Confidence level (0-1) in your interpretation

Return your response as JSON in this exact format:
{
  "intent": "ticket_list|ticket_filter|analytics|user_query|organization_query|chat_query|call_query|help_article|automation|unknown",
  "filters": {
    "status": "open|closed|pending|solved|on-hold" (optional),
    "priority": "urgent|high|normal|low" (optional),
    "organization": "string" (optional),
    "assignee": "string" (optional),
    "contains": "string" (optional),
    "type": "incident|problem|question|task" (optional)
  },
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation of your interpretation"
}

Common intents:
- ticket_list: user wants to see/list tickets (e.g., "show open tickets")
- ticket_filter: user wants filtered tickets (e.g., "high priority from Acme Corp")
- analytics: user wants statistics/metrics (e.g., "average response time")
- user_query: user wants info about support agents (e.g., "list agents")
- organization_query: user wants info about customers/orgs (e.g., "customers from XYZ")
- help_article: user wants documentation (e.g., "how to configure SSO")
- automation: user wants automation rules info
- unknown: query doesn't fit other categories

Focus on extracting all relevant filters. If something is ambiguous, note lower confidence.`

/**
 * Interpret a complex query using OpenAI
 * Falls back when pattern matching doesn't provide full clarity
 */
export async function interpretComplexQuery(
  query: string
): Promise<QueryInterpretationResult> {
  validateEnvironment()

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: SYSTEM_PROMPT,
      prompt: `Interpret this Zendesk support query: "${query}"`,
      temperature: 0.3, // Lower temperature for more consistent parsing
    })

    // Parse the response
    const parsed = JSON.parse(text) as QueryInterpretationResult

    // Validate response structure
    if (!parsed.intent || typeof parsed.confidence !== "number" || !parsed.filters) {
      throw new Error("Invalid response format from OpenAI")
    }

    return {
      intent: parsed.intent,
      filters: parsed.filters || {},
      confidence: Math.min(1, Math.max(0, parsed.confidence)), // Clamp to 0-1
      reasoning: parsed.reasoning || "OpenAI interpretation",
    }
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("timeout") || error.message.includes("timed out")) {
        throw new Error("OpenAI request timeout - please try again in a moment")
      }
      if (error.message.includes("429") || error.message.includes("rate limit")) {
        throw new Error("Rate limited by OpenAI - please try again in a moment")
      }
      if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        throw new Error("Invalid OpenAI API key configuration")
      }
    }

    // Re-throw with context
    throw error
  }
}

/**
 * Batch interpret multiple queries
 * Useful for testing or processing multiple queries together
 */
export async function interpretQueriesBatch(
  queries: string[]
): Promise<QueryInterpretationResult[]> {
  return Promise.all(queries.map((query) => interpretComplexQuery(query)))
}

/**
 * Cache key generator for query interpretation
 * Used to minimize API calls for repeated queries
 */
export function getCacheKey(query: string): string {
  // Normalize query: lowercase, trim, remove extra whitespace
  const normalized = query.toLowerCase().trim().replace(/\s+/g, " ")
  // Create simple hash
  return `query:${Buffer.from(normalized).toString("base64")}`
}

/**
 * Test the OpenAI connection
 * Useful for verifying configuration before running queries
 */
export async function testConnection(): Promise<{
  success: boolean
  message: string
}> {
  validateEnvironment()

  try {
    await generateText({
      model: openai("gpt-4o"),
      prompt: "Say 'OK' only.",
    })

    return {
      success: true,
      message: "OpenAI connection successful",
    }
  } catch (error) {
    return {
      success: false,
      message: `OpenAI connection failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
