/**
 * Smart Query Handler
 * Fast response system with two-tier approach:
 * 1. Instant: Check classifier for discrete answers from cache (<100ms)
 * 2. Fallback: Use OpenAI with cached context for complex queries (2-3s)
 */

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { buildSystemPromptWithContext, invalidateCache } from "./cached-ai-context"
import { classifyQuery } from "./classify-query"
import { loadTicketCache, refreshTicketCache } from "./ticket-cache"
import { getZendeskClient } from "./zendesk-api-client"

interface QueryResponse {
  answer: string
  source: "cache" | "live" | "ai"
  confidence: number
  processingTime: number
  tickets?:
    | Array<{
        id: number
        subject: string
        description: string
        status: string
        priority: string
      }>
    | undefined
}

interface ConversationContext {
  lastTickets?:
    | Array<{
        id: number
        subject: string
        description: string
        status: string
        priority: string
      }>
    | undefined
  lastQuery?: string | undefined
}

interface TicketStats {
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  byAge: {
    lessThan24h: number
    lessThan7d: number
    lessThan30d: number
    olderThan30d: number
  }
}

interface Ticket {
  id: number
  subject: string
  priority: string
  status: string
}

interface TicketCacheData {
  lastUpdated: string
  ticketCount: number
  tickets: Ticket[]
  stats: TicketStats
}

/**
 * Check if query is asking for a refresh
 */
function isRefreshQuery(query: string): boolean {
  return /^(refresh|update|sync|reload|fetch|pull)\b/i.test(query)
}

/**
 * Check if query is asking for help
 */
function isHelpQuery(query: string): boolean {
  return /^(help|commands|what can|how do|available|guide)\b/i.test(query)
}

/**
 * Check if query is general conversation (non-Zendesk)
 * Detects questions about weather, personal feelings, general chitchat, etc.
 */
function isGeneralConversation(query: string): boolean {
  const generalPatterns = [
    // Weather queries
    /\b(weather|temperature|forecast|rain|sunny|cloudy|hot|cold)\b/i,
    // Personal questions
    /\b(how are you|how do you feel|are you okay|what's up|how's it going)\b/i,
    // Time/date queries
    /\b(what time|what day|what date|current time|today's date)\b/i,
    // General knowledge
    /\b(who is|what is|where is|when is|why is|define|explain|tell me about)\b/i,
    // Greetings
    /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/i,
    // Thanks/goodbye
    /\b(thank you|thanks|bye|goodbye|see you|farewell)\b/i,
    // Random/off-topic
    /\b(joke|story|fun fact|random|tell me|sing)\b/i,
  ]

  return generalPatterns.some((pattern) => pattern.test(query))
}

/**
 * Generate professional, zen-like response to general conversation
 * Gently redirects to Zendesk-focused assistance
 */
function generateGeneralResponse(query: string): string {
  const lowerQuery = query.toLowerCase().trim()

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/i.test(lowerQuery)) {
    return `Greetings. I'm your Zendesk Intelligence Assistant, here to help you understand and manage your support tickets with clarity and focus.\n\nHow may I assist you with your Zendesk data today?`
  }

  // How are you / feelings
  if (/\b(how are you|how do you feel|are you okay|what's up|how's it going)\b/i.test(lowerQuery)) {
    return `I'm operating smoothly and ready to serve. My purpose is to bring clarity to your support operations and help you make informed decisions.\n\nWhat insights about your Zendesk tickets can I provide?`
  }

  // Thanks/appreciation
  if (/\b(thank you|thanks)\b/i.test(lowerQuery)) {
    return `You're welcome. It's my purpose to assist you with clarity and precision.\n\nIs there anything else about your support tickets I can help you understand?`
  }

  // Goodbye
  if (/\b(bye|goodbye|see you|farewell)\b/i.test(lowerQuery)) {
    return `Until next time. Remember, I'm here whenever you need insights into your support operations.\n\nType 'help' anytime to see what I can do.`
  }

  // Weather
  if (/\b(weather|temperature|forecast|rain|sunny|cloudy|hot|cold)\b/i.test(lowerQuery)) {
    return `I'm a Zendesk intelligence assistant focused on support ticket analysis. For weather information, I recommend checking weather.com or your local forecast service.\n\nHow can I help you analyze your support tickets instead?`
  }

  // Time/date
  if (/\b(what time|what day|what date|current time)\b/i.test(lowerQuery)) {
    const now = new Date()
    return `The current time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}.\n\nNow, what would you like to know about your Zendesk tickets?`
  }

  // General knowledge / off-topic
  return `I appreciate your curiosity, but my expertise is in analyzing Zendesk support data. I'm here to help you understand ticket patterns, priorities, and trends with clarity and precision.\n\nTry asking:\n• "How many tickets are open?"\n• "What are the most common problems?"\n• "Show me high priority tickets"\n• Or type "help" for more examples`
}

/**
 * Generate help text
 */
function generateHelpText(): string {
  return `**ZENDESK INTELLIGENCE TERMINAL - HELP**

**QUICK START:**
Ask natural language questions about your support tickets. The system uses AI to understand your intent and provide instant answers.

**EXAMPLE QUERIES:**

**📊 Status & Counts**
• How many tickets do we have in total?
• How many tickets are open?
• Show me ticket status breakdown
• What's our pending ticket count?

**🏷️ Priority Analysis**
• How many urgent tickets?
• Show high priority tickets
• What's the priority distribution?

**📅 Time-Based Queries**
• Which tickets were created today?
• Show tickets from the last 7 days
• What tickets are older than 30 days?

**🔍 Content Search (AI-Powered)**
• Find tickets mentioning login issues
• What are the most common problems?
• Analyze ticket trends
• Which tickets need immediate attention?

**🔄 System Commands**
• Type "refresh" or "update" to sync latest ticket data
• Press Ctrl+L or Cmd+K to clear screen

**💡 PRO TIPS:**
• Use ↑↓ arrows to navigate command history
• The system remembers your previous queries
• Complex questions use AI analysis (2-10 seconds)
• Simple counts are instant (<100ms)

**EXAMPLES TO TRY:**
> How many tickets have descriptions longer than 200 words?
> Review all high priority tickets and prioritize them
> What's the breakdown by status?
> Show me recent urgent tickets`
}

/**
 * Format ticket statistics for display
 */
function formatTicketStats(cache: TicketCacheData | null): string {
  if (!cache?.stats) return ""

  let output = "TICKET STATISTICS\n"
  output += "=================\n\n"

  if (cache.stats.byStatus && Object.keys(cache.stats.byStatus).length > 0) {
    output += "BY STATUS:\n"
    for (const [status, count] of Object.entries(cache.stats.byStatus)) {
      output += `  ${String(status).padEnd(12)} ${count}\n`
    }
    output += "\n"
  }

  if (cache.stats.byPriority && Object.keys(cache.stats.byPriority).length > 0) {
    output += "BY PRIORITY:\n"
    for (const [priority, count] of Object.entries(cache.stats.byPriority)) {
      output += `  ${String(priority).padEnd(12)} ${count}\n`
    }
    output += "\n"
  }

  if (cache.stats.byAge) {
    output += "BY AGE:\n"
    output += `  < 24 hours      ${cache.stats.byAge.lessThan24h}\n`
    output += `  < 7 days        ${cache.stats.byAge.lessThan7d}\n`
    output += `  < 30 days       ${cache.stats.byAge.lessThan30d}\n`
    output += `  > 30 days       ${cache.stats.byAge.olderThan30d}\n`
  }

  output += `\nLAST UPDATED: ${cache.lastUpdated}\n`
  output += `TOTAL TICKETS: ${cache.ticketCount}\n`

  return output
}

/**
 * Main smart query handler - Two-tier approach for fast responses
 * Tier 1: Instant answers from cache (discrete queries)
 * Tier 2: AI-powered analysis with cached context (complex queries)
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Function handles multiple query types with clear sections
export async function handleSmartQuery(
  query: string,
  context?: ConversationContext
): Promise<QueryResponse> {
  const startTime = Date.now()

  try {
    // Handle empty or whitespace-only queries
    if (!query || query.trim().length === 0) {
      console.log("[SmartQuery] Handling empty query")
      const processingTime = Date.now() - startTime

      return {
        answer: generateHelpText(),
        source: "cache",
        confidence: 1,
        processingTime,
      }
    }

    // Check for refresh command
    if (isRefreshQuery(query)) {
      console.log("[SmartQuery] Handling refresh request")
      const refreshResult = await refreshTicketCache()
      invalidateCache() // Clear cached context after refresh
      const processingTime = Date.now() - startTime

      return {
        answer: refreshResult.success
          ? `✅ Cache refreshed successfully!\n\nUpdated with ${refreshResult.ticketCount} tickets from Zendesk.\nMessage: ${refreshResult.message}`
          : `❌ Failed to refresh cache\n\nError: ${refreshResult.error}\n${refreshResult.message}`,
        source: "cache",
        confidence: refreshResult.success ? 1 : 0,
        processingTime,
      }
    }

    // Check for help command
    if (isHelpQuery(query)) {
      console.log("[SmartQuery] Handling help request")
      const processingTime = Date.now() - startTime

      return {
        answer: generateHelpText(),
        source: "cache",
        confidence: 1,
        processingTime,
      }
    }

    // Check for general conversation (non-Zendesk queries)
    if (isGeneralConversation(query)) {
      console.log("[SmartQuery] Handling general conversation")
      const processingTime = Date.now() - startTime

      return {
        answer: generateGeneralResponse(query),
        source: "cache",
        confidence: 1,
        processingTime,
      }
    }

    // Check if query is asking for ticket list (to populate context)
    const isTicketListQuery =
      /\b(show|list|display|top|recent|latest|first)\s+\d*\s*(tickets?|issues?)\b/i.test(query)

    // Check if query is asking to build/send a reply
    const isReplyRequest =
      /\b(build|create|generate|write|send|post)\s+(a\s+)?(reply|response|comment)\b/i.test(query)

    // Handle reply requests with context
    if (isReplyRequest && context?.lastTickets && context.lastTickets.length > 0) {
      console.log("[SmartQuery] Handling reply request with context")

      // Extract which ticket (first, second, etc.) or use first by default
      let ticketIndex = 0
      const indexMatch = query.match(/\b(first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th)\b/i)
      if (indexMatch?.[1]) {
        const indexWord = indexMatch[1].toLowerCase()
        const indexMap: Record<string, number> = {
          first: 0,
          "1st": 0,
          second: 1,
          "2nd": 1,
          third: 2,
          "3rd": 2,
          fourth: 3,
          "4th": 3,
          fifth: 4,
          "5th": 4,
        }
        ticketIndex = indexMap[indexWord] ?? 0
      }

      const targetTicket = context.lastTickets[ticketIndex]

      if (!targetTicket) {
        const processingTime = Date.now() - startTime
        return {
          answer: `❌ Cannot find ticket at position ${ticketIndex + 1}.\n\nOnly ${context.lastTickets.length} tickets available in context.`,
          source: "cache",
          confidence: 0,
          processingTime,
        }
      }

      try {
        // Call the reply endpoint
        const replyResponse = await fetch("http://localhost:1333/api/zendesk/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId: targetTicket.id }),
        })

        if (!replyResponse.ok) {
          throw new Error("Failed to generate and post reply")
        }

        const replyData = (await replyResponse.json()) as {
          success: boolean
          ticketId: number
          commentId: number
          replyBody: string
          ticketLink: string
        }

        const processingTime = Date.now() - startTime

        return {
          answer: `✅ **Reply Generated and Posted**\n\n**Ticket:** #${replyData.ticketId} - ${targetTicket.subject}\n\n**Reply Preview:**\n${replyData.replyBody.substring(0, 300)}${replyData.replyBody.length > 300 ? "..." : ""}\n\n**Direct Link:** ${replyData.ticketLink}\n**Comment ID:** ${replyData.commentId}\n\nThe reply has been successfully posted to Zendesk and is now visible to the customer.`,
          source: "ai",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        return {
          answer: `❌ **Error Generating Reply**\n\nFailed to create reply for ticket #${targetTicket.id}\n\nError: ${errorMsg}\n\nPlease try again or check your Zendesk API connection.`,
          source: "live",
          confidence: 0,
          processingTime,
        }
      }
    }

    // If reply request but no context
    if (isReplyRequest && (!context?.lastTickets || context.lastTickets.length === 0)) {
      const processingTime = Date.now() - startTime
      return {
        answer: `❌ **No Tickets in Context**\n\nTo generate a reply, first show me some tickets:\n• "show top 5 tickets"\n• "list recent tickets"\n\nThen you can say:\n• "build a reply for the first ticket"\n• "send a response to the second ticket"`,
        source: "cache",
        confidence: 1,
        processingTime,
      }
    }

    // Check if query is asking to create a ticket
    const isCreateTicketRequest = /\b(create|make|new|open|submit)\s+(a\s+)?(ticket|issue)\b/i.test(
      query
    )

    if (isCreateTicketRequest) {
      console.log("[SmartQuery] Handling create ticket request")

      // Extract subject from query (basic extraction - AI can enhance later)
      const subjectMatch = query.match(
        /\b(?:about|regarding|for|subject:?)\s+"([^"]+)"|titled?\s+"([^"]+)"|:\s*(.+)$/i
      )
      const subject = subjectMatch?.[1] || subjectMatch?.[2] || subjectMatch?.[3] || query

      const processingTime = Date.now() - startTime

      return {
        answer: `✅ **Ticket Creation Detected**\n\nSubject: "${subject.trim()}"\n\nTo create this ticket, I need a few more details:\n• Priority (urgent/high/normal/low)\n• Description of the issue\n• Requester email (optional)\n• Assignee (optional)\n\nExample: "create a ticket about login issues with priority high and description 'User cannot access dashboard after password reset'"`,
        source: "cache",
        confidence: 0.9,
        processingTime,
      }
    }

    // Check if query is asking to update ticket status
    const isUpdateStatusRequest =
      /\b(close|solve|resolve|reopen|set status|update status|mark as|change status)\b/i.test(
        query
      ) &&
      context?.lastTickets &&
      context.lastTickets.length > 0

    if (isUpdateStatusRequest) {
      console.log("[SmartQuery] Handling update status request with context")

      // Extract target status
      let targetStatus: "new" | "open" | "pending" | "hold" | "solved" | "closed" | null = null
      if (/\b(close|closed)\b/i.test(query)) targetStatus = "closed"
      else if (/\b(solve|solved|resolve|resolved)\b/i.test(query)) targetStatus = "solved"
      else if (/\b(open|reopen|reopened)\b/i.test(query)) targetStatus = "open"
      else if (/\b(pending)\b/i.test(query)) targetStatus = "pending"
      else if (/\b(hold)\b/i.test(query)) targetStatus = "hold"
      else if (/\b(new)\b/i.test(query)) targetStatus = "new"

      // Extract which ticket
      let ticketIndex = 0
      const indexMatch = query.match(/\b(first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th)\b/i)
      if (indexMatch?.[1]) {
        const indexWord = indexMatch[1].toLowerCase()
        const indexMap: Record<string, number> = {
          first: 0,
          "1st": 0,
          second: 1,
          "2nd": 1,
          third: 2,
          "3rd": 2,
          fourth: 3,
          "4th": 3,
          fifth: 4,
          "5th": 4,
        }
        ticketIndex = indexMap[indexWord] ?? 0
      }

      const targetTicket = context.lastTickets[ticketIndex]

      if (!(targetTicket && targetStatus)) {
        const processingTime = Date.now() - startTime
        return {
          answer: `❌ **Cannot Update Status**\n\n${targetTicket ? "Could not determine target status from query." : `Ticket at position ${ticketIndex + 1} not found in context.`}\n\nExamples:\n• "close the first ticket"\n• "mark second ticket as solved"\n• "set status to pending for first ticket"`,
          source: "cache",
          confidence: 0.5,
          processingTime,
        }
      }

      try {
        const client = getZendeskClient()
        const updatedTicket = await client.updateTicketStatus(targetTicket.id, targetStatus)

        const subdomain = process.env["ZENDESK_SUBDOMAIN"] || ""
        const ticketLink = `https://${subdomain}.zendesk.com/agent/tickets/${updatedTicket.id}`

        const processingTime = Date.now() - startTime

        return {
          answer: `✅ **Status Updated Successfully**\n\n**Ticket:** #${updatedTicket.id} - ${updatedTicket.subject}\n**Previous Status:** ${targetTicket.status}\n**New Status:** ${updatedTicket.status}\n\n**Direct Link:** ${ticketLink}\n\nThe ticket status has been updated in Zendesk.`,
          source: "live",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        return {
          answer: `❌ **Error Updating Status**\n\nFailed to update ticket #${targetTicket.id}\n\nError: ${errorMsg}\n\nPlease check your Zendesk API connection.`,
          source: "live",
          confidence: 0,
          processingTime,
        }
      }
    }

    // Check if query is asking to delete or mark as spam
    const isDeleteRequest =
      /\b(delete|remove|spam|archive)\s+(ticket|the (first|second|third|fourth|fifth))\b/i.test(
        query
      ) &&
      context?.lastTickets &&
      context.lastTickets.length > 0

    // Check if this is a confirmation for delete/spam
    const isConfirmDelete = /\b(confirm\s+(delete|spam))\s+ticket\s+#?(\d+)\b/i.test(query)

    if (isConfirmDelete) {
      const confirmMatch = query.match(/\b(confirm\s+(delete|spam))\s+ticket\s+#?(\d+)\b/i)
      const ticketId = confirmMatch?.[3] ? Number.parseInt(confirmMatch[3], 10) : null
      const isSpam = confirmMatch?.[2]?.toLowerCase() === "spam"

      if (!ticketId) {
        const processingTime = Date.now() - startTime
        return {
          answer: "❌ **Invalid Confirmation**\n\nCould not parse ticket ID from confirmation.",
          source: "cache",
          confidence: 0,
          processingTime,
        }
      }

      try {
        const client = getZendeskClient()
        const subdomain = process.env["ZENDESK_SUBDOMAIN"] || ""

        if (isSpam) {
          await client.markAsSpam(ticketId)

          const processingTime = Date.now() - startTime

          return {
            answer: `✅ **Ticket Marked as Spam**\n\n**Ticket:** #${ticketId}\n\nThe ticket has been marked as spam and the requester has been suspended.\n\n**Note:** This action suspends future tickets from this requester.`,
            source: "live",
            confidence: 1,
            processingTime,
          }
        }

        await client.deleteTicket(ticketId)
        const ticketLink = `https://${subdomain}.zendesk.com/agent/tickets/${ticketId}`

        const processingTime = Date.now() - startTime

        return {
          answer: `✅ **Ticket Deleted**\n\n**Ticket:** #${ticketId}\n\nThe ticket has been soft-deleted (can be restored later).\n\nTo restore: "restore ticket #${ticketId}"\n\n**Link:** ${ticketLink}`,
          source: "live",
          confidence: 1,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        return {
          answer: `❌ **Error**\n\nFailed to ${isSpam ? "mark as spam" : "delete"} ticket #${ticketId}\n\nError: ${errorMsg}`,
          source: "live",
          confidence: 0,
          processingTime,
        }
      }
    }

    if (isDeleteRequest) {
      console.log("[SmartQuery] Handling delete/spam request with context")

      const isSpamRequest = /\b(spam|junk)\b/i.test(query)

      // Extract which ticket
      let ticketIndex = 0
      const indexMatch = query.match(/\b(first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th)\b/i)
      if (indexMatch?.[1]) {
        const indexWord = indexMatch[1].toLowerCase()
        const indexMap: Record<string, number> = {
          first: 0,
          "1st": 0,
          second: 1,
          "2nd": 1,
          third: 2,
          "3rd": 2,
          fourth: 3,
          "4th": 3,
          fifth: 4,
          "5th": 4,
        }
        ticketIndex = indexMap[indexWord] ?? 0
      }

      const targetTicket = context.lastTickets[ticketIndex]

      if (!targetTicket) {
        const processingTime = Date.now() - startTime
        return {
          answer: `❌ **Cannot ${isSpamRequest ? "Mark as Spam" : "Delete"}**\n\nTicket at position ${ticketIndex + 1} not found in context.`,
          source: "cache",
          confidence: 0.5,
          processingTime,
        }
      }

      const processingTime = Date.now() - startTime

      return {
        answer: `⚠️ **${isSpamRequest ? "Spam Detection" : "Deletion"} Detected**\n\n**Ticket:** #${targetTicket.id} - ${targetTicket.subject}\n\n${isSpamRequest ? "This will mark the ticket as spam and suspend the requester." : "This will soft-delete the ticket (can be restored later)."}\n\n✋ **Confirmation Required**\n\nTo proceed, please explicitly confirm:\n• "${isSpamRequest ? "confirm spam" : "confirm delete"} ticket #${targetTicket.id}"\n\nDestructive operations require explicit confirmation for safety.`,
        source: "cache",
        confidence: 0.95,
        processingTime,
      }
    }

    // Check if query is asking to merge tickets
    const isMergeRequest =
      /\b(merge|combine|consolidate)\s+(tickets?|the (first|second|third))\b/i.test(query) &&
      context?.lastTickets &&
      context.lastTickets.length >= 2

    if (isMergeRequest) {
      console.log("[SmartQuery] Handling merge request with context")

      const processingTime = Date.now() - startTime

      return {
        answer: `✅ **Ticket Merge Detected**\n\n**Available tickets:**\n${context.lastTickets
          .slice(0, 5)
          .map((t, i) => `${i + 1}. #${t.id} - ${t.subject}`)
          .join(
            "\n"
          )}\n\nTo merge tickets, specify:\n• Target ticket (where comments will be merged to)\n• Source tickets (will be closed after merge)\n\nExample: "merge tickets 2 and 3 into ticket 1"\n\n⚠️ Merge functionality coming soon!`,
        source: "cache",
        confidence: 0.85,
        processingTime,
      }
    }

    // Check if query is asking to restore a deleted ticket
    const isRestoreRequest = /\b(restore|undelete|recover)\s+ticket\s+#?(\d+)\b/i.test(query)

    if (isRestoreRequest) {
      const restoreMatch = query.match(/\b(restore|undelete|recover)\s+ticket\s+#?(\d+)\b/i)
      const ticketId = restoreMatch?.[2] ? Number.parseInt(restoreMatch[2], 10) : null

      if (!ticketId) {
        const processingTime = Date.now() - startTime
        return {
          answer: "❌ **Invalid Request**\n\nCould not parse ticket ID from query.",
          source: "cache",
          confidence: 0,
          processingTime,
        }
      }

      try {
        const client = getZendeskClient()
        const restoredTicket = await client.restoreTicket(ticketId)

        const subdomain = process.env["ZENDESK_SUBDOMAIN"] || ""
        const ticketLink = `https://${subdomain}.zendesk.com/agent/tickets/${restoredTicket.id}`

        const processingTime = Date.now() - startTime

        return {
          answer: `✅ **Ticket Restored**\n\n**Ticket:** #${restoredTicket.id} - ${restoredTicket.subject}\n**Status:** ${restoredTicket.status}\n**Priority:** ${restoredTicket.priority}\n\n**Direct Link:** ${ticketLink}\n\nThe ticket has been successfully restored.`,
          source: "live",
          confidence: 1,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        return {
          answer: `❌ **Error Restoring Ticket**\n\nFailed to restore ticket #${ticketId}\n\nError: ${errorMsg}`,
          source: "live",
          confidence: 0,
          processingTime,
        }
      }
    }

    // Check if query is asking to update priority
    const isUpdatePriorityRequest =
      /\b(set|change|update)\s+(priority|prio)\b/i.test(query) &&
      context?.lastTickets &&
      context.lastTickets.length > 0

    if (isUpdatePriorityRequest) {
      // Extract target priority
      let targetPriority: "urgent" | "high" | "normal" | "low" | null = null
      if (/\burgent\b/i.test(query)) targetPriority = "urgent"
      else if (/\bhigh\b/i.test(query)) targetPriority = "high"
      else if (/\bnormal\b/i.test(query)) targetPriority = "normal"
      else if (/\blow\b/i.test(query)) targetPriority = "low"

      // Extract which ticket
      let ticketIndex = 0
      const indexMatch = query.match(/\b(first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th)\b/i)
      if (indexMatch?.[1]) {
        const indexWord = indexMatch[1].toLowerCase()
        const indexMap: Record<string, number> = {
          first: 0,
          "1st": 0,
          second: 1,
          "2nd": 1,
          third: 2,
          "3rd": 2,
          fourth: 3,
          "4th": 3,
          fifth: 4,
          "5th": 4,
        }
        ticketIndex = indexMap[indexWord] ?? 0
      }

      const targetTicket = context.lastTickets[ticketIndex]

      if (!(targetTicket && targetPriority)) {
        const processingTime = Date.now() - startTime
        return {
          answer: `❌ **Cannot Update Priority**\n\n${targetTicket ? "Could not determine target priority (urgent/high/normal/low)." : `Ticket at position ${ticketIndex + 1} not found.`}\n\nExamples:\n• "set priority to high for first ticket"\n• "change priority to urgent"`,
          source: "cache",
          confidence: 0.5,
          processingTime,
        }
      }

      try {
        const client = getZendeskClient()
        const updatedTicket = await client.updateTicketPriority(targetTicket.id, targetPriority)

        const subdomain = process.env["ZENDESK_SUBDOMAIN"] || ""
        const ticketLink = `https://${subdomain}.zendesk.com/agent/tickets/${updatedTicket.id}`

        const processingTime = Date.now() - startTime

        return {
          answer: `✅ **Priority Updated**\n\n**Ticket:** #${updatedTicket.id} - ${updatedTicket.subject}\n**Previous:** ${targetTicket.priority}\n**New:** ${updatedTicket.priority}\n\n**Direct Link:** ${ticketLink}`,
          source: "live",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        return {
          answer: `❌ **Error Updating Priority**\n\nFailed to update ticket #${targetTicket.id}\n\nError: ${errorMsg}`,
          source: "live",
          confidence: 0,
          processingTime,
        }
      }
    }

    // Check if query is asking to assign a ticket
    const isAssignRequest =
      /\b(assign|reassign|give)\s+(ticket|the (first|second|third))\b/i.test(query) &&
      context?.lastTickets &&
      context.lastTickets.length > 0

    if (isAssignRequest) {
      const processingTime = Date.now() - startTime

      return {
        answer: `✅ **Assignment Detected**\n\nTo assign a ticket, I need:\n• Agent ID or email\n• Which ticket to assign\n\nExample: "assign first ticket to agent 123456"\n\n⚠️ Full assignment functionality coming soon! For now, use manual assignment in Zendesk.`,
        source: "cache",
        confidence: 0.8,
        processingTime,
      }
    }

    // Check if query is asking about tags
    const isTagRequest =
      /\b(add|remove|set)\s+tags?\b/i.test(query) &&
      context?.lastTickets &&
      context.lastTickets.length > 0

    if (isTagRequest) {
      const processingTime = Date.now() - startTime

      return {
        answer: `✅ **Tag Operation Detected**\n\nTo modify tags, I need:\n• Which ticket\n• Which tags to add/remove\n\nExamples:\n• "add tags billing,urgent to first ticket"\n• "remove tag spam from second ticket"\n\n⚠️ Tag functionality coming soon!`,
        source: "cache",
        confidence: 0.8,
        processingTime,
      }
    }

    // TIER 1: Try instant answer from classifier
    console.log("[SmartQuery] Checking cache classifier for instant answer...")
    const classified = await classifyQuery(query)

    if (classified.matched && classified.answer) {
      console.log(`[SmartQuery] Instant answer matched (${classified.processingTime}ms)`)
      return {
        answer: classified.answer,
        source: "cache",
        confidence: classified.confidence,
        processingTime: classified.processingTime,
      }
    }

    // TIER 2: Fall back to AI with cached context
    console.log("[SmartQuery] Falling back to AI analysis with cached context...")

    // Validate cache exists before AI processing
    const cache = await loadTicketCache()
    if (!cache || cache.tickets.length === 0) {
      const processingTime = Date.now() - startTime
      return {
        answer: "❌ No tickets found in cache\n\nTry 'refresh' or 'update' to sync with Zendesk",
        source: "cache",
        confidence: 0,
        processingTime,
      }
    }

    // Build AI prompt with cached context (including conversation context if available)
    let systemPrompt = await buildSystemPromptWithContext()

    // If we have conversation context, append it to the system prompt
    if (context?.lastTickets && context.lastTickets.length > 0) {
      systemPrompt += `\n\nCONVERSATION CONTEXT:\nThe user previously asked: "${context.lastQuery}"\nThese tickets were shown:\n${context.lastTickets.map((t, i) => `${i + 1}. Ticket #${t.id}: ${t.subject} (${t.status}, ${t.priority})`).join("\n")}`
    }

    const { text: aiAnswer } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: query,
      temperature: 0.7,
    })

    const processingTime = Date.now() - startTime

    // If this was a ticket list query, extract and return ticket data
    let ticketsToReturn: QueryResponse["tickets"]

    if (isTicketListQuery && cache) {
      // Extract number of tickets requested (default to 5)
      const countMatch = query.match(/\b(top|first|show|list)\s+(\d+)\s+tickets?\b/i)
      const count = countMatch ? Number.parseInt(countMatch[2] || "5", 10) : 5

      ticketsToReturn = cache.tickets.slice(0, count).map((t) => ({
        id: t.id,
        subject: t.subject,
        description: t.description,
        status: t.status,
        priority: t.priority,
      }))
    }

    return {
      answer: aiAnswer,
      source: "ai",
      confidence: 0.85,
      processingTime,
      tickets: ticketsToReturn,
    }
  } catch (error) {
    const processingTime = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : String(error)

    console.error("[SmartQuery] Error:", error)

    return {
      answer: `❌ Error processing query\n\nError: ${errorMsg}\n\nPlease try again or use 'help' for available commands.`,
      source: "live",
      confidence: 0,
      processingTime,
    }
  }
}

/**
 * Quick stat lookup from cache (no AI needed)
 */
export async function getQuickStats(): Promise<string | null> {
  const cache = await loadTicketCache()
  if (!cache) return null

  return formatTicketStats(cache)
}
