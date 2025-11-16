#!/usr/bin/env bun

/**
 * Simple Zendesk API Diagnostic
 * Tests basic connectivity and data fetching
 */

import { getZendeskClient } from "@/app/zendesk/lib/zendesk-api-client"

async function main() {
  console.log("Testing Zendesk API Connection...")
  console.log("================================\n")

  try {
    const _client = getZendeskClient()

    // Test basic ticket fetch (first page only, no pagination)
    console.log("Fetching first page of tickets...")
    const subdomain = process.env["ZENDESK_SUBDOMAIN"]
    const email = process.env["ZENDESK_EMAIL"]
    const token = process.env["ZENDESK_API_TOKEN"]

    const auth = Buffer.from(`${email}/token:${token}`).toString("base64")

    const response = await fetch(
      `https://${subdomain}.zendesk.com/api/v2/tickets.json?per_page=10`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    )

    console.log(`Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const text = await response.text()
      console.log("Error response body:", text.substring(0, 500))
      process.exit(1)
    }

    const data = (await response.json()) as {
      tickets: unknown[]
      count: number
      next_page?: string
    }

    console.log("\n✓ Success!")
    console.log(`Tickets returned: ${data.tickets.length}`)
    console.log(`Has next page: ${!!data.next_page}`)

    if (data.tickets.length > 0) {
      const firstTicket = data.tickets[0] as { id: number; subject: string; status: string }
      console.log("\nFirst ticket:")
      console.log(`  ID: ${firstTicket.id}`)
      console.log(`  Subject: ${firstTicket.subject}`)
      console.log(`  Status: ${firstTicket.status}`)
    } else {
      console.log("\n⚠️  No tickets found in Zendesk account")
      console.log("You may need to create some test tickets first.")
      console.log("Run: bun scripts/generate-zendesk-tickets.ts --count 20")
    }
  } catch (error) {
    console.error("\n✗ Error:", error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
