#!/usr/bin/env bun

/**
 * Zendesk Query Testing Script
 *
 * Tests both discrete (pattern-based) and complex (AI-powered) queries
 * to verify the two-tier smart query system works end-to-end.
 *
 * Usage:
 *   bun scripts/test-zendesk-queries.ts
 *
 * Tests:
 * - Discrete queries (instant answers from cache)
 * - Complex queries (AI-powered analysis)
 * - Word count analysis
 * - Priority-based analysis and recommendations
 */

import { handleSmartQuery } from "@/app/zendesk/lib/smart-query-handler"

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
}

interface TestQuery {
  name: string
  query: string
  expectedSource: "cache" | "ai"
  description: string
}

const TEST_QUERIES: TestQuery[] = [
  // DISCRETE QUERIES (should use cache classifier - instant)
  {
    name: "Total Count",
    query: "How many tickets do we have in total?",
    expectedSource: "cache",
    description: "Simple count query - should match pattern instantly",
  },
  {
    name: "Open Tickets",
    query: "How many tickets are open?",
    expectedSource: "cache",
    description: "Status query - should use cache stats",
  },
  {
    name: "High Priority",
    query: "Show me high priority tickets",
    expectedSource: "cache",
    description: "Priority query - should use cache stats",
  },
  {
    name: "Recent Tickets",
    query: "What tickets were created in the last 24 hours?",
    expectedSource: "cache",
    description: "Age query - should use cache age stats",
  },

  // COMPLEX QUERIES (should use AI - 2-3 seconds)
  {
    name: "Word Count Analysis",
    query: "How many tickets have descriptions longer than 200 words?",
    expectedSource: "ai",
    description: "Complex analysis requiring full ticket data and word counting",
  },
  {
    name: "Priority Analysis",
    query: "Review all high priority tickets and tell me which ones need immediate attention",
    expectedSource: "ai",
    description: "Complex prioritization requiring context and reasoning",
  },
  {
    name: "Trend Analysis",
    query: "What are the most common issues people are reporting?",
    expectedSource: "ai",
    description: "Pattern recognition across ticket subjects/descriptions",
  },
  {
    name: "Content Search",
    query: "Find tickets that mention login or authentication issues",
    expectedSource: "ai",
    description: "Content search requiring full text analysis",
  },
]

async function runTest(test: TestQuery): Promise<{
  passed: boolean
  response: Awaited<ReturnType<typeof handleSmartQuery>>
  error?: string
}> {
  try {
    console.log(`\n${COLORS.cyan}Testing: ${test.name}${COLORS.reset}`)
    console.log(`Query: "${test.query}"`)
    console.log(`Expected source: ${test.expectedSource}`)
    console.log(`Description: ${test.description}`)

    const response = await handleSmartQuery(test.query)

    const sourceMatch = response.source === test.expectedSource
    const hasAnswer = response.answer && response.answer.length > 0

    console.log(`\n${COLORS.bright}Results:${COLORS.reset}`)
    console.log(`  Source: ${response.source} ${sourceMatch ? COLORS.green + "✓" : COLORS.red + "✗"} ${COLORS.reset}`)
    console.log(`  Processing time: ${response.processingTime}ms`)
    console.log(`  Confidence: ${response.confidence}`)
    console.log(`  Answer preview: ${response.answer.substring(0, 150)}...`)

    const passed = sourceMatch && hasAnswer

    if (passed) {
      console.log(`\n${COLORS.green}✓ PASSED${COLORS.reset}`)
    } else {
      console.log(`\n${COLORS.red}✗ FAILED${COLORS.reset}`)
    }

    return { passed, response }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.log(`\n${COLORS.red}✗ ERROR: ${errorMsg}${COLORS.reset}`)
    return {
      passed: false,
      response: {
        answer: "",
        source: "live" as const,
        confidence: 0,
        processingTime: 0,
      },
      error: errorMsg,
    }
  }
}

async function main() {
  console.log(`${COLORS.bright}${COLORS.cyan}`)
  console.log("=".repeat(70))
  console.log("ZENDESK QUERY SYSTEM TEST")
  console.log("=".repeat(70))
  console.log(`${COLORS.reset}\n`)

  const results = {
    passed: 0,
    failed: 0,
    total: TEST_QUERIES.length,
  }

  for (const test of TEST_QUERIES) {
    const result = await runTest(test)
    if (result.passed) {
      results.passed++
    } else {
      results.failed++
    }

    // Small delay between tests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log(`\n${COLORS.bright}${COLORS.cyan}`)
  console.log("=".repeat(70))
  console.log("TEST SUMMARY")
  console.log("=".repeat(70))
  console.log(`${COLORS.reset}`)
  console.log(`Total tests: ${results.total}`)
  console.log(`${COLORS.green}Passed: ${results.passed}${COLORS.reset}`)
  console.log(`${COLORS.red}Failed: ${results.failed}${COLORS.reset}`)
  console.log(`Success rate: ${((results.passed / results.total) * 100).toFixed(1)}%`)

  if (results.failed === 0) {
    console.log(`\n${COLORS.green}${COLORS.bright}✓ ALL TESTS PASSED${COLORS.reset}`)
    process.exit(0)
  } else {
    console.log(`\n${COLORS.red}${COLORS.bright}✗ SOME TESTS FAILED${COLORS.reset}`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(`${COLORS.red}Fatal error:${COLORS.reset}`, error)
  process.exit(1)
})
