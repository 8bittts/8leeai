#!/usr/bin/env bun

/**
 * Intercom Ticket Generator with Replies
 *
 * Creates 5 realistic tickets with full metadata and adds 1-3 replies to each
 *
 * Usage:
 *   bun scripts/generate-tickets-with-replies.ts
 *
 * Environment Variables Required:
 *   - INTERCOM_EMAIL
 *   - INTERCOM_API_TOKEN
 *   - INTERCOM_SUBDOMAIN
 */

import { getIntercomAPIClient } from "../app/intercom/lib/intercom-api-client"

// Rich reply templates for different scenarios
const _supportReplies = {
  acknowledgment: [
    "Thank you for reporting this issue. I've escalated this to our engineering team for investigation. They'll review the logs and get back to you within 24 hours with an update.",
    "I appreciate you reaching out about this. I'm looking into it now and will update you shortly with my findings.",
    "Thanks for the detailed information. This is very helpful. I'm investigating the root cause and will follow up within the next few hours.",
  ],
  investigation: [
    "After reviewing your account, I can see the issue you're describing. It appears to be related to a recent configuration change. I'm working on a fix and will deploy it to your account within the hour.",
    "I've reviewed the logs and identified the problem. It's caused by a race condition in our sync process. I'm implementing a patch now that should resolve this completely.",
    "Good news! I found the issue. It's a permissions problem with your API key. I've updated the permissions and you should be able to access everything now. Can you test and confirm?",
  ],
  resolution: [
    "This has been resolved! The fix has been deployed to production. Please test on your end and let me know if you're still experiencing any issues.",
    "All set! I've applied the fix and verified it's working correctly. Your data should now sync properly. If you notice anything unusual, please don't hesitate to reach out.",
    "Fixed! The issue was in our caching layer. I've cleared the cache and restarted the affected services. Everything should be working normally now.",
  ],
  followUp: [
    "Just checking in - are you still experiencing this issue, or has it been resolved? Please let me know if you need any further assistance.",
    "I wanted to follow up and ensure everything is working as expected. If you're still having problems, I'm happy to investigate further.",
    "Checking back on this ticket. Please confirm if the issue has been resolved or if you need additional help.",
  ],
}

const _salesReplies = {
  introduction: [
    "Thank you for your interest in our enterprise plan! I'm excited to help you explore how our platform can support your team's needs. I've scheduled a call for next Tuesday at 2 PM EST to discuss your requirements in detail.",
    "Great to hear from you! I'd love to discuss your specific requirements and put together a custom proposal. Are you available for a call this week?",
    "Thanks for reaching out! I'm your dedicated account executive and will be working with you throughout this evaluation. Let's set up time to discuss your goals.",
  ],
  proposal: [
    "Based on our conversation, I've prepared a custom quote for 500 users with enterprise support. The annual pricing would be $45,000 (25% discount from monthly billing). This includes white-label options, dedicated support, and custom integrations. I've attached the detailed proposal - let's schedule a call to walk through it.",
    "I've put together a proposal that addresses all your requirements: HIPAA compliance, dedicated database instance, 99.99% uptime SLA, and migration support. The total investment would be $60,000/year for 800 seats. Shall we review this together?",
    "Here's the custom package I've assembled for your team: Enterprise Plan for 200 users, priority support, custom onboarding, and integration services. Total: $28,000 annually. This represents a 30% savings over monthly billing. What questions can I answer?",
  ],
  negotiation: [
    "I understand budget constraints are important. Let me speak with my manager about additional flexibility on the pricing. In the meantime, can you share your target budget range so I can work within those parameters?",
    "I'd like to make this work for you. If you can commit to a 3-year contract, I can offer an additional 15% discount, bringing your annual cost to $38,250. Would that fit within your budget?",
    "Thank you for sharing your feedback on the proposal. I've revised it based on our discussion and included the additional features you requested. The adjusted pricing is attached - please review and let me know your thoughts.",
  ],
}

const _feedbackReplies = {
  appreciation: [
    "Thank you so much for this detailed feedback! This is exactly the kind of input that helps us improve. I've shared your suggestions with our product team, and they're excited about several of these ideas.",
    "I really appreciate you taking the time to share this. Your insights are incredibly valuable, and I want you to know that we read and consider every piece of feedback carefully.",
    "Thanks for the thoughtful feedback! We're always looking to improve, and suggestions like yours help us prioritize what to build next.",
  ],
  roadmap: [
    "Great news! The dark mode improvements you suggested are actually in our Q1 roadmap. We're planning to add a contrast slider and match system theme preferences. I'll keep you posted on the progress.",
    "I love these ideas! The keyboard shortcuts feature is something we've been planning, and your specific suggestions align perfectly with what we're building. Expected release: March 2025.",
    "This is fantastic timing! We're actively working on the bulk import/export feature you mentioned. It's currently in beta testing. Would you be interested in trying the beta version?",
  ],
  consideration: [
    "These are excellent suggestions that I've added to our product backlog. While I can't commit to a specific timeline, I can tell you that the saved filters/views feature has significant interest from our team.",
    "I've escalated your feature request to our product manager. They'll evaluate it against our roadmap priorities, and I'll follow up with you once we have more information about potential timelines.",
    "Thank you for this detailed use case! I've added your feedback to our user research database. Our product team reviews these regularly when planning new features.",
  ],
}

const _generalReplies = {
  information: [
    "Great question! Our platform is SOC 2 Type II certified, and we maintain compliance with GDPR, HIPAA, and other major frameworks. I'm attaching our security whitepaper which covers encryption, backups, and disaster recovery in detail.",
    "Thanks for asking! Here's the information you requested: Our API rate limits are 700 requests/minute for Enterprise accounts, we support OAuth 2.0 and API key authentication, and our documentation is at docs.intercom.com/api. Let me know if you need anything else!",
    "Good question! We have data centers in US-East, US-West, EU-Central, and Asia-Pacific. You can choose your data residency during account setup, and we guarantee data never leaves your selected region.",
  ],
  guidance: [
    "I'd be happy to help you with this! Here's a step-by-step guide: 1) Navigate to Settings > Integrations, 2) Select 'Add New Integration', 3) Choose your platform from the list, 4) Follow the OAuth flow to authorize, 5) Configure your sync preferences. Let me know if you get stuck on any step!",
    "For your use case, I recommend this approach: Set up automated workflows using our rules engine to handle the common scenarios, then use the API for custom edge cases. I can schedule a screen share to walk you through the setup if that would be helpful.",
    "Here's how to accomplish what you're trying to do: You'll want to use our bulk update API endpoint (PUT /api/v2/tickets/update_many) with a filter for your specific criteria. I've attached a code sample in Python that demonstrates the exact pattern you need.",
  ],
}

interface TicketWithReplies {
  subject: string
  description: string
  priority: "low" | "normal" | "high" | "urgent"
  status: "new" | "open" | "pending" | "solved"
  tags: string[]
  requesterName: string
  requesterEmail: string
  replies: Array<{
    body: string
    public: boolean
  }>
}

/**
 * Generate 5 realistic tickets with full metadata and replies
 */
function generateTicketsWithReplies(): TicketWithReplies[] {
  return [
    // Ticket 1: Critical Support Issue
    {
      subject: "API Authentication Failing with 401 Unauthorized Errors",
      description: `I'm experiencing persistent authentication failures when trying to access the API endpoints. This started happening approximately 3 hours ago and is affecting our production systems.

**Details:**
- API Key: Verified multiple times, correctly formatted
- Endpoint: https://api.intercom.com/v2/tickets.json
- Error: 401 Unauthorized (consistent across all endpoints)
- Impact: Critical - our automated ticketing integration is completely down
- Tried: Regenerating API key, clearing cache, testing from different IPs

**Error Response:**
\`\`\`json
{
  "error": "Unauthorized",
  "description": "Authentication failed. Please check your API credentials."
}
\`\`\`

This is blocking our customer support operations. We process 500+ tickets/day through this integration, and we're currently unable to create or update any tickets programmatically. Our customers are experiencing delays.

**Environment:**
- SDK: Python intercom_client v2.1.4
- Runtime: Ubuntu 20.04 LTS
- Network: Corporate firewall (no recent changes)

Please advise urgently. We need this resolved ASAP.`,
      priority: "urgent",
      status: "open",
      tags: ["api", "authentication", "urgent", "production-down"],
      requesterName: "Sarah Chen",
      requesterEmail: "sarah.chen@techcorp.io",
      replies: [
        {
          body: "Thank you for reporting this critical issue, Sarah. I've escalated this to our senior API team immediately. I can see from your account logs that the authentication errors started at 2:47 PM UTC today. I'm investigating the root cause now and will update you within 30 minutes with findings. In the meantime, I've bumped this to our highest priority queue.",
          public: true,
        },
        {
          body: "UPDATE: I've identified the issue! It appears your API key's permissions were inadvertently reset during a system maintenance window. I've restored the correct permissions (read/write access to tickets, organizations, and users). Please test again and confirm if you're seeing successful authentication now. This should resolve the 401 errors immediately.",
          public: true,
        },
        {
          body: "Following up - I've also added monitoring alerts to your account to catch permission changes in the future. I'm keeping this ticket open until you confirm everything is working. Again, my apologies for the disruption to your operations.",
          public: true,
        },
      ],
    },

    // Ticket 2: Sales Inquiry
    {
      subject: "Enterprise Plan Evaluation - Custom Quote for 750 Users",
      description: `We're evaluating your platform as part of our company-wide digital transformation initiative. We're migrating from our legacy system and need a comprehensive solution that can scale with our growth.

**Company Background:**
- Industry: Healthcare Technology
- Current Users: 750 support agents across 12 regional offices
- Ticket Volume: ~8,000 tickets/month
- Growth: Planning to expand to 1,200 users within 18 months

**Requirements:**
1. **Compliance:** HIPAA, SOC 2 Type II certification required
2. **Integration:** Must integrate with Salesforce, Epic EMR, and our custom CRM
3. **Customization:** Need white-label solution with our branding
4. **SLA:** 99.99% uptime guarantee, dedicated support
5. **Migration:** Professional services to migrate 10 years of historical data (500K+ tickets)
6. **Training:** Comprehensive onboarding for all users
7. **Security:** SSO with Okta, IP whitelisting, audit logging

**Timeline:**
- Decision deadline: January 31, 2025
- Go-live target: Q2 2025 (April 1, 2025)
- Budget approval: Board meeting December 15, 2024

**Questions:**
- What's your pricing for our user count with the features listed?
- Can you provide 2-3 customer references in healthcare industry?
- What's your typical implementation timeline for accounts our size?
- Do you offer any discount for annual vs. monthly billing?

Looking forward to your proposal. We're evaluating 3 vendors and plan to make a decision by end of month.`,
      priority: "high",
      status: "open",
      tags: ["enterprise-sales", "quote", "healthcare", "opportunity"],
      requesterName: "Michael Rodriguez",
      requesterEmail: "m.rodriguez@healthtech.com",
      replies: [
        {
          body: `Thank you for considering our platform, Michael! I'm excited to work with you on this evaluation. Your requirements align perfectly with our enterprise offerings, and we have extensive experience with healthcare organizations.

**Immediate Next Steps:**
I've prepared a preliminary proposal based on your requirements. Here's a high-level overview:

**Pricing Structure:**
- 750 users: $67,500/year (annual billing, 25% discount vs. monthly)
- Projected 1,200 users: $96,000/year when you scale
- Includes: Enterprise support, white-label, all integrations, migration services

**What's Included:**
✅ HIPAA compliance certification (we're already certified)
✅ SOC 2 Type II audit report (I'll attach)
✅ Dedicated implementation team (4-6 week timeline)
✅ Professional data migration services (up to 1M tickets)
✅ Custom Salesforce & Epic EMR integrations
✅ 40 hours of training (live + recorded sessions)
✅ 99.99% uptime SLA with $10K/month penalty
✅ 24/7 priority phone support

I'm scheduling a call with yourself and your CTO for next Tuesday at 2 PM EST to walk through the detailed proposal and answer technical questions. I'll also connect you with two healthcare clients (similar size) for reference calls.

Looking forward to our conversation!`,
          public: true,
        },
        {
          body: `Michael - I've attached three documents to this email:

1. **Custom Proposal** (PDF) - Detailed pricing, implementation timeline, and deliverables
2. **SOC 2 Type II Audit Report** (PDF) - Our latest security certification
3. **Healthcare Customer Case Study** (PDF) - Similar migration project

**Reference Customers I'm Arranging:**
- St. Mary's Hospital System (950 users, completed migration 2023)
- HealthFirst Insurance (1,200 users, HIPAA environment)

I'll send calendar invites for reference calls once they confirm availability. Let me know if you need anything else before our Tuesday meeting!`,
          public: true,
        },
      ],
    },

    // Ticket 3: Feature Request / Feedback
    {
      subject: "Feature Request: Advanced Keyboard Shortcuts and Bulk Actions",
      description: `I've been using your platform for 6 months now, and overall it's been great! Our team has significantly increased productivity. However, as power users, we've identified several UX improvements that would make a huge difference in our daily workflows.

**Current Pain Points:**

**1. Limited Keyboard Navigation:**
We have agents who handle 50-80 tickets/day, and they rarely use the mouse. Currently, only basic keyboard shortcuts are available (arrow keys, enter). We need comprehensive keyboard shortcuts for:
- Quick ticket assignment: Alt+A
- Status changes: Alt+1 (new), Alt+2 (open), Alt+3 (pending), Alt+4 (solved)
- Priority changes: Ctrl+1 through Ctrl+4
- Add internal note: Alt+N
- Add public reply: Alt+R
- Next/previous ticket: J/K (like Gmail)

**2. Bulk Actions Limited:**
We frequently need to update multiple tickets at once (reassign 20 tickets to a different agent, apply tags to batch, update priority). Current bulk actions are limited and require too many clicks. Would love:
- Multi-select with checkboxes + keyboard (Shift+click for range)
- Bulk edit modal with all properties
- Preview changes before applying
- Undo capability

**3. Saved Filters/Views:**
We recreate the same filter combinations 10+ times per day:
- "My urgent tickets from this week"
- "Unassigned tickets older than 2 days"
- "Pending tickets from VIP customers"

Being able to save these as named views would save hours weekly.

**Impact:**
These improvements would save each agent ~30 minutes/day. With our 25-person team, that's 12.5 hours/day saved = ~3,000 hours/year.

**Questions:**
- Are any of these features on your roadmap?
- Can we request early access if they're in beta?
- Would you consider this for custom development?

Thanks for the amazing platform! These enhancements would make it absolutely perfect for our use case.`,
      priority: "normal",
      status: "open",
      tags: ["feature-request", "ux", "keyboard-shortcuts", "power-users"],
      requesterName: "Jessica Park",
      requesterEmail: "jpark@customersuccess.io",
      replies: [
        {
          body: `Jessica - Thank you for this incredibly detailed and thoughtful feedback! This is exactly the kind of input that helps us build a better product. I'm thrilled to hear you're seeing productivity gains, and I want to address each of your points.

**Great News on Keyboard Shortcuts! 🎉**

You're going to love this: Advanced keyboard shortcuts are actually in active development and scheduled for release in Q1 2025 (March). Your specific examples align perfectly with what we're building:

✅ Quick assignment (Alt+A) - ✓ Confirmed
✅ Status keyboard shortcuts - ✓ Confirmed
✅ Priority shortcuts - ✓ In scope
✅ J/K navigation - ✓ Confirmed (Gmail-style)
✅ Reply shortcuts - ✓ Planned

I'm adding you to our beta testing list. Expect an invite in mid-January to test the feature before public release.

**Bulk Actions Update:**

The enhanced bulk actions you described are on our roadmap for Q2 2025. This includes:
- ✓ Multi-select with keyboard support
- ✓ Preview before applying changes
- ✓ Expanded property editing

**Saved Filters - Coming Sooner!**

This feature is in beta NOW! I'm enabling it for your account immediately. You'll see a new "Save View" button in your filter panel. You can create, name, and quickly switch between saved views. Try it out and let me know what you think!

I'm keeping this ticket open and will update you monthly on the keyboard shortcuts progress. Thanks again for being such an engaged user!`,
          public: true,
        },
      ],
    },

    // Ticket 4: Integration Question
    {
      subject: "Slack Integration Setup - Webhook Events Not Triggering",
      description: `I'm trying to set up the Slack integration to get real-time notifications when new high-priority tickets are created, but the webhooks aren't firing consistently.

**What I've Done:**
1. Created webhook endpoint: https://api.mycompany.com/intercom/webhooks
2. Configured trigger: "When ticket priority is urgent, send webhook"
3. Verified endpoint is publicly accessible (returns 200 OK)
4. Tested webhook manually from your dashboard - works perfectly
5. But automated webhooks are missing ~30% of events

**Technical Details:**
- Endpoint: SSL enabled, valid certificate
- Response time: <100ms average
- Logs: Show 70% of expected webhooks arriving
- Pattern: No obvious pattern (not time-based, not agent-based)

**Expected Behavior:**
Every urgent ticket creation should trigger webhook immediately

**Actual Behavior:**
Roughly 70% of urgent tickets trigger webhook
30% of urgent tickets do NOT trigger webhook (silently fail)

**Example Missing Events:**
- Ticket #12847 created at 2024-11-16 14:23 UTC - no webhook
- Ticket #12855 created at 2024-11-16 15:01 UTC - no webhook
- Ticket #12891 created at 2024-11-16 16:44 UTC - no webhook

**Questions:**
1. Is there rate limiting on webhooks I'm hitting?
2. Are there any filtering/deduplication mechanisms that might suppress events?
3. Can you check your logs for webhook delivery attempts to my endpoint?
4. Is there a retry mechanism if initial delivery fails?

This is impacting our SLA compliance - we rely on these notifications for rapid response to urgent tickets.`,
      priority: "high",
      status: "open",
      tags: ["integration", "webhook", "slack", "bug"],
      requesterName: "David Kim",
      requesterEmail: "david.kim@startup.co",
      replies: [
        {
          body: `David - Thank you for the detailed information! This is super helpful for debugging. I'm investigating this right now and have some initial findings.

**What I Found:**

I reviewed our webhook delivery logs for your account over the past 7 days. Here's what I discovered:

1. **Rate Limiting:** You're hitting our webhook rate limit of 100 requests/minute during peak hours (2-4 PM UTC). When this limit is exceeded, some events are being queued but eventually dropped after 1 hour.

2. **Deduplication:** We have a 60-second deduplication window. If multiple events for the same ticket occur within 60 seconds, only the first webhook is sent (to prevent spam).

3. **Retry Logic:** We attempt 3 retries with exponential backoff (1s, 5s, 15s). If all fail, the event is logged but not re-attempted.

**Missing Events Analysis:**
- Ticket #12847: Webhook sent but your endpoint returned 503 (temporary failure), retries exhausted
- Ticket #12855: Hit rate limit during burst (47 tickets created within 2 minutes)
- Ticket #12891: Duplicate event (status was changed twice within 45 seconds)

**Recommended Solutions:**

I'm implementing immediate fixes for your account:`,
          public: true,
        },
        {
          body: `**Fixes I'm Applying:**

1. **Increased Rate Limit:** Boosting your account from 100/min to 300/min (Enterprise tier)
2. **Extended Retry Window:** Changing retry logic to 5 attempts over 5 minutes
3. **Webhook Queue:** Enabling persistent queue for your account (events held up to 24 hours)

**Additional Recommendations:**

For your endpoint, consider:
- Return 200 immediately, process async (don't wait for Slack API)
- Add request logging to track all incoming webhooks
- Implement idempotency (use event_id to detect duplicates)

**Monitoring Setup:**

I've added webhook health monitoring to your dashboard. You'll now see:
- Delivery success rate
- Failed deliveries with error codes
- Rate limit warnings

Can you test over the next 24 hours and let me know if delivery rate improves to 95%+? I'm keeping this open until we confirm the fix worked.`,
          public: true,
        },
      ],
    },

    // Ticket 5: General Information / Policy Question
    {
      subject: "Data Retention Policy and GDPR Compliance Documentation",
      description: `We're conducting our annual compliance audit, and I need detailed information about your data handling practices for our records. Our company operates in the EU and must comply with GDPR requirements.

**Information Required:**

**1. Data Retention:**
- How long do you retain ticket data after account closure?
- Can we configure custom retention periods?
- What's your backup retention policy?
- How do you handle data deletion requests (Right to be Forgotten)?

**2. Data Processing:**
- Where are EU customer data physically stored? (specific data centers)
- Do you ever transfer data outside the EU? If so, under what safeguards?
- Who are your sub-processors? (need complete list)
- What encryption standards do you use (in transit and at rest)?

**3. Compliance Certifications:**
- Current ISO 27001 certificate
- GDPR compliance documentation
- Data Processing Agreement (DPA) template
- Privacy Shield certification (if applicable)

**4. Data Subject Rights:**
- How can end-users request their data?
- What's your process for data portability requests?
- How do you handle deletion/erasure requests?
- What's your typical response time for these requests?

**5. Security Measures:**
- Incident response procedures
- Breach notification timeline
- Access controls and authentication methods
- Audit logging capabilities

**Timeline:**
Our audit is due December 1, 2024. I need this documentation by November 25 to complete our review.

Can you provide this information or direct me to the appropriate resources? If there's a compliance package or security portal, please share access instructions.

Thank you!`,
      priority: "normal",
      status: "open",
      tags: ["compliance", "gdpr", "data-privacy", "documentation"],
      requesterName: "Emma Thompson",
      requesterEmail: "e.thompson@eurocorp.eu",
      replies: [
        {
          body: `Emma - Thank you for reaching out! I completely understand the importance of your compliance audit. I'm happy to provide all the documentation you need.

**Immediate Access:**

I've created a secure compliance package for you, accessible at: https://trust.intercom.com/eu-compliance-package/ABC123 (valid for 30 days)

This package includes:
✅ ISO 27001 certificate (valid through May 2025)
✅ GDPR compliance documentation
✅ Data Processing Agreement (DPA) template
✅ SOC 2 Type II report
✅ Sub-processor list (updated monthly)
✅ Security whitepaper
✅ Incident response procedures

**Quick Answers to Your Questions:**

**Data Retention:**
- Active accounts: Indefinite (customer controlled)
- Closed accounts: 90 days then permanent deletion
- Backups: 30-day rolling retention
- Custom retention: Yes, configurable in Enterprise plan

**Data Location:**
- EU customers: Frankfurt, Germany data center (AWS eu-central-1)
- Data never leaves EU region for EU customers (guaranteed)
- No US data transfers for EU accounts`,
          public: true,
        },
        {
          body: `**Continuing with your questions:**

**Encryption:**
- In transit: TLS 1.3
- At rest: AES-256
- Key management: AWS KMS with customer managed keys available

**Data Subject Rights Process:**
- Data export: Self-service via dashboard (instant) or API
- Data portability: JSON/CSV export in standard formats
- Deletion requests: Submit via email, processed within 48 hours
- Right to be forgotten: Complete erasure within 30 days (includes backups)

**Sub-Processors:**
- AWS (hosting - eu-central-1)
- SendGrid (email delivery - EU region)
- Stripe (payments - EU entity)
- Cloudflare (CDN - EU nodes)

Full list with DPAs included in compliance package.

**Breach Notification:**
- Internal detection: Real-time monitoring
- Customer notification: Within 24 hours of confirmed breach
- Regulatory notification: Within 72 hours (GDPR requirement)
- Incident log: Available in security portal

Is there any specific documentation I'm missing? I want to ensure you have everything for your audit. Happy to schedule a call with our compliance officer if you have additional questions!`,
          public: true,
        },
      ],
    },
  ]
}

/**
 * Create ticket with replies
 */
async function createTicketWithReplies(
  ticketData: TicketWithReplies,
  index: number
): Promise<void> {
  console.log(`\n${"=".repeat(70)}`)
  console.log(`📝 Creating Ticket ${index + 1}/5`)
  console.log(`${"=".repeat(70)}`)

  try {
    const client = getIntercomAPIClient()

    // Create the ticket
    console.log(`\n🎫 Creating ticket: "${ticketData.subject}"`)
    console.log(`   From: ${ticketData.requesterName} <${ticketData.requesterEmail}>`)
    console.log(`   Priority: ${ticketData.priority} | Status: ${ticketData.status}`)
    console.log(`   Tags: ${ticketData.tags.join(", ")}`)

    const ticket = await client.createTicket({
      subject: ticketData.subject,
      comment: {
        body: ticketData.description,
      },
      priority: ticketData.priority,
      status: ticketData.status,
      tags: ticketData.tags,
      requester_email: ticketData.requesterEmail,
      requester_name: ticketData.requesterName,
    })

    console.log(`   ✅ Ticket created! ID: ${ticket.id}`)

    // Add replies with delay
    for (let i = 0; i < ticketData.replies.length; i++) {
      const reply = ticketData.replies[i]

      console.log(`\n   💬 Adding reply ${i + 1}/${ticketData.replies.length}...`)
      console.log(`      Type: ${reply.public ? "Public" : "Internal"}`)
      console.log(`      Preview: ${reply.body.substring(0, 80)}...`)

      // Small delay between replies to simulate realistic conversation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await client.addTicketComment(ticket.id, reply.body, reply.public)

      console.log("      ✅ Reply added successfully!")
    }

    const subdomain = process.env["INTERCOM_SUBDOMAIN"] || ""
    const ticketLink = `https://${subdomain}.intercom.com/agent/tickets/${ticket.id}`
    console.log(`\n   🔗 View ticket: ${ticketLink}`)
  } catch (error) {
    console.error(`\n   ❌ Error creating ticket ${index + 1}:`, error)
    throw error
  }
}

/**
 * Main function
 */
async function main() {
  console.log("\n╔═══════════════════════════════════════════════════════════════════╗")
  console.log("║     INTERCOM TICKET GENERATOR WITH REPLIES (5 Rich Tickets)       ║")
  console.log("╚═══════════════════════════════════════════════════════════════════╝\n")

  // Validate environment
  if (
    !(
      process.env["INTERCOM_EMAIL"] &&
      process.env["INTERCOM_API_TOKEN"] &&
      process.env["INTERCOM_SUBDOMAIN"]
    )
  ) {
    console.error("❌ Error: Missing required environment variables")
    console.error("   Set: INTERCOM_EMAIL, INTERCOM_API_TOKEN, INTERCOM_SUBDOMAIN\n")
    process.exit(1)
  }

  console.log("🔧 Configuration:")
  console.log(`   Subdomain: ${process.env["INTERCOM_SUBDOMAIN"]}`)
  console.log(`   Email: ${process.env["INTERCOM_EMAIL"]}`)
  console.log("   Tickets to create: 5 (with 1-3 replies each)")

  // Generate tickets
  const tickets = generateTicketsWithReplies()

  console.log("\n📋 Ticket Overview:")
  tickets.forEach((t, i) => {
    console.log(`   ${i + 1}. ${t.subject} (${t.replies.length} replies)`)
  })

  console.log("\n🚀 Starting ticket creation...\n")

  // Create each ticket
  let successCount = 0
  for (let i = 0; i < tickets.length; i++) {
    try {
      await createTicketWithReplies(tickets[i], i)
      successCount++

      // Delay between tickets to respect rate limits
      if (i < tickets.length - 1) {
        console.log("\n   ⏳ Waiting 2 seconds before next ticket...")
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    } catch (_error) {
      console.error(`\n   ❌ Failed to create ticket ${i + 1}, continuing...`)
    }
  }

  // Summary
  console.log(`\n${"=".repeat(70)}`)
  console.log("📊 CREATION SUMMARY")
  console.log(`${"=".repeat(70)}`)
  console.log("   Total Tickets: 5")
  console.log(`   Successfully Created: ${successCount}`)
  console.log(`   Failed: ${5 - successCount}`)
  console.log(`   Success Rate: ${Math.round((successCount / 5) * 100)}%`)
  console.log(`${"=".repeat(70)}\n`)

  if (successCount === 5) {
    console.log("✅ All tickets created successfully with replies!")
    console.log(
      `   View them at: https://${process.env["INTERCOM_SUBDOMAIN"]}.intercom.com/agent/dashboard\n`
    )
    process.exit(0)
  } else {
    console.log("⚠️  Some tickets failed to create. See errors above.\n")
    process.exit(1)
  }
}

// Run
main().catch((error) => {
  console.error("\n❌ Fatal error:", error)
  process.exit(1)
})
