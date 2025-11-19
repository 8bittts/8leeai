#!/usr/bin/env bun

/**
 * Add Ticket Metadata Script
 *
 * Systematically adds comprehensive metadata to tickets #424-473 (50 tickets)
 * to enable advanced filtering, assignment, and tagging operations.
 *
 * Metadata Patterns:
 * - Assignees: Rotate among 5 agents
 * - Tags: Context-based keywords (billing, technical, feature-request, bug, urgent)
 * - Type: Realistic distribution (question 40%, incident 30%, problem 20%, task 10%)
 *
 * Usage: bun scripts/add-ticket-metadata.ts
 */

import { getIntercomAPIClient } from "../app/intercom/lib/intercom-api-client"

// Configuration
const START_TICKET = 424
const END_TICKET = 473
const DELAY_MS = 1000 // 1 second delay between operations to respect rate limits

// Agent rotation for assignments
const AGENTS = ["sarah@8lee.ai", "john@8lee.ai", "mike@8lee.ai", "lisa@8lee.ai", "alex@8lee.ai"]

// Tag pools by category
const TAG_POOLS = {
  priority: ["urgent", "high-priority", "low-priority"],
  category: ["billing", "technical", "feature-request", "bug", "customer-success"],
  status: ["needs-review", "in-progress", "waiting-on-customer"],
}

// Ticket type distribution
const TICKET_TYPES = [
  { type: "question", weight: 40 },
  { type: "incident", weight: 30 },
  { type: "problem", weight: 20 },
  { type: "task", weight: 10 },
]

/**
 * Select ticket type based on weighted distribution
 */
function selectTicketType(ticketNumber: number): string {
  const seed = ticketNumber % 100
  let cumulative = 0

  for (const { type, weight } of TICKET_TYPES) {
    cumulative += weight
    if (seed < cumulative) {
      return type
    }
  }

  return "question" // fallback
}

/**
 * Select tags based on ticket characteristics
 */
function selectTags(ticketNumber: number, subject: string): string[] {
  const tags: string[] = []

  // Add priority tag (30% chance of urgent/high-priority)
  const priorityChance = ticketNumber % 10
  if (priorityChance < 3) {
    tags.push(priorityChance === 0 ? "urgent" : "high-priority")
  }

  // Add category tags based on subject keywords
  const subjectLower = subject.toLowerCase()
  if (
    subjectLower.includes("bill") ||
    subjectLower.includes("payment") ||
    subjectLower.includes("invoice")
  ) {
    tags.push("billing")
  } else if (
    subjectLower.includes("bug") ||
    subjectLower.includes("error") ||
    subjectLower.includes("broken")
  ) {
    tags.push("bug", "technical")
  } else if (
    subjectLower.includes("feature") ||
    subjectLower.includes("request") ||
    subjectLower.includes("enhance")
  ) {
    tags.push("feature-request")
  } else {
    // Default to technical or customer-success
    tags.push(ticketNumber % 2 === 0 ? "technical" : "customer-success")
  }

  // Add status tag (50% chance)
  if (ticketNumber % 2 === 0) {
    const statusTags = TAG_POOLS.status
    tags.push(statusTags[ticketNumber % statusTags.length])
  }

  return tags
}

/**
 * Select assignee based on rotation
 */
function selectAssignee(ticketNumber: number): string {
  return AGENTS[ticketNumber % AGENTS.length]
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Main execution
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: One-time utility script
async function main() {
  console.log("🚀 Starting Ticket Metadata Addition")
  console.log(
    `📊 Target: Tickets #${START_TICKET}-${END_TICKET} (${END_TICKET - START_TICKET + 1} tickets)`
  )
  console.log(`⏱️  Rate limit: ${DELAY_MS}ms delay between operations\n`)

  const client = getIntercomAPIClient()

  let successCount = 0
  let errorCount = 0
  const errors: Array<{ ticketId: number; error: string }> = []

  for (let ticketNumber = START_TICKET; ticketNumber <= END_TICKET; ticketNumber++) {
    try {
      console.log(
        `\n[${ticketNumber - START_TICKET + 1}/${END_TICKET - START_TICKET + 1}] Processing ticket #${ticketNumber}...`
      )

      // Fetch ticket to get current state and subject
      const ticket = await client.getTicket(ticketNumber)

      if (!ticket) {
        console.log(`⚠️  Ticket #${ticketNumber} not found, skipping...`)
        errorCount++
        errors.push({ ticketId: ticketNumber, error: "Ticket not found" })
        continue
      }

      console.log(`   Subject: "${ticket.subject}"`)

      // Determine metadata
      const assignee = selectAssignee(ticketNumber)
      const tags = selectTags(ticketNumber, ticket.subject)
      const ticketType = selectTicketType(ticketNumber)

      console.log(`   Assignee: ${assignee}`)
      console.log(`   Tags: ${tags.join(", ")}`)
      console.log(`   Type: ${ticketType}`)

      // Update ticket with all metadata in a single call
      const _updatedTicket = await client.updateTicket(ticketNumber, {
        assignee_email: assignee,
        additional_tags: tags,
        type: ticketType,
      })

      console.log("   ✅ Updated successfully")
      successCount++

      // Rate limiting delay (skip on last iteration)
      if (ticketNumber < END_TICKET) {
        await sleep(DELAY_MS)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error(`   ❌ Error: ${errorMsg}`)
      errorCount++
      errors.push({ ticketId: ticketNumber, error: errorMsg })

      // Continue with next ticket even if this one fails
      if (ticketNumber < END_TICKET) {
        await sleep(DELAY_MS)
      }
    }
  }

  // Summary report
  console.log(`\n${"=".repeat(60)}`)
  console.log("📊 METADATA ADDITION SUMMARY")
  console.log("=".repeat(60))
  console.log(`✅ Successful updates: ${successCount}`)
  console.log(`❌ Failed updates: ${errorCount}`)
  console.log(
    `📈 Success rate: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`
  )

  if (errors.length > 0) {
    console.log("\n❌ ERRORS:")
    for (const { ticketId, error } of errors) {
      console.log(`   Ticket #${ticketId}: ${error}`)
    }
  }

  console.log("\n✨ Metadata addition complete!")
}

// Execute
main().catch((error) => {
  console.error("\n💥 Fatal error:", error)
  process.exit(1)
})
