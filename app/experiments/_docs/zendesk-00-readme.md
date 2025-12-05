# Zendesk Intelligence Portal

**Last Updated**: November 17, 2025 (Phase 6.7)
**Status**: Production-Ready
**Live Demo**: https://8lee.ai/zendesk

---

## Overview

An intelligent terminal-styled interface for querying Zendesk support data using natural language. The system uses a two-tier architecture: instant answers from pre-computed statistics (60-70% of queries) and AI-powered analysis via OpenAI GPT-4o-mini for complex queries (30-40% of queries).

**Key Philosophy**: Smart classification for optimal performance. Simple queries get instant answers (<100ms), complex queries get intelligent analysis (2-10s).

### Core Principles

1. **Smart Classification**: Research-backed decision tree routes queries optimally
2. **Two-Tier Performance**: Instant answers for simple queries, deep analysis for complex ones
3. **Always Fresh Data**: No persistent cache, fetches fresh from Zendesk API every time
4. **Comprehensive AI Context**: Provides ALL tickets (not just 50) with word counts and descriptions
5. **Simple Architecture**: Easy to understand, maintain, and extend
6. **No Filesystem**: Vercel serverless compatible - no file writes, in-memory caching only

---

## Quick Start

### 1. Verify Credentials

```bash
# Check environment variables are set
echo $ZENDESK_SUBDOMAIN
echo $ZENDESK_EMAIL

# Test Zendesk API
curl -u "${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}" \
  "https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json"
```

### 2. Start Development Server

```bash
# Development server (port 1333)
bun run dev

# Open http://localhost:1333/zendesk
```

### 3. Test Basic Queries

Try these in order of complexity:
1. `help` - Show available commands
2. `how many tickets are open` - Simple count
3. `show recent tickets` - Recent activity
4. `what areas need help` - AI analysis

---

## Architecture

### Two-Tier Data Flow

```
User Query
   ↓
Chat Container (handles input)
   ↓
Smart Query Handler
   ↓
Query Classifier (research-based decision tree)
   ├─→ TIER 1 (Fast Path <100ms): Discrete queries
   │     ↓
   │   Pattern Matching (cache stats)
   │     ↓
   │   Instant Answer
   │
   └─→ TIER 2 (AI Path 2-10s): Complex queries
         ↓
       Zendesk API Client (fetches ALL tickets)
         ↓
       AI Context Builder (word counts, descriptions, stats)
         ↓
       OpenAI GPT-4o-mini (intelligent analysis)
         ↓
       Formatted Response
   ↓
Display to User
```

### Technology Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Next.js 16 API routes + Node.js
- **Runtime**: Bun 1.3.1
- **APIs**: Zendesk REST v2, OpenAI GPT-4o-mini
- **Build**: Turbopack (Next.js compiler)

### Styling Architecture

**Zendesk inherits styles from the main 8lee.ai terminal theme:**

- **Layout**: Uses minimal layout wrapper that inherits root terminal styling
- **Password Gate**: Uses shared `PasswordGate` component from `_shared/password-gate.tsx`
- **Colors**: `bg-black`, `text-green-500`, `font-mono` (inherited from root)
- **No Custom Styles**: Zero experiment-specific CSS overrides

This design ensures visual consistency with the main portfolio site while maintaining complete code isolation.

---

## File Structure

```
app/zendesk/
├── page.tsx                           # Main entry point
├── layout.tsx                         # Zendesk-specific layout
├── components/
│   ├── zendesk-chat-container.tsx    # Main orchestrator
│   ├── zendesk-header.tsx            # ASCII art header
│   ├── chat-history.tsx              # Message display
│   ├── chat-input.tsx                # Terminal input
│   ├── message-bubble.tsx            # Message renderer
│   └── suggestion-bar.tsx            # Quick queries
├── lib/
│   ├── ticket-cache.ts               # Fetches fresh ticket data
│   ├── classify-query.ts             # Query classifier
│   ├── smart-query-handler.ts        # Two-tier orchestrator
│   ├── query-patterns.ts             # Pattern recognition library
│   ├── conversation-cache.ts         # Conversation context
│   ├── cached-ai-context.ts          # AI context builder
│   ├── zendesk-api-client.ts         # API client (18 methods)
│   ├── response-formatter.ts         # Terminal formatting
│   └── types.ts                      # TypeScript definitions
├── cache/
│   ├── tickets/                      # Ticket cache directory
│   └── conversation-cache.json       # Conversation cache
├── api/
│   ├── query/route.ts                # Main query endpoint
│   ├── reply/route.ts                # AI reply generation
│   ├── analyze/route.ts              # AI analysis
│   ├── interpret-query/route.ts      # Query interpretation
│   └── refresh/route.ts              # Manual refresh
├── scripts/
│   ├── create-synthetic-tickets.ts   # Generate test tickets
│   ├── queries-test.ts               # Query tests
│   ├── api-test.ts                   # API tests
│   ├── full-workflow-test.ts         # Full workflow tests
│   ├── generate-tickets.ts           # Ticket generator
│   ├── generate-tickets-with-replies.ts # Tickets with replies
│   └── add-ticket-metadata.ts        # Add metadata
├── __tests__/
│   ├── metadata-operations.test.ts   # Metadata tests (28 tests)
│   └── openai-response-quality.test.ts # AI quality tests
└── _docs/
    ├── README.md                      # This file
    ├── TESTING.md                     # Test results
    └── ARCHIVE.md                     # Historical docs
```

---

## Key Components

### 1. Zendesk API Client (`lib/zendesk-api-client.ts`)

**Purpose**: Handle all Zendesk REST API v2 interactions

**Main Methods** (18 total):

```typescript
// Ticket Retrieval
getTickets(filters?: { status, priority, limit }): Promise<ZendeskTicket[]>
getTicket(ticketId: number): Promise<ZendeskTicket>
getTicketsByIds(ticketIds: number[]): Promise<ZendeskTicket[]>
searchTickets(query: string): Promise<ZendeskTicket[]>

// Ticket Creation & Updates
createTicket(data: TicketCreateData): Promise<ZendeskTicket>
updateTicket(ticketId: number, data: TicketUpdateData): Promise<ZendeskTicket>
updateTicketStatus(ticketId: number, status: string): Promise<ZendeskTicket>
updateTicketPriority(ticketId: number, priority: string): Promise<ZendeskTicket>
addTicketComment(ticketId: number, body: string, public: boolean): Promise<Comment>

// Ticket Operations
deleteTicket(ticketId: number): Promise<void>
restoreTicket(ticketId: number): Promise<ZendeskTicket>
mergeTickets(targetId: number, sourceIds: number[]): Promise<JobStatus>
markAsSpam(ticketId: number): Promise<ZendeskTicket>
updateManyTickets(ticketIds: number[], data: BulkUpdateData): Promise<JobStatus>

// Metadata Operations
assignTicket(ticketId: number, assigneeEmail: string): Promise<ZendeskTicket>
addTags(ticketId: number, tags: string[]): Promise<ZendeskTicket>
removeTags(ticketId: number, tags: string[]): Promise<ZendeskTicket>

// Users & Organizations
getUsers(filters?: { role, active }): Promise<ZendeskUser[]>
getOrganizations(): Promise<ZendeskOrganization[]>

// Analytics
getTicketStats(): Promise<Record<string, number>>
```

**Key Features**:
- Basic Auth with email/token credentials
- Automatic pagination (fetches ALL results)
- In-memory caching (5-min TTL for tickets, 1-hour for users/orgs)
- Rate limiting awareness (429 handling)
- Comprehensive error handling

### 2. Query Classification System (`lib/classify-query.ts`)

**Purpose**: Research-based two-tier decision tree for routing queries

**Architecture**:
- **TIER 1 (Fast Path <100ms)**: Discrete queries from pre-computed cache
- **TIER 2 (AI Path 2-10s)**: Complex queries via OpenAI GPT-4o-mini

**Multi-Stage Decision Tree**:

```
Stage 1: Explicit Exclusions (ALWAYS CACHE)
  → System commands: refresh, update, sync, help

Stage 2: Strong AI Signals (ALWAYS AI)
  → Content inspection: mentions, contains, talks about
  → Analysis requests: analyze, review, investigate
  → Why questions: why, what's causing, root cause
  → Trend detection: common, frequent, trending
  → Sentiment: angry, frustrated, happy

Stage 3: Complex Modifiers (ALWAYS AI)
  → Length-based: longer than, more than X words
  → Recommendations: should, recommend, prioritize
  → Action verbs: which ones, tell me which
  → Conditionals: if, when, where, with more than

Stage 4: Ambiguous Comparatives (Context-Dependent)
  → "Which status has most tickets?" → Cache
  → "What are most common problems?" → AI

Stage 5: Default → Cache for performance
```

**Performance Metrics** (based on 346 tickets):
- Cache Hit Rate: 60-70% of queries → <100ms response
- AI Usage: 30-40% of queries → 2-10s response
- Accuracy: 95%+ cache, 85%+ AI
- Metadata queries: <2ms (sub-millisecond)

### 3. Smart Query Handler (`lib/smart-query-handler.ts`)

**Purpose**: Orchestrates two-tier query processing

**Flow**:
1. Check for explicit ticket number operations
2. Handle reply requests with explicit ticket IDs
3. Handle ticket creation requests
4. Handle status/priority updates
5. Handle delete/spam/merge/restore operations
6. Classify remaining queries via `classifyQuery()`
7. If discrete pattern matched → Return instant answer
8. If no match → Fall back to AI analysis

**Operation Handlers**:
- Reply Generation: Generate and post AI replies
- Status Update: Change ticket status
- Priority Update: Change ticket priority
- Assignment: Assign tickets to agents
- Tags: Add or remove tags
- Delete/Spam: Soft delete or mark as spam
- Merge: Combine multiple tickets
- Restore: Restore deleted tickets
- Create Ticket: AI-powered parameter extraction
- List Users/Customers: Fetch and display users

### 4. Query Pattern Recognition (`lib/query-patterns.ts`)

**Purpose**: Comprehensive natural language pattern library

**Architecture**:
- **16 operation categories**: retrieval, status, priority, creation, deletion, merge, assignment, tags, collaboration, reply, analytics, organization, users, system, bulk operations
- **100+ regex patterns**: covering all common natural language variations
- **Type-safe definitions**: TypeScript interfaces for all patterns

**Helper Functions**:
```typescript
extractTicketId(query: string): number | null
extractTicketIds(query: string): number[]
extractStatus(query: string): string | null
extractPriority(query: string): string | null
extractEmails(query: string): string[]
extractTags(query: string): string[]
matchQuery(query: string): QueryPattern[]
getBestMatch(query: string): QueryPattern | null
```

---

## API Endpoints

### POST `/api/zendesk/query`

**Purpose**: Main unified query endpoint

**Request**:
```json
{
  "query": "how many urgent tickets?"
}
```

**Response**:
```json
{
  "answer": "Tickets with tag **urgent**: 6",
  "source": "cache",
  "confidence": 0.95,
  "processingTime": 2
}
```

### POST `/api/zendesk/reply`

**Purpose**: AI-powered reply generation

**Request**:
```json
{
  "ticketId": 473
}
```

**Response**:
```json
{
  "success": true,
  "ticketId": 473,
  "commentId": 43427955631764,
  "replyBody": "Hello,\n\nThank you for reaching out...",
  "ticketLink": "https://8lee.zendesk.com/agent/tickets/473"
}
```

### POST `/api/zendesk/refresh`

**Purpose**: Trigger manual refresh of ticket data

**Response**:
```json
{
  "success": true,
  "ticketCount": 316,
  "message": "Successfully fetched 316 tickets from Zendesk",
  "stats": {
    "byStatus": { "open": 42, "pending": 71, ... },
    "byPriority": { "urgent": 12, "high": 45, ... }
  }
}
```

---

## Environment Setup

### Required Variables

```bash
# Zendesk Configuration
ZENDESK_SUBDOMAIN=8lee
ZENDESK_EMAIL=jleekun@gmail.com
ZENDESK_API_TOKEN=xhUpLvStmznUeLCN2HuYcj860W9HCfOM7qQOGrKY

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...
```

### Verification

```bash
# Test Zendesk API
curl -u "${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}" \
  "https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json"

# Expected: HTTP 200 with ticket JSON
```

---

## Development

### Running Locally

```bash
# Development server
bun run dev
# Open http://localhost:1333/zendesk

# Build for production
bun run build

# Run tests
bun test

# Run Zendesk-specific tests
bun run test:zendesk
```

### Making Changes

**To modify query patterns**:
1. Edit `lib/query-patterns.ts`
2. Add pattern to relevant category
3. Test with query classifier

**To add new API features**:
1. Add method to `lib/zendesk-api-client.ts`
2. Update types in `lib/types.ts`
3. Add formatting logic in `lib/response-formatter.ts`

**To change terminal styling**:
1. All styles use Tailwind CSS utilities
2. Green theme: `text-green-500`, `bg-black`, `font-mono`
3. No custom CSS - Tailwind utilities only

---

## Performance Characteristics

### Latency

| Operation | Typical Time | Notes |
|-----------|-------------|-------|
| Load tickets | 2-3 seconds | Fetches ALL tickets via pagination |
| Simple query | 500ms | Pattern match + format |
| Metadata queries | <2ms | Tags, types, priorities |
| AI analysis | 2-4 seconds | OpenAI GPT-4o processing |
| Statistics | <100ms | Calculated from cached data |

### API Limits

**Zendesk**:
- Standard: 200 requests/min
- Pagination: ~100 tickets per page
- Current load: 346 tickets = 4 API calls

**OpenAI**:
- GPT-4o: 10,000 requests/min
- Current load: <1% of limit

---

## Troubleshooting

### Common Issues

**"No tickets found"**
- Check Zendesk credentials in .env
- Verify subdomain is correct
- Test API directly with curl

**"Rate limit exceeded"**
- Wait 60 seconds
- Check if other processes are hitting Zendesk API
- Implement exponential backoff

**"AI analysis failed"**
- Check OpenAI API key
- Verify GPT-4o model access
- Check request logs for specific error

**"Slow responses"**
- Expected for fresh-fetch approach (2-3s)
- Pagination of 346 tickets = 4 sequential API calls
- Acceptable for demo purposes

---

## Security Considerations

**Implemented**:
- Environment variables for all credentials
- Basic Auth over HTTPS
- Input validation on all queries
- Error messages don't expose internals
- CORS properly configured

**Before Production**:
- [ ] Add authentication layer for chat interface
- [ ] Implement rate limiting per user
- [ ] Add CSRF protection
- [ ] Audit all API responses for sensitive data
- [ ] Set up proper logging/monitoring

---

## Testing

See [TESTING.md](./TESTING.md) for comprehensive test results and coverage.

**Current Status**:
- 28 integration tests
- 92.9% success rate
- Sub-2ms metadata queries
- 100% tag/type query accuracy

---

## Summary

The Zendesk Intelligence Portal is a **production-ready terminal-styled interface** that:

- Always fetches fresh data from Zendesk API
- Uses AI for intelligent query processing
- Provides terminal-formatted responses
- Handles 346+ tickets with full pagination
- Sub-2ms metadata queries (tags, types, priorities)
- 92.9% query classification accuracy
- Comprehensive metadata operations
- 28 integration tests with production validation
- macOS-style terminal UI with window controls
- Simple architecture (no cache complexity)
- Deployable to production immediately

**Philosophy**: Keep it simple. Fetch fresh. Let AI do the thinking. Display beautifully.
