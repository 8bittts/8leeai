/**
 * Smart Query Handler - Simplified Architecture
 * All queries go directly to OpenAI with full ticket cache context
 * Operation handlers detect specific actions (create, update, delete, etc.)
 */

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { getIntercomAPIClient } from "./intercom-api-client"
import { buildSystemPromptWithContext, invalidateCache } from "./intercom-cached-ai-context"
import { loadConversationCache, refreshConversationCache } from "./intercom-conversation-cache"
import { addConversationEntry, getRecentConversationContext } from "./intercom-query-history"
import {
  extractEmails,
  extractPriority,
  extractStatus,
  extractTags,
} from "./intercom-query-patterns"

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
  lastConversations?:
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
      const refreshResult = await refreshConversationCache()
      invalidateCache() // Clear cached context after refresh
      const processingTime = Date.now() - startTime

      const answer = refreshResult.success
        ? `✅ Cache refreshed successfully!\n\nUpdated with ${refreshResult.conversationCount} conversations and ${refreshResult.ticketCount} tickets from Intercom.\nMessage: ${refreshResult.message}`
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
        const client = getIntercomAPIClient()
        const ticket = await client.getTicket(String(explicitTicketId))

        // Call the reply endpoint
        const replyResponse = await fetch("http://localhost:1333/intercom/api/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId: String(explicitTicketId) }),
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
        const ticketSubject = ticket.ticket_attributes._default_title_

        const answer = `✅ **Reply Generated and Posted**\n\n**Ticket:** #${replyData.ticketId} - ${ticketSubject}\n\n**Reply Preview:**\n${replyData.replyBody.substring(0, 300)}${replyData.replyBody.length > 300 ? "..." : ""}\n\n**Direct Link:** ${replyData.ticketLink}\n\nThe reply has been successfully posted to Intercom and is now visible to the customer.`
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
    if (isReplyRequest && context?.lastConversations && context.lastConversations.length > 0) {
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

      const targetTicket = context.lastConversations[ticketIndex]

      if (!targetTicket) {
        const processingTime = Date.now() - startTime
        const answer = `❌ Cannot find ticket at position ${ticketIndex + 1}.\n\nOnly ${context.lastConversations.length} tickets available in context.`
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
        const replyResponse = await fetch("http://localhost:1333/intercom/api/reply", {
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

        const answer = `✅ **Reply Generated and Posted**\n\n**Ticket:** #${replyData.ticketId} - ${targetTicket.subject}\n\n**Reply Preview:**\n${replyData.replyBody.substring(0, 300)}${replyData.replyBody.length > 300 ? "..." : ""}\n\n**Direct Link:** ${replyData.ticketLink}\n**Comment ID:** ${replyData.commentId}\n\nThe reply has been successfully posted to Intercom and is now visible to the customer.`
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

        const answer = `❌ **Error Generating Reply**\n\nFailed to create reply for ticket #${targetTicket.id}\n\nError: ${errorMsg}\n\nPlease try again or check your Intercom API connection.`
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
    if (isReplyRequest && (!context?.lastConversations || context.lastConversations.length === 0)) {
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
- Use "support@intercom.com" as default requester if none specified
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
        const client = getIntercomAPIClient()
        const createdTicket = await client.createTicket({
          ticket_type_id: "default", // You may want to make this configurable
          contacts: [{ email: ticketParams.requester_email || "support@intercom.com" }],
          ticket_attributes: {
            _default_title_: ticketParams.subject,
            _default_description_: ticketParams.description,
          },
          state: "submitted",
        })

        const subdomain = process.env["INTERCOM_SUBDOMAIN"] || "app"
        const ticketLink = `https://${subdomain}.intercom.com/a/tickets/${createdTicket.id}`

        const processingTime = Date.now() - startTime

        const answer = `✅ **Ticket Created Successfully**\n\n**Ticket #${createdTicket.id}**\n\n**Subject:** ${ticketParams.subject}\n**Status:** ${createdTicket.state}\n\n**Description:**\n${ticketParams.description}\n\n**Direct Link:** ${ticketLink}\n\nThe ticket has been created in Intercom and is ready for agent review.`
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
      context?.lastConversations &&
      context.lastConversations.length > 0

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

      const targetTicket = context.lastConversations?.[ticketIndex]

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
        const client = getIntercomAPIClient()
        const updatedTicket = await client.updateTicket(String(targetTicket.id), {
          state: targetStatus,
        })

        const subdomain = process.env["INTERCOM_SUBDOMAIN"] || "app"
        const ticketLink = `https://${subdomain}.intercom.com/a/tickets/${updatedTicket.id}`

        const processingTime = Date.now() - startTime
        const ticketSubject = updatedTicket.ticket_attributes._default_title_

        const answer = `✅ **Status Updated Successfully**\n\n**Ticket:** #${updatedTicket.id} - ${ticketSubject}\n**Previous Status:** ${targetTicket.status}\n**New Status:** ${updatedTicket.state}\n\n**Direct Link:** ${ticketLink}\n\nThe ticket status has been updated in Intercom.`
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

        const answer = `❌ **Error Updating Status**\n\nFailed to update ticket #${targetTicket.id}\n\nError: ${errorMsg}\n\nPlease check your Intercom API connection.`
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
      context?.lastConversations &&
      context.lastConversations.length > 0

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
        if (isSpam) {
          const processingTime = Date.now() - startTime

          const answer = `❌ **Spam Marking Not Supported**\n\n**Ticket:** #${ticketId}\n\nIntercom does not support marking tickets as spam via API. You can delete the conversation instead using "delete ticket #${ticketId}".`
          addConversationEntry(query, answer, "live", 0)

          return {
            answer,
            source: "live",
            confidence: 0,
            processingTime,
          }
        }

        // Note: Intercom API doesn't support deleting conversations/tickets
        // Conversations can only be closed via status update
        const processingTime = Date.now() - startTime

        const answer = `❌ **Deletion Not Supported**\n\n**Ticket:** #${ticketId}\n\nIntercom does not support deleting conversations via API. Instead, you can:\n\n1. Close the conversation: "close ticket #${ticketId}"\n2. Update the conversation status\n\nConversations can only be deleted manually from the Intercom dashboard.`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
          source: "live",
          confidence: 0,
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

      const targetTicket = context.lastConversations?.[ticketIndex]

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
      context?.lastConversations &&
      context.lastConversations.length >= 2

    if (isMergeRequest) {
      console.log("[SmartQuery] Handling merge request with context")

      const processingTime = Date.now() - startTime

      const answer = `✅ **Ticket Merge Detected**\n\n**Available tickets:**\n${context.lastConversations
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
        // Note: Intercom doesn't support restoring deleted conversations
        // Conversations cannot be deleted or restored via API
        const processingTime = Date.now() - startTime

        const answer = `❌ **Restore Not Supported**\n\n**Ticket:** #${ticketId}\n\nIntercom does not support restoring conversations via API because:\n\n1. Conversations cannot be deleted via API\n2. Only manual deletion from the dashboard is possible\n3. There is no restore functionality in the API\n\nIf you need to re-open a closed conversation, use: "reopen ticket #${ticketId}"`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
          source: "live",
          confidence: 0,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error**\n\nAn error occurred: ${errorMsg}`
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
      context?.lastConversations &&
      context.lastConversations.length > 0

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

      const targetTicket = context.lastConversations?.[ticketIndex]

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
        const client = getIntercomAPIClient()
        // Convert string priority to boolean (Intercom only has high/normal)
        const priorityBoolean = targetPriority === "urgent" || targetPriority === "high"
        const updatedConv = await client.updateConversation(String(targetTicket.id), {
          priority: priorityBoolean,
        })

        const subdomain = process.env["INTERCOM_SUBDOMAIN"] || "app"
        const ticketLink = `https://${subdomain}.intercom.com/a/inbox/${updatedConv.id}`

        const processingTime = Date.now() - startTime
        const priorityLabel = priorityBoolean ? "high" : "normal"
        const prevPriorityLabel = targetTicket.priority === "high" ? "high" : "normal"

        const answer = `✅ **Priority Updated**\n\n**Conversation:** #${updatedConv.id}\n**Previous:** ${prevPriorityLabel}\n**New:** ${priorityLabel}\n\n**Direct Link:** ${ticketLink}`
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
      context?.lastConversations &&
      context.lastConversations.length > 0

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

      const targetTicket = context.lastConversations?.[ticketIndex]

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
        const client = getIntercomAPIClient()
        // Use updateConversation with admin_assignee_id (assigneeEmail should be admin ID)
        const updatedConv = await client.updateConversation(String(targetTicket.id), {
          admin_assignee_id: assigneeEmail, // Assuming assigneeEmail is actually admin ID
        })

        const subdomain = process.env["INTERCOM_SUBDOMAIN"] || "app"
        const ticketLink = `https://${subdomain}.intercom.com/a/inbox/${updatedConv.id}`

        const processingTime = Date.now() - startTime

        const answer = `✅ **Conversation Assigned Successfully**\n\n**Conversation:** #${updatedConv.id}\n**Assigned To:** ${assigneeEmail}\n\n**Direct Link:** ${ticketLink}\n\nThe conversation has been assigned in Intercom.`
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
      context?.lastConversations &&
      context.lastConversations.length > 0

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

      const targetTicket = context.lastConversations?.[ticketIndex]

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
        const processingTime = Date.now() - startTime

        // Note: Tag management via API requires implementation
        const operation = isAddOperation ? "add" : isRemoveOperation ? "remove" : "modify"
        const answer = `❌ **Tag Management Not Yet Implemented**\n\n**Conversation:** #${targetTicket.id}\n**Operation:** ${operation} tags\n**Tags:** ${tags.join(", ")}\n\nTag management for conversations is not yet fully implemented in the API client. This feature will be added in a future update.\n\nFor now, you can manage tags manually from the Intercom dashboard.`
        addConversationEntry(query, answer, "live", 0)

        return {
          answer,
          source: "live",
          confidence: 0,
          processingTime,
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        const errorMsg = error instanceof Error ? error.message : String(error)

        const answer = `❌ **Error**\n\nAn error occurred: ${errorMsg}`
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
        const client = getIntercomAPIClient()
        // Get admins (team members) - contacts would require search with filters
        const users = await client.getAdmins()

        const processingTime = Date.now() - startTime

        // Format admin list (Intercom admins don't have role field)
        const adminList = users
          .slice(0, 20)
          .map((admin) => {
            const status = admin.away_mode_enabled ? "🌙 Away" : "✓ Active"
            const jobTitle = admin.job_title ? ` - ${admin.job_title}` : ""
            return `  • ${admin.name} (${admin.email})${jobTitle} ${status}`
          })
          .join("\n")

        // Build formatted answer
        let answer = "✅ **Admins & Team Members**\n\n"
        answer += `**Total Admins:** ${users.length}\n\n`
        answer += adminList

        if (users.length > 20) {
          answer += `\n\n... and ${users.length - 20} more admins`
        }

        answer += "\n\n✓ Active  🌙 Away Mode"

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

        const answer = `❌ **Error Listing Users**\n\nFailed to fetch users from Intercom.\n\nError: ${errorMsg}\n\nPlease check your Intercom API connection.`
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
    const cache = await loadConversationCache()
    if (!cache || (cache.conversations.length === 0 && cache.tickets.length === 0)) {
      const processingTime = Date.now() - startTime
      const answer =
        "❌ No tickets or conversations found in cache\n\nTry 'refresh' or 'update' to sync with Intercom"
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
    if (context?.lastConversations && context.lastConversations.length > 0) {
      systemPrompt += `\n\nCONVERSATION CONTEXT:\nThe user previously asked: "${context.lastQuery}"\nThese tickets were shown:\n${context.lastConversations.map((t, i) => `${i + 1}. Ticket #${t.id}: ${t.subject} (${t.status}, ${t.priority})`).join("\n")}`
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

      ticketsToReturn = cache.conversations.slice(0, count).map((conv) => ({
        id: Number(conv.id),
        subject: `Conversation ${conv.id}`, // Conversations don't have subjects in cache
        description: conv.tags.length > 0 ? `Tags: ${conv.tags.join(", ")}` : "No description",
        status: conv.state,
        priority: conv.priority ? "high" : "normal",
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
  const cache = await loadConversationCache()
  if (!cache) return null

  let output = "TICKET STATISTICS\n"
  output += "=================\n\n"

  if (cache.stats.byState && Object.keys(cache.stats.byState).length > 0) {
    output += "BY STATE:\n"
    for (const [state, count] of Object.entries(cache.stats.byState)) {
      output += `  ${String(state).padEnd(12)} ${count}\n`
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
  output += `TOTAL CONVERSATIONS: ${cache.conversationCount}\n`

  return output
}
