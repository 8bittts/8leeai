#!/usr/bin/env bun

/**
 * Test script to send 10 test emails for both Zendesk and Intercom
 * Directly sends emails via Resend to verify email integration is working
 * Usage: bun scripts/test-contact-forms.ts [zendesk|intercom|both]
 */

import { Resend } from "resend"

interface EmailData {
  name: string
  email: string
  message: string
}

// Resend instance with API key from environment
// biome-ignore lint/complexity/useLiteralKeys: Required for TypeScript strict mode
const resend = new Resend(process.env["RESEND_API_KEY"])

// Generate test email data
function generateTestEmail(index: number): EmailData {
  return {
    name: `Test User ${index}`,
    email: `testuser${index}@example.com`,
    message: `This is an automated test submission #${index} to verify email integration is working correctly.`,
  }
}

async function sendZendeskEmail(data: EmailData): Promise<boolean> {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "jleekun@gmail.com",
      replyTo: data.email,
      subject: `[Zendesk] Support Request from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 10px; border-radius: 3px;">${data.message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Reply to this email to respond directly to the visitor.
          </p>
        </div>
      `,
    })

    if (response.error) {
      console.error(`❌ Zendesk Email #${data.name.split(" ")[2]}: Failed - ${response.error.message}`)
      return false
    }

    console.log(
      `✅ Zendesk Email #${data.name.split(" ")[2]}: Success (Message ID: ${response.data?.id})`
    )
    return true
  } catch (error) {
    console.error(
      `❌ Zendesk Error:`,
      error instanceof Error ? error.message : error
    )
    return false
  }
}

async function sendIntercomEmail(data: EmailData): Promise<boolean> {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "jleekun@gmail.com",
      replyTo: data.email,
      subject: `[Intercom] Support Request from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 10px; border-radius: 3px;">${data.message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Reply to this email to respond directly to the visitor.
          </p>
        </div>
      `,
    })

    if (response.error) {
      console.error(`❌ Intercom Email #${data.name.split(" ")[2]}: Failed - ${response.error.message}`)
      return false
    }

    console.log(
      `✅ Intercom Email #${data.name.split(" ")[2]}: Success (Message ID: ${response.data?.id})`
    )
    return true
  } catch (error) {
    console.error(
      `❌ Intercom Error:`,
      error instanceof Error ? error.message : error
    )
    return false
  }
}

async function main() {
  const target = process.argv[2] || "both"
  const validTargets = ["zendesk", "intercom", "both"]

  if (!validTargets.includes(target)) {
    console.error(`Invalid target: ${target}. Valid options: ${validTargets.join(", ")}`)
    process.exit(1)
  }

  if (!process.env["RESEND_API_KEY"]) {
    console.error("❌ RESEND_API_KEY environment variable is not set")
    process.exit(1)
  }

  console.log("\n🧪 Email Integration Test Suite")
  console.log("================================\n")
  console.log(`📍 Target: ${target.toUpperCase()}`)
  console.log(`🔑 Using Resend API for email delivery\n`)

  let totalSuccess = 0
  let totalFailed = 0

  // Test Zendesk emails
  if (target === "zendesk" || target === "both") {
    console.log("📧 Sending 10 test emails to Zendesk...\n")
    for (let i = 1; i <= 10; i++) {
      const data = generateTestEmail(i)
      const success = await sendZendeskEmail(data)
      if (success) totalSuccess++
      else totalFailed++
      // Small delay between submissions to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
    console.log()
  }

  // Test Intercom emails
  if (target === "intercom" || target === "both") {
    console.log("📧 Sending 10 test emails to Intercom...\n")
    for (let i = 1; i <= 10; i++) {
      const data = generateTestEmail(i)
      const success = await sendIntercomEmail(data)
      if (success) totalSuccess++
      else totalFailed++
      // Small delay between submissions to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
    console.log()
  }

  // Summary
  console.log("📊 Test Results Summary")
  console.log("======================")
  console.log(`✅ Successful emails: ${totalSuccess}`)
  console.log(`❌ Failed emails: ${totalFailed}`)
  const total = totalSuccess + totalFailed
  const successRate = total > 0 ? ((totalSuccess / total) * 100).toFixed(1) : "0"
  console.log(`📈 Success Rate: ${successRate}%\n`)

  if (totalFailed === 0 && totalSuccess > 0) {
    console.log("🎉 All emails sent successfully!")
    console.log(
      "✨ Check your Zendesk and Intercom email inboxes to verify delivery.\n"
    )
  } else if (totalFailed > 0) {
    console.log(`⚠️  ${totalFailed} email(s) failed. Check the error messages above.\n`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
