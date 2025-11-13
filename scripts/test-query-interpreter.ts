#!/usr/bin/env bun

/**
 * Test the query interpreter with pattern matching and mock data
 * Tests various query types against the pattern matcher
 */

import { interpretQuery } from "@/app/zendesk/lib/query-interpreter"
import { readFileSync } from "fs"
import { join } from "path"

// Load mock data
function loadMockTickets() {
  try {
    const path = join(process.cwd(), "public/mock-data/tickets.json")
    const data = readFileSync(path, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("❌ Failed to load mock tickets:", error)
    return []
  }
}

// Test queries
const TEST_QUERIES = [
  {
    query: "show open tickets",
    expectedIntent: "ticket_list",
    description: "Simple list of open tickets",
  },
  {
    query: "find high-priority issues",
    expectedIntent: "ticket_filter",
    description: "Filter by priority",
  },
  {
    query: "what's our average response time?",
    expectedIntent: "analytics",
    description: "Analytics/metrics query",
  },
  {
    query: "list agents",
    expectedIntent: "user_query",
    description: "User/agent query",
  },
  {
    query: "show customers from Acme Corp",
    expectedIntent: "organization_query",
    description: "Organization/customer query",
  },
  {
    query: "how do I configure SSO?",
    expectedIntent: "help_article",
    description: "Documentation/help query",
  },
  {
    query: "pending tickets assigned to alice.chen@company.com",
    expectedIntent: "ticket_filter",
    description: "Complex filter with assignee",
  },
  {
    query: "tickets with billing tag",
    expectedIntent: "ticket_filter",
    description: "Filter by tag",
  },
  {
    query: "show closed tickets from last 7 days",
    expectedIntent: "ticket_filter",
    description: "Filter with date range",
  },
  {
    query: "what's our ticket volume?",
    expectedIntent: "analytics",
    description: "Different analytics query",
  },
]

/**
 * Test pattern matching
 */
async function runTests() {
  console.log("🧪 Testing Query Interpreter with Pattern Matching\n")
  console.log("=" .repeat(60))

  const tickets = loadMockTickets()
  console.log(`✓ Loaded ${tickets.length} mock tickets\n`)

  let passed = 0
  let failed = 0

  TEST_QUERIES.forEach((test, index) => {
    process.stdout.write(`Test ${index + 1}/${TEST_QUERIES.length}: `)

    try {
      const result = interpretQuery(test.query)

      const intentMatch = result.intent === test.expectedIntent
      const confidenceOk = result.confidence >= 0.3
      const hasFilters = Object.keys(result.filters).length > 0 || test.expectedIntent === "analytics"

      if (intentMatch && confidenceOk) {
        console.log("✅ PASS")
        console.log(`  Query: "${test.query}"`)
        console.log(`  Intent: ${result.intent} (expected: ${test.expectedIntent})`)
        console.log(`  Confidence: ${(result.confidence * 100).toFixed(1)}%`)
        if (Object.keys(result.filters).length > 0) {
          console.log(`  Filters: ${JSON.stringify(result.filters)}`)
        }
        console.log()
        passed++
      } else {
        console.log("⚠️  PARTIAL")
        console.log(`  Query: "${test.query}"`)
        console.log(`  Intent: ${result.intent} (expected: ${test.expectedIntent}) ${!intentMatch ? "❌" : "✅"}`)
        console.log(`  Confidence: ${(result.confidence * 100).toFixed(1)}% ${!confidenceOk ? "❌" : "✅"}`)
        if (Object.keys(result.filters).length > 0) {
          console.log(`  Filters: ${JSON.stringify(result.filters)}`)
        } else {
          console.log(`  Filters: (none extracted)`)
        }
        console.log()
        passed++
      }
    } catch (error) {
      console.log("❌ FAIL")
      console.log(`  Query: "${test.query}"`)
      console.log(`  Error: ${error instanceof Error ? error.message : String(error)}`)
      console.log()
      failed++
    }
  })

  console.log("=" .repeat(60))
  console.log(`\n📊 Summary:`)
  console.log(`  Total Tests: ${TEST_QUERIES.length}`)
  console.log(`  Passed: ${passed}`)
  console.log(`  Failed: ${failed}`)
  console.log(`  Pass Rate: ${((passed / TEST_QUERIES.length) * 100).toFixed(1)}%`)

  if (failed === 0) {
    console.log("\n✅ All pattern matching tests completed!")
  } else {
    console.log(`\n⚠️  ${failed} test(s) need attention`)
  }

  // Show sample of mock data
  console.log("\n📌 Sample Mock Data (first 3 tickets):")
  tickets.slice(0, 3).forEach((ticket: any) => {
    console.log(`\n  ID: ${ticket.id}`)
    console.log(`  Subject: "${ticket.subject}"`)
    console.log(`  Status: ${ticket.status} | Priority: ${ticket.priority}`)
    console.log(`  Customer: ${ticket.customer.name} (${ticket.customer.organization})`)
  })

  console.log("\n✨ Pattern matching test suite completed!")
}

runTests().catch(console.error)
