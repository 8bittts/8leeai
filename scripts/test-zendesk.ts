#!/usr/bin/env bun

/**
 * Zendesk API Test Script
 *
 * Auto-generates 10 random but realistic support ticket submissions
 * to test the Zendesk integration API.
 *
 * Usage:
 *   bun scripts/test-zendesk.ts
 *
 * Environment Variables Required:
 *   - ZENDESK_API_TOKEN
 *   - ZENDESK_SUBDOMAIN
 *   - ZENDESK_EMAIL
 *   - (Optionally override API_BASE_URL for testing)
 */

interface TicketSubmission {
  requesterName: string
  requesterEmail: string
  subject: string
  description: string
  category: "general" | "support" | "sales" | "feedback"
  priority: "low" | "normal" | "high" | "urgent"
}

interface ApiResponse {
  success?: boolean
  ticketId?: string
  error?: string
  status?: number
  message?: string
}

// Test data generators
const firstNames = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eve",
  "Frank",
  "Grace",
  "Henry",
  "Iris",
  "Jack",
]
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
]
const _companies = [
  "Tech Corp",
  "StartUp Inc",
  "Digital Agency",
  "Cloud Solutions",
  "Data Systems",
  "Enterprise Co",
  "Innovation Labs",
  "Future Tech",
  "Smart Systems",
  "Digital First",
]
const domains = ["gmail.com", "company.com", "outlook.com", "work.email", "dev.io"]

const subjects = [
  "Login issues with my account",
  "Feature request: dark mode",
  "Bug: Dashboard loading slowly",
  "Integration not working properly",
  "API documentation unclear",
  "Billing question about subscription",
  "Can't export my data",
  "Need help setting up authentication",
  "Error message on profile page",
  "Question about rate limits",
]

const categories = ["general", "support", "sales", "feedback"] as const
const priorities = ["low", "normal", "high", "urgent"] as const

const descriptions = {
  support: [
    "I've been trying to use this feature for hours but keep getting an error. Can you help me debug this? The error message says: Operation failed. I've restarted the app and cleared my cache but nothing works.",
    "The system is not syncing my data correctly. I uploaded a file 30 minutes ago but it hasn't appeared in my dashboard yet. Is there a delay or is something broken?",
    "I'm unable to authenticate using OAuth. I've set up the configuration correctly but the callback keeps failing. Can someone review my setup?",
    "The API response is inconsistent. Sometimes it returns the data, sometimes it doesn't. It seems random. Can you investigate this behavior?",
    "I need help migrating from the old API to the new v2 API. The documentation doesn't cover my use case and I'm stuck.",
  ],
  sales: [
    "We're interested in upgrading to the enterprise plan. Can you provide a custom quote for 500 users? We also need custom integrations.",
    "How much does the pro plan cost with annual billing? And do you offer any volume discounts?",
    "We need a demo of the system before we can make a purchasing decision. Can you schedule something for next week?",
    "Can you provide references from similar companies? We want to make sure this solution fits our needs.",
    "What's included in the support package for enterprise customers? Do you offer 24/7 support?",
  ],
  feedback: [
    "Love the new UI but the dark mode colors are a bit hard on the eyes. Would love if you could adjust the contrast slightly.",
    "Great product overall! One suggestion: can you add keyboard shortcuts for common operations? Would speed up my workflow.",
    "The onboarding process was confusing. I got stuck on step 3 and had to reach out to support. Maybe simplify that flow?",
    "Excellent work on the recent update! Performance has improved significantly. Keep up the good work!",
    "Feature suggestion: ability to bulk import/export data as CSV. Would save us hours of manual work.",
  ],
  general: [
    "Just wanted to check if the system will be down for maintenance this weekend? Our team needs to plan accordingly.",
    "What's the latest on the roadmap? Are there any exciting features coming soon that we should know about?",
    "Is there a community forum or Slack channel where I can connect with other users?",
    "Quick question about the licensing model. Can we use this for internal tools only?",
    "Do you have any integrations with Zapier or other automation platforms?",
  ],
}

/**
 * Generate a random realistic ticket submission
 */
function generateRandomTicket(): TicketSubmission {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const category = categories[Math.floor(Math.random() * categories.length)]
  const priority = priorities[Math.floor(Math.random() * priorities.length)]
  const domain = domains[Math.floor(Math.random() * domains.length)]

  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`
  const subject = subjects[Math.floor(Math.random() * subjects.length)]
  const descriptionList = descriptions[category as keyof typeof descriptions]
  const description = descriptionList[Math.floor(Math.random() * descriptionList.length)]

  return {
    requesterName: `${firstName} ${lastName}`,
    requesterEmail: email,
    subject,
    description,
    category,
    priority,
  }
}

/**
 * Submit a ticket to the local API endpoint
 */
async function submitTicket(ticket: TicketSubmission, index: number): Promise<ApiResponse> {
  const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3000"

  try {
    console.log(`\n📤 Submitting ticket ${index + 1}/10...`)
    console.log(`   Name: ${ticket.requesterName}`)
    console.log(`   Subject: ${ticket.subject}`)
    console.log(`   Category: ${ticket.category}`)
    console.log(`   Priority: ${ticket.priority}`)

    const response = await fetch(`${apiBaseUrl}/api/zendesk/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    })

    const data = await response.json()

    if (response.ok) {
      console.log(`   ✅ Success! Ticket ID: ${data.ticketId}`)
      return { success: true, ticketId: data.ticketId }
    }
    console.log(`   ❌ Error: ${data.error || data.message || "Unknown error"}`)
    return { success: false, error: data.error || "Unknown error" }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.log(`   ❌ Network error: ${errorMessage}`)
    return { success: false, error: errorMessage }
  }
}

/**
 * Main function - generate and submit 10 random tickets
 */
async function main() {
  console.log("╔════════════════════════════════════════════════════════════════╗")
  console.log("║            ZENDESK TEST SCRIPT - Auto-Generate 10 Tickets       ║")
  console.log("╚════════════════════════════════════════════════════════════════╝")

  // Check environment variables
  const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"
  console.log("\n🔧 Configuration:")
  console.log(`   API Base URL: ${baseUrl}`)
  console.log(`   Using local API endpoint: ${baseUrl}/api/zendesk/tickets`)

  // Generate and submit tickets
  const tickets: TicketSubmission[] = []
  const results: ApiResponse[] = []

  console.log("\n🎲 Generating 10 random tickets...")
  for (let i = 0; i < 10; i++) {
    tickets.push(generateRandomTicket())
  }

  console.log("\n📬 Submitting tickets to API...")
  for (let i = 0; i < tickets.length; i++) {
    const result = await submitTicket(tickets[i], i)
    results.push(result)

    // Add a small delay between requests to avoid rate limiting
    if (i < tickets.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  // Summary
  const successful = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  console.log("\n╔════════════════════════════════════════════════════════════════╗")
  console.log("║                        TEST RESULTS                            ║")
  console.log("╠════════════════════════════════════════════════════════════════╣")
  console.log(`║ Total Submitted:  ${String(tickets.length).padEnd(50)} ║`)
  console.log(`║ Successful:       ${String(successful).padEnd(50)} ║`)
  console.log(`║ Failed:           ${String(failed).padEnd(50)} ║`)
  console.log(
    `║ Success Rate:     ${String(`${Math.round((successful / tickets.length) * 100)}%`).padEnd(50)} ║`
  )
  console.log("╚════════════════════════════════════════════════════════════════╝")

  if (failed > 0) {
    console.log("\n⚠️  Some submissions failed. Check the logs above for details.")
    process.exit(1)
  } else {
    console.log("\n✅ All submissions successful! Check your Zendesk account.")
    process.exit(0)
  }
}

// Run the script
main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
