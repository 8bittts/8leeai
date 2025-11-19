import { z } from "zod"

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
