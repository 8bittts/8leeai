# Intercom Intelligence Portal - MASTER TECHNICAL DOCUMENTATION

**Version:** 4.0 (Consolidated Master Reference)
**Status:** PLANNING - Complete Redesign
**Last Updated:** 2025-11-18

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Current Implementation (v2.0)](#current-implementation-v20)
3. [Planned Redesign (v3.0)](#planned-redesign-v30)
4. [Complete API Reference](#complete-api-reference)
5. [Technical Architecture](#technical-architecture)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Advanced Features](#advanced-features)
8. [API Best Practices](#api-best-practices)
9. [Integration Opportunities](#integration-opportunities)
10. [Success Metrics & Deliverables](#success-metrics--deliverables)

---

## EXECUTIVE SUMMARY

A comprehensive Intercom integration that demonstrates mastery of the ENTIRE Intercom API ecosystem. This is not a basic contact form - this is a full-featured customer support intelligence platform showcasing advanced API orchestration, AI-powered assistance, and real-time customer engagement.

**Strategic Goal:** Prove exceptional API integration skills and system architecture expertise through comprehensive implementation of Intercom's complete API surface (80+ endpoints across 19 API categories).

**Key Transformation:**
- **Current:** Simple email-based contact form (v2.0)
- **Planned:** Comprehensive API integration mirroring Zendesk Intelligence Portal success

---

## CURRENT IMPLEMENTATION (v2.0)

### Status: [PASS] Complete and Production-Verified

The current implementation uses a simplified email-based approach providing contact registration and support routing through email forwarding.

### Architecture: Email-Based Contact Flow

```
User submits contact form on /intercom
         ↓
Contact data validated (name, email, message)
         ↓
Email composed and sent via Resend API
         ↓
Email arrives at: amihb4cq@8lee.intercom-mail.com
         ↓
Intercom automatically creates conversation
         ↓
Support team receives contact in Inbox
```

### Why Email Instead of REST API Initially?

**Original Approach** (Attempted):
- Used `/conversations` and `/messages` REST endpoints
- Required complex payload structure
- API validation strict and error-prone
- Multiple failed attempts with 400/404 errors

**Current Approach** (Working):
- Uses Intercom's built-in email forwarding
- Email automatically creates conversation
- Simple, reliable, time-tested feature
- No API complexity or validation issues

### Current Implementation Files

**Contact Form Component:**
- File: `app/intercom/components/intercom-contact-form.tsx`
- Features: Name, email, message validation
- UX: Loading states, success/error feedback, terminal aesthetic

**API Endpoint:**
- File: `app/api/contact/intercom/route.ts`
- Method: POST to `/api/contact/intercom`
- Validation: Zod schema (name, email, message)
- Email Service: Resend API to `amihb4cq@8lee.intercom-mail.com`

**Page Integration:**
- File: `app/intercom/page.tsx`
- Features: Terminal boot sequence, command prompt, contact form
- Access: Type `contact` command to open form

### Current Features

**Contact Form:**
- Required fields: Name, Email, Message
- Email format validation
- Submit button disabled until valid
- Terminal aesthetic (green/black, monospace)
- Auto-close success message

**Environment Variables:**
```bash
RESEND_API_KEY=<your_resend_api_key>
```

### Current Status Summary

- **Complexity:** Low
- **Maintenance:** Minimal
- **Reliability:** High
- **API Coverage:** 0 endpoints (email-based)
- **Confidence Level:** Production Verified [PASS]

---

## PLANNED REDESIGN (v3.0)

### Vision: Terminal-Style Intelligence Interface

Natural language interface for comprehensive Intercom operations:
- Query conversations, contacts, and companies
- AI-powered response generation
- Real-time conversation management
- Advanced search and filtering
- Analytics and insights
- Automated workflows

### Core Philosophy

**Zendesk Parallel:** Mirror the comprehensive Zendesk Intelligence Portal architecture
- Natural language query processing
- Smart caching for performance
- Two-tier query classification (cache vs AI)
- Context-aware conversations
- Comprehensive metadata support

### Comprehensive Feature Plan

#### Phase 1: Core Conversation Management ⭐
**Goal:** Complete conversation lifecycle management

**Features:**
1. **List Conversations**
   - Query: "show me all conversations"
   - Query: "list open conversations"
   - Query: "show closed conversations from last week"

2. **Search Conversations**
   - Query: "find conversations about billing"
   - Query: "show high priority conversations"
   - Query: "conversations assigned to Sarah"
   - Advanced filters: state, priority, assignee, tags, dates

3. **Retrieve Conversation Details**
   - Query: "show conversation 12345"
   - Query: "details for first conversation"
   - Display: full thread, participants, timestamps, tags, state

4. **Reply to Conversations**
   - Query: "reply to conversation 12345: Thanks for reaching out!"
   - Query: "send message to first conversation"
   - AI-powered response suggestions

5. **Conversation Actions**
   - Query: "close conversation 12345"
   - Query: "assign conversation 12345 to Sarah"
   - Query: "tag conversation 12345 as billing"
   - Query: "snooze conversation for 2 hours"

#### Phase 2: Contact & Company Management
**Goal:** Comprehensive contact database operations

**Features:**
1. **Contact Operations**
   - Create: "create contact john@example.com"
   - Search: "find contacts named John"
   - Update: "update contact email to new@example.com"
   - Tag: "tag contact as VIP"
   - Merge: "merge duplicate contacts"

2. **Company Operations**
   - Create: "create company Acme Corp"
   - Link: "attach contact to company Acme"
   - Search: "find companies with >100 employees"
   - List: "show all contacts at Acme Corp"

3. **Contact Insights**
   - Query: "how many contacts do we have?"
   - Query: "show VIP contacts"
   - Query: "contacts created this week"
   - Query: "contacts by segment"

#### Phase 3: Advanced Search & Analytics
**Goal:** Powerful data exploration

**Features:**
1. **Multi-Criteria Search**
   - Combine filters: state, priority, assignee, tags, dates
   - Full-text search across conversations
   - Contact attribute search
   - Company search

2. **Analytics Queries**
   - Query: "how many open tickets?"
   - Query: "average response time"
   - Query: "most tagged conversations"
   - Query: "conversations by team"
   - Query: "busiest admins"

3. **Trend Analysis**
   - Query: "conversation volume by day"
   - Query: "response time trends"
   - Query: "resolution rate"

#### Phase 4: AI-Powered Intelligence ⭐
**Goal:** Demonstrate AI/ML capabilities

**Features:**
1. **Smart Response Generation**
   - Context-aware reply suggestions
   - Multiple tone options (professional, friendly, technical)
   - Confidence scoring
   - Reasoning explanation

2. **Intelligent Search**
   - Natural language query understanding
   - Intent detection
   - Query classification
   - Semantic search

3. **Automated Insights**
   - Conversation sentiment analysis
   - Topic extraction
   - Priority prediction
   - Response urgency detection

4. **Proactive Suggestions**
   - Next action recommendations
   - Similar conversation detection
   - Knowledge base article suggestions

#### Phase 5: Team & Workflow Management
**Goal:** Operational efficiency features

**Features:**
1. **Team Operations**
   - Query: "list all teams"
   - Query: "show team capacity"
   - Query: "assign to support team"

2. **Admin Management**
   - Query: "list all admins"
   - Query: "who is available?"
   - Query: "admin workload"

3. **Assignment & Routing**
   - Auto-assignment rules
   - Load balancing
   - Skill-based routing
   - Priority escalation

#### Phase 6: Tags & Organization
**Goal:** Powerful categorization system

**Features:**
1. **Tag Management**
   - Create tags dynamically
   - Tag conversations, contacts, companies
   - Tag analytics and usage

2. **Smart Tagging**
   - Auto-tagging based on content
   - Tag suggestions
   - Tag hierarchies

3. **Organization Queries**
   - Query: "most used tags"
   - Query: "conversations with multiple tags"
   - Query: "tag distribution"

#### Phase 7: Knowledge Base Integration
**Goal:** Help center intelligence

**Features:**
1. **Article Search**
   - Query: "search knowledge base for password reset"
   - Query: "suggest articles for this conversation"

2. **Article Management**
   - Create articles from conversations
   - Update articles
   - Article analytics

3. **Collections & Sections**
   - Browse collection hierarchy
   - Article categorization

#### Phase 8: Custom Data & Events
**Goal:** Advanced tracking and attributes

**Features:**
1. **Custom Attributes**
   - Define custom contact fields
   - Set company attributes
   - Track custom data

2. **Event Tracking**
   - Track user actions
   - Product usage events
   - Conversion tracking
   - Event analytics

#### Phase 9: Ticketing System
**Goal:** Complete ticket management

**Features:**
1. **Ticket Operations**
   - Create tickets
   - Update ticket state
   - Assign tickets
   - Search tickets

2. **Ticket Types**
   - Custom ticket types
   - Type-specific attributes
   - SLA configuration

3. **Ticket Analytics**
   - Open ticket count
   - Resolution time
   - Ticket distribution

#### Phase 10: Real-time & Webhooks
**Goal:** Live updates and integrations

**Features:**
1. **Webhook Configuration**
   - Subscribe to events
   - Process real-time updates
   - Event filtering

2. **Live Dashboard**
   - Real-time conversation updates
   - New contact notifications
   - Ticket creation alerts

3. **Event Processing**
   - Automated workflows
   - Trigger actions on events
   - Integration with other systems

---

## COMPLETE API REFERENCE

### API Version: REST API v2.14 (November 2025)

### Authentication & Rate Limits

#### Authentication Methods

**Bearer Token Authentication:**
```
Authorization: Bearer <access_token>
```

**Use Cases:**
- **Private Apps**: Access your own Intercom workspace data using access tokens
- **Public Apps**: Use OAuth for accessing other people's Intercom data

**OAuth Flow**: Available for public apps requiring multi-workspace access

#### Rate Limits

**Private Apps:**
- 10,000 API calls per minute per app
- 25,000 API calls per minute per workspace

**Default Rate Limit:**
- 1,000 requests per minute
- Distributed over 10-second periods (166 operations per 10 seconds)

**Rate Limit Exceeded Response:**
- HTTP Status: `429 Too Many Requests`

**Important Notes:**
- Rate limits apply only to REST API calls
- Webhook requests are NOT rate limited

---

### Core API Categories

#### 1. Contacts & People Management
- **Contacts** - Unified contact model (users, leads, visitors)
- **Users** - Authenticated users of your product
- **Leads** - Potential customers who haven't signed up yet
- **Visitors** - Anonymous website visitors
- **Companies** - Organization-level data associated with contacts

#### 2. Conversations & Messaging
- **Conversations** - Customer communication threads
- **Messages** - Outbound messages to contacts
- **Conversation Parts** - Individual messages/notes within conversations
- **Tickets** - Support ticket management system

#### 3. Knowledge Base & Content
- **Articles** - Help center documentation
- **Collections** - Groupings of articles (up to 3 levels deep)
- **Sections** - (Deprecated - use Collections)
- **News** - Product announcements and updates
- **Newsfeeds** - Targeted collections of news items

#### 4. Team & Workspace
- **Admins** - Team members with workspace access
- **Teams** - Groups of admins
- **Activity Logs** - Admin activity tracking

#### 5. Data & Attributes
- **Data Attributes** - Metadata for contacts, companies, conversations
- **Custom Attributes** - User-defined fields
- **Custom Objects** - Complex custom data models with relationships
- **Data Events** - Track custom user behaviors and actions

#### 6. Automation & Intelligence
- **Fin AI Agent** - AI-powered customer service bot
- **Macros** - Saved reply templates with actions
- **Workflows** - Automation rules and routing
- **Assignment Rules** - Automatic conversation routing

#### 7. Organization & Categorization
- **Tags** - Labels for contacts, companies, conversations
- **Segments** - Dynamic groups of contacts
- **Subscription Types** - Email/SMS subscription preferences

#### 8. Communication Channels
- **Messenger** - In-app chat widget
- **Phone Switch** - Phone call deflection to Messenger
- **SMS** - SMS messaging and consent management

#### 9. Analytics & Reporting
- **Counts** - Global statistics and metrics
- **Statistics** - Conversation-level metrics
- **Data Export** - Bulk data exports to JSON/CSV/S3

#### 10. Developer Tools
- **Webhooks** - Real-time event notifications
- **Search** - Advanced filtering and querying
- **Pagination** - Cursor-based and standard pagination

---

### 1. CONVERSATIONS API ⭐ CORE
**Base:** `https://api.intercom.io/conversations`

#### Endpoints:
| Endpoint | Method | Purpose | Priority |
|----------|--------|---------|----------|
| `/conversations` | POST | Create new conversation | HIGH |
| `/conversations` | GET | List all conversations | HIGH |
| `/conversations/{id}` | GET | Retrieve specific conversation | HIGH |
| `/conversations/search` | POST | Advanced search with filters | HIGH |
| `/conversations/{id}/reply` | POST | Reply to conversation | HIGH |
| `/conversations/{id}/parts` | POST | Add message parts | MEDIUM |
| `/conversations/{id}/tags` | POST | Tag conversation | MEDIUM |
| `/conversations/{id}` | PUT | Manage conversation state | HIGH |
| `/conversations/{id}/run_assignment_rules` | POST | Trigger assignment rules | MEDIUM |
| `/conversations/{id}/redact` | POST | Redact conversation parts | LOW |

#### Conversation States:
- `open` - Active conversation
- `closed` - Resolved conversation
- `snoozed` - Temporarily hidden (with `snoozed_until` timestamp)

#### Key Attributes:
- `conversation_parts` - Array of messages/notes
- `source` - Origin of conversation (web, mobile, email, API, etc.)
- `state` - open/closed/snoozed
- `read` - Whether contact has read the conversation
- `waiting_since` - Timestamp waiting for response
- `snoozed_until` - When snoozed conversation reopens
- `admin_assignee_id` - Assigned admin ID
- `team_assignee_id` - Assigned team ID
- `tags` - Array of tags
- `priority` - Whether marked as priority
- `statistics` - Performance metrics object:
  - `time_to_assignment` - Seconds
  - `time_to_admin_reply` - Seconds
  - `time_to_first_close` - Seconds
  - `median_time_to_reply` - Seconds
  - `count_reopens` - Number of times reopened
  - `count_assignments` - Number of assignments
  - `count_conversation_parts` - Total parts count

---

### 2. CONTACTS API ⭐ CORE
**Base:** `https://api.intercom.io/contacts`

#### Core Operations:
- `POST /contacts` - Create a contact
- `GET /contacts/{id}` - Retrieve a contact by ID
- `PUT /contacts/{id}` - Update a contact
- `DELETE /contacts/{id}` - Delete a contact
- `GET /contacts` - List all contacts (paginated)

#### Advanced Operations:
- `POST /contacts/search` - Search contacts with filters
  - Supports AND/OR operators
  - Complex nested queries
  - Pagination and sorting
  - Most contact fields are searchable

- `POST /contacts/merge` - Merge two contacts
  - Preserves unique identifiers
  - Combines contact history

- `POST /contacts/{id}/archive` - Archive a contact
- `POST /contacts/{id}/unarchive` - Unarchive a contact

#### Key Attributes:
- `external_id` - Your custom identifier
- `email` - Contact email address
- `phone` - Contact phone number
- `name` - Contact full name
- `role` - Type: user, lead, or visitor
- `signed_up_at` - Timestamp of signup
- `last_seen_at` - Last activity timestamp
- `custom_attributes` - Object of custom fields
- `tags` - Array of tag objects
- `companies` - Array of associated companies

---

### 3. COMPANIES API
**Base:** `https://api.intercom.io/companies`

#### Core Operations:
- `POST /companies` - Create a company
- `GET /companies/{id}` - Retrieve a company
- `PUT /companies/{id}` - Update a company
- `DELETE /companies/{id}` - Delete a company
- `GET /companies` - List all companies
- `GET /companies/scroll` - Scroll over all companies (pagination)

#### Advanced Operations:
- `POST /companies/search` - Search companies with filters

#### Key Attributes:
- `company_id` - Your custom company identifier
- `name` - Company name
- `plan` - Subscription plan name
- `monthly_spend` - Revenue metric
- `user_count` - Number of associated users
- `size` - Company size (employees)
- `website` - Company website URL
- `industry` - Industry category
- `custom_attributes` - Object of custom fields
- `tags` - Array of tag objects

---

### 4. TICKETS API ⭐ CORE
**Base:** `https://api.intercom.io/tickets`

#### Core Operations:
- `POST /tickets` - Create a ticket
- `POST /tickets/enqueue` - Create ticket asynchronously (NEW in 2025)
- `GET /tickets/{id}` - Retrieve a ticket
- `PUT /tickets/{id}` - Update a ticket
- `DELETE /tickets/{id}` - Delete a ticket
- `POST /tickets/search` - Search tickets by attributes

#### Required Fields for Creation:
- `ticket_type_id` - ID of the ticket type
- `contacts` - Array of contact objects (email or ID)
- `ticket_attributes` - Object containing:
  - `_default_title_` - Ticket title
  - `_default_description_` - Ticket description
  - Custom attributes (priority, status, etc.)

#### Key Features:
- Custom ticket types
- Custom attributes (including priority as list type)
- Assignment to admins/teams
- Ticket state management
- Custom workflows per ticket type

---

### 5. TICKET TYPES API
**Base:** `https://api.intercom.io/ticket_types`

#### Operations:
- `GET /ticket_types` - List all ticket types
- `POST /ticket_types` - Create a ticket type
- `PUT /ticket_types/{id}` - Update a ticket type

#### Use Cases:
- Define custom support categories
- Set default attributes per type
- Configure custom fields and priorities
- Define SLA expectations per type

---

### 6. MESSAGES API
**Base:** `https://api.intercom.io/messages`

#### Core Operations:
- `POST /messages` - Send an outbound message
  - Email messages
  - In-app messages
  - Push notifications
  - SMS messages (with subscription consent)

#### Message Types:
- `email` - Email to contact
- `inapp` - Messenger notification
- `push` - Mobile push notification

#### Key Attributes:
- `message_type` - Type of message
- `subject` - Message subject (email)
- `body` - Message content (HTML supported)
- `from` - Admin sending the message
- `to` - Contact recipient(s)
- `template` - Template ID (if using template)

---

### 7. ADMINS API
**Base:** `https://api.intercom.io/admins`

#### Core Operations:
- `GET /admins` - List all admins
- `GET /admins/{id}` - Retrieve an admin
- `PUT /admins/{id}` - Update an admin (limited fields)
- `POST /admins/{id}/away` - Set away mode

#### Activity Logs:
- `GET /admins/activity_logs` - List admin activity logs

#### Tracked Activities:
- `admin_conversation_assignment_limit_change`
- `admin_ticket_assignment_limit_change`
- `admin_away_mode_change`
- `admin_deletion`
- And more...

#### Key Attributes:
- `name` - Admin name
- `email` - Admin email
- `avatar` - Profile image
- `away_mode_enabled` - Away status
- `away_mode_reassign` - Auto-reassign when away
- `has_inbox_seat` - Can access inbox
- `team_ids` - Array of team memberships
- `job_title` - Admin's role
- `priority_level` - Admin priority (NEW in 2025)

---

### 8. TEAMS API
**Base:** `https://api.intercom.io/teams`

#### Core Operations:
- `GET /teams` - List all teams
- `GET /teams/{id}` - Retrieve a team

#### Key Attributes:
- `name` - Team name
- `admin_ids` - Array of team member IDs
- `admin_priority_level` - Priority levels per admin (NEW in 2025)

#### Use Cases:
- Organize admins into departments
- Route conversations by team
- Team-level analytics
- Team-based permissions

---

### 9. TAGS API
**Base:** `https://api.intercom.io/tags`

#### Core Operations:
- `POST /tags` - Create a tag
- `GET /tags` - List all tags
- `GET /tags/{id}` - Retrieve a tag
- `DELETE /tags/{id}` - Delete a tag

#### Tagging Operations:
- `POST /contacts/{id}/tags` - Tag a contact
- `DELETE /contacts/{id}/tags/{tag_id}` - Untag a contact
- `POST /companies/{id}/tags` - Tag a company
- `POST /conversations/{id}/tags` - Tag a conversation

#### Key Attributes:
- `name` - Tag name
- `applied_at` - When tag was applied
- `applied_by` - Admin who applied tag

#### Use Cases:
- Categorize contacts, companies, conversations
- Filter and segment data
- Trigger workflows based on tags
- Analytics and reporting by tag

#### Webhook Topics:
- `contact.user.tag.created`
- `contact.user.tag.deleted`
- `contact.lead.tag.created`
- `contact.lead.tag.deleted`

---

### 10. SEGMENTS API
**Base:** `https://api.intercom.io/segments`

#### Core Operations:
- `GET /segments` - List all segments

#### Key Features:
- Dynamic groups of contacts based on attributes
- Auto-updating as contacts change
- Read-only via API (create/edit in Intercom UI)

#### Use Cases:
- Target messaging campaigns
- Analytics by customer segment
- Personalized experiences
- Customer health scoring

---

### 11. DATA ATTRIBUTES API
**Base:** `https://api.intercom.io/data_attributes`

#### Core Operations:
- `POST /data_attributes` - Create a custom attribute
- `GET /data_attributes` - List all data attributes
- `PUT /data_attributes/{id}` - Update a data attribute
- `DELETE /data_attributes/{id}` - Archive a data attribute

#### Attribute Types:
- `string` - Text values
- `integer` - Numeric values
- `float` - Decimal numbers
- `boolean` - True/false
- `date` - Unix timestamp
- `list` - Predefined options

#### Models:
- `contact` - Contact attributes
- `company` - Company attributes
- `conversation` - Conversation attributes

#### Key Attributes:
- `name` - Attribute name
- `model` - Which model it belongs to
- `data_type` - Type of data
- `description` - Human-readable description
- `options` - Predefined values (for list type)
- `archived` - Whether archived

#### Use Cases:
- Custom contact fields (job title, region, tier, etc.)
- Company metrics (ARR, user count, plan type)
- Conversation metadata (sentiment, category, product area)

---

### 12. CUSTOM OBJECTS API
**Base:** `https://api.intercom.io/custom_object_instances` (Unstable)

#### Core Operations:
- `POST /custom_object_instances` - Create a custom object instance
- `GET /custom_object_instances/{id}` - Retrieve an instance
- `PUT /custom_object_instances/{id}` - Update an instance
- `DELETE /custom_object_instances/{id}` - Delete an instance

#### Advanced Features:
- Complex data models beyond standard contacts/companies
- Relationships between objects
- Reference attributes to link objects

#### Key Attributes:
- `id` - Intercom-assigned ID
- `external_id` - Your custom identifier
- `type` - Custom object type identifier
- `custom_attributes` - Object of custom fields
- Relationship attributes - Links to other objects

#### Use Cases:
- Orders and transactions
- Products and inventory
- Subscriptions and billing
- Custom business entities

---

### 13. DATA EVENTS API
**Base:** `https://api.intercom.io/events`

#### Core Operations:
- `POST /events` - Submit a data event
- `GET /events` - List data events (last 90 days only)

#### Key Attributes:
- `event_name` - Name of the event
- `created_at` - When event occurred (Unix timestamp)
- `user_id` or `email` - Contact identifier
- `metadata` - Event properties (max 10 keys)

#### Limitations:
- Events older than 90 days cannot be listed
- Maximum 10 metadata keys per event

#### Use Cases:
- Track user behavior (feature usage, page views)
- Trigger automations based on events
- Customer analytics
- Lifecycle tracking
- Attribution modeling

#### Integration with Automation:
- Trigger Workflows based on events
- Power Fin AI responses with event data
- Segment users by event patterns

---

### 14. SUBSCRIPTION TYPES API
**Base:** `https://api.intercom.io/subscription_types`

#### Core Operations:
- `GET /subscription_types` - List subscription types
- `GET /contacts/{id}/subscriptions` - List contact's subscriptions
- `POST /contacts/{id}/subscriptions` - Subscribe a contact
- `DELETE /contacts/{id}/subscriptions/{subscription_id}` - Unsubscribe a contact

#### Supported Channels:
- Email subscriptions
- SMS subscriptions

#### Key Features:
- Granular opt-in/opt-out management
- Compliance with GDPR, CAN-SPAM, TCPA
- Separate essential vs. non-essential communications
- Self-service subscription management for customers

#### Use Cases:
- Newsletter subscriptions
- Product update announcements
- Marketing campaigns
- SMS consent management
- Transactional vs. promotional separation

---

### 15. VISITORS API
**Base:** `https://api.intercom.io/visitors`

#### Core Operations:
- `GET /visitors/{id}` - Retrieve a visitor
- `PUT /visitors/{id}` - Update a visitor
- `POST /visitors/{id}/convert` - Convert visitor to user/lead

#### Conversion Behavior:
- If user exists: Visitor merged into user, visitor deleted
- If user doesn't exist: Visitor converted to user with new identifiers
- Preserves conversation history and attributes

#### Key Attributes:
- `user_id` - Anonymous ID (before conversion)
- `name` - Visitor name (if collected)
- `email` - Email (if collected)
- `signed_up_at` - Conversion timestamp

#### Use Cases:
- Anonymous visitor tracking
- Pre-signup engagement
- Lead qualification
- Visitor-to-customer journey

---

### 16. ARTICLES API (Help Center)
**Base:** `https://api.intercom.io/articles`

#### Core Operations:
- `POST /articles` - Create an article
- `GET /articles/{id}` - Retrieve an article
- `PUT /articles/{id}` - Update an article
- `DELETE /articles/{id}` - Delete an article
- `GET /articles` - List all articles

#### Advanced Features:
- **Publishing States:** draft, published
- **Multilingual Support:** `translated_content` with language codes
- **Parent Structure:** Assign to collection or section via `parent_id`
- **Standalone Articles:** Articles without parent_id

#### Key Attributes:
- `title` - Article title
- `description` - Short summary
- `body` - Full content (HTML supported)
- `author_id` - Admin who created it
- `state` - draft or published
- `parent_id` - Collection/section ID (optional)
- `parent_type` - collection or section
- `translated_content` - Array of translations:
  - `locale` - Language code (e.g., 'en', 'es', 'fr')
  - `title` - Translated title
  - `description` - Translated description
  - `body` - Translated content
  - `state` - draft or published

#### Limitations:
- Currently cannot add article to multiple collections via API
- Workaround: Add to one collection via API, then use UI for additional collections

---

### 17. COLLECTIONS API (Help Center)
**Base:** `https://api.intercom.io/help_center/collections`

#### Core Operations:
- `POST /help_center/collections` - Create a collection
- `GET /help_center/collections/{id}` - Retrieve a collection
- `PUT /help_center/collections/{id}` - Update a collection
- `DELETE /help_center/collections/{id}` - Delete a collection
- `GET /help_center/collections` - List all collections

#### Structure:
- Top-level containers for articles
- Can contain other collections (up to 3 levels deep)
- Section endpoints are now deprecated (use Collections)

#### Key Attributes:
- `name` - Collection name
- `description` - Collection description
- `parent_id` - Parent collection ID (for nesting)
- `icon` - Icon identifier
- `order` - Display order

---

### 18. INTERNAL ARTICLES API
**Base:** `https://api.intercom.io/articles/internal` (NEW in 2025)

#### Purpose:
Manage internal knowledge base content for team members only (not customer-facing)

#### Use Cases:
- Internal documentation
- Team procedures
- Training materials
- Internal FAQs

---

### 19. NEWS API
**Base:** `https://api.intercom.io/news`

#### News Items Operations:
- `POST /news/news_items` - Create a news item
- `GET /news/news_items/{id}` - Retrieve a news item
- `PUT /news/news_items/{id}` - Update a news item
- `DELETE /news/news_items/{id}` - Delete a news item
- `GET /news/news_items` - List all news items

#### Newsfeeds Operations:
- `GET /news/newsfeeds` - List all newsfeeds
- `GET /news/newsfeeds/{id}` - Retrieve a newsfeed
- `GET /news/newsfeeds/{id}/items` - List items in a newsfeed

#### Key Attributes (News Items):
- `title` - News title
- `body` - Content (HTML supported)
- `sender_id` - Admin who created it
- `state` - draft or live
- `deliver_silently` - No notification badge when true
- `reactions` - Emoji reactions (empty array disables reactions)
- `newsfeed_assignments` - Array of newsfeed IDs

#### Newsfeeds:
- Target specific audiences (Visitors, Users, Leads, etc.)
- Cannot currently be edited through API
- Collection of news items for specific audience segments

#### Third-Party Integrations:
- Can import news from Beamer, Canny, AnnounceKit, WordPress
- Use unstable public API for news sharing

---

### 20. MACROS API (Unstable)
**Base:** `https://api.intercom.io/macros` (NEW in 2025)

#### Core Operations:
- `GET /macros` - List all macros (with pagination)
- `GET /macros/{id}` - Retrieve a specific macro

#### Key Features:
- Cursor-based pagination using `starting_after` (Base64-encoded)
- Filter by `updated_since` parameter (Unix timestamp)
- Automatic placeholder transformation
  - Intercom placeholders (e.g., `{{user.name}}`)
  - Converted to XML-like attributes in API response

#### Macro Actions:
- Send pre-written response
- Tag conversation
- Tag person
- Assign to team/admin
- Snooze conversation
- Close conversation
- Mark as priority

#### Use Cases:
- Retrieve saved replies for external applications
- Sync macros across multiple tools
- Display team responses in custom interfaces
- Audit macro usage and effectiveness

---

### 21. PHONE SWITCH API
**Base:** `https://api.intercom.io/switch`

#### Core Operations:
- `POST /switch/phone` - Create a phone switch (deflect call to Messenger)

#### Key Features:
- Deflect phone calls to Intercom Messenger
- Sends SMS with Messenger link
- Phone number must be in E.164 format

#### Required Parameters:
- `phone` - Phone number (E.164 format, e.g., +14155551234)

#### Use Cases:
- Reduce call volume
- Provide self-service options
- Collect context before live conversation
- Offer 24/7 support via AI/knowledge base

---

### 22. COUNTS API
**Base:** `https://api.intercom.io/counts`

#### Available Counts:
- `GET /counts` - App total counts (tags, segments)
- `GET /counts/conversations` - Conversation counts
  - Global conversation metrics
  - Open/closed breakdown

- `GET /counts/conversations/admins` - Admin conversation counts
  - Per-admin open/closed counts

- `GET /counts/companies` - Company counts
  - Segments, tags, users per company

#### Use Cases:
- Dashboard metrics
- Team performance tracking
- Workspace health monitoring
- Capacity planning

---

### 23. DATA EXPORT API
**Base:** `https://api.intercom.io/export/content/data`

#### Core Operations:
- `POST /export/content/data` - Create a data export job
- `GET /export/content/data/{job_id}` - Check export status
- `GET /export/content/data/{job_id}/download` - Download export

#### Export Constraints:
- Maximum 90-day timeframe per request
- One active job per workspace at a time
- Concurrent job attempts return `429 Too Many Requests`

#### Export Formats:
- JSON (for S3 exports)
- CSV (for instant downloads)

#### Export Destinations:
- Amazon S3 bucket
- Direct download

#### Data Retention:
- Data available for up to 2 years

#### CSV Export Features:
- Access to all 13 reporting datasets
- Full attribute coverage
- Custom column selection
- Attribute-based filtering
- Instant downloads (up to 10,000 rows)
- Scheduled exports at regular intervals

#### Use Cases:
- Data warehouse integration
- Custom analytics
- Compliance and archiving
- Migration to other systems
- Advanced reporting

---

### 24. SEARCH API ⭐ POWERFUL
**Base URLs:**
- `POST /contacts/search` - Search contacts
- `POST /conversations/search` - Search conversations
- `POST /tickets/search` - Search tickets (by attribute values)

#### Search Features

**Query Operators:**
- `=` - Equals
- `!=` - Not equals
- `>` - Greater than
- `<` - Less than
- `~` - Contains (for strings)
- `!~` - Does not contain
- `^` - Starts with
- `$` - Ends with

**Logical Operators:**
- `AND` - All conditions must match
- `OR` - Any condition must match
- Nested queries: `(1 OR 2) AND (3 OR 4)`

**Searchable Fields:**
- Most model fields are searchable
- Includes read-only fields
- Custom attributes
- Timestamps
- Relationships

**Pagination:**
- Default: 50 results per page
- Cursor-based using `starting_after`
- Custom page sizes

**Sorting:**
- Default sort: `last_request_at` descending (most recent first)
- Custom sort fields available
- Ascending or descending order

#### Use Cases:
- Advanced filtering
- Complex customer queries
- Analytics and reporting
- Data auditing
- Bulk operations

---

### 25. WEBHOOKS

**Management URL:** Configure in Developer Hub under App Settings → Webhooks

#### Setup Requirements:
- HTTPS endpoint URL required
- Associated with App (not individual workspace)
- Receive events from all workspaces where app is installed
- Each topic requires appropriate permissions

#### Available Webhook Topics

**Contact Topics:**
- `contact.created` - New contact created
- `contact.deleted` - Contact deleted
- `contact.merged` - Contacts merged
- `contact.signed_up` - Contact converted from visitor
- `contact.unsubscribed` - Contact unsubscribed from emails
- `contact.user.tag.created` - Tag added to user
- `contact.user.tag.deleted` - Tag removed from user
- `contact.lead.tag.created` - Tag added to lead
- `contact.lead.tag.deleted` - Tag removed from lead

**Company Topics:**
- `company.created` - New company created

**Conversation Topics:**
- `conversation.user.created` - User started conversation
- `conversation.user.replied` - User replied
- `conversation.admin.replied` - Admin replied
- `conversation.admin.single.created` - Admin sent direct message
- `conversation.admin.assigned` - Conversation assigned
- `conversation.admin.noted` - Admin added internal note
- `conversation.admin.closed` - Admin closed conversation
- `conversation.admin.opened` - Admin reopened conversation
- `conversation.operator.replied` - Fin/bot replied (NEW in 2025)
- `conversation.rating.added` - CSAT rating received
- `conversation.rating.changed` - CSAT rating updated

**Ticket Topics:**
- `ticket.created` - New ticket created

**Admin Topics:**
- `admin.away_mode.updated` - Admin away status changed

**Visitor Topics:**
- `visitor.signed_up` - Visitor converted to user

#### Webhook Payload Structure:
```json
{
  "type": "notification_event",
  "app_id": "your_app_id",
  "data": {
    "type": "notification_event_data",
    "item": { /* the object that triggered the event */ }
  },
  "id": "notification_id",
  "topic": "conversation.user.created",
  "delivery_status": "pending",
  "delivery_attempts": 1,
  "first_sent_at": 1234567890,
  "created_at": 1234567890
}
```

#### Webhook Reliability:
- Multiple delivery attempts on failure
- Delivery status tracking
- Timestamp tracking for debugging

#### Use Cases:
- Real-time integrations
- External system synchronization
- Event-driven automation
- Analytics pipelines
- Notification systems
- CRM updates
- Data warehouse streaming

---

## TECHNICAL ARCHITECTURE

### 1. API Client Layer
**File:** `app/intercom/lib/intercom-api-client.ts`

```typescript
class IntercomAPIClient {
  // Core configuration
  private accessToken: string
  private baseURL = "https://api.intercom.io"
  private version = "2.14"

  // Conversations
  async getConversations(filters?: ConversationFilters): Promise<Conversation[]>
  async searchConversations(query: SearchQuery): Promise<SearchResult<Conversation>>
  async getConversation(id: string): Promise<Conversation>
  async replyToConversation(id: string, message: string): Promise<ConversationPart>
  async closeConversation(id: string): Promise<Conversation>
  async assignConversation(id: string, adminId: string): Promise<Conversation>
  async tagConversation(id: string, tags: string[]): Promise<Conversation>
  async snoozeConversation(id: string, until: Date): Promise<Conversation>

  // Contacts
  async createContact(data: ContactData): Promise<Contact>
  async getContacts(filters?: ContactFilters): Promise<Contact[]>
  async searchContacts(query: SearchQuery): Promise<SearchResult<Contact>>
  async getContact(id: string): Promise<Contact>
  async updateContact(id: string, data: Partial<ContactData>): Promise<Contact>
  async deleteContact(id: string): Promise<void>
  async tagContact(id: string, tags: string[]): Promise<Contact>
  async addNoteToContact(id: string, note: string): Promise<Note>
  async mergeContacts(fromId: string, toId: string): Promise<Contact>

  // Companies
  async createCompany(data: CompanyData): Promise<Company>
  async getCompanies(filters?: CompanyFilters): Promise<Company[]>
  async getCompany(id: string): Promise<Company>
  async updateCompany(id: string, data: Partial<CompanyData>): Promise<Company>
  async getCompanyContacts(id: string): Promise<Contact[]>

  // Messages
  async sendMessage(data: MessageData): Promise<Message>
  async getMessage(id: string): Promise<Message>

  // Teams & Admins
  async getAdmins(): Promise<Admin[]>
  async getAdmin(id: string): Promise<Admin>
  async getCurrentAdmin(): Promise<Admin>
  async getTeams(): Promise<Team[]>
  async getTeam(id: string): Promise<Team>

  // Tags
  async createTag(name: string): Promise<Tag>
  async getTags(): Promise<Tag[]>
  async getTag(id: string): Promise<Tag>
  async deleteTag(id: string): Promise<void>

  // Data Attributes
  async getDataAttributes(): Promise<DataAttribute[]>
  async createDataAttribute(data: DataAttributeData): Promise<DataAttribute>

  // Segments
  async getSegments(): Promise<Segment[]>
  async getSegment(id: string): Promise<Segment>
  async getSegmentContacts(id: string): Promise<Contact[]>

  // Events
  async trackEvent(event: EventData): Promise<void>
  async getEventSummaries(filters: EventFilters): Promise<EventSummary[]>

  // Articles
  async getArticles(filters?: ArticleFilters): Promise<Article[]>
  async searchArticles(query: string): Promise<Article[]>
  async getArticle(id: string): Promise<Article>
  async createArticle(data: ArticleData): Promise<Article>

  // Tickets
  async createTicket(data: TicketData): Promise<Ticket>
  async getTicket(id: string): Promise<Ticket>
  async updateTicket(id: string, data: Partial<TicketData>): Promise<Ticket>
  async searchTickets(query: SearchQuery): Promise<SearchResult<Ticket>>
  async getTicketTypes(): Promise<TicketType[]>

  // Visitors
  async getVisitors(filters?: VisitorFilters): Promise<Visitor[]>
  async getVisitor(id: string): Promise<Visitor>
  async convertVisitor(id: string, contactData: ContactData): Promise<Contact>

  // Notes
  async createNote(data: NoteData): Promise<Note>
  async getNote(id: string): Promise<Note>
  async getContactNotes(contactId: string): Promise<Note[]>
}
```

---

### 2. Query Handler Layer
**File:** `app/intercom/lib/intercom-smart-query-handler.ts`

Natural language query processing:

```typescript
// Pattern matching for queries
const QUERY_PATTERNS = {
  // Conversation queries
  listConversations: /\b(show|list|display|get)\s+(all\s+)?conversations?\b/i,
  searchConversations: /\b(find|search)\s+conversations?\s+(about|with|containing)\s+(.+)/i,
  getConversation: /\b(show|display|get)\s+conversation\s+(\d+|first|last)\b/i,

  // Contact queries
  createContact: /\b(create|add)\s+contact\s+(.+)/i,
  searchContacts: /\b(find|search)\s+contacts?\s+(.+)/i,

  // Company queries
  listCompanies: /\b(show|list)\s+companies\b/i,

  // Tag queries
  listTags: /\b(show|list)\s+tags?\b/i,
  tagConversation: /\b(tag|label)\s+conversation\s+(.+)\s+as\s+(.+)/i,

  // Team queries
  listTeams: /\b(show|list)\s+teams?\b/i,
  listAdmins: /\b(show|list)\s+(admins?|agents?)\b/i,

  // Analytics queries
  conversationStats: /\b(how many|count)\s+(open|closed|total)\s+conversations?\b/i,
  responseTime: /\baverage\s+response\s+time\b/i,
}

async function handleQuery(query: string, context: QueryContext): Promise<QueryResponse> {
  // Classify query
  const queryType = classifyQuery(query)

  // Execute based on type
  switch (queryType) {
    case 'list_conversations':
      return await handleListConversations(query)
    case 'search_conversations':
      return await handleSearchConversations(query)
    case 'conversation_details':
      return await handleConversationDetails(query)
    // ... etc
  }
}
```

---

### 3. Caching Strategy
**File:** `app/intercom/lib/intercom-cache.ts`

Smart caching for performance:

```typescript
interface CacheEntry {
  conversations: Conversation[]
  contacts: Contact[]
  companies: Company[]
  tags: Tag[]
  teams: Team[]
  admins: Admin[]
  stats: CacheStats
  lastUpdated: Date
}

class IntercomCache {
  async getConversations(): Promise<Conversation[]>
  async refreshConversations(): Promise<void>
  async invalidateCache(): Promise<void>
  calculateStats(): CacheStats
}
```

---

### 4. AI Integration
**File:** `app/intercom/lib/intercom-ai-helpers.ts`

OpenAI integration for intelligence:

```typescript
// Query classification
async function classifyQuery(query: string): Promise<QueryClassification>

// Response generation
async function generateResponse(
  conversation: Conversation,
  tone: 'professional' | 'friendly' | 'technical'
): Promise<AISuggestion[]>

// Intent detection
async function detectIntent(query: string): Promise<Intent>

// Sentiment analysis
async function analyzeSentiment(message: string): Promise<Sentiment>

// Topic extraction
async function extractTopics(conversation: Conversation): Promise<string[]>
```

---

### 5. API Route Structure

```
app/intercom/api/
├── conversations/
│   ├── route.ts              # GET (list), POST (create)
│   ├── [id]/
│   │   ├── route.ts          # GET (retrieve)
│   │   ├── reply/route.ts    # POST (reply)
│   │   ├── close/route.ts    # POST (close)
│   │   ├── assign/route.ts   # POST (assign)
│   │   ├── tags/route.ts     # POST (tag)
│   │   └── snooze/route.ts   # POST (snooze)
│   └── search/route.ts       # POST (search)
├── contacts/
│   ├── route.ts              # GET (list), POST (create)
│   ├── [id]/
│   │   ├── route.ts          # GET, PUT, DELETE
│   │   ├── tags/route.ts     # POST (tag)
│   │   ├── notes/route.ts    # POST, GET (notes)
│   │   └── companies/route.ts # POST (attach company)
│   ├── search/route.ts       # POST (search)
│   └── merge/route.ts        # POST (merge)
├── companies/
│   ├── route.ts              # GET (list), POST (create)
│   ├── [id]/
│   │   ├── route.ts          # GET, PUT, DELETE
│   │   └── contacts/route.ts # GET (company contacts)
│   └── search/route.ts       # POST (search)
├── messages/
│   ├── route.ts              # POST (send)
│   └── [id]/route.ts         # GET (retrieve)
├── admins/
│   ├── route.ts              # GET (list)
│   ├── [id]/route.ts         # GET (retrieve)
│   └── me/route.ts           # GET (current admin)
├── teams/
│   ├── route.ts              # GET (list)
│   └── [id]/route.ts         # GET (retrieve)
├── tags/
│   ├── route.ts              # GET (list), POST (create)
│   └── [id]/route.ts         # GET, DELETE
├── data-attributes/
│   ├── route.ts              # GET (list), POST (create)
│   └── [id]/route.ts         # PUT (update)
├── segments/
│   ├── route.ts              # GET (list)
│   ├── [id]/route.ts         # GET (retrieve)
│   └── [id]/contacts/route.ts # GET (segment contacts)
├── events/
│   ├── route.ts              # POST (track event)
│   └── summaries/route.ts    # POST (get summaries)
├── articles/
│   ├── route.ts              # GET (list), POST (create)
│   ├── [id]/route.ts         # GET, PUT, DELETE
│   └── search/route.ts       # GET (search)
├── tickets/
│   ├── route.ts              # POST (create)
│   ├── [id]/route.ts         # GET, PUT
│   └── search/route.ts       # POST (search)
├── ticket-types/
│   ├── route.ts              # GET (list)
│   └── [id]/route.ts         # GET (retrieve)
├── visitors/
│   ├── route.ts              # GET (list)
│   ├── [id]/route.ts         # GET, PUT, DELETE
│   └── [id]/convert/route.ts # POST (convert to contact)
├── notes/
│   ├── route.ts              # POST (create)
│   └── [id]/route.ts         # GET (retrieve)
├── query/route.ts            # POST (unified smart query endpoint)
└── suggest-response/route.ts # POST (AI response suggestions)
```

---

## IMPLEMENTATION ROADMAP

### Sprint 1: Foundation (Week 1)
**Goal:** Core infrastructure and basic operations

**Deliverables:**
- Core API client implementation
- Authentication and rate limiting
- Basic conversation operations
- Contact management
- Simple query handler
- Error handling framework
- Testing infrastructure

**Tasks:**
1. Set up `intercom-api-client.ts` with all method stubs
2. Implement authentication layer
3. Build rate limit handling with retry logic
4. Create conversation CRUD operations
5. Create contact CRUD operations
6. Basic query pattern matching
7. Unit tests for all client methods

---

### Sprint 2: Search & Intelligence (Week 2)
**Goal:** Advanced search and AI capabilities

**Deliverables:**
- Advanced search implementation
- AI query classification
- Smart response generation
- Caching layer
- Context management

**Tasks:**
1. Implement search API for conversations, contacts, companies
2. Build query pattern recognition system
3. Integrate OpenAI for query classification
4. Create AI response generation
5. Implement caching system
6. Build context memory for conversations
7. Integration tests for search and AI

---

### Sprint 3: Advanced Features (Week 3)
**Goal:** Complete entity management

**Deliverables:**
- Company operations
- Tag management
- Team/admin operations
- Event tracking
- Custom attributes

**Tasks:**
1. Implement company CRUD and search
2. Build tag creation and management
3. Add team/admin listing and operations
4. Create event tracking system
5. Implement custom attribute management
6. Build bulk operations
7. End-to-end workflow tests

---

### Sprint 4: Knowledge & Tickets (Week 4)
**Goal:** Support and knowledge base features

**Deliverables:**
- Article search
- Ticket management
- Analytics queries
- Visitor tracking
- Notes system

**Tasks:**
1. Implement article API operations
2. Build ticket CRUD and search
3. Create analytics calculation methods
4. Add visitor conversion tracking
5. Implement notes system
6. Build knowledge base suggestions
7. Performance benchmarking

---

### Sprint 5: Real-time & Polish (Week 5)
**Goal:** Live updates and production readiness

**Deliverables:**
- Webhook integration
- Live updates
- Performance optimization
- Comprehensive testing
- Documentation

**Tasks:**
1. Set up webhook receiver
2. Implement real-time UI updates
3. Optimize caching and query performance
4. Complete test coverage (>80%)
5. Write comprehensive documentation
6. Security audit and hardening
7. Load testing and optimization

---

## ADVANCED FEATURES

### 1. Fin AI Agent (AI-Powered Automation)

**Powered by:** Claude (Anthropic) - as of Fin 2.0 (2025)

**Core Capabilities:**
- Resolve up to 50%+ of support queries instantly
- Understand complex queries and ask clarifying questions
- Learn from existing knowledge base articles
- Human-like tone and explanations
- Simple on/off toggle to activate

**Fin over API:**
- Integrate Fin into custom messengers
- Embed in help center search bars
- Use in existing systems without migration

**Advanced Features:**

**Fin Tasks:**
- Automate complex multi-step processes
- Data connector integration with external systems
- Personalized answers based on customer data
- Complex task automation (account updates, order tracking, etc.)

**Fin in Workflows:**
- Deep integration with Intercom Workflows
- Conditional Fin activation
- Advanced handover rules to human agents
- Combine AI and human support strategically

**Fin AI Copilot (for Agents):**
- AI assistant for human agents in Inbox
- Instant conversation summarization
- Personalized reply suggestions
- Automatic task completion
- Eliminates searching across multiple sources

**Analytics & Intelligence:**

**Topics Explorer:**
- AI-powered automatic conversation categorization
- Spot trends without manual tagging
- Track high-effort issues
- Understand volume drivers

**CX Score:**
- Measures quality of every conversation
- 5x more coverage than CSAT surveys
- Understand customer sentiment at scale
- Track Fin + teammate performance

**Topic Trends:**
- Highlights weekly changes in support topics
- Volume spikes detection
- AI performance drops
- Emerging question identification

**Performance Metrics:**
- 51% average resolution rate across customers
- Millions of conversations processed
- Continuous improvement with Claude integration

**Webhook Integration:**
- `conversation.operator.replied` - Track Fin responses (NEW 2025)

---

### 2. Workflow Automation

**Available Actions:**
- Apply rules
- Tag conversation
- Tag person/company
- Assign conversation (to admin/team)
- Snooze conversation
- Wait (delays)
- Mark as priority
- Trigger data connectors
- Activate Fin AI Agent

**Workflow Triggers:**
- New conversation
- Contact properties change
- Tag applied/removed
- Data event received
- Subscription status change
- Time-based (scheduled)
- Manual trigger

**Assignment Workflows:**
- Automatic routing to right teams
- Skill-based assignment
- Load balancing across admins
- Priority-based routing
- Custom routing logic

**Use Cases:**
- Lead qualification and routing
- Escalation paths
- SLA management
- Follow-up sequences
- Customer onboarding
- Churn prevention

---

### 3. Data Connectors

**Purpose:** Connect Fin and Workflows to external systems

**Capabilities:**
- Retrieve data from external APIs
- Provide personalized answers in Fin
- Power Inbox automations via Workflows
- Store response data in Intercom
- Execute complex tasks on behalf of customers

**Triggers:**
- Fin AI conversations
- Workflows
- Custom Answers
- Macros

**Use Cases:**
- Order status lookup
- Account balance retrieval
- Shipping tracking
- Subscription management
- Product recommendations
- Inventory checks

---

### 4. Pagination Strategies

**Cursor-Based Pagination (Search APIs):**
```json
{
  "starting_after": "base64_encoded_cursor",
  "per_page": 50
}
```
- Used for: Contact search, Conversation search, Macros
- More efficient for large datasets
- Stable results during iteration

**Standard Pagination (List APIs):**
```json
{
  "pages": {
    "type": "pages",
    "next": "https://api.intercom.io/contacts?page=2",
    "page": 1,
    "per_page": 50,
    "total_pages": 10
  }
}
```
- Used for: Most list endpoints
- Navigate with provided URLs
- Page-based navigation

**Scroll Pagination (Companies):**
```json
{
  "scroll_param": "scroll_token_here"
}
```
- Used for: Scrolling over all companies
- Efficient for processing all records
- Maintains consistent snapshot of data

---

### 5. Messenger Customization

**Appearance Settings (API/UI):**
- Background color (header)
- Action color (buttons, links)
- Launcher positioning (left/right)
- Horizontal and vertical padding
- Custom launcher image

**Content Configuration:**
- Home screen spaces (add/remove)
- Initial experience customization
- Visibility rules (visitors vs. users)

**Programmatic Control (JavaScript API):**
```javascript
window.intercomSettings = {
  alignment: 'left',
  horizontal_padding: 20,
  vertical_padding: 20,
  hide_default_launcher: true
};

// Dynamic updates
Intercom('update', {
  hide_default_launcher: false
});
```

**Multi-Brand Support:**
- Configure per brand/workspace
- Consistent styling across products
- Brand-specific messaging

---

### 6. Multilingual & Localization

**Intercom Native Features:**
- Messenger localization
- Browser language detection (`Browser language` attribute)
- Multi-language article support

**Article Translation API:**
```http
PUT /articles/{id}
Content-Type: application/json

{
  "translated_content": [
    {
      "locale": "es",
      "title": "Título en español",
      "body": "Contenido en español",
      "description": "Descripción en español",
      "state": "published"
    }
  ]
}
```

**Third-Party Translation Integrations:**

**Lokalise:**
- Real-time machine translation (100+ languages)
- Import/export articles and collections
- AI-powered translation

**Unbabel:**
- AI + human editor translation
- Native-quality translations
- Language solutions API

**Crowdin:**
- Sync Help Center articles
- Translation management
- Update translations back to Intercom

**Lingpad:**
- Real-time conversation translation
- Agent-customer translation
- Built-in automation

**Swifteq:**
- Automatic help article translation
- Multiple language support
- Global reach optimization

---

### 7. Reporting & Analytics

**Built-in Metrics:**
- Team performance
- Teammate performance
- Response times (excluding office hours)
- Customer satisfaction (CSAT)
- Resolution times
- Conversation volumes

**Custom Reports via API:**
- Build using REST API and CSV exports
- Access to 13 reporting datasets
- Custom metrics calculation
- Data warehouse integration

**Conversation Statistics:**
- Time to assignment (seconds)
- Time to first admin reply
- Time to close
- Median response time
- Reopen count
- Assignment count
- Part count

**Available Durations:**
- All durations in seconds
- Office hours excluded from calculations
- Timezone-aware calculations

---

## API BEST PRACTICES

### 1. Error Handling
- Handle `429 Too Many Requests` with exponential backoff
- Validate input before API calls
- Log all errors with context
- Implement retry logic for transient failures

### 2. Performance Optimization
- Use Search API instead of filtering locally
- Implement pagination for all list operations
- Cache frequently accessed data
- Use webhooks instead of polling
- Batch operations when possible

### 3. Security
- Store access tokens securely (environment variables, secrets manager)
- Use HTTPS for all API calls
- Implement webhook signature verification
- Rotate tokens regularly
- Use minimal permissions

### 4. Data Consistency
- Use idempotency keys where available
- Handle merge conflicts gracefully
- Validate data before updates
- Monitor webhook delivery failures
- Implement data reconciliation jobs

### 5. Scalability
- Design for rate limits from day one
- Use async processing for bulk operations
- Implement queue systems for webhooks
- Monitor API usage and trends
- Plan for workspace growth

---

## INTEGRATION OPPORTUNITIES

### High-Impact Features for Job Application Demo

#### 1. Comprehensive Dashboard
**Demonstrate:**
- Real-time conversation metrics
- Team performance analytics
- AI vs. human resolution rates
- CSAT trends and CX scores
- Topic trending (using Fin insights)

**APIs Used:**
- Counts API
- Conversations Search API
- Statistics objects
- Data Export API
- Webhook integration for real-time updates

---

#### 2. Advanced Search & Filtering
**Demonstrate:**
- Complex nested queries with AND/OR logic
- Multi-field filtering (tags, attributes, states)
- Saved search templates
- Bulk operations on search results
- Export filtered results

**APIs Used:**
- Contacts Search API
- Conversations Search API
- Tickets Search API
- Pagination APIs

---

#### 3. Intelligent Automation Hub
**Demonstrate:**
- Workflow builder interface
- Macro management and analytics
- Assignment rule configuration
- Fin AI integration and monitoring
- Data connector setup

**APIs Used:**
- Macros API
- Webhooks for trigger monitoring
- Conversations API for state management
- Fin integration endpoints

---

#### 4. Knowledge Base Manager
**Demonstrate:**
- Article creation with rich text editor
- Multi-language content management
- Collection organization (3-level hierarchy)
- Analytics on article performance
- AI-powered article suggestions

**APIs Used:**
- Articles API
- Collections API
- Internal Articles API
- Translation support
- Search API for content discovery

---

#### 5. Customer 360 View
**Demonstrate:**
- Unified contact/company profile
- Conversation history timeline
- Data events and behavior tracking
- Custom object relationships
- Tag and segment visualization

**APIs Used:**
- Contacts API
- Companies API
- Conversations API
- Data Events API
- Custom Objects API
- Tags API
- Segments API

---

#### 6. Real-Time Notification Center
**Demonstrate:**
- Webhook event processing
- Event filtering and routing
- Real-time UI updates
- Event replay and debugging
- Integration health monitoring

**APIs Used:**
- Webhooks (all topics)
- Activity Logs API
- Webhook payload processing

---

#### 7. Omnichannel Communication Suite
**Demonstrate:**
- Multi-channel message sending (email, SMS, in-app, push)
- Phone deflection to Messenger
- News and announcements broadcasting
- Subscription preference management
- Channel performance analytics

**APIs Used:**
- Messages API
- Phone Switch API
- News API
- Subscription Types API
- Messenger Settings

---

#### 8. Advanced Ticketing System
**Demonstrate:**
- Custom ticket type builder
- Ticket lifecycle management
- SLA tracking and alerts
- Bulk ticket operations
- Ticket analytics and reporting

**APIs Used:**
- Tickets API
- Ticket Types API
- Tickets Search API
- Assignment workflows
- Statistics tracking

---

#### 9. Data Integration Platform
**Demonstrate:**
- Data import/export pipelines
- Scheduled data synchronization
- Custom object mapping
- Attribute management interface
- Data transformation workflows

**APIs Used:**
- Data Export API
- Data Attributes API
- Custom Objects API
- Data Events API
- Bulk operations via Search + Update

---

#### 10. Admin & Team Management Portal
**Demonstrate:**
- Team structure visualization
- Admin activity monitoring
- Performance leaderboards
- Capacity management
- Away mode automation

**APIs Used:**
- Admins API
- Teams API
- Activity Logs API
- Counts API
- Webhook admin topics

---

## SUCCESS METRICS & DELIVERABLES

### API Coverage
- **Target:** 80+ endpoints implemented
- **Current:** 2 endpoints (conversations, suggest-message)
- **Goal:** Comprehensive coverage across all major API categories

### Query Capabilities
- Natural language understanding for 50+ query types
- Support for complex multi-filter searches
- Context-aware conversation handling
- AI-powered insights and suggestions

### Performance
- Cache hit rate: >70%
- Query response time: <200ms (cache), <3s (AI)
- API rate limit compliance
- Error rate: <1%

### User Experience
- Terminal-style interface matching main site aesthetic
- Instant feedback for all operations
- Clear error messages
- Comprehensive help system

---

### Competitive Advantages

#### 1. Comprehensive Coverage
Unlike basic integrations, we implement EVERY major Intercom API category:
- Full conversation management
- Complete contact/company operations
- Advanced search across all entities
- Real-time webhooks
- AI-powered intelligence
- Knowledge base integration
- Event tracking
- Custom data attributes

#### 2. Intelligent Automation
- AI-powered response generation
- Smart query classification
- Automated tagging and routing
- Predictive analytics
- Proactive suggestions

#### 3. Advanced Search
- Multi-criteria filtering
- Full-text search
- Semantic understanding
- Complex query operators
- Cross-entity search

#### 4. Production-Grade Architecture
- Smart caching strategy
- Error handling and retry logic
- Rate limit management
- Security best practices
- Comprehensive testing

---

### Deliverables

#### Code
1. Complete API client (`intercom-api-client.ts`)
2. Smart query handler (`intercom-smart-query-handler.ts`)
3. Caching system (`intercom-cache.ts`)
4. AI helpers (`intercom-ai-helpers.ts`)
5. 80+ API route handlers
6. Type definitions for all Intercom entities
7. Comprehensive error handling

#### Documentation
1. API endpoint reference (this document)
2. Query syntax guide
3. Integration guide
4. Testing documentation
5. Deployment guide

#### Testing
1. Unit tests for all API client methods
2. Integration tests for query handling
3. End-to-end workflow tests
4. Performance benchmarks

---

## TECHNICAL EXCELLENCE DEMONSTRATED

### 1. API Mastery
- Comprehensive endpoint coverage
- Proper authentication
- Error handling
- Rate limiting
- Retry logic
- Pagination handling

### 2. Architecture Skills
- Clean separation of concerns
- Modular design
- Scalable patterns
- Caching strategies
- Query optimization

### 3. AI Integration
- Natural language processing
- Intent classification
- Context awareness
- Response generation
- Sentiment analysis

### 4. User Experience
- Terminal interface design
- Intuitive commands
- Clear feedback
- Error recovery
- Help system

### 5. Code Quality
- TypeScript strict mode
- Comprehensive type definitions
- Unit testing
- Integration testing
- Documentation

---

## COMPARISON: Current vs. Planned

### Current State (Email-Based v2.0)
- ❌ 1 simple contact form endpoint
- ❌ Email forwarding to Intercom
- ❌ No API integration
- ❌ No conversation management
- ❌ No search capabilities
- ❌ No analytics
- ❌ No AI features

### Planned State (Comprehensive API v3.0)
- ✅ 80+ API endpoints
- ✅ Full conversation lifecycle
- ✅ Advanced search
- ✅ Contact/company management
- ✅ Team operations
- ✅ AI-powered intelligence
- ✅ Real-time webhooks
- ✅ Knowledge base integration
- ✅ Event tracking
- ✅ Custom data management

---

## VERSION NOTES

**Current API Version:** v2.14 (as of November 2025)

**Recent Additions (2025):**
- Internal Articles API
- Macros API (unstable)
- Asynchronous ticket creation endpoint (`/tickets/enqueue`)
- Fin operator webhook (`conversation.operator.replied`)
- Admin priority levels in Teams API
- Fin 2.0 with Claude (Anthropic) integration

**Deprecations:**
- Sections API (use Collections instead)
- Some legacy user/lead endpoints (migrated to unified Contacts)

**Unstable APIs** (Subject to change):
- Custom Objects API
- Macros API
- News API (some endpoints)

---

## ADDITIONAL RESOURCES

**Official Documentation:**
- API Reference: https://developers.intercom.com/docs/references/rest-api/api.intercom.io
- Developer Hub: https://developers.intercom.com/
- Changelog: https://developers.intercom.com/docs/references/changelog

**SDKs Available:**
- Ruby: https://github.com/intercom/intercom-ruby
- Node.js: https://github.com/intercom/intercom-node
- Python: Community-maintained
- PHP: Community-maintained

**Support:**
- Developer Forum: https://community.intercom.com/api-webhooks-23
- Intercom Help Center: https://www.intercom.com/help

---

## CONCLUSION

This comprehensive Intercom integration demonstrates:
- **Deep API knowledge** - Every major endpoint category
- **Advanced architecture** - Smart caching, query classification, AI integration
- **Production readiness** - Error handling, rate limiting, security
- **User focus** - Natural language interface, intelligent suggestions
- **Technical excellence** - Clean code, comprehensive testing, thorough documentation

**Goal Achievement:** Prove exceptional capabilities worthy of any senior engineering position through comprehensive implementation of Intercom's complete API surface.

---

**Document Status:** CONSOLIDATED MASTER - Ready for Implementation
**Version:** 4.0 (Consolidated from v2.0 README, v3.0 MASTER, and API Reference)
**Last Updated:** 2025-11-18
**Confidence Level:** HIGH - Comprehensive and achievable
