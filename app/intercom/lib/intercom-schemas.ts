import { z } from "zod"

/**
 * Intercom Ticket Creation Schema
 * Validates user contact form submissions before sending to Intercom
 */
export const IntercomTicketSchema = z.object({
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

export type IntercomTicketRequest = z.infer<typeof IntercomTicketSchema>

/**
 * Intercom AI Response Suggestion Schema
 * Validates requests for AI-powered response suggestions
 */
export const IntercomResponseSuggestionSchema = z.object({
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

export type IntercomResponseSuggestionRequest = z.infer<typeof IntercomResponseSuggestionSchema>

/**
 * Intercom API Response Types
 */
export const IntercomTicketResponseSchema = z.object({
  ticketId: z.string(),
  status: z.string(),
  priority: z.string(),
  createdAt: z.string().datetime(),
  requesterEmail: z.string().email(),
  subject: z.string(),
})

export type IntercomTicketResponse = z.infer<typeof IntercomTicketResponseSchema>

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
