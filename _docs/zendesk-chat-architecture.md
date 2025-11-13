# Zendesk Chat Interface Architecture

## Overview
Transform `/zendesk` from a projects display into an intelligent, terminal-styled chat interface that allows natural language queries against all Zendesk APIs. The interface maintains the existing terminal aesthetic while providing powerful data exploration capabilities.

---

## 1. USER INTERFACE LAYOUT

### Screen Layout (Terminal Style)
```
┌─────────────────────────────────────────────────────────────┐
│ $ Zendesk Intelligence Terminal v1.0                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ [Chat History / Response Area]                              │
│                                                               │
│ > User Query 1                                              │
│   [Streaming Response with data tables/formatting]          │
│                                                               │
│ > User Query 2                                              │
│   [Formatted response with metrics/insights]                │
│                                                               │
│ (scrollable, auto-scroll on new messages)                   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ > _                                                          │
│   [Input field with cursor, syntax highlighting]           │
├─────────────────────────────────────────────────────────────┤
│ Suggestions: [tickets] [chats] [calls] [users] [help]      │
└─────────────────────────────────────────────────────────────┘
```

### Key Components
1. **Chat History Panel** (scrollable, main content area)
   - User queries styled as `> query text`
   - AI responses with formatted data
   - Streaming response indicators
   - Timestamps (optional)
   - Copy-to-clipboard on responses

2. **Input Area** (sticky bottom)
   - Terminal-style prompt `> `
   - Auto-focus on load
   - Syntax highlighting for recognized commands
   - Command history (up/down arrows)
   - Submit button or Enter to send

3. **Suggestions Bar**
   - Quick-access buttons for common queries
   - Dynamic based on context
   - Example: after viewing tickets, suggest "show analytics"

4. **Status Indicator**
   - Show when AI is thinking/processing
   - Streaming response animation
   - API call status

---

## 2. COMPONENT STRUCTURE

### New Components to Create

#### `ZendeskChatContainer` (Main orchestrator)
- State management for chat history, current input
- Handle boot sequence
- Manage message streaming
- Error handling and recovery
- Session management

#### `ChatHistory` (Display component)
- Render message bubbles
- Format responses with tables/lists
- Handle markdown rendering
- Auto-scroll on new messages
- Message actions (copy, retry, filter)

#### `ChatInput` (Input component)
- Terminal-style input field
- Command history navigation
- Auto-suggestions/autocomplete
- Command validation visual feedback
- Submit handling

#### `AIResponseRenderer` (Formatting component)
- Convert API responses to terminal-friendly format
- Table formatting (ASCII art tables)
- List rendering
- Metric/stat visualization
- Error message display

#### `SuggestionBar` (UI component)
- Dynamic suggestion buttons
- Quick-access to common queries
- Context-aware recommendations

#### `StreamingIndicator` (Status component)
- Show processing status
- Animated loading state
- Thinking indicator

### Existing Components to Modify
- Keep `BootSequence` (reuse existing)
- Adapt `MatrixBackground` (reuse existing)
- Keep `TerminalContainer` structure (but adapt for chat)

### Directory Structure
```
app/zendesk/
├── page.tsx
├── layout.tsx
├── components/
│   ├── boot-sequence.tsx (reuse from root)
│   ├── matrix-background.tsx (reuse from root)
│   ├── zendesk-chat-container.tsx (NEW)
│   ├── chat-history.tsx (NEW)
│   ├── chat-input.tsx (NEW)
│   ├── ai-response-renderer.tsx (NEW)
│   ├── suggestion-bar.tsx (NEW)
│   ├── streaming-indicator.tsx (NEW)
│   └── message-bubble.tsx (NEW)
├── hooks/
│   ├── use-chat-history.ts (NEW)
│   ├── use-api-client.ts (NEW)
│   ├── use-query-interpreter.ts (NEW)
│   └── use-response-formatter.ts (NEW)
└── lib/
    ├── zendesk-api-client.ts (NEW)
    ├── query-interpreter.ts (NEW)
    ├── response-formatter.ts (NEW)
    └── zendesk-queries.ts (NEW)
```

---

## 3. DATA FLOW ARCHITECTURE

### Message Flow
```
User Input
   ↓
ChatInput Component (validation, history storage)
   ↓
Query Interpreter (natural language → API query)
   ↓
API Client (execute Zendesk API calls)
   ↓
Response Formatter (format for terminal display)
   ↓
ChatHistory Component (display with streaming)
   ↓
User sees formatted result
```

### State Management
Using React hooks (no external state libraries per CLAUDE.md):

```typescript
// ZendeskChatContainer state
const [messages, setMessages] = useState<ChatMessage[]>([])
const [currentInput, setCurrentInput] = useState("")
const [isLoading, setIsLoading] = useState(false)
const [commandHistory, setCommandHistory] = useState<string[]>([])
const [historyIndex, setHistoryIndex] = useState(-1)
const [bootComplete, setBootComplete] = useState(false)

// Types
type ChatMessage = {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    apiEndpoint?: string
    executionTime?: number
    recordCount?: number
  }
}
```

---

## 4. NATURAL LANGUAGE QUERY INTERPRETATION

### Query Types & Routing

#### Ticket Queries
**Patterns to recognize:**
- "show me [all/open/closed] [tickets/issues]"
- "find tickets [filter criteria]"
- "how many tickets [condition]"
- "oldest/newest [ticket]"

**Routes to:**
- `GET /api/v2/tickets`
- With filters: status, priority, type, assignee, tags, created date

**Example:**
```
User: "Show me all open support tickets"
Interpreter:
  - Recognized: ticket_list
  - Filters: status=open, type=support
  - API: GET /api/v2/tickets?query=status:open type:support
Formatter:
  - Display as paginated table
  - Show: ID, Subject, Priority, Status, Created
```

#### Analytics Queries
**Patterns:**
- "what's [the/our] [metric]"
- "show me [statistic]"
- "average/total [metric]"

**Routes to:**
- `GET /api/v2/incremental/tickets`
- Calculate metrics from responses

**Example:**
```
User: "What's our average response time?"
Interpreter:
  - Recognized: metric_query
  - Metric: average_response_time
  - API: GET /api/v2/tickets with calculation
Formatter:
  - Display: "Average Response Time: 4.2 hours"
  - Show trend graph (ASCII-based)
```

#### User/Organization Queries
**Patterns:**
- "find [users/organizations/customers]"
- "show me all [entity type]"
- "list [entities] [filter]"

**Routes to:**
- `GET /api/v2/users`
- `GET /api/v2/organizations`

#### Help Center Queries
**Patterns:**
- "find articles about"
- "search knowledge base"
- "what articles mention"

**Routes to:**
- `GET /api/v2/help_center/articles`

#### Automation/Integration Queries
**Patterns:**
- "show [automations/integrations/views]"
- "create [automation/macro]"
- "check [automation] status"

**Routes to:**
- `GET /api/v2/automations`
- `GET /api/v2/macros`
- `GET /api/v2/views`

### Query Interpretation Strategy

#### Phase 1: Pattern Matching
```typescript
const queryPatterns = {
  ticket_list: /^(show|list|find).*(ticket|issue)/i,
  ticket_filter: /ticket.*(status|priority|type|assignee|tag)/i,
  analytics: /^(what's|what is|show).*(average|total|count|metric)/i,
  user_query: /(user|agent|customer|contact).*(find|list|show)/i,
  // ... more patterns
}
```

#### Phase 2: Filter Extraction
Parse the query for filters:
- Status: open, closed, pending, solved
- Priority: urgent, high, normal, low
- Type: problem, incident, question, task
- Time ranges: today, this week, last 30 days
- Custom fields: department, account type, etc.

#### Phase 3: API Construction
Build the API call:
```typescript
const apiCall = {
  method: 'GET',
  endpoint: '/api/v2/tickets',
  params: {
    query: buildZQLQuery(filters),
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 100
  }
}
```

#### Phase 4: Fallback to AI (Claude)
If pattern matching fails:
- Send query to Claude for interpretation
- Use Claude to determine: intent, entity type, filters
- Claude constructs the API call
- Falls back gracefully if uncertain

---

## 5. API CLIENT ARCHITECTURE

### Authentication
```typescript
// API client initialized with Zendesk credentials
const client = new ZendeskAPIClient({
  subdomain: process.env.ZENDESK_SUBDOMAIN,
  email: process.env.ZENDESK_EMAIL,
  apiToken: process.env.ZENDESK_API_TOKEN,
})
```

### Request/Response Handling
```typescript
async function queryAPI(endpoint, params) {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    })

    // Handle pagination
    if (response.meta.has_more) {
      // Auto-fetch additional pages if needed
    }

    return formatResponse(response.data)
  } catch (error) {
    // Rate limit handling (429)
    // Auth error handling (401)
    // Not found handling (404)
  }
}
```

### Caching Strategy
```typescript
// LRU Cache for API responses
const cache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 5 // 5 minutes
})

// Cache keys by query signature
const cacheKey = `${endpoint}:${JSON.stringify(params)}`
```

---

## 6. RESPONSE FORMATTING FOR TERMINAL

### Table Formatting
```
$ list open tickets
┌────┬──────────────────────────────┬──────────┬──────────┐
│ ID │ Subject                      │ Priority │ Status   │
├────┼──────────────────────────────┼──────────┼──────────┤
│ 1  │ Cannot login to account      │ high     │ open     │
│ 2  │ Billing issue - wrong charge │ urgent   │ open     │
│ 3  │ Feature request: dark mode   │ normal   │ pending  │
└────┴──────────────────────────────┴──────────┴──────────┘

Total: 3 tickets | Showing 1-3 of 3
```

### Metric Display
```
$ show statistics
╔════════════════════════════════════════╗
║ Zendesk Support Metrics               ║
╠════════════════════════════════════════╣
║ Total Open Tickets:        47          ║
║ Average Response Time:     2.4 hours   ║
║ Average Resolution Time:   18 hours    ║
║ Customer Satisfaction:     4.2 / 5.0   ║
║ Agents Online:             8 / 12      ║
╚════════════════════════════════════════╝
```

### List Display
```
$ show agents
1. Alice Chen - Support Lead (12 tickets)
2. Bob Martinez - Billing Specialist (8 tickets)
3. Carol Singh - Technical Support (15 tickets)
```

### Error Display
```
$ invalid query
❌ Error: Could not interpret query
Suggestion: Try "show open tickets" or "list customers"
```

---

## 7. IMPRESSIVE FEATURES FOR HIRING MANAGER

### 1. Multi-Query Intelligence
- Parse complex natural language
- Handle ambiguity gracefully
- Learn from context across queries
- Remember previous results

### 2. Real-Time Data
- Stream responses as they load
- Show progress indicators
- Display partial results quickly
- Handle large datasets efficiently

### 3. Smart Formatting
- Auto-detect best display format (table, list, metrics)
- Syntax highlighting for data
- Color-coded status indicators
- Responsive terminal rendering

### 4. Advanced Filtering
- "Show me angry customers"
- "Find tickets older than 7 days"
- "List high-value orgs with issues"
- Complex boolean queries

### 5. Omnichannel Unified View
- Query across tickets, chats, calls, messages
- Show customer 360 view
- Timeline of all interactions
- Cross-channel context

### 6. Predictive Insights
- "Which tickets will breach SLA?"
- "Customers likely to churn"
- "Suggest best agent for this chat"
- "Predict resolution time"

### 7. Automation Showcase
- Create automation rules via chat
- Trigger workflows
- Schedule reports
- Export data

### 8. Integration Examples
- "Send this ticket to Slack"
- "Create GitHub issue from ticket"
- "Sync customer with CRM"
- "Log to analytics platform"

---

## 8. IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure
- Set up `ZendeskChatContainer`
- Implement `ChatHistory` and `ChatInput`
- Basic message rendering
- Command history navigation

### Phase 2: Query Interpretation
- Pattern matching engine
- Filter extraction
- API call construction
- Fallback to Claude AI

### Phase 3: API Integration
- Build ZendeskAPIClient
- Implement caching
- Error handling
- Rate limit management

### Phase 4: Response Formatting
- Table rendering
- Metric visualization
- ASCII art formatting
- Mobile responsiveness

### Phase 5: Impressive Features
- Multi-query context
- Streaming responses
- Smart formatting
- Advanced filtering

### Phase 6: Polish & Performance
- Optimize response times
- Add animations/transitions
- Mobile optimization
- Accessibility

---

## 9. TECHNICAL CONSIDERATIONS

### Performance
- Pagination for large result sets
- Lazy load response content
- Cache frequently accessed data
- Debounce rapid queries

### Security
- Sanitize user input
- Don't expose API tokens in frontend
- Use API backend proxy for requests
- Validate all API responses

### Accessibility
- Keyboard navigation
- ARIA labels for chat bubbles
- Screen reader support
- Focus management

### Mobile Optimization
- Responsive layout
- Touch-friendly buttons
- Keyboard suppression on input
- Optimized table rendering

---

## 10. EXAMPLE CONVERSATIONS (For Demo)

### Conversation 1: Quick Analytics
```
$ show ticket stats
[Response: Total open: 47, Avg resolution: 18h, CSAT: 4.2/5]

$ what's causing delays?
[Response: Long analysis of slow tickets by category]

$ show top 5 issues
[Response: Table of most common problems]
```

### Conversation 2: Customer Investigation
```
$ find tickets from acme corp
[Response: Table of 8 Acme tickets]

$ show their chat history
[Response: Timeline of 3 chats with Acme contacts]

$ what's their support spend?
[Response: Acme Corp spent $45,000 on support this year]
```

### Conversation 3: Agent Performance
```
$ list agents
[Response: Table of all agents with metrics]

$ who's handling our vip customers?
[Response: List of VIP-assigned agents]

$ create automation: route vip to alice
[Response: Automation created successfully]
```

---

## Success Metrics

- **Query Understanding**: Can interpret 80%+ of natural language queries correctly
- **Response Time**: <2s for simple queries, <5s for complex multi-endpoint queries
- **Accuracy**: Data returned matches actual Zendesk state
- **User Satisfaction**: Easy-to-use interface that requires minimal training
- **Hiring Impact**: Demonstrates technical skill, API mastery, UI design, and creative problem-solving
