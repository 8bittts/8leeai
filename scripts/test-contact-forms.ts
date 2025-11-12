#!/usr/bin/env bun

/**
 * Test script to create 10 tickets/contacts for both Zendesk and Intercom
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
      console.error(`❌ Zendesk Ticket #${data.name.split(" ")[2]}: Failed - ${result.error}`)
      return false
    }

    console.log(
      `✅ Zendesk Ticket #${data.name.split(" ")[2]}: Created (ID: ${result.ticketId})`
    )
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
      console.error(`❌ Intercom Contact #${data.name.split(" ")[2]}: Failed - ${result.error}`)
      return false
    }

    console.log(
      `✅ Intercom Contact #${data.name.split(" ")[2]}: Created (ID: ${result.contactId})`
    )
    return true
  } catch (error) {
    console.error("❌ Intercom Error:", error instanceof Error ? error.message : error)
    return false
  }
}

async function createTestItems(
  service: "zendesk" | "intercom",
  createFn: (data: TicketData) => Promise<boolean>
): Promise<{ success: number; failed: number }> {
  console.log(`🎫 Creating 10 test items in ${service.toUpperCase()}...\n`)

  let success = 0
  let failed = 0

  for (let i = 1; i <= 10; i++) {
    const data = generateTestTicket(i)
    const result = await createFn(data)
    if (result) success++
    else failed++
    // Small delay between submissions to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  console.log()
  return { success, failed }
}

async function main() {
  const target = process.argv[2] || "both"
  const validTargets = ["zendesk", "intercom", "both"]

  if (!validTargets.includes(target)) {
    console.error(`Invalid target: ${target}. Valid options: ${validTargets.join(", ")}`)
    process.exit(1)
  }

  // biome-ignore lint/complexity/useLiteralKeys: Required for TypeScript strict mode
  if (!process.env["RESEND_API_KEY"]) {
    console.error("❌ RESEND_API_KEY environment variable is not set")
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
  console.log("📊 Test Results Summary")
  console.log("======================")
  console.log(`✅ Successful tickets/contacts: ${totalSuccess}`)
  console.log(`❌ Failed tickets/contacts: ${totalFailed}`)
  const total = totalSuccess + totalFailed
  const successRate = total > 0 ? ((totalSuccess / total) * 100).toFixed(1) : "0"
  console.log(`📈 Success Rate: ${successRate}%\n`)

  if (totalFailed === 0 && totalSuccess > 0) {
    console.log("🎉 All tickets/contacts created successfully!")
    console.log("✨ Check your Zendesk and Intercom admin dashboards to see the created items.\n")
  } else if (totalFailed > 0) {
    console.log(`⚠️  ${totalFailed} item(s) failed. Check the error messages above.\n`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
