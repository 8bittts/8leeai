#!/usr/bin/env bun

/**
 * Create Synthetic Test Tickets
 *
 * Generates diverse test tickets with comprehensive metadata for testing:
 * - Various ticket types (question, incident, problem, task)
 * - Multiple priority levels (urgent, high, normal, low)
 * - Rich tag combinations (billing, technical, feature-request, bug, etc.)
 * - Different assignees and groups
 * - Realistic subjects and descriptions
 *
 * Usage: bun scripts/create-synthetic-tickets.ts [count]
 */

import { getIntercomAPIClient } from "../app/intercom/lib/intercom-api-client"

// Configuration
const DEFAULT_COUNT = 25
const DELAY_MS = 1000 // 1 second delay between creations

// Agent rotation for assignments
const AGENTS = ["sarah@8lee.ai", "john@8lee.ai", "mike@8lee.ai", "lisa@8lee.ai", "alex@8lee.ai"]

// Ticket templates with diverse scenarios
const TICKET_TEMPLATES = [
  // Billing scenarios
  {
    type: "question" as const,
    priority: "normal" as const,
    tags: ["billing", "payment"],
    subject: "Question about invoice {{number}}",
    description:
      "I received invoice #{{number}} but I'm not sure about the charges. Can you explain the breakdown?",
  },
  {
    type: "incident" as const,
    priority: "high" as const,
    tags: ["billing", "urgent", "payment-failed"],
    subject: "Payment failed - urgent assistance needed",
    description:
      "My payment method was declined. I need this resolved quickly to maintain service.",
  },
  // Technical scenarios
  {
    type: "incident" as const,
    priority: "urgent" as const,
    tags: ["technical", "bug", "urgent", "production"],
    subject: "API returning 500 errors in production",
    description:
      "Our production API is returning 500 errors for all requests since {{time}}. This is affecting all users.",
  },
  {
    type: "problem" as const,
    priority: "high" as const,
    tags: ["technical", "bug", "authentication"],
    subject: "Users unable to login with SSO",
    description:
      "Multiple users reporting SSO authentication failures. Error message: 'Invalid SAML response'.",
  },
  {
    type: "question" as const,
    priority: "normal" as const,
    tags: ["technical", "documentation"],
    subject: "API rate limits documentation",
    description: "Where can I find documentation about API rate limits and quotas for our plan?",
  },
  // Feature requests
  {
    type: "task" as const,
    priority: "normal" as const,
    tags: ["feature-request", "enhancement"],
    subject: "Feature request: Bulk export functionality",
    description: "It would be great to have a bulk export feature for all tickets in CSV format.",
  },
  {
    type: "task" as const,
    priority: "low" as const,
    tags: ["feature-request", "ui-ux"],
    subject: "Enhancement: Dark mode for dashboard",
    description: "Please consider adding a dark mode option for the main dashboard interface.",
  },
  // Customer success scenarios
  {
    type: "question" as const,
    priority: "normal" as const,
    tags: ["customer-success", "onboarding"],
    subject: "Getting started with advanced features",
    description:
      "We just upgraded to Enterprise plan. Can you help us get started with advanced automation features?",
  },
  {
    type: "task" as const,
    priority: "high" as const,
    tags: ["customer-success", "training"],
    subject: "Training session for new team members",
    description:
      "We have 5 new team members joining next week. Can we schedule a training session?",
  },
  // Integration scenarios
  {
    type: "incident" as const,
    priority: "high" as const,
    tags: ["technical", "integration", "slack"],
    subject: "Slack integration stopped working",
    description: "Our Slack integration stopped sending notifications. Last working: {{date}}",
  },
  {
    type: "question" as const,
    priority: "normal" as const,
    tags: ["technical", "integration", "api"],
    subject: "Webhook configuration for custom events",
    description: "How do I configure webhooks to receive notifications for custom event types?",
  },
  // Performance scenarios
  {
    type: "problem" as const,
    priority: "high" as const,
    tags: ["technical", "performance", "needs-review"],
    subject: "Dashboard loading very slowly",
    description:
      "The main dashboard is taking 10+ seconds to load. This started happening yesterday.",
  },
  // Security scenarios
  {
    type: "incident" as const,
    priority: "urgent" as const,
    tags: ["technical", "security", "urgent"],
    subject: "Suspicious login attempts detected",
    description: "We're seeing unusual login patterns from IP addresses in suspicious locations.",
  },
]

/**
 * Select ticket type based on weighted distribution
 */
function _selectTicketType(index: number): "question" | "incident" | "problem" | "task" {
  const types: Array<"question" | "incident" | "problem" | "task"> = [
    "question",
    "incident",
    "problem",
    "task",
  ]
  return types[index % types.length]
}

/**
 * Select assignee based on rotation
 */
function selectAssignee(index: number): string {
  return AGENTS[index % AGENTS.length]
}

/**
 * Generate ticket from template with variable substitution
 */
function generateTicket(template: (typeof TICKET_TEMPLATES)[0], index: number) {
  const now = new Date()
  const vars = {
    number: String(1000 + index),
    time: now.toLocaleTimeString(),
    date: now.toLocaleDateString(),
  }

  const subject = template.subject.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => vars[key as keyof typeof vars] || ""
  )
  const description = template.description.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => vars[key as keyof typeof vars] || ""
  )

  return {
    subject,
    description,
    type: template.type,
    priority: template.priority,
    tags: template.tags,
  }
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
  const count = Number(process.argv[2]) || DEFAULT_COUNT

  console.log("🚀 Creating Synthetic Test Tickets")
  console.log(`📊 Target: ${count} tickets with diverse metadata`)
  console.log(`⏱️  Rate limit: ${DELAY_MS}ms delay between creations\n`)

  const client = getIntercomAPIClient()

  let successCount = 0
  let errorCount = 0
  const errors: Array<{ index: number; error: string }> = []
  const createdTickets: number[] = []

  for (let i = 0; i < count; i++) {
    try {
      console.log(`\n[${i + 1}/${count}] Creating synthetic ticket...`)

      // Select template (cycle through all templates)
      const template = TICKET_TEMPLATES[i % TICKET_TEMPLATES.length]
      const ticket = generateTicket(template, i)
      const assignee = selectAssignee(i)

      console.log(`   Subject: "${ticket.subject}"`)
      console.log(`   Type: ${ticket.type}`)
      console.log(`   Priority: ${ticket.priority}`)
      console.log(`   Tags: ${ticket.tags.join(", ")}`)
      console.log(`   Assignee: ${assignee}`)

      // Create ticket with all metadata
      const createdTicket = await client.createTicket({
        subject: ticket.subject,
        comment: {
          body: ticket.description,
        },
        type: ticket.type,
        priority: ticket.priority,
        tags: ticket.tags,
        assignee_email: assignee,
      })

      console.log(`   ✅ Created ticket #${createdTicket.id}`)
      successCount++
      createdTickets.push(createdTicket.id)

      // Rate limiting delay (skip on last iteration)
      if (i < count - 1) {
        await sleep(DELAY_MS)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error(`   ❌ Error: ${errorMsg}`)
      errorCount++
      errors.push({ index: i, error: errorMsg })

      // Continue with next ticket even if this one fails
      if (i < count - 1) {
        await sleep(DELAY_MS)
      }
    }
  }

  // Summary report
  console.log(`\n${"=".repeat(60)}`)
  console.log("📊 SYNTHETIC TICKET CREATION SUMMARY")
  console.log("=".repeat(60))
  console.log(`✅ Successfully created: ${successCount} tickets`)
  console.log(`❌ Failed creations: ${errorCount}`)
  console.log(
    `📈 Success rate: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`
  )

  if (createdTickets.length > 0) {
    console.log(`\n📋 Created Ticket IDs: ${createdTickets.join(", ")}`)
    console.log(
      `\n💾 Ticket ID Range: #${Math.min(...createdTickets)} - #${Math.max(...createdTickets)}`
    )
  }

  if (errors.length > 0) {
    console.log("\n❌ ERRORS:")
    for (const { index, error } of errors) {
      console.log(`   Ticket ${index + 1}: ${error}`)
    }
  }

  console.log("\n✨ Synthetic ticket creation complete!")
}

// Execute
main().catch((error) => {
  console.error("\n💥 Fatal error:", error)
  process.exit(1)
})
