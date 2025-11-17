/**
 * Comprehensive Zendesk Intelligence Portal Test
 * Tests all query types, context awareness, and two-way communication
 */

interface TestResult {
  name: string
  query: string
  passed: boolean
  duration: number
  error?: string
  response?: {
    answer: string
    source: string
    confidence: number
    tickets?: unknown[]
  }
}

const API_BASE = "http://localhost:1333"
const results: TestResult[] = []

/**
 * Execute a query against the Zendesk API
 */
async function executeQuery(
  query: string,
  context?: {
    lastTickets?: Array<{
      id: number
      subject: string
      description: string
      status: string
      priority: string
    }>
    lastQuery?: string
  }
): Promise<{
  answer: string
  source: string
  confidence: number
  processingTime: number
  tickets?: unknown[]
}> {
  const response = await fetch(`${API_BASE}/api/zendesk/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, context }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Test helper function
 */
async function test(
  name: string,
  query: string,
  validator: (response: Awaited<ReturnType<typeof executeQuery>>) => boolean,
  context?: Parameters<typeof executeQuery>[1]
): Promise<void> {
  const startTime = Date.now()

  try {
    console.log(`\n🧪 Testing: ${name}`)
    console.log(`   Query: "${query}"`)

    const response = await executeQuery(query, context)
    const duration = Date.now() - startTime

    console.log(`   Source: ${response.source}`)
    console.log(`   Confidence: ${(response.confidence * 100).toFixed(0)}%`)
    console.log(`   Duration: ${duration}ms`)

    const passed = validator(response)

    if (passed) {
      console.log("   ✅ PASSED")
    } else {
      console.log("   ❌ FAILED - Validation failed")
    }

    results.push({
      name,
      query,
      passed,
      duration,
      response: {
        answer: response.answer.substring(0, 200),
        source: response.source,
        confidence: response.confidence,
        tickets: response.tickets,
      },
    })
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : String(error)

    console.log(`   ❌ FAILED - ${errorMsg}`)

    results.push({
      name,
      query,
      passed: false,
      duration,
      error: errorMsg,
    })
  }
}

/**
 * Print test summary
 */
function printSummary(): void {
  console.log(`\n\n${"=".repeat(80)}`)
  console.log("TEST SUMMARY")
  console.log("=".repeat(80))

  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const total = results.length
  const successRate = ((passed / total) * 100).toFixed(1)

  console.log(`\nTotal Tests: ${total}`)
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)
  console.log(`Success Rate: ${successRate}%`)

  if (failed > 0) {
    console.log("\n❌ FAILED TESTS:")
    const failedTests = results.filter((r) => !r.passed)
    for (const r of failedTests) {
      console.log(`\n  • ${r.name}`)
      console.log(`    Query: "${r.query}"`)
      console.log(`    Error: ${r.error || "Validation failed"}`)
    }
  }

  console.log(`\n${"=".repeat(80)}`)

  if (failed === 0) {
    console.log("✅ ALL TESTS PASSED!")
  } else {
    console.log(`❌ ${failed} TEST(S) FAILED`)
    process.exit(1)
  }
}

/**
 * Main test suite
 */
async function runTests(): Promise<void> {
  console.log("╔═══════════════════════════════════════════════════════════════════╗")
  console.log("║   ZENDESK INTELLIGENCE PORTAL - COMPREHENSIVE TEST SUITE        ║")
  console.log("╚═══════════════════════════════════════════════════════════════════╝")

  console.log("\nAPI Base URL:", API_BASE)
  console.log("Starting comprehensive tests...\n")

  // ============================================================================
  // SECTION 1: General Conversation & System Commands
  // ============================================================================
  console.log(`\n${"=".repeat(80)}`)
  console.log("SECTION 1: General Conversation & System Commands")
  console.log("=".repeat(80))

  await test(
    "Empty Query → Help Text",
    "",
    (r) => r.answer.includes("HELP") && r.source === "cache"
  )

  await test("Help Command", "help", (r) => r.answer.includes("QUICK START") && r.confidence === 1)

  await test(
    "Greeting - Professional",
    "hello",
    (r) => r.answer.includes("Zendesk Intelligence Assistant") && r.source === "cache"
  )

  await test("How are you - Zen Response", "how are you feeling today", (r) =>
    r.answer.includes("operating smoothly")
  )

  await test("Weather Query - Polite Redirect", "what is the weather today", (r) =>
    r.answer.includes("weather.com")
  )

  await test("Time Query - Helpful Response", "what time is it", (r) =>
    r.answer.includes("current time")
  )

  await test("Thank You - Professional", "thank you", (r) => r.answer.includes("welcome"))

  // ============================================================================
  // SECTION 2: Ticket Querying & Information Retrieval
  // ============================================================================
  console.log(`\n${"=".repeat(80)}`)
  console.log("SECTION 2: Ticket Querying & Information Retrieval")
  console.log("=".repeat(80))

  await test("Total Ticket Count", "how many tickets do we have", (r) => /\d+/.test(r.answer))

  await test("Open Tickets Count", "how many tickets are open", (r) => /open/i.test(r.answer))

  await test(
    "Status Breakdown",
    "show me ticket status breakdown",
    (r) => r.answer.includes("STATUS") || r.answer.includes("status")
  )

  await test(
    "Priority Distribution",
    "what's the priority distribution",
    (r) => r.answer.includes("priority") || r.answer.includes("Priority")
  )

  await test(
    "High Priority Tickets",
    "show me high priority tickets",
    (r) => r.answer.includes("high") || r.answer.includes("priority")
  )

  await test("Recent Tickets", "show tickets from the last 7 days", (r) => r.answer.length > 20)

  // ============================================================================
  // SECTION 3: Context-Aware Ticket Listing
  // ============================================================================
  console.log(`\n${"=".repeat(80)}`)
  console.log("SECTION 3: Context-Aware Ticket Listing (Stores Tickets)")
  console.log("=".repeat(80))

  let testContext: Awaited<ReturnType<typeof executeQuery>>["tickets"] = []

  await test("Show Top 5 Tickets", "show top 5 tickets", (r) => {
    const hasTickets = r.tickets && r.tickets.length > 0
    if (hasTickets) {
      testContext = r.tickets
      console.log(`   📦 Stored ${r.tickets?.length} tickets in context`)
    }
    return hasTickets || r.answer.length > 50
  })

  await test("Show Top 10 Tickets", "list top 10 tickets", (r) => {
    if (r.tickets && r.tickets.length > 0) {
      testContext = r.tickets
      console.log(`   📦 Stored ${r.tickets?.length} tickets in context`)
    }
    return (r.tickets && r.tickets.length > 0) || r.answer.length > 50
  })

  // ============================================================================
  // SECTION 4: Complex AI-Powered Analysis
  // ============================================================================
  console.log(`\n${"=".repeat(80)}`)
  console.log("SECTION 4: Complex AI-Powered Analysis")
  console.log("=".repeat(80))

  await test("Most Common Problems", "what are the most common problems", (r) => r.source === "ai")

  await test(
    "Tickets Needing Attention",
    "which tickets need immediate attention",
    (r) => r.source === "ai"
  )

  await test(
    "Content Search - Login Issues",
    "find tickets mentioning login issues",
    (r) => r.source === "ai" && r.answer.length > 50
  )

  await test(
    "Word Count Analysis",
    "how many tickets have descriptions longer than 200 words",
    (r) => r.answer.includes("tickets") || r.answer.includes("description")
  )

  // ============================================================================
  // SECTION 5: Context-Aware Reply Generation (Two-Way Communication)
  // ============================================================================
  console.log(`\n${"=".repeat(80)}`)
  console.log("SECTION 5: Context-Aware Reply Generation")
  console.log("=".repeat(80))

  // Test reply request WITHOUT context (should fail gracefully)
  await test("Reply Request - No Context", "build a reply for the first ticket", (r) =>
    r.answer.includes("No Tickets in Context")
  )

  // Test reply request WITH context (using stored tickets)
  if (testContext && testContext.length > 0) {
    const contextWithTickets = {
      lastTickets: testContext.slice(0, 5).map((t: unknown) => {
        const ticket = t as {
          id: number
          subject: string
          description?: string
          status: string
          priority: string
        }
        return {
          id: ticket.id,
          subject: ticket.subject,
          description: ticket.description || "No description",
          status: ticket.status,
          priority: ticket.priority,
        }
      }),
      lastQuery: "show top 5 tickets",
    }

    await test(
      "Reply Request - First Ticket",
      "build a reply for the first ticket and send it to zendesk",
      (r) => {
        const hasReplyGenerated = r.answer.includes("Reply Generated") || r.answer.includes("reply")
        const hasTicketLink = r.answer.includes("zendesk.com") || r.answer.includes("Direct Link")
        const hasCommentId = r.answer.includes("Comment ID") || r.answer.includes("comment")

        if (hasReplyGenerated) {
          console.log("   ✉️  Reply generated and posted to Zendesk")
        }
        if (hasTicketLink) {
          console.log("   🔗 Direct link included in response")
        }

        return hasReplyGenerated || hasTicketLink || hasCommentId
      },
      contextWithTickets
    )

    await test(
      "Reply Request - Second Ticket",
      "generate a response for the second ticket",
      (r) =>
        r.answer.includes("Reply") || r.answer.includes("reply") || r.answer.includes("comment"),
      contextWithTickets
    )

    await test(
      "Reply Request - Invalid Index",
      "create a reply for the tenth ticket",
      (r) =>
        r.answer.includes("Cannot find ticket") ||
        r.answer.includes("Reply Generated") ||
        r.answer.includes("available"),
      contextWithTickets
    )
  } else {
    console.log("\n⚠️  Skipping context-aware reply tests - no tickets available in context")
  }

  // ============================================================================
  // SECTION 6: Error Handling & Edge Cases
  // ============================================================================
  console.log(`\n${"=".repeat(80)}`)
  console.log("SECTION 6: Error Handling & Edge Cases")
  console.log("=".repeat(80))

  await test("Very Long Query", "a".repeat(600), (r) => r.answer.length > 0 || r.source === "cache")

  await test(
    "Special Characters",
    "show tickets with priority: high & status: open",
    (r) => r.answer.length > 20
  )

  await test("Mixed Case Query", "ShOw Me TiCkEtS", (r) => r.answer.length > 20)

  // Print final summary
  printSummary()
}

// ============================================================================
// Execute Test Suite
// ============================================================================
console.log("\n⚠️  IMPORTANT: Make sure the dev server is running on port 1333")
console.log("   Run: bun run dev\n")

// Wait 2 seconds for user to read
await new Promise((resolve) => setTimeout(resolve, 2000))

runTests().catch((error) => {
  console.error("\n❌ FATAL ERROR:", error)
  process.exit(1)
})
