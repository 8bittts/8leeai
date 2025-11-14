#!/usr/bin/env bun

/**
 * Zendesk Ticket Generator Script
 *
 * Creates realistic and varied support tickets directly in Zendesk
 * with built-in rate limiting to respect API limits.
 *
 * Usage:
 *   bun scripts/generate-zendesk-tickets.ts [options]
 *
 * Options:
 *   --count <n>        Number of tickets to generate (default: 10, max: 100)
 *   --delay <ms>       Delay between requests in ms (default: 500)
 *   --priority <p>     Fixed priority: low|normal|high|urgent (random by default)
 *   --status <s>       Fixed status: new|open|pending|solved (random by default)
 *
 * Environment Variables Required:
 *   - ZENDESK_EMAIL
 *   - ZENDESK_API_TOKEN
 *   - ZENDESK_SUBDOMAIN
 *
 * Examples:
 *   bun scripts/generate-zendesk-tickets.ts                    # Generate 10 random tickets
 *   bun scripts/generate-zendesk-tickets.ts --count 25         # Generate 25 tickets
 *   bun scripts/generate-zendesk-tickets.ts --count 15 --delay 1000  # Slower generation
 */

interface ZendeskTicket {
  ticket: {
    subject: string
    description: string
    requester_email: string
    requester_name: string
    priority?: "low" | "normal" | "high" | "urgent"
    status?: "new" | "open" | "pending" | "solved"
    tags?: string[]
  }
}

interface TicketData {
  subject: string
  description: string
  requesterEmail: string
  requesterName: string
  priority: "low" | "normal" | "high" | "urgent"
  status: "new" | "open" | "pending" | "solved"
  tags: string[]
}

// Rich data sets for realistic variations
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
  "Karen",
  "Leo",
  "Maya",
  "Noah",
  "Olivia",
  "Peter",
  "Quinn",
  "Rachel",
  "Sam",
  "Tina",
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
  "Anderson",
  "Taylor",
  "Thomas",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Thompson",
  "White",
  "Harris",
]

const domains = ["gmail.com", "company.com", "outlook.com", "work.email", "dev.io", "startup.co"]

const subjects = {
  support: [
    "Login issues with my account",
    "Bug: Dashboard loading slowly",
    "Integration not working properly",
    "API documentation unclear",
    "Can't export my data",
    "Need help setting up authentication",
    "Error message on profile page",
    "Question about rate limits",
    "Feature not working as expected",
    "Can't reset my password",
    "502 Bad Gateway error when submitting",
    "Webhook not firing on ticket creation",
    "OAuth integration failing with 401",
    "Data sync not happening automatically",
    "API key keeps getting reset",
    "Can't attach files to tickets",
    "Custom fields not showing up",
    "Search is returning no results",
    "Bulk edit feature not working",
    "Timeout errors on large imports",
    "Tags not being applied correctly",
    "Nested group structure broken",
    "Performance degradation on Sunday nights",
    "Unable to restore from backup",
    "Two-factor authentication not working",
    "Email forwarding stopped working",
    "Conditional rules not executing",
    "Macros timing out on execution",
    "View filters not persisting",
    "Dashboard widget rendering errors",
  ],
  sales: [
    "Upgrading to enterprise plan",
    "Custom quote request for 500 users",
    "Annual billing discount inquiry",
    "Demo request for team evaluation",
    "Need references from similar companies",
    "Support package details for enterprise",
    "Volume licensing inquiry",
    "Integration capabilities question",
    "Custom features development",
    "SLA and uptime guarantees",
    "Multi-tier pricing structure inquiry",
    "Custom domain setup requirements",
    "API rate limit increase request",
    "White-label licensing options",
    "Security audit requirements",
    "HIPAA compliance certification",
    "SOC 2 compliance documentation",
    "Custom implementation service",
    "Training and onboarding services",
    "Dedicated account manager request",
    "Priority support tier inquiry",
    "Custom integration development",
    "API token management features",
    "Audit log retention requirements",
    "Data residency requirements",
    "Pricing for 10,000 users",
    "Cost comparison with competitors",
    "Trial extension request",
    "Contract negotiation needed",
    "Partnership opportunity inquiry",
  ],
  feedback: [
    "UI/UX suggestions for improvement",
    "Dark mode colors need adjustment",
    "Feature request: keyboard shortcuts",
    "Onboarding process too complex",
    "Performance improvement feedback",
    "Bulk import/export feature suggestion",
    "Mobile app responsiveness issue",
    "Documentation needs clarification",
    "Translation improvements needed",
    "API versioning concerns",
    "Search needs better relevance",
    "Would love saved filters/views",
    "Custom report builder needed",
    "Suggestion: drag-drop ticket assignment",
    "Need better notification settings",
    "Mobile app refresh button helpful",
    "Dark mode should match system theme",
    "Sidebar collapse toggle would help",
    "Keyboard navigation improvements",
    "Better email threading visualization",
    "Advanced filtering would be useful",
    "Custom dashboard layouts please",
    "Multi-language UI support",
    "Better mobile form layout",
    "Undo button for accidental actions",
    "Better ticket preview on hover",
    "Faster search response times",
    "Calendar integration would help",
    "Gantt chart for project tickets",
    "Better analytics visualizations",
  ],
  general: [
    "Maintenance window notification",
    "Roadmap and upcoming features",
    "Community forum access",
    "Licensing for internal tools",
    "Zapier integration availability",
    "Data privacy and compliance",
    "Backup and disaster recovery",
    "Migration assistance needed",
    "Compliance certification status",
    "White-label solution inquiry",
    "Status page URL for incidents",
    "How to recover deleted data",
    "Best practices for ticket organization",
    "Team structure setup guidance",
    "Process automation recommendations",
    "Database backup frequency",
    "Regional data center locations",
    "Maximum attachment file size",
    "API versioning and deprecation",
    "SSL certificate requirements",
    "Single sign-on setup help",
    "LDAP integration details",
    "Rate limiting details",
    "Concurrent user limits",
    "Storage quota information",
    "Import/export limitations",
    "Historical data access",
    "Change log and version history",
    "Migration tool documentation",
    "Disaster recovery procedures",
  ],
}

const descriptions = {
  support: [
    // Short
    "Getting 502 error when trying to submit forms. What's happening?",
    "Dashboard is very slow today. Is there an issue?",
    "API key won't authenticate. Please reset it.",
    "Can't export data in CSV format.",
    "Webhook isn't firing for new tickets.",
    // Medium
    "I've been unable to access my account for the past 2 hours. I've tried clearing my browser cache and using a different browser, but the issue persists. The error message just says 'Access Denied'. Can you help me investigate?",
    "The system is not syncing my data correctly. I uploaded a CSV file 45 minutes ago but it still hasn't appeared in my dashboard. Is there a processing delay or is something broken? This is blocking our team's workflow.",
    "I'm trying to set up OAuth authentication but the callback keeps failing with a 401 error. I've verified the client ID and secret multiple times. Can someone review my configuration? We've been stuck on this for 2 days.",
    "The API responses are inconsistent. Sometimes it returns the data, sometimes it doesn't. It seems random and is affecting our production pipeline. Can you investigate? This is a critical issue for us.",
    "I'm migrating from the old API to v2 but the documentation doesn't cover my specific use case. I'm stuck at the authentication step. Can you provide guidance or connect me with a migration specialist?",
    // Long
    "I've been experiencing intermittent connectivity issues with the API endpoints over the past week. The pattern seems to occur between 8-10 PM UTC, which corresponds to our peak usage times. When the issue occurs, approximately 30% of our requests fail with timeout errors (>30 second response time). We've verified that our network connection is stable, and other external APIs work fine during these periods. Our current implementation includes exponential backoff and retry logic, but we're losing transaction data. Can you check your server logs for any anomalies during these specific time windows? Our account ID is ACC-12345 and we can provide detailed logs from our side if needed.",
    "We're getting strange behavior with the webhook delivery system. About 5% of our ticket creation webhooks are not being delivered, but there's no error indication. We've verified the URL is correct and accessible (status 200), and our endpoint is logging successful connections. However, we're missing roughly 50-100 webhook events per day. When I manually re-trigger the webhook from your dashboard, it works immediately. This suggests a queuing or filtering issue on your end. Can you investigate our account's webhook settings? Is there any throttling or deduplication logic that might be suppressing events?",
    "We've implemented a custom integration that relies heavily on your search API endpoint. Since the update last Tuesday, search performance has degraded significantly. Queries that previously returned in 2-3 seconds are now taking 30-60 seconds. We haven't changed our query parameters or request volume. The issue affects all types of searches: simple text searches, complex ZQL queries, and filtered searches. When we run the same query directly through the admin dashboard, performance is normal. This suggests the issue is with the API implementation or how it handles programmatic requests versus UI requests. We're concerned this may affect our customers if not resolved quickly.",
  ],
  sales: [
    // Short
    "Need a quote for 100 users, please.",
    "What's the price for enterprise?",
    "Can we get a demo next week?",
    "Do you offer annual discounts?",
    "Need references please.",
    // Medium
    "We're interested in the enterprise plan for 500+ users. Can you provide a custom quote? We also need custom integrations and white-label options. We'd like to understand the implementation timeline and support included.",
    "What's the pricing for annual billing? Do you offer volume discounts for 200+ seats? We need this for our board approval by end of month.",
    "Can you schedule a demo for our team next week? We want to see how this integrates with our existing Salesforce and HubSpot setup.",
    "Can you provide references from companies in our industry (healthcare/fintech)? We want to ensure this solution is proven for our use case and compliance requirements.",
    "What's included in enterprise support? Do you offer 24/7 phone support and dedicated account management? We also need SLA guarantees.",
    // Long
    "We're evaluating your platform as a replacement for our current support system, and this is part of a major digital transformation initiative at our company. We're interested in the enterprise plan, but need clarity on several aspects before we can move forward with a purchase decision. First, we need a custom quote for approximately 800 concurrent users, with the possibility of scaling to 2000+ users within 18 months as we onboard new divisions. We also require white-label capabilities so our customers interact with our branding only. Second, we have specific technical requirements: we need to maintain compliance with HIPAA and SOC 2 Type II standards, require IP whitelisting, need dedicated database instances if possible, and require 99.99% uptime SLA. Third, we need to understand the implementation timeline - we have a go-live date of Q2 2025 and need to know if you can support that schedule with migrations from our current system. Finally, we'd like to speak with 2-3 customers in similar industries (healthcare or financial services) who've gone through enterprise implementations. Can your sales team schedule a call with myself and our CTO to discuss these requirements?",
    "We currently use Zendesk but are exploring options because we're hitting limitations with our current setup. Our main pain points are: (1) inability to create custom ticket types for different business units, (2) limited programmatic access to customize workflows, (3) insufficient audit logging for compliance purposes, and (4) inadequate multi-tenancy support for our specific organizational structure. We'd like to understand how your solution addresses these gaps. We also need information about: migration services and timeline, cost structure for our estimated volume (3000 tickets/month, 200 agents), custom feature development options, and dedicated support availability. We're planning to make a final decision by Q1 2025, so timeline is critical. Can we schedule a deep-dive technical demo?",
  ],
  feedback: [
    // Short
    "Love the new UI! Great work.",
    "Search needs improvement.",
    "Mobile app is buggy.",
    "Feature request: dark mode",
    "Performance is great now, thanks!",
    // Medium
    "Great product overall! The recent update significantly improved performance. One suggestion: add keyboard shortcuts for power users like us. That would save hours each week. Also, could you add a bulk action feature for managing multiple tickets at once?",
    "Love the redesigned UI, but the dark mode contrast is a bit hard on the eyes. Could you increase the contrast slightly? Also, the sidebar is a bit too wide and takes up valuable screen space. Maybe add a collapse option?",
    "The onboarding process was confusing. I got stuck on step 3 where it asks for API credentials. The docs don't explain where to find them. Consider improving that UX and adding more screenshots or video tutorials.",
    "Feature suggestion: bulk import/export as CSV would save our team hours of manual work. Currently we have to do everything one by one. We need to sync data with our other systems regularly.",
    "Excellent customer support! However, response times could be faster during peak hours. Consider adding more support staff. We also need more detailed API documentation with better code examples.",
    // Long
    "We've been using your platform for 6 months now, and overall it's been a solid solution. However, I'd like to provide some constructive feedback about areas that could be improved. First, the reporting and analytics capabilities feel limited. We can generate basic reports, but we can't create custom dashboards for specific metrics we care about (like SLA compliance by team, resolution time by category, or customer satisfaction trends). Being able to build custom dashboards would transform this feature from adequate to excellent. Second, the mobile app, while functional, doesn't feel optimized for our use case. We need to be able to assign tickets, update statuses, and add internal notes while on the go, but the interface is cramped and navigation is unintuitive. Consider redesigning for better touch interactions and larger buttons. Third, the API documentation, while comprehensive, lacks practical examples for common use cases. Adding code examples in Python, JavaScript, and Go would be incredibly helpful for our integration efforts. Finally, we'd love to see better integrations with communication tools we use (Slack, Teams, Discord) for real-time notifications and quick actions.",
    "I've been using competing products and have noticed several UX patterns that work really well that you might consider adopting. Specifically: (1) The ability to save views with custom filters - we end up recreating the same filter combinations multiple times per day. (2) Better support for keyboard navigation throughout the interface - we have power users who rarely touch the mouse. (3) A 'snooze' feature for tickets - sometimes we handle issues that take multiple days, and we'd like to 'snooze' them to resurface at a specific time. (4) Better visual hierarchy in the ticket detail view - important information sometimes gets buried. (5) Ability to template responses for common questions - we answer the same things repeatedly. These changes would significantly improve our team's productivity.",
  ],
  general: [
    // Short
    "Will there be maintenance this weekend?",
    "What's your roadmap?",
    "How do I reset my password?",
    "Where's your status page?",
    "What's your data privacy policy?",
    // Medium
    "Will the system be down for maintenance this weekend? Our team needs to plan work schedules accordingly. Please confirm timing and expected duration. Does this include the API endpoints we rely on?",
    "What exciting features are coming in the next quarter? We want to factor that into our planning and ensure we're not building duplicate functionality in-house.",
    "Is there an active community forum or Slack channel where users can help each other? Would be great to connect with other companies using the platform and share best practices.",
    "Can we use this for internal tools only, or do we need a different license? We're not planning to resell but want to clarify licensing terms.",
    "Do you have integrations with Zapier, Make, or other automation platforms? We want to automate some workflows and connect to other tools in our stack.",
    // Long
    "We're in the process of migrating from our legacy ticketing system to your platform, and we have several questions about the migration process. First, what's the maximum amount of historical data we can import? We have 10 years of ticket history (roughly 500K tickets) that we'd like to preserve. Second, what tools/APIs do you provide for data migration? Do you have pre-built connectors for our current system (Kayako)? Third, what happens to custom fields during migration - will they map automatically or do we need to do manual configuration? Fourth, how long does a typical migration take for an account our size? Fifth, what's your approach to downtime during migration? Can we do a parallel run or cutover migration to minimize disruption? Finally, do you provide any training or change management support as part of the migration? We're planning a go-live in Q2 2025 and need to understand the timeline and resource requirements.",
    "We're conducting a security audit for our organization and have several questions about your platform's security posture. We need: (1) Your most recent SOC 2 Type II audit report, (2) Documentation on data encryption in transit and at rest, (3) Details on your disaster recovery and backup procedures, (4) Your security incident response process and any recent incidents, (5) Support for single sign-on (we use Okta), (6) IP whitelisting capabilities, (7) Audit logging of all user actions for compliance purposes, (8) Data residency guarantees (we may need EU-based servers), and (9) Your vulnerability disclosure policy. This information is required before we can get board approval for using your platform in our organization.",
  ],
}

const tags = {
  support: ["bug", "account", "integration", "api", "urgent"],
  sales: ["opportunity", "enterprise", "quote", "demo", "enterprise-sales"],
  feedback: ["feature-request", "ux", "improvement", "performance"],
  general: ["question", "information", "policy", "integration-inquiry"],
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    count: 10,
    delay: 500,
    priority: null as string | null,
    status: null as string | null,
  }

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--count":
        options.count = Math.min(Number.parseInt(args[i + 1]) || 10, 100)
        i++
        break
      case "--delay":
        options.delay = Math.max(Number.parseInt(args[i + 1]) || 500, 100)
        i++
        break
      case "--priority":
        options.priority = args[i + 1]
        i++
        break
      case "--status":
        options.status = args[i + 1]
        i++
        break
    }
  }

  return options
}

/**
 * Generate a random realistic ticket
 */
function generateRandomTicket(): TicketData {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const domain = domains[Math.floor(Math.random() * domains.length)]
  const category = Object.keys(subjects)[Math.floor(Math.random() * 4)] as keyof typeof subjects

  const subjectList = subjects[category]
  const descriptionList = descriptions[category]
  const tagList = tags[category]

  const subject = subjectList[Math.floor(Math.random() * subjectList.length)]
  const description = descriptionList[Math.floor(Math.random() * descriptionList.length)]
  const selectedTags = tagList.slice(0, Math.floor(Math.random() * 3) + 1)

  const priorities: Array<"low" | "normal" | "high" | "urgent"> = [
    "low",
    "normal",
    "high",
    "urgent",
  ]
  const statuses: Array<"new" | "open" | "pending" | "solved"> = [
    "new",
    "open",
    "pending",
    "solved",
  ]

  return {
    subject,
    description,
    requesterEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    requesterName: `${firstName} ${lastName}`,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    tags: selectedTags,
  }
}

/**
 * Create a ticket in Zendesk via API
 */
async function createZendeskTicket(
  ticket: TicketData,
  index: number,
  options: ReturnType<typeof parseArgs>
): Promise<{ success: boolean; ticketId?: string; error?: string }> {
  const email = process.env.ZENDESK_EMAIL
  const token = process.env.ZENDESK_API_TOKEN
  const subdomain = process.env.ZENDESK_SUBDOMAIN

  if (!(email && token && subdomain)) {
    return { success: false, error: "Missing required environment variables" }
  }

  const auth = btoa(`${email}/token:${token}`)
  const url = `https://${subdomain}.zendesk.com/api/v2/tickets.json`

  const payload: ZendeskTicket = {
    ticket: {
      subject: ticket.subject,
      description: ticket.description,
      requester_email: ticket.requesterEmail,
      requester_name: ticket.requesterName,
      priority: (options.priority as any) || ticket.priority,
      status: (options.status as any) || ticket.status,
      tags: ticket.tags,
    },
  }

  try {
    console.log(`\n📤 Creating ticket ${index + 1}/${options.count}...`)
    console.log(`   From: ${ticket.requesterName} <${ticket.requesterEmail}>`)
    console.log(`   Subject: ${ticket.subject}`)
    console.log(`   Priority: ${payload.ticket.priority} | Status: ${payload.ticket.status}`)
    console.log(`   Tags: ${ticket.tags.join(", ") || "none"}`)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = (await response.json()) as any

    if (response.ok && data.ticket?.id) {
      console.log(`   ✅ Created! Ticket ID: ${data.ticket.id}`)
      return { success: true, ticketId: String(data.ticket.id) }
    }

    console.log(`   ❌ Error: ${data.error?.message || data.description || "Unknown error"}`)
    return { success: false, error: data.error?.message || "Unknown error" }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.log(`   ❌ Network error: ${errorMessage}`)
    return { success: false, error: errorMessage }
  }
}

/**
 * Main function
 */
async function main() {
  const options = parseArgs()

  console.log("\n╔═══════════════════════════════════════════════════════════════════╗")
  console.log("║         ZENDESK TICKET GENERATOR - Create Realistic Tickets      ║")
  console.log("╚═══════════════════════════════════════════════════════════════════╝")

  // Validate environment variables
  if (
    !(process.env.ZENDESK_EMAIL && process.env.ZENDESK_API_TOKEN && process.env.ZENDESK_SUBDOMAIN)
  ) {
    console.error("\n❌ Error: Missing required environment variables")
    console.error("   Set: ZENDESK_EMAIL, ZENDESK_API_TOKEN, ZENDESK_SUBDOMAIN")
    process.exit(1)
  }

  console.log("\n🔧 Configuration:")
  console.log(`   Subdomain: ${process.env.ZENDESK_SUBDOMAIN}`)
  console.log(`   Email: ${process.env.ZENDESK_EMAIL}`)
  console.log(`   Tickets to create: ${options.count}`)
  console.log(`   Delay between requests: ${options.delay}ms`)
  if (options.priority) console.log(`   Fixed priority: ${options.priority}`)
  if (options.status) console.log(`   Fixed status: ${options.status}`)

  // Generate and submit tickets
  const tickets: TicketData[] = []
  const results: Array<{ success: boolean; ticketId?: string; error?: string }> = []

  console.log(`\n🎲 Generating ${options.count} random tickets...`)
  for (let i = 0; i < options.count; i++) {
    tickets.push(generateRandomTicket())
  }

  console.log(`\n📬 Submitting tickets to Zendesk (${options.delay}ms delay between requests)...`)
  for (let i = 0; i < tickets.length; i++) {
    const result = await createZendeskTicket(tickets[i], i, options)
    results.push(result)

    // Rate limiting delay
    if (i < tickets.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, options.delay))
    }
  }

  // Summary
  const successful = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  console.log("\n╔═══════════════════════════════════════════════════════════════════╗")
  console.log("║                        TEST RESULTS                             ║")
  console.log("╠═══════════════════════════════════════════════════════════════════╣")
  console.log(`║ Total Created:    ${String(tickets.length).padEnd(54)} ║`)
  console.log(`║ Successful:       ${String(successful).padEnd(54)} ║`)
  console.log(`║ Failed:           ${String(failed).padEnd(54)} ║`)
  console.log(
    `║ Success Rate:     ${String(`${Math.round((successful / tickets.length) * 100)}%`).padEnd(54)} ║`
  )
  console.log("╚═══════════════════════════════════════════════════════════════════╝")

  if (failed > 0) {
    console.log("\n⚠️  Some tickets failed to create. Check the logs above for details.")
    process.exit(1)
  } else {
    console.log("\n✅ All tickets created successfully!")
    console.log("   View them at: https://8lee.zendesk.com/agent/dashboard")
    process.exit(0)
  }
}

// Run the script
main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
