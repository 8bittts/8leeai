import { z } from "zod"

/**
 * Zendesk Ticket Creation Schema
 * Validates user contact form submissions before sending to Zendesk
 */
export const ZendeskTicketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),

  requesterEmail: z.string().email("Invalid email address"),

  requesterName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  category: z.enum(["general", "support", "sales", "feedback"]).default("general"),

  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
})

export type ZendeskTicketRequest = z.infer<typeof ZendeskTicketSchema>

/**
 * Zendesk AI Response Suggestion Schema
 * Validates requests for AI-powered response suggestions
 */
export const ZendeskResponseSuggestionSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),

  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),

  tone: z.enum(["professional", "friendly", "formal", "casual"]).default("professional"),

  responseCount: z.number().int().min(1).max(5).default(3),
})

export type ZendeskResponseSuggestionRequest = z.infer<typeof ZendeskResponseSuggestionSchema>

/**
 * Zendesk API Response Types
 */
export const ZendeskTicketResponseSchema = z.object({
  ticketId: z.string(),
  status: z.string(),
  priority: z.string(),
  createdAt: z.string().datetime(),
  requesterEmail: z.string().email(),
  subject: z.string(),
})

export type ZendeskTicketResponse = z.infer<typeof ZendeskTicketResponseSchema>

/**
 * AI Response Suggestion Schema
 */
export const AISuggestedResponseSchema = z.object({
  response: z.string(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
})

export const AISuggestionsResponseSchema = z.object({
  ticketId: z.string(),
  suggestions: z.array(AISuggestedResponseSchema),
  generatedAt: z.string().datetime(),
})

export type AISuggestedResponse = z.infer<typeof AISuggestedResponseSchema>
export type AISuggestionsResponse = z.infer<typeof AISuggestionsResponseSchema>

/**
 * Intercom Conversation Schema
 * Validates conversation start requests
 */
export const IntercomConversationSchema = z.object({
  visitorEmail: z.string().email("Invalid email address"),

  visitorName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  initialMessage: z
    .string()
    .min(5, "Message must be at least 5 characters")
    .max(1000, "Message must be less than 1000 characters"),

  topic: z.enum(["sales", "support", "feedback", "general"]).default("general"),

  pageUrl: z.string().url("Invalid URL").optional(),

  pageTitle: z.string().optional(),
})

export type IntercomConversationRequest = z.infer<typeof IntercomConversationSchema>

/**
 * Intercom Message Schema
 * Validates incoming/outgoing messages
 */
export const IntercomMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),

  content: z
    .string()
    .min(1, "Message content is required")
    .max(1000, "Message must be less than 1000 characters"),

  authorType: z.enum(["visitor", "admin", "ai"]).default("visitor"),

  isFromAi: z.boolean().default(false),
})

export type IntercomMessageRequest = z.infer<typeof IntercomMessageSchema>

/**
 * Intercom AI Message Suggestion Schema
 */
export const IntercomAISuggestionSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),

  conversationHistory: z
    .array(
      z.object({
        author: z.enum(["visitor", "admin"]),
        message: z.string(),
      })
    )
    .min(1, "At least one message is required"),

  messageType: z.enum(["greeting", "response", "suggestion"]).default("response"),

  suggestionCount: z.number().int().min(1).max(3).default(2),
})

export type IntercomAISuggestionRequest = z.infer<typeof IntercomAISuggestionSchema>

/**
 * Intercom Visitor Analytics Schema
 */
export const IntercomVisitorAnalyticsSchema = z.object({
  visitorId: z.string().min(1, "Visitor ID is required"),

  pageUrl: z.string().url("Invalid URL"),

  timeOnPage: z.number().min(0, "Time on page must be non-negative"),

  isReturningVisitor: z.boolean(),

  previousPages: z.array(z.string().url()).optional(),
})

export type IntercomVisitorAnalyticsRequest = z.infer<typeof IntercomVisitorAnalyticsSchema>

/**
 * API Response Types
 */
export const IntercomConversationResponseSchema = z.object({
  conversationId: z.string(),
  visitorEmail: z.string().email(),
  visitorName: z.string(),
  createdAt: z.string().datetime(),
  topic: z.string(),
  status: z.enum(["open", "pending", "closed"]),
})

export type IntercomConversationResponse = z.infer<typeof IntercomConversationResponseSchema>

export const IntercomMessageResponseSchema = z.object({
  messageId: z.string(),
  conversationId: z.string(),
  content: z.string(),
  authorType: z.string(),
  createdAt: z.string().datetime(),
})

export type IntercomMessageResponse = z.infer<typeof IntercomMessageResponseSchema>

export const IntercomAISuggestionsSchema = z.object({
  conversationId: z.string(),
  suggestions: z.array(
    z.object({
      message: z.string(),
      confidence: z.number().min(0).max(1),
      reasoning: z.string(),
    })
  ),
  generatedAt: z.string().datetime(),
})

export type IntercomAISuggestions = z.infer<typeof IntercomAISuggestionsSchema>

/**
 * Intercom Routing Intent Schema
 */
export const IntercomRoutingIntentSchema = z.object({
  conversationHistory: z.array(z.string()).min(1),

  detectedTopic: z.enum(["sales", "support", "feedback", "general"]).optional(),

  suggestedTeam: z.enum(["sales", "support", "feedback", "general"]).optional(),

  handoffContext: z.string().optional(),
})

export type IntercomRoutingIntent = z.infer<typeof IntercomRoutingIntentSchema>
