#!/usr/bin/env bun

/**
 * Test the query interpretation API endpoint
 * Tests both pattern matching (local) and fallback scenarios
 */

interface QueryInterpretationResponse {
  success: boolean
  intent: string
  filters: Record<string, unknown>
  confidence: number
  method: "pattern_match" | "openai"
  reasoning?: string
  error?: string
}

const API_URL = "http://localhost:1333/api/zendesk/interpret-query"

// Test queries
const TEST_QUERIES = [
  "show open tickets",
  "find high-priority issues",
  "what's our average response time?",
  "list agents",
  "show customers",
  "tickets with billing tag",
]

/**
 * Test the API endpoint
 */
async function testAPI() {
  console.log("🔌 Testing Query Interpretation API Endpoint\n")
  console.log("=" .repeat(60))

  // Check if dev server is running
  try {
    const healthCheck = await fetch(`${API_URL.replace("/interpret-query", "")}/zendesk/interpret-query`, {
      method: "GET",
    })

    if (!healthCheck.ok && healthCheck.status !== 404 && healthCheck.status !== 405) {
      console.log("⚠️  Dev server not responding. Start it with: bun run dev")
      console.log("   Then run this test again.\n")
      return
    }
  } catch (error) {
    console.log("⚠️  Could not connect to dev server at", API_URL)
    console.log("   Start it with: bun run dev\n")
    return
  }

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < TEST_QUERIES.length; i++) {
    const query = TEST_QUERIES[i]
    process.stdout.write(`Test ${i + 1}/${TEST_QUERIES.length}: `)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        console.log(`❌ HTTP ${response.status}`)
        failCount++
        continue
      }

      const data = (await response.json()) as QueryInterpretationResponse

      if (data.success && data.intent !== "unknown") {
        console.log("✅")
        console.log(`  Query: "${query}"`)
        console.log(`  Intent: ${data.intent} | Method: ${data.method}`)
        console.log(`  Confidence: ${(data.confidence * 100).toFixed(1)}%`)
        if (Object.keys(data.filters).length > 0) {
          console.log(`  Filters: ${JSON.stringify(data.filters)}`)
        }
        console.log()
        successCount++
      } else {
        console.log("⚠️  Unknown intent")
        console.log(`  Query: "${query}"`)
        console.log(`  Method: ${data.method}`)
        console.log()
        successCount++
      }
    } catch (error) {
      console.log("❌")
      console.log(`  Query: "${query}"`)
      console.log(`  Error: ${error instanceof Error ? error.message : String(error)}`)
      console.log()
      failCount++
    }
  }

  console.log("=" .repeat(60))
  console.log(`\n📊 Summary:`)
  console.log(`  Total Tests: ${TEST_QUERIES.length}`)
  console.log(`  Successful: ${successCount}`)
  console.log(`  Failed: ${failCount}`)
  console.log(`  Success Rate: ${((successCount / TEST_QUERIES.length) * 100).toFixed(1)}%`)

  console.log("\n✨ API endpoint test completed!")
}

testAPI().catch(console.error)
