#!/usr/bin/env bun

/**
 * Generate realistic mock Zendesk support tickets for testing
 * Outputs to public/mock-data/tickets.json
 *
 * Usage: bun run scripts/generate-zendesk-tickets.ts
 * Or add to package.json: "scripts:generate-tickets": "bun scripts/generate-zendesk-tickets.ts"
 */

import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

interface MockTicket {
  id: number
  subject: string
  description: string
  status: "open" | "closed" | "pending" | "solved" | "on-hold"
  priority: "urgent" | "high" | "normal" | "low"
  created_at: string
  updated_at: string
  assignee: string | null
  tags: string[]
  customer: {
    name: string
    email: string
    organization: string
  }
}

// Common support ticket subjects
const SUBJECTS = [
  "Cannot login to account",
  "Billing question about subscription",
  "Feature request: dark mode",
  "Bug: API endpoint returning 500 error",
  "Password reset not working",
  "Payment processing failed",
  "Integration with Slack not syncing",
  "Performance issue with dashboard",
  "Missing data in exports",
  "Authentication token expired",
  "Unable to upload files",
  "Dashboard not loading",
  "Email notifications not arriving",
  "Export format issue",
  "Account verification stuck",
  "Custom field not saving",
  "Webhook delivery failing",
  "Rate limiting too strict",
  "Mobile app crashes",
  "Data retention policy question",
  "How to configure SAML",
  "Automation rule not triggering",
  "Reports not generating",
  "API documentation outdated",
  "Need help with migration",
]

// Common descriptions (varied length)
const DESCRIPTIONS = [
  "I've been trying to log in for the past hour but keep getting an error message.",
  "User is having trouble accessing their dashboard and needs immediate assistance.",
  "We're seeing occasional performance issues during peak hours. Can you investigate?",
  "Please provide documentation on how to set up SSO authentication.",
  "The integration stopped working after the last update. Can you help debug?",
  "I'd like to request a new feature for bulk operations. This would save us significant time.",
  "Our team is considering upgrading. Can we discuss pricing options?",
  "One of our users reported data loss. Can you look into this urgently?",
  "We need to migrate from our old system. Can you provide migration support?",
  "The API response is slower than expected. Can you optimize it?",
  "Our organization needs custom branding options. Is this available?",
  "Can you help configure webhooks for our custom integration?",
  "We're hitting rate limits. Can we increase our quota?",
  "The mobile app is crashing when trying to view large reports.",
  "Can you provide an audit log of all account changes?",
  "We need to set up two-factor authentication for security compliance.",
  "The export feature is missing some fields we need.",
  "Can you help with our backup and disaster recovery plan?",
  "We're having issues with the search functionality returning incorrect results.",
  "Need guidance on best practices for managing large teams.",
]

// Common organizations
const ORGANIZATIONS = [
  "Acme Corporation",
  "TechStart Inc",
  "Global Solutions Ltd",
  "Innovation Labs",
  "Digital Ventures",
  "Cloud Services Pro",
  "Enterprise Systems",
  "NextGen Software",
  "Data Insights Co",
  "Future Tech Group",
  "Smart Business Solutions",
  "Quantum Computing Labs",
  "Digital Transform",
  "Cloud Native Corp",
  "AI Research Institute",
]

// Common names
const FIRST_NAMES = [
  "John", "Sarah", "Michael", "Emma", "David", "Lisa", "James", "Jennifer",
  "Robert", "Maria", "William", "Patricia", "Richard", "Barbara", "Joseph",
  "Susan", "Thomas", "Jessica", "Charles", "Karen",
]

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin",
]

// Assignees (support team members)
const ASSIGNEES = [
  "alice.chen@company.com",
  "bob.martinez@company.com",
  "carol.williams@company.com",
  "david.kumar@company.com",
  "emma.johnson@company.com",
  null, // Some tickets are unassigned
]

// Tags
const TAGS_POOL = [
  "support",
  "billing",
  "technical",
  "feature-request",
  "documentation",
  "api",
  "integration",
  "urgent",
  "high-priority",
  "customer-complaint",
  "internal-issue",
  "security",
  "performance",
  "migration",
  "training",
]

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Pick random item from array
 */
function randomItem<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)]
}

/**
 * Generate random date within the past 90 days
 */
function randomDate(daysAgo = 90): Date {
  const now = new Date()
  const ms = randomInt(0, daysAgo * 24 * 60 * 60 * 1000)
  return new Date(now.getTime() - ms)
}

/**
 * Generate random tags (1-4 tags)
 */
function randomTags(): string[] {
  const count = randomInt(1, 4)
  const tags = new Set<string>()
  while (tags.size < count) {
    tags.add(randomItem(TAGS_POOL))
  }
  return Array.from(tags)
}

/**
 * Generate random customer info
 */
function randomCustomer() {
  const firstName = randomItem(FIRST_NAMES)
  const lastName = randomItem(LAST_NAMES)
  const org = randomItem(ORGANIZATIONS)
  return {
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    organization: org,
  }
}

/**
 * Generate a single mock ticket
 */
function generateTicket(id: number): MockTicket {
  const created = randomDate()
  const updated = new Date(created.getTime() + randomInt(0, 60 * 24 * 60 * 60 * 1000))

  // Statuses are weighted - more open/pending tickets than closed
  const statusRandom = Math.random()
  let status: MockTicket["status"]
  if (statusRandom < 0.4) status = "open"
  else if (statusRandom < 0.6) status = "pending"
  else if (statusRandom < 0.8) status = "solved"
  else if (statusRandom < 0.95) status = "closed"
  else status = "on-hold"

  // Priorities are weighted - most are normal, some high/urgent
  const priorityRandom = Math.random()
  let priority: MockTicket["priority"]
  if (priorityRandom < 0.5) priority = "normal"
  else if (priorityRandom < 0.75) priority = "high"
  else if (priorityRandom < 0.95) priority = "low"
  else priority = "urgent"

  return {
    id,
    subject: randomItem(SUBJECTS),
    description: randomItem(DESCRIPTIONS),
    status,
    priority,
    created_at: created.toISOString(),
    updated_at: updated.toISOString(),
    assignee: randomItem(ASSIGNEES),
    tags: randomTags(),
    customer: randomCustomer(),
  }
}

/**
 * Generate all mock tickets
 */
function generateTickets(count: number = 150): MockTicket[] {
  const tickets: MockTicket[] = []
  for (let i = 1; i <= count; i++) {
    tickets.push(generateTicket(i))
  }
  return tickets
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log("🎫 Generating mock Zendesk tickets...")

    // Generate tickets (150 realistic entries)
    const tickets = generateTickets(150)
    console.log(`✓ Generated ${tickets.length} tickets`)

    // Create output directory if needed
    const outputDir = join(process.cwd(), "public", "mock-data")
    mkdirSync(outputDir, { recursive: true })
    console.log(`✓ Ensured directory exists: ${outputDir}`)

    // Write to file
    const outputPath = join(outputDir, "tickets.json")
    writeFileSync(outputPath, JSON.stringify(tickets, null, 2))
    console.log(`✓ Saved to: ${outputPath}`)

    // Display summary
    console.log("\n📊 Summary:")
    const statusCounts = tickets.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    const priorityCounts = tickets.reduce(
      (acc, t) => {
        acc[t.priority] = (acc[t.priority] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    console.log(`  Total tickets: ${tickets.length}`)
    console.log(`  Status breakdown:`)
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`    - ${status}: ${count}`)
    })
    console.log(`  Priority breakdown:`)
    Object.entries(priorityCounts).forEach(([priority, count]) => {
      console.log(`    - ${priority}: ${count}`)
    })

    // Sample a few tickets to show
    console.log("\n📌 Sample tickets:")
    tickets.slice(0, 3).forEach((ticket) => {
      console.log(`  ID ${ticket.id}: "${ticket.subject}"`)
      console.log(`    Status: ${ticket.status} | Priority: ${ticket.priority}`)
      console.log(`    Customer: ${ticket.customer.name} (${ticket.customer.organization})`)
    })

    console.log("\n✅ Mock data generation complete!")
  } catch (error) {
    console.error("❌ Error generating tickets:", error)
    process.exit(1)
  }
}

main()
