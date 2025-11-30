#!/usr/bin/env bun

/**
 * Comprehensive Cache Data Verification
 * Validates all aspects of the cached ticket and conversation data
 */

import { loadConversationCache } from "@/app/experiments/intercom/lib/intercom-conversation-cache"

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Verification script with multiple validation checks
async function main() {
  console.log("🔍 Comprehensive Cache Data Verification")
  console.log("=".repeat(52))
  console.log("")

  try {
    console.log("1️⃣  Loading cache data...")
    const cacheData = await loadConversationCache()

    if (!cacheData) {
      console.error("❌ Failed to load cache data")
      process.exit(1)
    }

    console.log("✅ Cache loaded successfully")
    console.log("")

    // Verify data structure
    console.log("2️⃣  Verifying data structure...")
    const checks = []

    // Check required fields
    checks.push({
      name: "lastUpdated exists",
      pass: !!cacheData.lastUpdated,
      value: cacheData.lastUpdated,
    })

    checks.push({
      name: "conversationCount is number",
      pass: typeof cacheData.conversationCount === "number",
      value: cacheData.conversationCount,
    })

    checks.push({
      name: "ticketCount is number",
      pass: typeof cacheData.ticketCount === "number",
      value: cacheData.ticketCount,
    })

    checks.push({
      name: "conversations array exists",
      pass: Array.isArray(cacheData.conversations),
      value: `${cacheData.conversations.length} items`,
    })

    checks.push({
      name: "tickets array exists",
      pass: Array.isArray(cacheData.tickets),
      value: `${cacheData.tickets.length} items`,
    })

    checks.push({
      name: "stats object exists",
      pass: !!cacheData.stats,
      value: "present",
    })

    for (const check of checks) {
      const status = check.pass ? "✅" : "❌"
      console.log(`   ${status} ${check.name}: ${check.value}`)
    }

    const failedChecks = checks.filter((c) => !c.pass)
    if (failedChecks.length > 0) {
      console.error(`\n❌ ${failedChecks.length} checks failed`)
      process.exit(1)
    }

    console.log("\n✅ All structure checks passed")
    console.log("")

    // Verify ticket data quality
    console.log("3️⃣  Verifying ticket data quality...")
    const ticketChecks = []

    const allTicketsHaveId = cacheData.tickets.every((t) => !!t.id)
    ticketChecks.push({ name: "All tickets have ID", pass: allTicketsHaveId })

    const allTicketsHaveState = cacheData.tickets.every((t) => !!t.state)
    ticketChecks.push({ name: "All tickets have state", pass: allTicketsHaveState })

    const allTicketsHaveTitle = cacheData.tickets.every((t) => !!t.title)
    ticketChecks.push({ name: "All tickets have title", pass: allTicketsHaveTitle })

    const allTicketsHaveType = cacheData.tickets.every((t) => !!t.ticket_type_id)
    ticketChecks.push({ name: "All tickets have type ID", pass: allTicketsHaveType })

    const allTicketsHaveTimestamps = cacheData.tickets.every(
      (t) => t.created_at > 0 && t.updated_at > 0
    )
    ticketChecks.push({ name: "All tickets have timestamps", pass: allTicketsHaveTimestamps })

    for (const check of ticketChecks) {
      const status = check.pass ? "✅" : "❌"
      console.log(`   ${status} ${check.name}`)
    }

    const failedTicketChecks = ticketChecks.filter((c) => !c.pass)
    if (failedTicketChecks.length > 0) {
      console.error(`\n❌ ${failedTicketChecks.length} ticket quality checks failed`)
      process.exit(1)
    }

    console.log("\n✅ All ticket quality checks passed")
    console.log("")

    // Show ticket state distribution
    console.log("4️⃣  Ticket State Distribution:")
    const stateDistribution: Record<string, number> = {}
    for (const ticket of cacheData.tickets) {
      stateDistribution[ticket.state] = (stateDistribution[ticket.state] || 0) + 1
    }

    for (const [state, count] of Object.entries(stateDistribution)) {
      console.log(`   - ${state}: ${count} tickets`)
    }
    console.log("")

    // Show ticket type distribution
    console.log("5️⃣  Ticket Type Distribution:")
    const typeDistribution: Record<string, number> = {}
    for (const ticket of cacheData.tickets) {
      typeDistribution[ticket.ticket_type_name] =
        (typeDistribution[ticket.ticket_type_name] || 0) + 1
    }

    for (const [type, count] of Object.entries(typeDistribution)) {
      console.log(`   - ${type}: ${count} tickets`)
    }
    console.log("")

    // Sample tickets
    console.log("6️⃣  Sample Tickets (5 random):")
    const sampleSize = Math.min(5, cacheData.tickets.length)
    const sampleIndices = Array.from({ length: sampleSize }, (_, i) =>
      Math.floor((cacheData.tickets.length / sampleSize) * i)
    )

    for (const idx of sampleIndices) {
      const ticket = cacheData.tickets[idx]
      console.log(`   ${idx + 1}. [${ticket.state.toUpperCase()}] ${ticket.title}`)
      console.log(`      ID: ${ticket.id} | Type: ${ticket.ticket_type_name}`)
      console.log(`      Created: ${new Date(ticket.created_at * 1000).toISOString()}`)
    }
    console.log("")

    // Final summary
    console.log("=".repeat(52))
    console.log("✅ VERIFICATION COMPLETE")
    console.log("=".repeat(52))
    console.log(`Total Items: ${cacheData.conversationCount + cacheData.ticketCount}`)
    console.log(`  - Conversations: ${cacheData.conversationCount}`)
    console.log(`  - Tickets: ${cacheData.ticketCount}`)
    console.log(`Last Updated: ${cacheData.lastUpdated}`)
    console.log("")
    console.log("All cache data is valid and ready for use! 🎉")
  } catch (error) {
    console.error("\n❌ Error:", error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
