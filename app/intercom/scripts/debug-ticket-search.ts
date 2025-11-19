#!/usr/bin/env bun
import { getIntercomAPIClient } from "@/app/intercom/lib/intercom-api-client"

async function main() {
  const client = getIntercomAPIClient()

  console.log("🔍 Debugging Ticket Search")
  console.log("=".repeat(52))

  try {
    // Try searching with different queries
    console.log("\n1. Searching with OR query for all states (with pagination):")
    const tickets1 = await client.searchTickets({
      query: {
        operator: "OR",
        value: [
          { field: "state", operator: "=", value: "submitted" },
          { field: "state", operator: "=", value: "open" },
        ],
      },
      pagination: {
        per_page: 50,
      },
    })
    console.log(`   Found ${tickets1?.length || 0} tickets`)

    if (tickets1 && tickets1.length > 0) {
      console.log(`   First ticket: ${tickets1[0].id} - ${tickets1[0].ticket_attributes._default_title_}`)
    }

    console.log("\n2. Searching for just submitted tickets:")
    const tickets2 = await client.searchTickets({
      query: {
        operator: "AND",
        value: [{ field: "state", operator: "=", value: "submitted" }],
      },
      pagination: {
        per_page: 50,
      },
    })
    console.log(`   Found ${tickets2?.length || 0} tickets`)

    console.log("\n3. Getting ticket types:")
    const types = await client.getTicketTypes()
    console.log(`   Found ${types.length} ticket types:`)
    for (const type of types) {
      console.log(`   - ${type.name} (${type.id})`)
    }

  } catch (error) {
    console.error("\n❌ Error:", error)
    if (error instanceof Error) {
      console.error("   Message:", error.message)
      console.error("   Stack:", error.stack)
    }
  }
}

main()
