// Zendesk chat interface types

export type MessageType = "user" | "assistant" | "system" | "error"

export interface ChatMessageMetadata {
  apiEndpoint?: string
  executionTime?: number
  recordCount?: number
  isStreaming?: boolean
  source?: "cache" | "live" | "ai"
  confidence?: number
}

export interface ChatMessage {
  id: string
  type: MessageType
  content: string
  timestamp: Date
  metadata?: ChatMessageMetadata
}

export interface ChatState {
  messages: ChatMessage[]
  currentInput: string
  isLoading: boolean
  commandHistory: string[]
  historyIndex: number
  bootComplete: boolean
  error?: string
}

export interface APICall {
  method: "GET" | "POST" | "PUT" | "DELETE"
  endpoint: string
  params?: Record<string, unknown>
  query?: string
}

export interface APIResponse {
  success: boolean
  data?: unknown
  error?: string
  meta?: {
    count?: number
    pages?: number
    page?: number
    has_more?: boolean
  }
  executionTime?: number
}

export type QueryIntent =
  | "ticket_list"
  | "ticket_filter"
  | "analytics"
  | "user_query"
  | "organization_query"
  | "chat_query"
  | "call_query"
  | "help_article"
  | "automation"
  | "unknown"

export interface ParsedQuery {
  intent: QueryIntent
  apiCall: APICall
  suggestedFormat: "table" | "metrics" | "list" | "timeline"
  confidence: number
  filters: Record<string, unknown>
}

export interface SuggestionButton {
  label: string
  query: string
  icon?: string
  description?: string
}
