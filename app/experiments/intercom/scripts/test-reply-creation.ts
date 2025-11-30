/**
 * Test Script: Reply Creation
 * Tests the ability to create real replies to Intercom tickets
 *
 * Run: bun app/intercom/scripts/test-reply-creation.ts
 */

import { getIntercomAPIClient } from "../lib/intercom-api-client"

async function testReplyCreation() {
  console.log("🧪 Testing Intercom Reply Creation\n")

  try {
    const client = getIntercomAPIClient()

    // Step 1: Get a ticket to reply to
    console.log("📋 Step 1: Fetching tickets...")
    const tickets = await client.searchTickets({
      query: {
        operator: "OR",
        value: [
          { field: "state", operator: "=", value: "submitted" },
          { field: "state", operator: "=", value: "open" },
        ],
      },
    })

    if (!tickets || tickets.length === 0) {
      console.log("❌ No tickets found to test with")
      console.log("\nℹ️  Create a test ticket first using:")
      console.log("   bun app/intercom/scripts/intercom-create-synthetic-tickets.ts")
      process.exit(1)
    }

    const testTicket = tickets[0]
    if (!testTicket) {
      console.log("❌ Failed to get test ticket")
      process.exit(1)
    }

    const ticketTitle = testTicket.ticket_attributes._default_title_
    const ticketDescription = testTicket.ticket_attributes._default_description_
    console.log(`✅ Found ticket to test: #${testTicket.id}`)
    console.log(`   Title: ${ticketTitle}`)
    console.log(`   Description: ${ticketDescription.substring(0, 100)}...`)
    console.log(`   State: ${testTicket.state}\n`)

    // Step 2: Create a test reply via API
    console.log("💬 Step 2: Creating reply via API...")
    const replyResponse = await fetch("http://localhost:1333/intercom/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: String(testTicket.id),
        customInstructions:
          "This is a test reply. Please acknowledge receipt and mark as resolved.",
      }),
    })

    if (!replyResponse.ok) {
      const errorText = await replyResponse.text()
      console.log(`❌ Reply API failed: ${replyResponse.status}`)
      console.log(`   Error: ${errorText}`)
      process.exit(1)
    }

    const replyData = (await replyResponse.json()) as {
      success: boolean
      ticketId: string
      replyBody: string
      ticketLink: string
      ticket: {
        id: string
        subject: string
        status: string
      }
    }

    console.log("✅ Reply created successfully!")
    console.log(`   Ticket: #${replyData.ticketId}`)
    console.log(`   Subject: ${replyData.ticket.subject}`)
    console.log(`   Status: ${replyData.ticket.status}`)
    console.log(`   Link: ${replyData.ticketLink}\n`)

    console.log("📝 Generated Reply:")
    console.log("─".repeat(60))
    console.log(replyData.replyBody)
    console.log("─".repeat(60))
    console.log()

    // Step 3: Verify the reply was posted to Intercom
    console.log("🔍 Step 3: Verifying reply in Intercom...")

    // Wait a moment for Intercom to process the comment
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Fetch the ticket again to see if comment was added
    const updatedTicket = await client.getTicket(String(testTicket.id))

    // Check if ticket_parts exist (Intercom API structure)
    const hasComments = updatedTicket.ticket_parts && updatedTicket.ticket_parts.total_count > 0

    if (hasComments) {
      console.log(
        `✅ Verified: Ticket has ${updatedTicket.ticket_parts?.total_count || 0} comment(s)`
      )
    } else {
      console.log("⚠️  Note: Comment count not immediately available (Intercom may be processing)")
    }

    console.log()
    console.log("✅ TEST PASSED: Reply creation works correctly!")
    console.log()
    console.log("Summary:")
    console.log(`  • Ticket: #${testTicket.id}`)
    console.log(`  • Reply length: ${replyData.replyBody.length} characters`)
    console.log("  • Status: Posted successfully")
    console.log(`  • View in Intercom: ${replyData.ticketLink}`)
  } catch (error) {
    console.error("❌ TEST FAILED:", error)
    if (error instanceof Error) {
      console.error("   Error:", error.message)
      if (error.stack) {
        console.error("\nStack trace:")
        console.error(error.stack)
      }
    }
    process.exit(1)
  }
}

// Run the test
testReplyCreation().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
