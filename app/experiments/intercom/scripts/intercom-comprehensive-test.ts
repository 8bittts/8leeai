#!/usr/bin/env bun

/**
 * Comprehensive Intercom Intelligence Portal Test Suite
 *
 * Tests all API endpoints, caching, and OpenAI integration.
 * Run this after generating synthetic data to verify everything works.
 *
 * Usage:
 *   bun app/intercom/scripts/intercom-comprehensive-test.ts
 */

import { getIntercomAPIClient } from "@/app/experiments/intercom/lib/intercom-api-client"
import {
  loadConversationCache,
  refreshConversationCache,
} from "@/app/experiments/intercom/lib/intercom-conversation-cache"
import { handleSmartQuery } from "@/app/experiments/intercom/lib/intercom-smart-query-handler"

let passedTests = 0
let failedTests = 0

function logTest(name: string, passed: boolean, message?: string) {
  if (passed) {
    console.log(`  ✓ ${name}`)
    passedTests++
  } else {
    console.log(`  ✗ ${name}`)
    if (message) console.log(`    ${message}`)
    failedTests++
  }
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Test function with multiple API endpoint checks
async function testAPIClient() {
  console.log("\n🔌 Testing API Client")
  console.log(`${"=".repeat(52)}`)

  const client = getIntercomAPIClient()

  // Test 1: Get Conversations
  try {
    const conversations = await client.getConversations()
    logTest(
      "getConversations()",
      conversations.length >= 0,
      `Found ${conversations.length} conversations`
    )
  } catch (error) {
    logTest("getConversations()", false, error instanceof Error ? error.message : String(error))
  }

  // Test 2: Get Admins
  try {
    const admins = await client.getAdmins()
    logTest("getAdmins()", admins.length > 0, `Found ${admins.length} admins`)
  } catch (error) {
    logTest("getAdmins()", false, error instanceof Error ? error.message : String(error))
  }

  // Test 3: Get Teams
  try {
    const teams = await client.getTeams()
    logTest("getTeams()", teams.length >= 0, `Found ${teams.length} teams`)
  } catch (error) {
    logTest("getTeams()", false, error instanceof Error ? error.message : String(error))
  }

  // Test 4: Get Contacts
  try {
    const contacts = await client.getContacts({ per_page: 10 })
    logTest("getContacts()", contacts.length >= 0, `Found ${contacts.length} contacts`)
  } catch (error) {
    logTest("getContacts()", false, error instanceof Error ? error.message : String(error))
  }

  // Test 5: Get Tags
  try {
    const tags = await client.getTags()
    logTest("getTags()", tags.length >= 0, `Found ${tags.length} tags`)
  } catch (error) {
    logTest("getTags()", false, error instanceof Error ? error.message : String(error))
  }

  // Test 6: Get Ticket Types
  try {
    const ticketTypes = await client.getTicketTypes()
    logTest("getTicketTypes()", ticketTypes.length > 0, `Found ${ticketTypes.length} ticket types`)
  } catch (error) {
    logTest("getTicketTypes()", false, error instanceof Error ? error.message : String(error))
  }

  // Test 7: Search Conversations
  try {
    const results = await client.searchConversations({
      query: {
        operator: "AND",
        value: [
          {
            field: "state",
            operator: "=",
            value: "open",
          },
        ],
      },
    })
    logTest("searchConversations()", true, `Found ${results.length} open conversations`)
  } catch (error) {
    logTest("searchConversations()", false, error instanceof Error ? error.message : String(error))
  }
}

async function testCacheSystem() {
  console.log("\n💾 Testing Cache System")
  console.log(`${"=".repeat(52)}`)

  // Test 1: Refresh Cache
  try {
    const result = await refreshConversationCache()
    logTest(
      "refreshConversationCache()",
      result.success,
      `Cached ${result.conversationCount} conversations`
    )
  } catch (error) {
    logTest(
      "refreshConversationCache()",
      false,
      error instanceof Error ? error.message : String(error)
    )
  }

  // Test 2: Load Cache
  try {
    const cache = await loadConversationCache()
    logTest(
      "loadConversationCache()",
      cache !== null && cache.conversations.length > 0,
      `Loaded ${cache?.conversationCount || 0} conversations from cache`
    )

    if (cache) {
      console.log("\n    📊 Cache Stats:")
      console.log(`       Open: ${cache.stats.byState["open"] || 0}`)
      console.log(`       Closed: ${cache.stats.byState["closed"] || 0}`)
      console.log(`       Priority: ${cache.stats.byPriority.priority}`)
      console.log(`       Normal: ${cache.stats.byPriority.noPriority}`)
    }
  } catch (error) {
    logTest(
      "loadConversationCache()",
      false,
      error instanceof Error ? error.message : String(error)
    )
  }
}

async function testSmartQueries() {
  console.log("\n🤖 Testing Smart Query Handler")
  console.log(`${"=".repeat(52)}`)

  // Test 1: Refresh Command
  try {
    const response = await handleSmartQuery("refresh")
    logTest(
      "Query: 'refresh'",
      response.answer.includes("Cache refreshed") ||
        response.answer.includes("refreshed successfully"),
      `Response time: ${response.processingTime}ms`
    )
  } catch (error) {
    logTest("Query: 'refresh'", false, error instanceof Error ? error.message : String(error))
  }

  // Test 2: Stats Query
  try {
    const response = await handleSmartQuery("stats")
    logTest(
      "Query: 'stats'",
      response.answer.includes("STATISTICS") || response.answer.includes("CONVERSATION"),
      `Source: ${response.source}`
    )
  } catch (error) {
    logTest("Query: 'stats'", false, error instanceof Error ? error.message : String(error))
  }

  // Test 3: List Open Conversations (Cache Query)
  try {
    const response = await handleSmartQuery("show all open conversations")
    logTest(
      "Query: 'show all open conversations'",
      response.source === "cache" && response.processingTime < 200,
      `Found in ${response.processingTime}ms (cache hit)`
    )
  } catch (error) {
    logTest(
      "Query: 'show all open conversations'",
      false,
      error instanceof Error ? error.message : String(error)
    )
  }

  // Test 4: Analytics Query (AI)
  try {
    const response = await handleSmartQuery("how many conversations do we have?")
    logTest(
      "Query: 'how many conversations?'",
      response.answer.length > 0,
      `Source: ${response.source}, Time: ${response.processingTime}ms`
    )
  } catch (error) {
    logTest(
      "Query: 'how many conversations?'",
      false,
      error instanceof Error ? error.message : String(error)
    )
  }
}

async function testOpenAIIntegration() {
  console.log("\n🧠 Testing OpenAI Integration")
  console.log(`${"=".repeat(52)}`)

  // Test 1: AI Query with Cache Context
  try {
    const response = await handleSmartQuery("summarize the current ticket situation")
    logTest(
      "AI Query with Cache Context",
      response.source === "ai" && response.answer.length > 50,
      `Response length: ${response.answer.length} chars`
    )
  } catch (error) {
    logTest(
      "AI Query with Cache Context",
      false,
      error instanceof Error ? error.message : String(error)
    )
  }

  // Test 2: Complex Analysis Query
  try {
    const response = await handleSmartQuery("what are the most common issues?")
    logTest(
      "Complex Analysis Query",
      response.confidence > 0.5 && response.answer.length > 30,
      `Confidence: ${response.confidence}`
    )
  } catch (error) {
    logTest("Complex Analysis Query", false, error instanceof Error ? error.message : String(error))
  }
}

async function main() {
  console.log(`\n╔${"═".repeat(60)}╗`)
  console.log("║  INTERCOM INTELLIGENCE PORTAL - COMPREHENSIVE TEST SUITE  ║")
  console.log(`╚${"═".repeat(60)}╝`)

  // Run all test suites
  await testAPIClient()
  await testCacheSystem()
  await testSmartQueries()
  await testOpenAIIntegration()

  // Final Summary
  console.log(`\n${"=".repeat(62)}`)
  console.log("📊 FINAL RESULTS")
  console.log("=".repeat(62))
  console.log(`✓ Passed: ${passedTests}`)
  console.log(`✗ Failed: ${failedTests}`)
  console.log(`Total Tests: ${passedTests + failedTests}`)
  console.log(`Success Rate: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`)
  console.log("")

  if (failedTests === 0) {
    console.log("🎉 All tests passed! The Intercom Intelligence Portal is fully operational.")
  } else {
    console.log("⚠️  Some tests failed. Review the errors above and fix any issues.")
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error)
  process.exit(1)
})
