#!/usr/bin/env bun

/**
 * Safe Synthetic Data Generator for Intercom
 *
 * Creates realistic tickets and conversations for testing the Intelligence Portal.
 * Built with safety first: small batches, delays, and rate limit handling.
 *
 * Usage:
 *   bun app/intercom/scripts/intercom-generate-synthetic-data.ts --count 20
 *
 * Options:
 *   --count <n>    Number of tickets to create (default: 10, max: 50 per run)
 *   --batch <n>    Batch size (default: 5, max: 10)
 *   --delay <ms>   Delay between batches (default: 3000ms)
 */

import { getIntercomAPIClient } from "@/app/experiments/intercom/lib/intercom-api-client"

// Parse command line args
function parseArgs() {
  const args = process.argv.slice(2)
  const countIdx = args.indexOf("--count")
  const batchIdx = args.indexOf("--batch")
  const delayIdx = args.indexOf("--delay")

  const count = countIdx >= 0 ? Number.parseInt(args[countIdx + 1], 10) : 10
  const batch = batchIdx >= 0 ? Number.parseInt(args[batchIdx + 1], 10) : 5
  const delay = delayIdx >= 0 ? Number.parseInt(args[delayIdx + 1], 10) : 3000

  return {
    count: Math.min(count, 50), // Safety: max 50 per run
    batch: Math.min(batch, 10), // Safety: max 10 per batch
    delay: Math.max(delay, 2000), // Safety: min 2 second delay
  }
}

// Realistic ticket templates
const TICKET_TEMPLATES = [
  {
    title: "Unable to login to account",
    description:
      "I've been trying to log into my account for the past hour but keep getting an error message. Can you please help?",
    priority: false,
    tags: ["login", "access"],
  },
  {
    title: "Billing question about recent charge",
    description:
      "I noticed a charge on my credit card and I'm not sure what it's for. Could you provide details about my recent bill?",
    priority: false,
    tags: ["billing", "payment"],
  },
  {
    title: "Feature request: Dark mode",
    description:
      "Would love to see a dark mode option added to the interface. It would make using the app at night much easier on the eyes.",
    priority: false,
    tags: ["feature-request", "ui"],
  },
  {
    title: "Integration not working with Slack",
    description:
      "The Slack integration stopped working this morning. Messages aren't coming through and I can't see any connection status.",
    priority: true,
    tags: ["integration", "slack", "urgent"],
  },
  {
    title: "How do I export my data?",
    description:
      "I need to export all my data for backup purposes. What's the best way to do this? Is there a bulk export option?",
    priority: false,
    tags: ["data", "export", "how-to"],
  },
  {
    title: "Account upgrade request",
    description:
      "I'd like to upgrade from the basic plan to the pro plan. What's the process and how soon can the upgrade take effect?",
    priority: false,
    tags: ["billing", "upgrade"],
  },
  {
    title: "Mobile app crashing on Android",
    description:
      "The mobile app keeps crashing whenever I try to open my profile. I'm on Android 14, latest app version. Help!",
    priority: true,
    tags: ["mobile", "bug", "android"],
  },
  {
    title: "Password reset not working",
    description:
      "I requested a password reset but never received the email. I've checked spam folder and it's not there either.",
    priority: false,
    tags: ["password", "email"],
  },
  {
    title: "Performance issues with large datasets",
    description:
      "Loading times are very slow when working with datasets over 10,000 rows. Is there a way to optimize this?",
    priority: false,
    tags: ["performance", "optimization"],
  },
  {
    title: "Cannot add team members",
    description:
      "When I try to invite team members, the invitation never goes through. The button just spins indefinitely.",
    priority: true,
    tags: ["team", "invitation", "bug"],
  },
]

// Contact email templates
const CONTACT_EMAILS = [
  "sarah.johnson@company.com",
  "mike.williams@startup.io",
  "emma.davis@tech.co",
  "john.smith@business.com",
  "lisa.anderson@enterprise.org",
  "david.chen@innovation.io",
  "maria.garcia@solutions.com",
  "james.wilson@digital.net",
  "jennifer.taylor@ventures.io",
  "robert.brown@systems.com",
]

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Data generation script with batching logic
async function main() {
  const options = parseArgs()

  console.log("🎫 Intercom Synthetic Data Generator")
  console.log(`${"=".repeat(52)}`)
  console.log(`Tickets to create: ${options.count}`)
  console.log(`Batch size: ${options.batch}`)
  console.log(`Delay between batches: ${options.delay}ms`)
  console.log("")

  try {
    const client = getIntercomAPIClient()

    // Step 1: Get or verify default ticket type
    console.log("1️⃣  Fetching ticket types...")
    const ticketTypes = await client.getTicketTypes()

    if (ticketTypes.length === 0) {
      console.error("❌ No ticket types found. Please create a ticket type in Intercom first.")
      process.exit(1)
    }

    const defaultType = ticketTypes[0]
    console.log(`✓ Using ticket type: "${defaultType.name}" (${defaultType.id})`)
    console.log("")

    // Step 2: Create tickets in batches
    console.log("2️⃣  Creating tickets...")
    let created = 0
    let failed = 0

    const batches = Math.ceil(options.count / options.batch)

    for (let batchNum = 0; batchNum < batches; batchNum++) {
      const batchStart = batchNum * options.batch
      const batchEnd = Math.min(batchStart + options.batch, options.count)
      const batchSize = batchEnd - batchStart

      console.log(`\n📦 Batch ${batchNum + 1}/${batches} (${batchSize} tickets)`)

      for (let i = batchStart; i < batchEnd; i++) {
        const template = TICKET_TEMPLATES[i % TICKET_TEMPLATES.length]
        const contactEmail = CONTACT_EMAILS[i % CONTACT_EMAILS.length]

        try {
          await client.createTicket({
            ticket_type_id: defaultType.id,
            contacts: [{ email: contactEmail }],
            ticket_attributes: {
              _default_title_: template.title,
              _default_description_: template.description,
            },
            state: Math.random() > 0.3 ? "submitted" : "open",
          })

          console.log(`  ✓ Created ticket #${i + 1}: "${template.title.substring(0, 40)}..."`)
          created++
        } catch (error) {
          console.error(
            `  ✗ Failed to create ticket #${i + 1}:`,
            error instanceof Error ? error.message : error
          )
          failed++
        }
      }

      // Delay between batches (except after last batch)
      if (batchNum < batches - 1) {
        console.log(`\n⏳ Waiting ${options.delay}ms before next batch...`)
        await new Promise((resolve) => setTimeout(resolve, options.delay))
      }
    }

    // Summary
    console.log("")
    console.log(`${"=".repeat(52)}`)
    console.log("✅ SUMMARY")
    console.log(`${"=".repeat(52)}`)
    console.log(`Created: ${created}`)
    console.log(`Failed: ${failed}`)
    console.log(`Total: ${created + failed}`)
    console.log("")

    if (created > 0) {
      console.log("Next steps:")
      console.log("  1. Run: bun app/intercom/api/refresh/route.ts")
      console.log("  2. Test queries in the Intercom portal")
    }
  } catch (error) {
    console.error("\n❌ Error:", error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
