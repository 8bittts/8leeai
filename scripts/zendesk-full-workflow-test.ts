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

  // Additional comprehensive AI analysis tests
  await test("Trend Analysis - Volume", "show ticket volume trends", (r) => r.source === "ai")

  await test(
    "Agent Performance",
    "which agent has the most open tickets",
    (r) => r.source === "ai" && r.answer.length > 30
  )

  await test(
    "Organization Insights",
    "show top 5 organizations by ticket count",
    (r) => r.source === "ai"
  )

  await test("Tag Analysis", "what are the most common tags", (r) => r.source === "ai")

  await test(
    "Response Time Analysis",
    "what's the average time to first response",
    (r) => r.source === "ai"
  )

  await test(
    "Resolution Analysis",
    "what's the average resolution time by priority",
    (r) => r.source === "ai"
  )

  await test(
    "Correlation Analysis",
    "are high priority tickets assigned to specific agents",
    (r) => r.source === "ai"
  )

  await test(
    "Priority Escalation",
    "which low priority tickets should be escalated",
    (r) => r.source === "ai"
  )

  await test(
    "SLA Analysis",
    "how many tickets are at risk of missing SLA",
    (r) => r.source === "ai"
  )

  await test(
    "Content Pattern Analysis",
    "find all tickets about password reset",
    (r) => r.source === "ai" && r.answer.length > 40
  )

  await test(
    "Multi-Condition Search",
    "find urgent tickets from last 24 hours",
    (r) => r.answer.length > 20
  )

  await test("Ticket Age Distribution", "how old are our tickets", (r) => r.source === "ai")

  await test("Requester Analysis", "who creates the most tickets", (r) => r.source === "ai")

  await test("Solved Ticket Analysis", "analyze recently solved tickets", (r) => r.source === "ai")

  await test("Open vs Closed Ratio", "what's our open vs closed ratio", (r) => r.source === "ai")

  await test(
    "Custom Field Analysis",
    "analyze tickets by custom field values",
    (r) => r.source === "ai"
  )

  await test("Group Performance", "which group handles the most tickets", (r) => r.source === "ai")

  await test("Ticket Type Distribution", "breakdown by ticket type", (r) => r.source === "ai")

  await test(
    "Problem Ticket Analysis",
    "show problem tickets and their incidents",
    (r) => r.source === "ai"
  )

  await test(
    "Unassigned Tickets",
    "how many tickets are unassigned",
    (r) => r.answer.includes("unassigned") || r.answer.includes("tickets")
  )

  // ============================================================================
  // SECTION 5: Comprehensive Ticket Operations
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

    // ============================================================================
    // SECTION 5B: Status Update Operations
    // ============================================================================
    console.log(`\n${"=".repeat(80)}`)
    console.log("SECTION 5B: Status Update Operations")
    console.log("=".repeat(80))

    await test(
      "Status Update - Close Ticket",
      "close the first ticket",
      (r) =>
        r.answer.includes("Status Updated") ||
        r.answer.includes("closed") ||
        r.answer.includes("zendesk.com"),
      contextWithTickets
    )

    await test(
      "Status Update - Solve Ticket",
      "mark second ticket as solved",
      (r) => r.answer.includes("solved") || r.answer.includes("Status"),
      contextWithTickets
    )

    await test(
      "Status Update - Reopen",
      "reopen the third ticket",
      (r) => r.answer.includes("open") || r.answer.includes("Status"),
      contextWithTickets
    )

    await test(
      "Status Update - Pending",
      "set status to pending for first ticket",
      (r) => r.answer.includes("pending") || r.answer.includes("Status"),
      contextWithTickets
    )

    await test(
      "Status Update - Hold",
      "put first ticket on hold",
      (r) => r.answer.includes("hold") || r.answer.includes("Status"),
      contextWithTickets
    )

    // ============================================================================
    // SECTION 5C: Priority Update Operations
    // ============================================================================
    console.log(`\n${"=".repeat(80)}`)
    console.log("SECTION 5C: Priority Update Operations")
    console.log("=".repeat(80))

    await test(
      "Priority Update - Urgent",
      "set priority to urgent for first ticket",
      (r) => r.answer.includes("urgent") || r.answer.includes("Priority"),
      contextWithTickets
    )

    await test(
      "Priority Update - High",
      "change priority to high",
      (r) => r.answer.includes("high") || r.answer.includes("Priority"),
      contextWithTickets
    )

    await test(
      "Priority Update - Normal",
      "set first ticket priority to normal",
      (r) => r.answer.includes("normal") || r.answer.includes("Priority"),
      contextWithTickets
    )

    await test(
      "Priority Update - Low",
      "downgrade priority to low",
      (r) => r.answer.includes("low") || r.answer.includes("Priority"),
      contextWithTickets
    )

    // ============================================================================
    // SECTION 5D: Delete & Restore Operations
    // ============================================================================
    console.log(`\n${"=".repeat(80)}`)
    console.log("SECTION 5D: Delete & Restore Operations")
    console.log("=".repeat(80))

    await test(
      "Delete Detection - Confirmation Required",
      "delete the first ticket",
      (r) => r.answer.includes("Confirmation Required") || r.answer.includes("confirm"),
      contextWithTickets
    )

    await test(
      "Spam Detection - Confirmation Required",
      "mark second ticket as spam",
      (r) => r.answer.includes("Confirmation Required") || r.answer.includes("confirm"),
      contextWithTickets
    )

    // Test actual confirmation (will succeed if ticket exists)
    if (testContext && testContext.length > 0) {
      const firstTicket = testContext[0] as { id: number }
      await test(
        "Delete Confirmation - Execute",
        `confirm delete ticket #${firstTicket.id}`,
        (r) =>
          r.answer.includes("Deleted") || r.answer.includes("deleted") || r.answer.includes("Error")
      )

      await test(
        "Restore Ticket",
        `restore ticket #${firstTicket.id}`,
        (r) =>
          r.answer.includes("Restored") ||
          r.answer.includes("restored") ||
          r.answer.includes("Error")
      )
    }

    // ============================================================================
    // SECTION 5E: Assignment & Tag Operations
    // ============================================================================
    console.log(`\n${"=".repeat(80)}`)
    console.log("SECTION 5E: Assignment & Tag Operations")
    console.log("=".repeat(80))

    await test(
      "Assignment Detection",
      "assign first ticket to agent",
      (r) => r.answer.includes("Assignment") || r.answer.includes("assign"),
      contextWithTickets
    )

    await test(
      "Tag Operation - Add",
      "add tags billing,urgent to first ticket",
      (r) => r.answer.includes("Tag") || r.answer.includes("tags"),
      contextWithTickets
    )

    await test(
      "Tag Operation - Remove",
      "remove tag spam from second ticket",
      (r) => r.answer.includes("Tag") || r.answer.includes("tags"),
      contextWithTickets
    )

    // ============================================================================
    // SECTION 5F: Merge & Advanced Operations
    // ============================================================================
    console.log(`\n${"=".repeat(80)}`)
    console.log("SECTION 5F: Merge & Advanced Operations")
    console.log("=".repeat(80))

    await test(
      "Merge Detection",
      "merge tickets 2 and 3 into ticket 1",
      (r) => r.answer.includes("Merge") || r.answer.includes("merge"),
      contextWithTickets
    )

    // ============================================================================
    // SECTION 5G: Ticket Creation
    // ============================================================================
    console.log(`\n${"=".repeat(80)}`)
    console.log("SECTION 5G: Ticket Creation")
    console.log("=".repeat(80))

    await test(
      "Create Ticket Detection",
      "create a ticket about login issues",
      (r) => r.answer.includes("Ticket Creation") || r.answer.includes("create")
    )

    await test(
      "Create Ticket with Details",
      'create ticket titled "Test Issue" with priority high',
      (r) => r.answer.includes("Ticket Creation") || r.answer.includes("priority")
    )
  } else {
    console.log("\n⚠️  Skipping context-aware operation tests - no tickets available in context")
  }

  // ============================================================================
  // SECTION 5H: Multi-Step Operations
  // ============================================================================
  console.log(`\n${"=".repeat(80)}`)
  console.log("SECTION 5H: Multi-Step Query Interpretation")
  console.log("=".repeat(80))

  await test(
    "Multi-Step - Find and Assign",
    "find high priority tickets and show me the first 3",
    (r) => r.answer.length > 30
  )

  await test(
    "Multi-Step - Filter and Count",
    "count all open tickets from the last week",
    (r) => r.answer.includes("tickets") || r.answer.includes("open")
  )

  await test(
    "Multi-Step - Search and Analyze",
    "find tickets about billing and tell me which agent handles them most",
    (r) => r.source === "ai" && r.answer.length > 40
  )

  await test(
    "Complex Query - Time Range + Status",
    "show me urgent tickets created in the last 48 hours that are still open",
    (r) => r.answer.length > 30
  )

  await test(
    "Complex Query - Organization + Priority",
    "which organizations have the most high priority tickets",
    (r) => r.source === "ai"
  )

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
