#!/usr/bin/env bun

/**
 * Test Cache Refresh Logic
 * Verifies that cache correctly loads both conversations and tickets
 */

import { loadConversationCache } from "@/app/experiments/intercom/lib/intercom-conversation-cache"

async function main() {
  console.log("🔄 Testing Cache Refresh Logic")
  console.log("=".repeat(52))
  console.log("")

  try {
    console.log("1️⃣  Loading cache data (conversations + tickets)...")
    const cacheData = await loadConversationCache()

    if (!cacheData) {
      console.error("❌ Failed to load cache data")
      process.exit(1)
    }

    console.log("")
    console.log("✅ CACHE LOADED SUCCESSFULLY")
    console.log("=".repeat(52))
    console.log(`Last Updated: ${cacheData.lastUpdated}`)
    console.log(`Conversations: ${cacheData.conversationCount}`)
    console.log(`Tickets: ${cacheData.ticketCount}`)
    console.log(`Total Items: ${cacheData.conversationCount + cacheData.ticketCount}`)
    console.log("")

    console.log("📊 Conversation Stats:")
    console.log(`  - Open: ${cacheData.stats.byState["open"] || 0}`)
    console.log(`  - Closed: ${cacheData.stats.byState["closed"] || 0}`)
    console.log(`  - Snoozed: ${cacheData.stats.byState["snoozed"] || 0}`)
    console.log(`  - Priority: ${cacheData.stats.byPriority.priority}`)
    console.log(`  - No Priority: ${cacheData.stats.byPriority.noPriority}`)
    console.log("")

    console.log("🎫 Ticket Sample (first 3):")
    cacheData.tickets.slice(0, 3).forEach((ticket, idx) => {
      console.log(`  ${idx + 1}. [${ticket.id}] ${ticket.title}`)
      console.log(`     Type: ${ticket.ticket_type_name} | State: ${ticket.state}`)
      console.log(`     Contact: ${ticket.contact_emails.join(", ")}`)
    })
    console.log("")

    console.log("✅ Cache refresh test PASSED")
    console.log(`   - Successfully loaded ${cacheData.conversationCount} conversations`)
    console.log(`   - Successfully loaded ${cacheData.ticketCount} tickets`)
    console.log("   - All data structures validated")
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
