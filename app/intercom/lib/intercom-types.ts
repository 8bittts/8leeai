/**
 * Intercom API Types
 * Based on MASTER.md specifications and Intercom API v2.11
 */

// ============================================================================
// CHAT INTERFACE TYPES
// ============================================================================

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

export interface SuggestionButton {
  label: string
  query: string
  icon?: string
  description?: string
}

export type QueryIntent =
  | "conversation_list"
  | "conversation_filter"
  | "ticket_list" // Legacy alias
  | "ticket_filter" // Legacy alias
  | "analytics"
  | "user_query"
  | "contact_query"
  | "admin_query"
  | "team_query"
  | "ticket_query"
  | "organization_query" // Legacy alias
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

// ============================================================================
// INTERCOM API DATA STRUCTURES
// ============================================================================

/**
 * Conversation (primary entity in Intercom)
 * MASTER.md lines 128-153
 */
export interface IntercomConversation {
  id: string
  type: "conversation"
  created_at: number
  updated_at: number
  waiting_since: number | null
  snoozed_until: number | null
  source: {
    type: string
    id: string
    delivered_as?: string
    subject?: string
    body?: string
    author?: {
      type: string
      id: string
      name?: string
      email?: string
    }
    attachments?: unknown[]
    url?: string
  }
  contacts: {
    type: "contact.list"
    contacts: Array<{
      type: "contact"
      id: string
      external_id?: string
    }>
  }
  teammates?: {
    type: "admin.list"
    admins?: Array<{
      type: "admin"
      id: string
    }>
  }
  assignee?: {
    type: "admin" | "team" | "nobody_admin"
    id: string
  }
  admin_assignee_id?: string
  team_assignee_id?: string
  open: boolean
  state: "open" | "closed" | "snoozed"
  read: boolean
  priority: boolean
  tags?: {
    type: "tag.list"
    tags: Array<{
      type: "tag"
      id: string
      name: string
    }>
  }
  conversation_rating?: {
    rating?: number
    remark?: string
    created_at?: number
    contact?: {
      type: "contact"
      id: string
    }
    teammate?: {
      type: "admin"
      id: string
    }
  }
  statistics?: {
    type: "conversation_statistics"
    time_to_assignment?: number
    time_to_admin_reply?: number
    time_to_first_close?: number
    time_to_last_close?: number
    median_time_to_reply?: number
    first_contact_reply_at?: number
    first_assignment_at?: number
    first_admin_reply_at?: number
    first_close_at?: number
    last_assignment_at?: number
    last_assignment_admin_reply_at?: number
    last_contact_reply_at?: number
    last_admin_reply_at?: number
    last_close_at?: number
    last_closed_by?: {
      type: string
      id: string
    }
    count_reopens?: number
    count_assignments?: number
    count_conversation_parts?: number
  }
  conversation_parts?: {
    type: "conversation_part.list"
    conversation_parts: IntercomConversationPart[]
    total_count: number
  }
  sla_applied?: {
    type: "conversation_sla_summary"
    sla_name?: string
    sla_status?: "hit" | "missed" | "active" | "cancelled"
  }
  custom_attributes?: Record<string, unknown>
}

/**
 * Conversation Part (message in conversation)
 */
export interface IntercomConversationPart {
  type: "conversation_part"
  id: string
  part_type: "comment" | "note" | "assignment"
  body?: string
  created_at: number
  updated_at: number
  notified_at?: number
  assigned_to?: {
    type: string
    id: string
  }
  author: {
    type: "admin" | "user" | "lead" | "contact"
    id: string
    name?: string
    email?: string
  }
  attachments?: unknown[]
  external_id?: string
  redacted?: boolean
}

/**
 * Ticket (formal support tickets in Intercom)
 * MASTER.md lines 156-184
 */
export interface IntercomTicket {
  type: "ticket"
  id: string
  ticket_type: {
    type: "ticket_type"
    id: string
    name: string
    description?: string
    icon?: string
    archived?: boolean
    created_at?: number
    updated_at?: number
  }
  contacts: Array<{
    type: "contact"
    id: string
    external_id?: string
  }>
  admin_assignee_id?: string
  team_id?: string
  ticket_state: string
  ticket_attributes: {
    _default_title_: string
    _default_description_: string
    [key: string]: unknown
  }
  tags?: string[]
  created_at: number
  updated_at: number
  open: boolean
  state: "submitted" | "open" | "waiting_on_customer" | "resolved"
  snoozed_until?: number
  linked_objects?: {
    type: "list"
    data: unknown[]
    total_count: number
    has_more: boolean
  }
  ticket_parts?: {
    type: "ticket_part.list"
    ticket_parts: unknown[]
    total_count: number
  }
}

/**
 * Ticket Type
 */
export interface IntercomTicketType {
  type: "ticket_type"
  id: string
  name: string
  description?: string
  icon?: string
  archived: boolean
  ticket_type_attributes: {
    type: "ticket_type_attribute.list"
    ticket_type_attributes: Array<{
      id: string
      name: string
      description?: string
      required_to_create?: boolean
      required_to_create_for_contacts?: boolean
      visible_on_create?: boolean
      visible_to_contacts?: boolean
      default?: boolean
      ticket_type_id?: string
      created_at?: number
      updated_at?: number
      archived?: boolean
      input_options?: {
        multiline?: boolean
        max_length?: number
        min_length?: number
      }
      list_items?: unknown[]
      order?: number
      type?: string
    }>
  }
  created_at: number
  updated_at: number
}

/**
 * Contact (users/leads in Intercom)
 * MASTER.md lines 187-206
 */
export interface IntercomContact {
  type: "contact"
  id: string
  workspace_id?: string
  external_id?: string
  role: "user" | "lead"
  email?: string
  phone?: string
  name?: string
  avatar?: string
  owner_id?: string
  social_profiles?: {
    type: "social_profile.list"
    data: Array<{
      type: "social_profile"
      name: string
      url: string
    }>
  }
  has_hard_bounced?: boolean
  marked_email_as_spam?: boolean
  unsubscribed_from_emails?: boolean
  created_at: number
  updated_at: number
  signed_up_at?: number
  last_seen_at?: number
  last_replied_at?: number
  last_contacted_at?: number
  last_email_opened_at?: number
  last_email_clicked_at?: number
  language_override?: string
  browser?: string
  browser_version?: string
  browser_language?: string
  os?: string
  location?: {
    type: "location"
    country?: string
    region?: string
    city?: string
  }
  android_app_name?: string
  android_app_version?: string
  android_device?: string
  android_os_version?: string
  android_sdk_version?: string
  android_last_seen_at?: number
  ios_app_name?: string
  ios_app_version?: string
  ios_device?: string
  ios_os_version?: string
  ios_sdk_version?: string
  ios_last_seen_at?: number
  custom_attributes?: Record<string, unknown>
  tags?: {
    type: "tag.list"
    data: Array<{
      type: "tag"
      id: string
      name: string
      applied_at?: number
    }>
  }
  notes?: {
    type: "note.list"
    data: unknown[]
  }
  companies?: {
    type: "company.list"
    data: unknown[]
  }
  opted_out_subscription_types?: {
    type: "subscription.list"
    data: unknown[]
  }
  opted_in_subscription_types?: {
    type: "subscription.list"
    data: unknown[]
  }
  utm_campaign?: string
  utm_content?: string
  utm_medium?: string
  utm_source?: string
  utm_term?: string
  referrer?: string
}

/**
 * Admin (team members in Intercom)
 * MASTER.md lines 209-218
 */
export interface IntercomAdmin {
  type: "admin"
  id: string
  name: string
  email: string
  job_title?: string
  away_mode_enabled?: boolean
  away_mode_reassign?: boolean
  has_inbox_seat?: boolean
  team_ids?: string[]
  avatar?: {
    type: "avatar"
    image_url?: string
  }
  email_verified?: boolean
}

/**
 * Team
 * MASTER.md lines 209-218
 */
export interface IntercomTeam {
  type: "team"
  id: string
  name: string
  admin_ids?: string[]
  admin_priority_level?: {
    primary_admin_ids?: string[]
    secondary_admin_ids?: string[]
  }
}

/**
 * Tag
 * MASTER.md lines 220-229
 */
export interface IntercomTag {
  type: "tag"
  id: string
  name: string
  applied_at?: number
}

/**
 * Search Query Structure
 * MASTER.md lines 232-265
 */
export interface IntercomSearchQuery {
  query: {
    operator: "AND" | "OR"
    value: Array<{
      field: string
      operator: "=" | "!=" | ">" | "<" | "~" | "^" | "$" | "IN" | "NIN"
      value: string | number | boolean | string[]
    }>
  }
  pagination?: {
    per_page?: number
    starting_after?: string
    page?: number
  }
  sort?: {
    field: string
    order: "asc" | "desc"
  }
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

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

// ============================================================================
// QUERY PROCESSING TYPES
// ============================================================================

export interface QueryPattern {
  pattern: RegExp
  category:
    | "retrieval"
    | "status"
    | "priority"
    | "creation"
    | "deletion"
    | "merge"
    | "assignment"
    | "tags"
    | "collaboration"
    | "reply"
    | "analytics"
    | "organization"
    | "users"
    | "system"
    | "bulk"
  operation: string
  description: string
  requiresId?: boolean
  cacheable: boolean
}

export interface QueryClassification {
  useCache: boolean
  queryType: "discrete" | "complex" | "ai"
  confidence: number
  reasoning?: string
}

export interface QueryResponse {
  answer: string
  source: "cache" | "ai" | "direct"
  confidence: number
  processingTime: number
  metadata?: {
    conversationCount?: number
    ticketCount?: number
    contactCount?: number
    [key: string]: unknown
  }
}

// ============================================================================
// CACHE TYPES
// ============================================================================

export interface CacheEntry {
  conversations: IntercomConversation[]
  tickets: IntercomTicket[]
  contacts: IntercomContact[]
  tags: IntercomTag[]
  teams: IntercomTeam[]
  admins: IntercomAdmin[]
  ticketTypes: IntercomTicketType[]
  lastRefresh: Date
}

export interface CacheStats {
  totalConversations: number
  openConversations: number
  closedConversations: number
  snoozedConversations: number
  conversationsByPriority: Record<string, number>
  conversationsByAssignee: Record<string, number>
  conversationsByTag: Record<string, number>
  ticketCount: number
  contactCount: number
  lastRefreshTime?: string
}
