#!/usr/bin/env bun

/**
 * Intercom Query Testing Script - Comprehensive Test Suite
 *
 * Tests both discrete (pattern-based) and complex (AI-powered) queries
 * to verify the two-tier smart query system works end-to-end.
 *
 * Usage:
 *   bun scripts/test-intercom-queries.ts              # Run all tests
 *   bun scripts/test-intercom-queries.ts --category=discrete  # Run only discrete tests
 *   bun scripts/test-intercom-queries.ts --category=complex   # Run only complex tests
 *   bun scripts/test-intercom-queries.ts --verbose    # Show full answers
 *   bun scripts/test-intercom-queries.ts --json       # Output JSON results
 *
 * Test Categories:
 * - discrete: Instant cache-based answers (<100ms)
 * - complex: AI-powered analysis (2-10s)
 * - breakdown: Distribution queries
 * - edge: Edge cases and error handling
 * - system: System commands (help, refresh)
 */

import { handleSmartQuery } from "@/app/intercom/lib/intercom-smart-query-handler"

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
}

interface TestQuery {
  name: string
  query: string
  expectedSource: "cache" | "ai"
  description: string
  category: "discrete" | "complex" | "breakdown" | "edge" | "system"
  maxExpectedTime?: number // Maximum expected processing time in ms
  minConfidence?: number // Minimum expected confidence score
}

const TEST_QUERIES: TestQuery[] = [
  // DISCRETE QUERIES (should use cache classifier - instant)
  {
    name: "Total Count",
    query: "How many tickets do we have in total?",
    expectedSource: "cache",
    description: "Simple count query - should match pattern instantly",
    category: "discrete",
    maxExpectedTime: 100,
    minConfidence: 0.95,
  },
  {
    name: "Open Tickets",
    query: "How many tickets are open?",
    expectedSource: "cache",
    description: "Status query - should use cache stats",
    category: "discrete",
    maxExpectedTime: 100,
    minConfidence: 0.9,
  },
  {
    name: "High Priority",
    query: "Show me high priority tickets",
    expectedSource: "cache",
    description: "Priority query - should use cache stats",
    category: "discrete",
    maxExpectedTime: 100,
    minConfidence: 0.9,
  },
  {
    name: "Recent Tickets",
    query: "What tickets were created in the last 24 hours?",
    expectedSource: "cache",
    description: "Age query - should use cache age stats",
    category: "discrete",
    maxExpectedTime: 100,
    minConfidence: 0.9,
  },
  {
    name: "Weekly Tickets",
    query: "Show tickets from last 7 days",
    expectedSource: "cache",
    description: "Time-based query - weekly filter",
    category: "discrete",
    maxExpectedTime: 100,
    minConfidence: 0.9,
  },

  // BREAKDOWN QUERIES (should use cache for aggregations)
  {
    name: "Status Breakdown",
    query: "Give me a breakdown by status",
    expectedSource: "cache",
    description: "Distribution query - status aggregation",
    category: "breakdown",
    maxExpectedTime: 100,
    minConfidence: 0.9,
  },
  {
    name: "Priority Distribution",
    query: "Show me the distribution of priorities",
    expectedSource: "cache",
    description: "Distribution query - priority aggregation",
    category: "breakdown",
    maxExpectedTime: 100,
    minConfidence: 0.9,
  },

  // COMPLEX QUERIES (should use AI - 2-10 seconds)
  {
    name: "Word Count Analysis",
    query: "How many tickets have descriptions longer than 200 words?",
    expectedSource: "ai",
    description: "Complex analysis requiring full ticket data and word counting",
    category: "complex",
    maxExpectedTime: 15000,
    minConfidence: 0.7,
  },
  {
    name: "Priority Analysis",
    query: "Review all high priority tickets and tell me which ones need immediate attention",
    expectedSource: "ai",
    description: "Complex prioritization requiring context and reasoning",
    category: "complex",
    maxExpectedTime: 15000,
    minConfidence: 0.7,
  },
  {
    name: "Trend Analysis",
    query: "What are the most common issues people are reporting?",
    expectedSource: "ai",
    description: "Pattern recognition across ticket subjects/descriptions",
    category: "complex",
    maxExpectedTime: 15000,
    minConfidence: 0.7,
  },
  {
    name: "Content Search",
    query: "Find tickets that mention login or authentication issues",
    expectedSource: "ai",
    description: "Content search requiring full text analysis",
    category: "complex",
    maxExpectedTime: 15000,
    minConfidence: 0.7,
  },
  {
    name: "Sentiment Analysis",
    query: "Which tickets seem most frustrated or angry?",
    expectedSource: "ai",
    description: "Sentiment detection requiring content analysis",
    category: "complex",
    maxExpectedTime: 15000,
    minConfidence: 0.6,
  },

  // SYSTEM COMMANDS (special handling)
  {
    name: "Help Command",
    query: "help",
    expectedSource: "cache",
    description: "System command - should return help text",
    category: "system",
    maxExpectedTime: 50,
    minConfidence: 0.99,
  },
  {
    name: "Refresh Command",
    query: "refresh",
    expectedSource: "cache",
    description: "System command - should trigger cache refresh",
    category: "system",
    maxExpectedTime: 5000,
    minConfidence: 0.99,
  },

  // EDGE CASES
  {
    name: "Empty Query",
    query: "",
    expectedSource: "cache",
    description: "Edge case - empty query should gracefully handle",
    category: "edge",
    maxExpectedTime: 100,
  },
  {
    name: "Very Long Query",
    query:
      "This is a very long query that goes on and on with lots of words to test how the system handles queries that are excessively verbose and contain multiple clauses and subclauses and just keep going and going",
    expectedSource: "ai",
    description: "Edge case - long query handling",
    category: "edge",
    maxExpectedTime: 15000,
  },
]

interface TestResult {
  passed: boolean
  response: Awaited<ReturnType<typeof handleSmartQuery>>
  error?: string
  warnings: string[]
  performanceIssue?: boolean
  confidenceIssue?: boolean
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Test function with necessary validation logic
async function runTest(test: TestQuery, options: { verbose: boolean }): Promise<TestResult> {
  const warnings: string[] = []

  try {
    if (options.verbose) {
      console.log(`\n${COLORS.cyan}${COLORS.bright}Testing: ${test.name}${COLORS.reset}`)
      console.log(`${COLORS.dim}Category: ${test.category}${COLORS.reset}`)
      console.log(`Query: "${test.query}"`)
      console.log(`Expected source: ${test.expectedSource}`)
      console.log(`Description: ${test.description}`)
    } else {
      console.log(
        `\n${COLORS.cyan}${test.name}${COLORS.reset} ${COLORS.dim}(${test.category})${COLORS.reset}`
      )
    }

    const response = await handleSmartQuery(test.query)

    const sourceMatch = response.source === test.expectedSource
    const hasAnswer = response.answer && response.answer.length > 0

    // Validate performance expectations
    let performanceIssue = false
    if (test.maxExpectedTime && response.processingTime > test.maxExpectedTime) {
      warnings.push(
        `Performance: Expected <${test.maxExpectedTime}ms, got ${response.processingTime}ms`
      )
      performanceIssue = true
    }

    // Validate confidence expectations
    let confidenceIssue = false
    if (test.minConfidence && response.confidence < test.minConfidence) {
      warnings.push(
        `Confidence: Expected >=${test.minConfidence}, got ${response.confidence.toFixed(2)}`
      )
      confidenceIssue = true
    }

    if (options.verbose) {
      console.log(`\n${COLORS.bright}Results:${COLORS.reset}`)
      console.log(
        `  Source: ${response.source} ${sourceMatch ? `${COLORS.green}✓` : `${COLORS.red}✗`} ${COLORS.reset}`
      )
      console.log(`  Processing time: ${response.processingTime}ms`)
      console.log(`  Confidence: ${response.confidence.toFixed(2)}`)

      if (warnings.length > 0) {
        console.log(`\n${COLORS.yellow}Warnings:${COLORS.reset}`)
        for (const warning of warnings) {
          console.log(`  ${COLORS.yellow}⚠${COLORS.reset} ${warning}`)
        }
      }

      console.log(`\nAnswer:\n${response.answer}`)
    } else {
      const timeColor = performanceIssue ? COLORS.yellow : COLORS.dim
      const confColor = confidenceIssue ? COLORS.yellow : COLORS.dim
      console.log(
        `  ${sourceMatch ? `${COLORS.green}✓` : `${COLORS.red}✗`} Source: ${response.source} | ${timeColor}${response.processingTime}ms${COLORS.reset} | ${confColor}Conf: ${response.confidence.toFixed(2)}${COLORS.reset}`
      )
      if (warnings.length > 0) {
        for (const warning of warnings) {
          console.log(`  ${COLORS.yellow}⚠${COLORS.reset} ${warning}`)
        }
      }
    }

    const passed = sourceMatch && hasAnswer

    return { passed, response, warnings, performanceIssue, confidenceIssue }
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
      warnings,
      performanceIssue: false,
      confidenceIssue: false,
    }
  }
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Test orchestration function with comprehensive reporting
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2)
  const categoryArg = args.find((arg) => arg.startsWith("--category="))
  const category = categoryArg?.split("=")[1] as TestQuery["category"] | undefined
  const verbose = args.includes("--verbose")
  const jsonOutput = args.includes("--json")

  // Filter tests by category if specified
  let testsToRun = TEST_QUERIES
  if (category) {
    testsToRun = TEST_QUERIES.filter((t) => t.category === category)
    if (testsToRun.length === 0) {
      console.error(`${COLORS.red}Error: No tests found for category "${category}"${COLORS.reset}`)
      console.error("Valid categories: discrete, complex, breakdown, edge, system")
      process.exit(1)
    }
  }

  if (!jsonOutput) {
    console.log(`${COLORS.bright}${COLORS.cyan}`)
    console.log("=".repeat(70))
    console.log("INTERCOM QUERY SYSTEM - COMPREHENSIVE TEST SUITE")
    console.log("=".repeat(70))
    console.log(`${COLORS.reset}`)
    if (category) {
      console.log(`${COLORS.dim}Running tests for category: ${category}${COLORS.reset}\n`)
    } else {
      console.log(`${COLORS.dim}Running all ${testsToRun.length} tests${COLORS.reset}\n`)
    }
  }

  const results = {
    passed: 0,
    failed: 0,
    total: testsToRun.length,
    warnings: 0,
    byCategory: {} as Record<string, { passed: number; failed: number; total: number }>,
    testResults: [] as Array<TestResult & { test: TestQuery }>,
  }

  for (const test of testsToRun) {
    const result = await runTest(test, { verbose })

    // Track results
    if (result.passed) {
      results.passed++
    } else {
      results.failed++
    }
    if (result.warnings.length > 0) {
      results.warnings++
    }

    // Track by category
    if (!results.byCategory[test.category]) {
      results.byCategory[test.category] = { passed: 0, failed: 0, total: 0 }
    }
    results.byCategory[test.category].total++
    if (result.passed) {
      results.byCategory[test.category].passed++
    } else {
      results.byCategory[test.category].failed++
    }

    results.testResults.push({ ...result, test })

    // Small delay between tests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  // Output results
  if (jsonOutput) {
    console.log(
      JSON.stringify(
        {
          summary: {
            total: results.total,
            passed: results.passed,
            failed: results.failed,
            warnings: results.warnings,
            successRate: ((results.passed / results.total) * 100).toFixed(1),
          },
          byCategory: results.byCategory,
          tests: results.testResults.map((r) => ({
            name: r.test.name,
            category: r.test.category,
            passed: r.passed,
            source: r.response.source,
            expectedSource: r.test.expectedSource,
            processingTime: r.response.processingTime,
            confidence: r.response.confidence,
            warnings: r.warnings,
            error: r.error,
          })),
        },
        null,
        2
      )
    )
  } else {
    console.log(`\n${COLORS.bright}${COLORS.cyan}`)
    console.log("=".repeat(70))
    console.log("TEST SUMMARY")
    console.log("=".repeat(70))
    console.log(`${COLORS.reset}`)

    // Overall stats
    console.log(`\nTotal tests: ${results.total}`)
    console.log(`${COLORS.green}Passed: ${results.passed}${COLORS.reset}`)
    console.log(`${COLORS.red}Failed: ${results.failed}${COLORS.reset}`)
    if (results.warnings > 0) {
      console.log(`${COLORS.yellow}Warnings: ${results.warnings}${COLORS.reset}`)
    }
    console.log(`Success rate: ${((results.passed / results.total) * 100).toFixed(1)}%`)

    // By category
    if (!category) {
      console.log(`\n${COLORS.bright}Results by Category:${COLORS.reset}`)
      for (const [cat, stats] of Object.entries(results.byCategory)) {
        const rate = ((stats.passed / stats.total) * 100).toFixed(0)
        const color = stats.failed === 0 ? COLORS.green : COLORS.yellow
        console.log(
          `  ${cat.padEnd(12)} ${color}${stats.passed}/${stats.total}${COLORS.reset} (${rate}%)`
        )
      }
    }

    // Performance insights
    const avgTime =
      results.testResults.reduce((sum, r) => sum + r.response.processingTime, 0) / results.total
    const slowest = results.testResults.reduce((max, r) =>
      r.response.processingTime > max.response.processingTime ? r : max
    )
    console.log(`\n${COLORS.bright}Performance:${COLORS.reset}`)
    console.log(`  Average processing time: ${avgTime.toFixed(0)}ms`)
    console.log(`  Slowest test: ${slowest.test.name} (${slowest.response.processingTime}ms)`)

    if (results.failed === 0 && results.warnings === 0) {
      console.log(`\n${COLORS.green}${COLORS.bright}✓ ALL TESTS PASSED${COLORS.reset}`)
      process.exit(0)
    } else if (results.failed === 0 && results.warnings > 0) {
      console.log(
        `\n${COLORS.yellow}${COLORS.bright}⚠ ALL TESTS PASSED WITH WARNINGS${COLORS.reset}`
      )
      process.exit(0)
    } else {
      console.log(`\n${COLORS.red}${COLORS.bright}✗ SOME TESTS FAILED${COLORS.reset}`)
      process.exit(1)
    }
  }
}

main().catch((error) => {
  console.error(`${COLORS.red}Fatal error:${COLORS.reset}`, error)
  process.exit(1)
})
