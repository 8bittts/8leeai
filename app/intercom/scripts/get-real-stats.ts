#!/usr/bin/env bun
/**
 * Get Real-Time Intercom Workspace Statistics
 * Fetches actual counts and data from the live API
 */

import { getIntercomAPIClient } from "../lib/intercom-api-client"

async function getRealStats() {
  console.log("📊 Fetching Real-Time Intercom Workspace Statistics")
  console.log("=".repeat(60))
  console.log("")

  const client = getIntercomAPIClient()

  try {
    // 1. Conversations
    console.log("1️⃣  Conversations...")
    const conversations = await client.getConversations()
    const convByState = conversations.reduce(
      (acc, conv) => {
        acc[conv.state] = (acc[conv.state] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    console.log(`   Total: ${conversations.length}`)
    if (conversations.length > 0) {
      console.log("   By state:", convByState)
    }
    console.log("")

    // 2. Tickets
    console.log("2️⃣  Tickets...")
    const tickets = await client.searchTickets({
      query: {
        operator: "OR",
        value: [
          { field: "state", operator: "=", value: "submitted" },
          { field: "state", operator: "=", value: "open" },
          { field: "state", operator: "=", value: "waiting_on_customer" },
          { field: "state", operator: "=", value: "resolved" },
        ],
      },
    })
    const ticketsByState = tickets.reduce(
      (acc, ticket) => {
        const state = ticket.ticket_state || "unknown"
        acc[state] = (acc[state] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    const ticketsByType = tickets.reduce(
      (acc, ticket) => {
        const typeName = ticket.ticket_type?.name || "Unknown"
        acc[typeName] = (acc[typeName] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    console.log(`   Total: ${tickets.length}`)
    console.log("   By state:", ticketsByState)
    console.log("   By type:", ticketsByType)
    console.log("")

    // 3. Ticket Types
    console.log("3️⃣  Ticket Types...")
    const ticketTypes = await client.getTicketTypes()
    console.log(`   Total: ${ticketTypes.length}`)
    if (ticketTypes.length > 0) {
      console.log(`   Types: ${ticketTypes.map((t) => t.name).join(", ")}`)
    }
    console.log("")

    // 4. Contacts
    console.log("4️⃣  Contacts...")
    const contacts = await client.getContacts({ per_page: 150 })
    console.log(`   Total (first page): ${contacts.length}`)
    if (contacts.length > 0) {
      const contactsByRole = contacts.reduce(
        (acc, contact) => {
          const role = contact.role || "unknown"
          acc[role] = (acc[role] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
      console.log("   By role:", contactsByRole)
    }
    console.log("")

    // 5. Admins
    console.log("5️⃣  Admins...")
    const admins = await client.getAdmins()
    console.log(`   Total: ${admins.length}`)
    if (admins.length > 0) {
      console.log(`   Names: ${admins.map((a) => a.name).join(", ")}`)
    }
    console.log("")

    // 6. Teams
    console.log("6️⃣  Teams...")
    const teams = await client.getTeams()
    console.log(`   Total: ${teams.length}`)
    if (teams.length > 0) {
      console.log(`   Names: ${teams.map((t) => t.name).join(", ")}`)
    }
    console.log("")

    // 7. Tags
    console.log("7️⃣  Tags...")
    const tags = await client.getTags()
    console.log(`   Total: ${tags.length}`)
    if (tags.length > 0) {
      console.log(`   Tags: ${tags.map((t) => t.name).join(", ")}`)
    }
    console.log("")

    // Summary
    console.log("=".repeat(60))
    console.log("📋 SUMMARY")
    console.log("=".repeat(60))
    console.log(`Conversations: ${conversations.length}`)
    console.log(`Tickets: ${tickets.length}`)
    console.log(`Ticket Types: ${ticketTypes.length}`)
    console.log(`Contacts: ${contacts.length}+ (first page only)`)
    console.log(`Admins: ${admins.length}`)
    console.log(`Teams: ${teams.length}`)
    console.log(`Tags: ${tags.length}`)
    console.log("")
    console.log("✅ Real-time statistics fetched successfully!")

    // Return structured data
    return {
      conversations: {
        total: conversations.length,
        byState: convByState,
      },
      tickets: {
        total: tickets.length,
        byState: ticketsByState,
        byType: ticketsByType,
      },
      ticketTypes: {
        total: ticketTypes.length,
        list: ticketTypes.map((t) => t.name),
      },
      contacts: {
        total: contacts.length,
        note: "First page only (up to 150)",
      },
      admins: {
        total: admins.length,
        list: admins.map((a) => a.name),
      },
      teams: {
        total: teams.length,
        list: teams.map((t) => t.name),
      },
      tags: {
        total: tags.length,
        list: tags.map((t) => t.name),
      },
    }
  } catch (error) {
    console.error("❌ Error fetching statistics:", error)
    throw error
  }
}

// Run if executed directly
if (import.meta.main) {
  getRealStats().catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
}

export { getRealStats }
