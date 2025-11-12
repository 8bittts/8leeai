#!/usr/bin/env bun

/**
 * Intercom API Test Script
 *
 * Auto-generates 10 random but realistic conversation submissions
 * to test the Intercom integration API.
 *
 * Usage:
 *   bun scripts/test-intercom.ts
 *
 * Environment Variables Required:
 *   - INTERCOM_ACCESS_TOKEN
 *   - INTERCOM_WORKSPACE_ID
 *   - (Optionally override API_BASE_URL for testing)
 */

interface ConversationSubmission {
  visitorEmail: string
  visitorName: string
  topic: "general" | "sales" | "support" | "feedback"
  initialMessage: string
  pageUrl: string
  pageTitle: string
}

interface ApiResponse {
  success?: boolean
  conversationId?: string
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
const domains = ["gmail.com", "company.com", "outlook.com", "work.email", "dev.io"]
const _companies = ["Tech Corp", "StartUp Inc", "Digital Agency", "Cloud Solutions", "Data Systems"]

const topics = ["general", "sales", "support", "feedback"] as const

const pages = [
  { url: "https://example.com/pricing", title: "Pricing Plans" },
  { url: "https://example.com/features", title: "Features" },
  { url: "https://example.com/docs", title: "Documentation" },
  { url: "https://example.com/blog", title: "Blog" },
  { url: "https://example.com/contact", title: "Contact Us" },
  { url: "https://example.com/demo", title: "Request Demo" },
  { url: "https://example.com/integrations", title: "Integrations" },
  { url: "https://example.com/security", title: "Security" },
  { url: "https://example.com/customers", title: "Customer Stories" },
  { url: "https://example.com/about", title: "About Us" },
]

const messages = {
  sales: [
    "Hi, I'm interested in learning more about your enterprise plan. We have about 500 team members.",
    "Do you offer any discounts for annual billing? We're looking to switch providers.",
    "Can someone schedule a demo? We'd like to see how this integrates with our existing stack.",
    "I have a few questions about the pricing model and what's included in each tier.",
    "We're evaluating a few solutions right now. What makes your product unique?",
    "What's your typical implementation timeline? We need to get this set up quickly.",
    "Do you have any SOC 2 or compliance certifications we should know about?",
    "Can you provide references from similar companies in our industry?",
    "What support options do you offer? Do you have 24/7 support available?",
    "We'd like to try a free trial before committing. Is that possible?",
  ],
  support: [
    "I'm having trouble getting the integration to work. The webhook keeps failing.",
    "The API documentation seems out of date. Can you clarify how the authentication flow works?",
    "I'm getting a 403 error when trying to access the endpoint. What could be wrong?",
    "How do I export my historical data? I can't find an export option in the dashboard.",
    "The system seems slow today. Is there an incident or maintenance happening?",
    "I accidentally deleted some data. Is there a way to recover it from backups?",
    "Can you help me debug why my API calls are being rate limited?",
    "I need to set up multi-factor authentication. Where do I configure that?",
    "The mobile app keeps crashing when I try to upload files. What's going on?",
    "I'm trying to migrate from the old system but I'm stuck on the data import step.",
  ],
  feedback: [
    "Great product! One thing that would help: being able to bulk edit settings.",
    "The UI is intuitive but I wish there were keyboard shortcuts for power users.",
    "Love the new dark mode! Would be nice if I could customize the colors though.",
    "The onboarding was helpful but it would be better if it was more interactive.",
    "Good work on the recent update. Performance feels snappier now.",
    "Feature request: Can you add the ability to set up recurring tasks or automations?",
    "The reporting dashboard is nice but I'd love more customization options.",
    "Would it be possible to have an offline mode? Sometimes I work without internet.",
    "The search function is great but could use some advanced filtering options.",
    "Overall loving this product! Keep adding features like these. Great job!",
  ],
  general: [
    "Quick question: Will there be downtime for maintenance this weekend?",
    "What's on the roadmap for the next few months? Any exciting features coming?",
    "Is there a community forum or Slack channel where I can network with other users?",
    "Do you have any resources on best practices or tips for getting the most value?",
    "What's the latency like for API calls? Does it vary by region?",
    "Can I use this for non-commercial projects? What does the license say?",
    "Do you have a referral program? I know a few companies that would benefit.",
    "How long have you been in business? What's your company story?",
    "Do you have an affiliate program for content creators and influencers?",
    "What's the best way to stay updated on new releases and features?",
  ],
}

/**
 * Generate a random realistic conversation submission
 */
function generateRandomConversation(): ConversationSubmission {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const topic = topics[Math.floor(Math.random() * topics.length)]
  const domain = domains[Math.floor(Math.random() * domains.length)]
  const page = pages[Math.floor(Math.random() * pages.length)]
  const messageList = messages[topic as keyof typeof messages]
  const initialMessage = messageList[Math.floor(Math.random() * messageList.length)]

  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`

  return {
    visitorEmail: email,
    visitorName: `${firstName} ${lastName}`,
    topic,
    initialMessage,
    pageUrl: page.url,
    pageTitle: page.title,
  }
}

/**
 * Submit a conversation to the local API endpoint
 */
async function submitConversation(
  conversation: ConversationSubmission,
  index: number
): Promise<ApiResponse> {
  const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3000"

  try {
    console.log(`\n💬 Submitting conversation ${index + 1}/10...`)
    console.log(`   Visitor: ${conversation.visitorName} (${conversation.visitorEmail})`)
    console.log(`   Topic: ${conversation.topic}`)
    console.log(`   Page: ${conversation.pageTitle}`)
    console.log(`   Message: "${conversation.initialMessage.substring(0, 50)}..."`)

    const response = await fetch(`${apiBaseUrl}/api/intercom/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conversation),
    })

    const data = await response.json()

    if (response.ok) {
      console.log(`   ✅ Success! Conversation ID: ${data.conversationId}`)
      return { success: true, conversationId: data.conversationId }
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
 * Main function - generate and submit 10 random conversations
 */
async function main() {
  console.log("╔════════════════════════════════════════════════════════════════╗")
  console.log("║        INTERCOM TEST SCRIPT - Auto-Generate 10 Conversations    ║")
  console.log("╚════════════════════════════════════════════════════════════════╝")

  // Check environment variables
  const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"
  console.log("\n🔧 Configuration:")
  console.log(`   API Base URL: ${baseUrl}`)
  console.log(`   Using local API endpoint: ${baseUrl}/api/intercom/conversations`)

  // Generate and submit conversations
  const conversations: ConversationSubmission[] = []
  const results: ApiResponse[] = []

  console.log("\n🎲 Generating 10 random conversations...")
  for (let i = 0; i < 10; i++) {
    conversations.push(generateRandomConversation())
  }

  console.log("\n📬 Submitting conversations to API...")
  for (let i = 0; i < conversations.length; i++) {
    const result = await submitConversation(conversations[i], i)
    results.push(result)

    // Add a small delay between requests to avoid rate limiting
    if (i < conversations.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  // Summary
  const successful = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  console.log("\n╔════════════════════════════════════════════════════════════════╗")
  console.log("║                        TEST RESULTS                            ║")
  console.log("╠════════════════════════════════════════════════════════════════╣")
  console.log(`║ Total Submitted:  ${String(conversations.length).padEnd(50)} ║`)
  console.log(`║ Successful:       ${String(successful).padEnd(50)} ║`)
  console.log(`║ Failed:           ${String(failed).padEnd(50)} ║`)
  console.log(
    `║ Success Rate:     ${String(`${Math.round((successful / conversations.length) * 100)}%`).padEnd(50)} ║`
  )
  console.log("╚════════════════════════════════════════════════════════════════╝")

  if (failed > 0) {
    console.log("\n⚠️  Some submissions failed. Check the logs above for details.")
    process.exit(1)
  } else {
    console.log("\n✅ All submissions successful! Check your Intercom account.")
    process.exit(0)
  }
}

// Run the script
main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
