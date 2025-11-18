/**
 * Smart Query Handler - Simplified Architecture
 * All queries go directly to OpenAI with full ticket cache context
 * Operation handlers detect specific actions (create, update, delete, etc.)
 */

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { getZendeskClient, type ZendeskTicket } from "./zendesk-api-client"
import { buildSystemPromptWithContext, invalidateCache } from "./zendesk-cached-ai-context"
import { addConversationEntry, getRecentConversationContext } from "./zendesk-conversation-cache"
import {
  extractEmails,
  extractPriority,
  extractStatus,
  extractTags,
} from "./zendesk-query-patterns"
import { loadTicketCache, refreshTicketCache } from "./zendesk-ticket-cache"

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

/**
 * Main smart query handler - Direct to OpenAI with cached context
 * All queries handled by AI except specific operation handlers
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Function handles multiple operation types with clear sections
export async function handleSmartQuery(
  query: string,
  context?: ConversationContext
): Promise<QueryResponse> {
  const startTime = Date.now()

  try {
    // Check for refresh command (special case - no AI needed)
    if (/^(refresh|update|sync|reload|fetch|pull)\b/i.test(query)) {
      console.log("[SmartQuery] Handling refresh request")
      const refreshResult = await refreshTicketCache()
      invalidateCache() // Clear cached context after refresh
      const processingTime = Date.now() - startTime

      const answer = refreshResult.success
        ? `✅ Cache refreshed successfully!\n\nUpdated with ${refreshResult.ticketCount} tickets from Zendesk.\nMessage: ${refreshResult.message}`
        : `❌ Failed to refresh cache\n\nError: ${refreshResult.error}\n${refreshResult.message}`

      addConversationEntry(query, answer, "cache", refreshResult.success ? 1 : 0)

      return {
        answer,
        source: "cache",
        confidence: refreshResult.success ? 1 : 0,
        processingTime,
      }
    }

    // Check if query is asking to build/send a reply
    const isReplyRequest =
      /\b(build|create|generate|write|send|post)\s+(a\s+)?(reply|response|comment|answer)\b/i.test(
        query
      )

    // Check if query explicitly mentions a ticket number
    const explicitTicketMatch = query.match(/ticket\s*#?(\d+)|#(\d+)/i)
    const explicitTicketId = explicitTicketMatch
      ? Number.parseInt(explicitTicketMatch[1] ?? explicitTicketMatch[2] ?? "", 10) || null
      : null

    // Handle reply requests with explicit ticket number (e.g., "create a reply for ticket #473")
    if (isReplyRequest && explicitTicketId) {
      console.log(`[SmartQuery] Handling reply request for explicit ticket #${explicitTicketId}`)

      try {
        // Fetch the specific ticket first to get its details
        const client = getZendeskClient()
        const ticket = await client.getTicket(explicitTicketId)

        // Call the reply endpoint
        const replyResponse = await fetch("http://localhost:1333/zendesk/api/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId: explicitTicketId }),
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

        const answer = `✅ **Reply Generated and Posted**\n\n**Ticket:** #${replyData.ticketId} - ${ticket.subject}\n\n**Reply Preview:**\n${replyData.replyBody.substring(0, 300)}${replyData.replyBody.length > 300 ? "..." : ""}\n\n**Direct Link:** ${replyData.ticketLink}\n**Comment ID:** ${replyData.commentId}\n\nThe reply has been successfully posted to Zendesk and is now visible to the customer.`
        addConversationEntry(query, answer, "ai", 0.95)

        return {
          answer,
          source: "ai",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error Generating Reply**\n\nFailed to create reply for ticket #${explicitTicketId}\n\nError: ${errorMsg}\n\nPlease verify the ticket number exists and try again.`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
          source: "live",
          confidence: 0,
          processingTime,
        }
      }
    }

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
        const answer = `❌ Cannot find ticket at position ${ticketIndex + 1}.\n\nOnly ${context.lastTickets.length} tickets available in context.`
        addConversationEntry(query, answer, "cache", 0)

        return {
          answer,
          source: "cache",
          confidence: 0,
          processingTime,
        }
      }

      try {
        // Call the reply endpoint
        const replyResponse = await fetch("http://localhost:1333/zendesk/api/reply", {
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

        const answer = `✅ **Reply Generated and Posted**\n\n**Ticket:** #${replyData.ticketId} - ${targetTicket.subject}\n\n**Reply Preview:**\n${replyData.replyBody.substring(0, 300)}${replyData.replyBody.length > 300 ? "..." : ""}\n\n**Direct Link:** ${replyData.ticketLink}\n**Comment ID:** ${replyData.commentId}\n\nThe reply has been successfully posted to Zendesk and is now visible to the customer.`
        addConversationEntry(query, answer, "ai", 0.95)

        return {
          answer,
          source: "ai",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error Generating Reply**\n\nFailed to create reply for ticket #${targetTicket.id}\n\nError: ${errorMsg}\n\nPlease try again or check your Zendesk API connection.`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
          source: "live",
          confidence: 0,
          processingTime,
        }
      }
    }

    // If reply request but no context
    if (isReplyRequest && (!context?.lastTickets || context.lastTickets.length === 0)) {
      const processingTime = Date.now() - startTime
      const answer = `❌ **No Tickets in Context**\n\nTo generate a reply, first show me some tickets:\n• "show top 5 tickets"\n• "list recent tickets"\n\nThen you can say:\n• "build a reply for the first ticket"\n• "send a response to the second ticket"`
      addConversationEntry(query, answer, "cache", 1)

      return {
        answer,
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
      console.log("[SmartQuery] Handling create ticket request - using AI to extract parameters")

      try {
        // Use AI to extract ticket details from natural language
        const { text: ticketJson } = await generateText({
          model: openai("gpt-4o-mini"),
          system: `You are a ticket parameter extractor. Extract ticket creation parameters from natural language.

**CRITICAL**: Output ONLY raw JSON. No markdown code blocks, no backticks, no explanation.

**Output format** (exactly this structure):
{
  "subject": "Clear, concise subject line (max 100 chars)",
  "description": "Detailed description of the issue (200-500 chars if user wants detailed, otherwise match query intent)",
  "priority": "urgent" | "high" | "normal" | "low",
  "requester_email": "email@example.com or null if not specified"
}

**Rules**:
- If user says "at least X characters", make description that length
- If user says "real meta information", include realistic details
- Default priority to "normal" unless specified
- Use "support@zendesk.com" as default requester if none specified
- Make the ticket realistic and professional
- Output ONLY raw JSON - start with { and end with }`,
          prompt: `Extract ticket parameters from: "${query}"`,
          temperature: 0.7,
        })

        // Strip markdown code blocks if AI ignores instructions
        let cleanJson = ticketJson.trim()
        if (cleanJson.startsWith("```")) {
          cleanJson = cleanJson
            .replace(/^```(?:json)?\n?/, "")
            .replace(/\n?```$/, "")
            .trim()
        }

        const ticketParams = JSON.parse(cleanJson)

        // Create the ticket
        const client = getZendeskClient()
        const createdTicket = await client.createTicket({
          subject: ticketParams.subject,
          comment: {
            body: ticketParams.description,
          },
          priority: ticketParams.priority,
          requester_email: ticketParams.requester_email || "support@zendesk.com",
        })

        const subdomain = process.env["ZENDESK_SUBDOMAIN"] || ""
        const ticketLink = `https://${subdomain}.zendesk.com/agent/tickets/${createdTicket.id}`

        const processingTime = Date.now() - startTime

        const answer = `✅ **Ticket Created Successfully**\n\n**Ticket #${createdTicket.id}**\n\n**Subject:** ${createdTicket.subject}\n**Priority:** ${createdTicket.priority}\n**Status:** ${createdTicket.status}\n\n**Description:**\n${ticketParams.description}\n\n**Direct Link:** ${ticketLink}\n\nThe ticket has been created in Zendesk and is ready for agent review.`
        addConversationEntry(query, answer, "live", 0.95)

        return {
          answer,
          source: "live",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        console.error("[SmartQuery] Error creating ticket:", error)

        const answer = `❌ **Error Creating Ticket**\n\nFailed to create ticket from query.\n\nError: ${errorMsg}\n\nPlease try with more explicit parameters like:\n"create ticket about login issues with priority high and description 'User cannot access dashboard'"`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
          source: "live",
          confidence: 0,
          processingTime,
        }
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

      // Extract target status using centralized pattern extractor
      const targetStatus = extractStatus(query) as
        | "new"
        | "open"
        | "pending"
        | "hold"
        | "solved"
        | "closed"
        | null

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

      const targetTicket = context.lastTickets?.[ticketIndex]

      if (!(targetTicket && targetStatus)) {
        const processingTime = Date.now() - startTime
        const answer = `❌ **Cannot Update Status**\n\n${targetTicket ? "Could not determine target status from query." : `Ticket at position ${ticketIndex + 1} not found in context.`}\n\nExamples:\n• "close the first ticket"\n• "mark second ticket as solved"\n• "set status to pending for first ticket"`
        addConversationEntry(query, answer, "cache", 0.5)

        return {
          answer,
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

        const answer = `✅ **Status Updated Successfully**\n\n**Ticket:** #${updatedTicket.id} - ${updatedTicket.subject}\n**Previous Status:** ${targetTicket.status}\n**New Status:** ${updatedTicket.status}\n\n**Direct Link:** ${ticketLink}\n\nThe ticket status has been updated in Zendesk.`
        addConversationEntry(query, answer, "live", 0.95)

        return {
          answer,
          source: "live",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error Updating Status**\n\nFailed to update ticket #${targetTicket.id}\n\nError: ${errorMsg}\n\nPlease check your Zendesk API connection.`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
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
        const answer = "❌ **Invalid Confirmation**\n\nCould not parse ticket ID from confirmation."
        addConversationEntry(query, answer, "cache", 0)

        return {
          answer,
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

          const answer = `✅ **Ticket Marked as Spam**\n\n**Ticket:** #${ticketId}\n\nThe ticket has been marked as spam and the requester has been suspended.\n\n**Note:** This action suspends future tickets from this requester.`
          addConversationEntry(query, answer, "live", 1)

          return {
            answer,
            source: "live",
            confidence: 1,
            processingTime,
          }
        }

        await client.deleteTicket(ticketId)
        const ticketLink = `https://${subdomain}.zendesk.com/agent/tickets/${ticketId}`

        const processingTime = Date.now() - startTime

        const answer = `✅ **Ticket Deleted**\n\n**Ticket:** #${ticketId}\n\nThe ticket has been soft-deleted (can be restored later).\n\nTo restore: "restore ticket #${ticketId}"\n\n**Link:** ${ticketLink}`
        addConversationEntry(query, answer, "live", 1)

        return {
          answer,
          source: "live",
          confidence: 1,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error**\n\nFailed to ${isSpam ? "mark as spam" : "delete"} ticket #${ticketId}\n\nError: ${errorMsg}`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
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

      const targetTicket = context.lastTickets?.[ticketIndex]

      if (!targetTicket) {
        const processingTime = Date.now() - startTime
        const answer = `❌ **Cannot ${isSpamRequest ? "Mark as Spam" : "Delete"}**\n\nTicket at position ${ticketIndex + 1} not found in context.`
        addConversationEntry(query, answer, "cache", 0.5)

        return {
          answer,
          source: "cache",
          confidence: 0.5,
          processingTime,
        }
      }

      const processingTime = Date.now() - startTime

      const answer = `⚠️ **${isSpamRequest ? "Spam Detection" : "Deletion"} Detected**\n\n**Ticket:** #${targetTicket.id} - ${targetTicket.subject}\n\n${isSpamRequest ? "This will mark the ticket as spam and suspend the requester." : "This will soft-delete the ticket (can be restored later)."}\n\n✋ **Confirmation Required**\n\nTo proceed, please explicitly confirm:\n• "${isSpamRequest ? "confirm spam" : "confirm delete"} ticket #${targetTicket.id}"\n\nDestructive operations require explicit confirmation for safety.`
      addConversationEntry(query, answer, "cache", 0.95)

      return {
        answer,
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

      const answer = `✅ **Ticket Merge Detected**\n\n**Available tickets:**\n${context.lastTickets
        ?.slice(0, 5)
        .map((t, i) => `${i + 1}. #${t.id} - ${t.subject}`)
        .join(
          "\n"
        )}\n\nTo merge tickets, specify:\n• Target ticket (where comments will be merged to)\n• Source tickets (will be closed after merge)\n\nExample: "merge tickets 2 and 3 into ticket 1"\n\n⚠️ Merge functionality coming soon!`
      addConversationEntry(query, answer, "cache", 0.85)

      return {
        answer,
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
        const answer = "❌ **Invalid Request**\n\nCould not parse ticket ID from query."
        addConversationEntry(query, answer, "cache", 0)

        return {
          answer,
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

        const answer = `✅ **Ticket Restored**\n\n**Ticket:** #${restoredTicket.id} - ${restoredTicket.subject}\n**Status:** ${restoredTicket.status}\n**Priority:** ${restoredTicket.priority}\n\n**Direct Link:** ${ticketLink}\n\nThe ticket has been successfully restored.`
        addConversationEntry(query, answer, "live", 1)

        return {
          answer,
          source: "live",
          confidence: 1,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error Restoring Ticket**\n\nFailed to restore ticket #${ticketId}\n\nError: ${errorMsg}`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
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
      // Extract target priority using centralized pattern extractor
      const targetPriority = extractPriority(query) as "urgent" | "high" | "normal" | "low" | null

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

      const targetTicket = context.lastTickets?.[ticketIndex]

      if (!(targetTicket && targetPriority)) {
        const processingTime = Date.now() - startTime
        const answer = `❌ **Cannot Update Priority**\n\n${targetTicket ? "Could not determine target priority (urgent/high/normal/low)." : `Ticket at position ${ticketIndex + 1} not found.`}\n\nExamples:\n• "set priority to high for first ticket"\n• "change priority to urgent"`
        addConversationEntry(query, answer, "cache", 0.5)

        return {
          answer,
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

        const answer = `✅ **Priority Updated**\n\n**Ticket:** #${updatedTicket.id} - ${updatedTicket.subject}\n**Previous:** ${targetTicket.priority}\n**New:** ${updatedTicket.priority}\n\n**Direct Link:** ${ticketLink}`
        addConversationEntry(query, answer, "live", 0.95)

        return {
          answer,
          source: "live",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error Updating Priority**\n\nFailed to update ticket #${targetTicket.id}\n\nError: ${errorMsg}`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
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
      console.log("[SmartQuery] Handling assignment request with context")

      // Extract email using centralized pattern extractor
      const emails = extractEmails(query)
      const assigneeEmail = emails[0] || null

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

      const targetTicket = context.lastTickets?.[ticketIndex]

      if (!(targetTicket && assigneeEmail)) {
        const processingTime = Date.now() - startTime
        const answer = `❌ **Cannot Assign Ticket**\n\n${targetTicket ? "Could not find assignee email in query." : `Ticket at position ${ticketIndex + 1} not found.`}\n\nExamples:\n• "assign first ticket to sarah@8lee.ai"\n• "reassign second ticket to john@8lee.ai"`
        addConversationEntry(query, answer, "cache", 0.5)

        return {
          answer,
          source: "cache",
          confidence: 0.5,
          processingTime,
        }
      }

      try {
        const client = getZendeskClient()
        const updatedTicket = await client.assignTicket(targetTicket.id, assigneeEmail)

        const subdomain = process.env["ZENDESK_SUBDOMAIN"] || ""
        const ticketLink = `https://${subdomain}.zendesk.com/agent/tickets/${updatedTicket.id}`

        const processingTime = Date.now() - startTime

        const answer = `✅ **Ticket Assigned Successfully**\n\n**Ticket:** #${updatedTicket.id} - ${updatedTicket.subject}\n**Assigned To:** ${assigneeEmail}\n\n**Direct Link:** ${ticketLink}\n\nThe ticket has been assigned in Zendesk.`
        addConversationEntry(query, answer, "live", 0.95)

        return {
          answer,
          source: "live",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error Assigning Ticket**\n\nFailed to assign ticket #${targetTicket.id} to ${assigneeEmail}\n\nError: ${errorMsg}\n\nPlease check the email address and try again.`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
          source: "live",
          confidence: 0,
          processingTime,
        }
      }
    }

    // Check if query is asking about tags
    const isTagRequest =
      /\b(add|remove|set)\s+tags?\b/i.test(query) &&
      context?.lastTickets &&
      context.lastTickets.length > 0

    if (isTagRequest) {
      console.log("[SmartQuery] Handling tag request with context")

      // Determine operation type
      const isAddOperation = /\b(add)\s+tags?\b/i.test(query)
      const isRemoveOperation = /\b(remove)\s+tags?\b/i.test(query)

      // Extract tags using centralized pattern extractor
      const tags = extractTags(query)

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

      const targetTicket = context.lastTickets?.[ticketIndex]

      if (!(targetTicket && tags.length > 0)) {
        const processingTime = Date.now() - startTime
        const answer = `❌ **Cannot Modify Tags**\n\n${targetTicket ? "Could not find tags in query." : `Ticket at position ${ticketIndex + 1} not found.`}\n\nExamples:\n• "add tag billing to first ticket"\n• "remove tag spam from second ticket"\n• "add tags urgent billing to first ticket"`
        addConversationEntry(query, answer, "cache", 0.5)

        return {
          answer,
          source: "cache",
          confidence: 0.5,
          processingTime,
        }
      }

      try {
        const client = getZendeskClient()
        let updatedTicket: ZendeskTicket

        if (isAddOperation) {
          updatedTicket = await client.addTags(targetTicket.id, tags)
        } else if (isRemoveOperation) {
          updatedTicket = await client.removeTags(targetTicket.id, tags)
        } else {
          throw new Error("Unknown tag operation")
        }

        const subdomain = process.env["ZENDESK_SUBDOMAIN"] || ""
        const ticketLink = `https://${subdomain}.zendesk.com/agent/tickets/${updatedTicket.id}`

        const processingTime = Date.now() - startTime

        const operation = isAddOperation ? "Added" : "Removed"
        const answer = `✅ **Tags ${operation} Successfully**\n\n**Ticket:** #${updatedTicket.id} - ${updatedTicket.subject}\n**Tags ${operation}:** ${tags.join(", ")}\n**Current Tags:** ${updatedTicket.tags.join(", ") || "(none)"}\n\n**Direct Link:** ${ticketLink}\n\nThe ticket tags have been updated in Zendesk.`
        addConversationEntry(query, answer, "live", 0.95)

        return {
          answer,
          source: "live",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error Modifying Tags**\n\nFailed to modify tags for ticket #${targetTicket.id}\n\nError: ${errorMsg}\n\nPlease try again.`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
          source: "live",
          confidence: 0,
          processingTime,
        }
      }
    }

    // Check if query is asking to list users/customers
    const isListUsersRequest =
      /\b(show|list|display|get|view)\s+(all\s+)?(users?|customers?|agents?|people)\b/i.test(query)

    if (isListUsersRequest) {
      console.log("[SmartQuery] Handling list users/customers request")

      try {
        const client = getZendeskClient()
        const users = await client.getUsers()

        const processingTime = Date.now() - startTime

        // Group users by role
        const usersByRole = users.reduce(
          (acc, user) => {
            const roleArray = acc[user.role] ?? []
            roleArray.push(user)
            acc[user.role] = roleArray
            return acc
          },
          {} as Record<string, typeof users>
        )

        // Build formatted answer
        let answer = "✅ **Users & Customers**\n\n"
        answer += `**Total Users:** ${users.length}\n\n`

        // Show breakdown by role
        if (usersByRole["admin"] && usersByRole["admin"].length > 0) {
          answer += `**Admins** (${usersByRole["admin"].length}):\n`
          answer += usersByRole["admin"]
            .slice(0, 10)
            .map((u) => `  • ${u.name} (${u.email}) ${u.active ? "✓" : "✗"}`)
            .join("\n")
          if (usersByRole["admin"].length > 10) {
            answer += `\n  ... and ${usersByRole["admin"].length - 10} more`
          }
          answer += "\n\n"
        }

        if (usersByRole["agent"] && usersByRole["agent"].length > 0) {
          answer += `**Agents** (${usersByRole["agent"].length}):\n`
          answer += usersByRole["agent"]
            .slice(0, 10)
            .map((u) => `  • ${u.name} (${u.email}) ${u.active ? "✓" : "✗"}`)
            .join("\n")
          if (usersByRole["agent"].length > 10) {
            answer += `\n  ... and ${usersByRole["agent"].length - 10} more`
          }
          answer += "\n\n"
        }

        if (usersByRole["end-user"] && usersByRole["end-user"].length > 0) {
          answer += `**End Users / Customers** (${usersByRole["end-user"].length}):\n`
          answer += usersByRole["end-user"]
            .slice(0, 15)
            .map((u) => `  • ${u.name} (${u.email}) ${u.active ? "✓" : "✗"}`)
            .join("\n")
          if (usersByRole["end-user"].length > 15) {
            answer += `\n  ... and ${usersByRole["end-user"].length - 15} more`
          }
          answer += "\n\n"
        }

        answer += "\n✓ Active  ✗ Inactive"

        addConversationEntry(query, answer, "live", 0.95)

        return {
          answer,
          source: "live",
          confidence: 0.95,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error Listing Users**\n\nFailed to fetch users from Zendesk.\n\nError: ${errorMsg}\n\nPlease check your Zendesk API connection.`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
          source: "live",
          confidence: 0,
          processingTime,
        }
      }
    }

    // ========================================================================
    // ALL OTHER QUERIES → DIRECT TO OPENAI WITH FULL CONTEXT
    // ========================================================================

    console.log("[SmartQuery] Sending query to OpenAI with full ticket cache context...")

    // Validate cache exists before AI processing
    const cache = await loadTicketCache()
    if (!cache || cache.tickets.length === 0) {
      const processingTime = Date.now() - startTime
      const answer =
        "❌ No tickets found in cache\n\nTry 'refresh' or 'update' to sync with Zendesk"
      addConversationEntry(query, answer, "cache", 0)

      return {
        answer,
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

    // Add recent conversation history for better AI context
    const conversationHistory = getRecentConversationContext()
    if (conversationHistory) {
      systemPrompt += `\n\n${conversationHistory}`
    }

    const { text: aiAnswer } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: query,
      temperature: 0.7,
    })

    const processingTime = Date.now() - startTime

    // Check if query is asking for ticket list (to populate context for follow-up queries)
    const isTicketListQuery =
      /\b(show|list|display|top|recent|latest|first)\s+\d*\s*(tickets?|issues?)\b/i.test(query)

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

    addConversationEntry(query, aiAnswer, "ai", 0.85)

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

    const answer = `❌ Error processing query\n\nError: ${errorMsg}\n\nPlease try again or ask for help with 'help'.`
    addConversationEntry(query, answer, "live", 0)

    return {
      answer,
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
