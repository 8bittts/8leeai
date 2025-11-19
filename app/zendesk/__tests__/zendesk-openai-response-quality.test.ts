/**
 * OpenAI Response Quality Tests
 * Comprehensive testing to ensure AI responses are properly formatted,
 * styled correctly, and easily understood by users
 */

import { beforeAll, describe, expect, test } from "bun:test"
import { handleSmartQuery } from "../lib/zendesk-smart-query-handler"
import { refreshTicketCache } from "../lib/zendesk-ticket-cache"

// Set longer timeout for AI-powered tests (30 seconds)
const AI_TEST_TIMEOUT = 30000

// Warm up the cache before running tests
beforeAll(async () => {
  console.log("[Test Setup] Refreshing ticket cache...")
  await refreshTicketCache()
  console.log("[Test Setup] Cache ready")
})

describe("OpenAI Response Quality - Formatting & Structure", () => {
  test(
    "AI responses should not contain markdown code blocks (no ```)",
    async () => {
      const result = await handleSmartQuery(
        "What are the top 3 most common problems across all tickets?"
      )

      // AI responses should be clean text/markdown, not wrapped in code blocks
      expect(result.answer).not.toContain("```")
      expect(result.answer).not.toContain("```json")
      expect(result.answer).not.toContain("```markdown")
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should use proper markdown formatting for readability",
    async () => {
      const result = await handleSmartQuery(
        "Analyze ticket trends and provide detailed recommendations for improvement"
      )

      // Should contain markdown formatting elements (if it's an AI response)
      if (result.source === "ai") {
        const hasMarkdown =
          result.answer.includes("**") || // Bold text
          result.answer.includes("##") || // Headers
          result.answer.includes("- ") || // Bullet points
          result.answer.includes("• ") // Alternative bullets

        expect(hasMarkdown).toBe(true)
      }
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should be reasonably sized (not empty, not excessive)",
    async () => {
      const result = await handleSmartQuery("What tickets need urgent attention?")

      // Responses should have content
      expect(result.answer.length).toBeGreaterThan(20)
      // But not excessively long for simple queries
      expect(result.answer.length).toBeLessThan(5000)
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should not contain raw JSON objects",
    async () => {
      const result = await handleSmartQuery("Show me statistics about ticket priority distribution")

      // Should not return raw JSON like {"priority": "high", ...}
      const looksLikeJson =
        result.answer.includes('{"') ||
        result.answer.includes('": "') ||
        result.answer.includes('"priority":')

      expect(looksLikeJson).toBe(false)
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should not include disclaimers or apologies",
    async () => {
      const result = await handleSmartQuery("Analyze average response time across all tickets")

      const hasDisclaimer =
        result.answer.toLowerCase().includes("i apologize") ||
        result.answer.toLowerCase().includes("i'm sorry") ||
        result.answer.toLowerCase().includes("unfortunately, i cannot") ||
        result.answer.toLowerCase().includes("i don't have access")

      expect(hasDisclaimer).toBe(false)
    },
    AI_TEST_TIMEOUT
  )
})

describe("OpenAI Response Quality - Content Clarity", () => {
  test(
    "AI responses should directly answer the question without excessive preamble",
    async () => {
      const result = await handleSmartQuery("Tell me about high priority ticket patterns")

      // Should not start with long preambles
      const startsWithFluff =
        result.answer.toLowerCase().startsWith("well, let me") ||
        result.answer.toLowerCase().startsWith("first, let me explain") ||
        result.answer.toLowerCase().startsWith("to answer your question,")

      expect(startsWithFluff).toBe(false)
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should use specific data when analyzing tickets",
    async () => {
      const result = await handleSmartQuery(
        "Analyze the distribution of tickets by status and priority"
      )

      // AI-powered analysis should include specific details
      if (result.source === "ai" && result.answer.length > 100) {
        const hasSpecifics =
          /\d+/.test(result.answer) || // Has numbers
          result.answer.includes("ticket") || // Mentions tickets
          result.answer.toLowerCase().includes("status") || // Mentions status
          result.answer.toLowerCase().includes("priority") // Mentions priority

        expect(hasSpecifics).toBe(true)
      }
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should use structured formatting for complex information",
    async () => {
      const result = await handleSmartQuery(
        "Provide comprehensive analysis of ticket patterns including status breakdown, priority distribution, and age analysis"
      )

      // Complex queries should have organized sections (if AI-powered)
      if (result.source === "ai" && result.answer.length > 300) {
        const hasStructure =
          result.answer.includes("##") || // Headers
          result.answer.includes("**") || // Bold sections
          result.answer.includes("- ") || // Bullet points
          result.answer.split("\n\n").length > 2 // Multiple paragraphs

        expect(hasStructure).toBe(true)
      }
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should avoid unnecessary technical jargon",
    async () => {
      const result = await handleSmartQuery("Which tickets are the oldest?")

      // Should use clear language, not overly technical
      const hasUnnecessaryJargon =
        result.answer.includes("algorithm") ||
        result.answer.includes("heuristic") ||
        result.answer.includes("metadata schema")

      expect(hasUnnecessaryJargon).toBe(false)
    },
    AI_TEST_TIMEOUT
  )
})

describe("OpenAI Response Quality - User Experience", () => {
  test(
    "AI responses should be actionable when analyzing problems",
    async () => {
      const result = await handleSmartQuery(
        "What tickets are at risk of missing SLA and what should we do?"
      )

      // AI responses should provide guidance (if AI-powered)
      if (result.source === "ai") {
        const hasActionableContent =
          result.answer.toLowerCase().includes("should") ||
          result.answer.toLowerCase().includes("consider") ||
          result.answer.toLowerCase().includes("recommend") ||
          result.answer.toLowerCase().includes("suggest")

        expect(hasActionableContent).toBe(true)
      }
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should maintain professional but accessible tone",
    async () => {
      const result = await handleSmartQuery("Tell me about recent ticket activity")

      // Should not be overly formal
      const isOverlyFormal =
        result.answer.includes("pursuant to") ||
        result.answer.includes("heretofore") ||
        result.answer.includes("aforementioned")

      // Should not be overly casual
      const isOverlyCasual =
        result.answer.toLowerCase().includes("gonna") ||
        result.answer.toLowerCase().includes("ya know") ||
        result.answer.toLowerCase().includes("lol")

      expect(isOverlyFormal).toBe(false)
      expect(isOverlyCasual).toBe(false)
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should handle edge cases gracefully",
    async () => {
      const result = await handleSmartQuery(
        "Show me tickets with status 'invalid_status_12345' from year 1900"
      )

      // Should handle impossible queries without errors
      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.answer.length).toBeGreaterThan(0)

      // Should not crash or return technical errors
      expect(result.answer).not.toContain("undefined")
      expect(result.answer).not.toContain("null")
      expect(result.answer).not.toContain("NaN")
    },
    AI_TEST_TIMEOUT
  )
})

describe("OpenAI Response Quality - Consistency", () => {
  test(
    "AI responses should use consistent ticket terminology",
    async () => {
      const result = await handleSmartQuery(
        "Analyze the most common support problems in our system"
      )

      // Should consistently use "ticket" terminology since we're a Zendesk system
      const ticketMentions = (result.answer.match(/ticket/gi) || []).length
      const issueMentions = (result.answer.match(/\bissue\b/gi) || []).length

      // "ticket" should be primary term (or neither is mentioned)
      if (ticketMentions > 0 || issueMentions > 0) {
        expect(ticketMentions).toBeGreaterThanOrEqual(issueMentions)
      }
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should reference time appropriately when relevant",
    async () => {
      const result = await handleSmartQuery(
        "When were the most recent tickets created and how old are they?"
      )

      // If dates/times are mentioned, they should be clear
      const hasTimeReference =
        /\d+/.test(result.answer) || // Numbers (counts, ages, etc.)
        result.answer.toLowerCase().includes("recent") ||
        result.answer.toLowerCase().includes("old") ||
        result.answer.toLowerCase().includes("created")

      expect(hasTimeReference).toBe(true)
    },
    AI_TEST_TIMEOUT
  )
})

describe("OpenAI Response Quality - Special Characters & Edge Cases", () => {
  test(
    "AI responses should properly handle special characters",
    async () => {
      const result = await handleSmartQuery(
        "Analyze tickets mentioning special characters or symbols in their content"
      )

      // Should not have broken markdown or formatting
      const hasBrokenMarkdown =
        result.answer.includes("*_") || // Broken formatting
        result.answer.includes("_*") ||
        result.answer.includes("**_") ||
        result.answer.includes("_**")

      expect(hasBrokenMarkdown).toBe(false)
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should handle long content gracefully",
    async () => {
      const result = await handleSmartQuery(
        "Provide detailed analysis of all ticket data with full breakdown"
      )

      // No single line should be ridiculously long (breaks readability)
      // Allow up to 400 chars for lines with URLs or detailed data
      const lines = result.answer.split("\n")
      const hasExtremelyLongLine = lines.some((line) => line.length > 400)

      expect(hasExtremelyLongLine).toBe(false)
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should not leak internal implementation details",
    async () => {
      const result = await handleSmartQuery("Analyze all ticket data comprehensively")

      // Should not leak internal implementation details
      // Be specific to avoid false positives (e.g., "function" in normal English)
      const hasInternalReferences =
        result.answer.includes("cache.") ||
        result.answer.includes("function()") ||
        result.answer.includes("JSON.parse") ||
        result.answer.includes("JSON.stringify") ||
        result.answer.includes("API key") ||
        result.answer.includes("API endpoint") ||
        result.answer.includes("database query") ||
        result.answer.includes("SQL") ||
        result.answer.toLowerCase().includes("typeof") ||
        result.answer.includes("localStorage") ||
        result.answer.includes("sessionStorage")

      expect(hasInternalReferences).toBe(false)
    },
    AI_TEST_TIMEOUT
  )
})

describe("OpenAI Response Quality - Performance & Reliability", () => {
  test(
    "AI responses should complete within reasonable time (< 30 seconds)",
    async () => {
      const start = Date.now()

      await handleSmartQuery(
        "Provide comprehensive analysis of all ticket trends, patterns, and recommendations"
      )

      const duration = Date.now() - start

      // Even complex queries should complete reasonably fast
      expect(duration).toBeLessThan(30000) // 30 seconds max
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should indicate appropriate confidence levels",
    async () => {
      const result = await handleSmartQuery("Analyze ticket resolution time patterns and trends")

      // Confidence should be in valid range
      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(1)

      // AI-powered responses should have decent confidence
      if (result.source === "ai") {
        expect(result.confidence).toBeGreaterThan(0.5)
      }
    },
    AI_TEST_TIMEOUT
  )

  test(
    "AI responses should track processing time accurately",
    async () => {
      const result = await handleSmartQuery("Analyze ticket age distribution")

      // Processing time should be tracked
      expect(result.processingTime).toBeGreaterThan(0)
      expect(typeof result.processingTime).toBe("number")
    },
    AI_TEST_TIMEOUT
  )
})

describe("OpenAI Response Quality - Context Awareness", () => {
  test(
    "System should leverage conversation history for context",
    async () => {
      // First query to establish context
      const firstResult = await handleSmartQuery("Show me urgent tickets")

      // Second query should work even with implicit context
      const secondResult = await handleSmartQuery("How many of those are unassigned?")

      // Both queries should complete successfully
      expect(firstResult.answer.length).toBeGreaterThan(0)
      expect(secondResult.answer.length).toBeGreaterThan(0)
      expect(secondResult.confidence).toBeGreaterThan(0)
    },
    AI_TEST_TIMEOUT
  )

  test(
    "System should handle follow-up questions appropriately",
    async () => {
      // Initial query
      await handleSmartQuery("Tell me about high priority tickets")

      // Follow-up question
      const result = await handleSmartQuery("What about urgent priority?")

      // Should understand implicit context
      expect(result.answer.length).toBeGreaterThan(0)
      expect(result.confidence).toBeGreaterThan(0)
    },
    AI_TEST_TIMEOUT
  )
})
