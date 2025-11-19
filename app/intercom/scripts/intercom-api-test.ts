#!/usr/bin/env bun

/**
 * Simple Intercom API Diagnostic
 * Tests basic connectivity and data fetching
 */

import { getIntercomAPIClient } from "@/app/intercom/lib/intercom-api-client"

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Test function with multiple API checks
async function main() {
  console.log("Testing Intercom API Connection...")
  console.log("=================================\n")

  try {
    const client = getIntercomAPIClient()

    // Test 1: Fetch conversations
    console.log("1. Fetching conversations...")
    const conversations = await client.getConversations()
    console.log(`✓ Fetched ${conversations.length} conversations`)

    if (conversations.length > 0) {
      const first = conversations[0]
      console.log("\nFirst conversation:")
      console.log(`  ID: ${first.id}`)
      console.log(`  State: ${first.state}`)
      console.log(`  Priority: ${first.priority ? "high" : "normal"}`)
      console.log(`  Created: ${new Date(first.created_at * 1000).toISOString()}`)
      console.log(`  Updated: ${new Date(first.updated_at * 1000).toISOString()}`)

      if (first.contacts?.contacts && first.contacts.contacts.length > 0) {
        console.log(`  Contact ID: ${first.contacts.contacts[0].id}`)
      }

      if (first.assignee) {
        console.log(`  Assignee: ${first.assignee.type} (${first.assignee.id})`)
      }

      if (first.tags?.tags && first.tags.tags.length > 0) {
        console.log(`  Tags: ${first.tags.tags.map((t) => t.name).join(", ")}`)
      }
    } else {
      console.log("\n⚠️  No conversations found in Intercom workspace")
    }

    // Test 2: Fetch admins
    console.log("\n2. Fetching admins...")
    const admins = await client.getAdmins()
    console.log(`✓ Fetched ${admins.length} admins`)

    if (admins.length > 0) {
      const firstAdmin = admins[0]
      console.log(`  First admin: ${firstAdmin.name} (${firstAdmin.email})`)
      console.log(`  Away mode: ${firstAdmin.away_mode_enabled ? "Yes" : "No"}`)
    }

    // Test 3: Fetch teams
    console.log("\n3. Fetching teams...")
    const teams = await client.getTeams()
    console.log(`✓ Fetched ${teams.length} teams`)

    if (teams.length > 0) {
      const firstTeam = teams[0]
      console.log(`  First team: ${firstTeam.name} (${firstTeam.id})`)
      if (firstTeam.admin_ids && firstTeam.admin_ids.length > 0) {
        console.log(`  Team members: ${firstTeam.admin_ids.length}`)
      }
    }

    // Test 4: Fetch contacts (first 5 only)
    console.log("\n4. Fetching contacts (first 5)...")
    const contacts = await client.getContacts({ per_page: 5 })
    console.log(`✓ Fetched ${contacts.length} contacts`)

    if (contacts.length > 0) {
      const firstContact = contacts[0]
      console.log(`  First contact: ${firstContact.email || firstContact.name || "Unknown"}`)
      console.log(`  Role: ${firstContact.role}`)
      console.log(`  Created: ${new Date(firstContact.created_at * 1000).toISOString()}`)
    }

    // Test 5: Fetch tags
    console.log("\n5. Fetching tags...")
    const tags = await client.getTags()
    console.log(`✓ Fetched ${tags.length} tags`)

    if (tags.length > 0) {
      console.log(`  First tag: ${tags[0].name}`)
    }

    console.log("\n✅ All tests passed!")
    console.log("\nAPI Connection: ✓")
    console.log("Authentication: ✓")
    console.log("Data Access: ✓")
  } catch (error) {
    console.error("\n✗ Error:", error)
    if (error instanceof Error) {
      console.error("Message:", error.message)
      if (error.stack) {
        console.error("\nStack trace:")
        console.error(error.stack)
      }
    }
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
