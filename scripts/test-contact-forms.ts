#!/usr/bin/env bun

/**
 * Test script to create 1 ticket/contact for both Zendesk and Intercom
 * Creates real support tickets/contacts in each system
 * Usage: bun scripts/test-contact-forms.ts [zendesk|intercom|both]
 */

interface TicketData {
  name: string
  email: string
  message: string
}

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"

// Generate test ticket data
function generateTestTicket(index: number): TicketData {
  return {
    name: `Test User ${index}`,
    email: `testuser${index}@example.com`,
    message: `This is an automated test submission #${index} to verify ticket integration is working correctly.`,
  }
}

async function createZendeskTicket(data: TicketData): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/zendesk/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: `Support Request from ${data.name}`,
        description: data.message,
        requesterEmail: data.email,
        requesterName: data.name,
        category: "support",
        priority: "normal",
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error(`❌ Zendesk: Failed - ${result.error}`)
      return false
    }

    console.log(`✅ Zendesk: Ticket Created (ID: ${result.ticketId})`)
    return true
  } catch (error) {
    console.error("❌ Zendesk Error:", error instanceof Error ? error.message : error)
    return false
  }
}

async function createIntercomContact(data: TicketData): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/intercom/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitorEmail: data.email,
        visitorName: data.name,
        initialMessage: data.message,
        topic: "support",
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error(`❌ Intercom: Failed - ${result.error}`)
      return false
    }

    console.log(
      `✅ Intercom: Conversation/Issue Created (Contact ID: ${result.contactId}, Conversation ID: ${result.conversationId})`
    )
    return true
  } catch (error) {
    console.error("❌ Intercom Error:", error instanceof Error ? error.message : error)
    return false
  }
}

async function createTestItems(
  _service: "zendesk" | "intercom",
  createFn: (data: TicketData) => Promise<boolean>
): Promise<{ success: number; failed: number }> {
  const data = generateTestTicket(1)
  const result = await createFn(data)

  return { success: result ? 1 : 0, failed: result ? 0 : 1 }
}

async function main() {
  const target = process.argv[2] || "both"
  const validTargets = ["zendesk", "intercom", "both"]

  if (!validTargets.includes(target)) {
    console.error(`Invalid target: ${target}. Valid options: ${validTargets.join(", ")}`)
    process.exit(1)
  }

  console.log("\n🧪 Ticket Creation Integration Test Suite")
  console.log("==========================================\n")
  console.log(`📍 Target: ${target.toUpperCase()}`)
  console.log(`🌐 Base URL: ${BASE_URL}\n`)

  let totalSuccess = 0
  let totalFailed = 0

  // Test Zendesk tickets
  if (target === "zendesk" || target === "both") {
    const result = await createTestItems("zendesk", createZendeskTicket)
    totalSuccess += result.success
    totalFailed += result.failed
  }

  // Test Intercom contacts
  if (target === "intercom" || target === "both") {
    const result = await createTestItems("intercom", createIntercomContact)
    totalSuccess += result.success
    totalFailed += result.failed
  }

  // Summary
  console.log("\n📊 Test Results Summary")
  console.log("======================")
  console.log(`✅ Successful: ${totalSuccess}`)
  console.log(`❌ Failed: ${totalFailed}`)
  const total = totalSuccess + totalFailed
  const successRate = total > 0 ? ((totalSuccess / total) * 100).toFixed(1) : "0"
  console.log(`📈 Success Rate: ${successRate}%\n`)

  if (totalFailed === 0 && totalSuccess > 0) {
    console.log("🎉 All tickets/issues created successfully!")
    console.log("✨ Check your Zendesk and Intercom admin dashboards to verify.\n")
  } else if (totalFailed > 0) {
    console.log(`⚠️  ${totalFailed} item(s) failed. Check the error messages above.\n`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
