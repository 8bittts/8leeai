# Zendesk Intelligence Portal - API Expansion Plan

## Current Status

The prompt fix for reply generation has been successfully implemented and tested. All Section 5 (Reply Generation) tests now pass without disclaimers.

**Last Commit**: Fix OpenAI prompt to prevent disclaimers in generated replies (267ffb9)

## Objective

Transform the Zendesk Intelligence Portal into a **general-purpose intelligence system** that can interpret ANY natural language query and map it to functional Zendesk API calls.

## Missing API Capabilities

### Currently Implemented [PASS]
- `getTickets()` - Paginated ticket retrieval with filters
- `getTicket(id)` - Single ticket retrieval
- `getUsers()` - Paginated user retrieval
- `getOrganizations()` - Paginated organization retrieval
- `getTicketStats()` - Basic status analytics
- `addTicketComment()` - Post public/private replies
- `searchTickets()` - ZQL search with pagination

### Phase 1: Core Ticket Management 🔨

#### Ticket Creation
- `createTicket()` - Create single ticket
  - Required: subject, comment (description)
  - Optional: requester_id, assignee_id, group_id, priority, status, type, tags, custom_fields
  - Returns: Created ticket with ID
- `createTickets()` - Bulk creation (up to 100)
  - Returns: job_status for async tracking
- `importTicket()` - Historical import (bypasses business rules)

#### Ticket Updates
- `updateTicket()` - Update single ticket
  - Update status: new, open, pending, hold, solved, closed
  - Update priority: urgent, high, normal, low
  - Update type: problem, incident, question, task
  - Update assignee_id or assignee_email
  - Update group_id
  - Update tags (add/remove/replace)
  - Update custom_fields
  - Set due_at for task types
- `updateTickets()` - Bulk update (up to 100)
  - Bulk format: Same changes to multiple tickets
  - Batch format: Different changes to different tickets
  - Support `additional_tags` and `remove_tags`

#### Ticket Deletion & Recovery
- `deleteTicket()` - Soft delete (recoverable)
- `deleteTickets()` - Bulk soft delete (up to 100)
- `deleteTicketPermanent()` - Immediate permanent deletion
- `deleteTicketsPermanent()` - Bulk permanent deletion
- `getDeletedTickets()` - List soft-deleted tickets
- `restoreTicket()` - Restore single ticket
- `restoreTickets()` - Bulk restore (up to 100)

### Phase 2: Advanced Ticket Operations 🚀

#### Assignment & Collaboration
- `assignTicket()` - Assign to specific agent
- `assignToGroup()` - Assign to agent group
- `addCollaborators()` - Add CC'd users
- `removeCollaborators()` - Remove CC'd users
- `addFollowers()` - Add agent followers
- `removeFollowers()` - Remove agent followers
- `addEmailCCs()` - Add email CCs
- `removeEmailCCs()` - Remove email CCs

#### Tags & Organization
- `addTags()` - Add tags without overwriting existing
- `removeTags()` - Remove specific tags
- `setTags()` - Replace all tags
- `updateOrganization()` - Change ticket's organization

#### Ticket Relationships
- `getCollaborators()` - Get ticket collaborators
- `getFollowers()` - Get ticket followers
- `getEmailCCs()` - Get email CCs
- `getIncidents()` - Get incidents linked to problem ticket
- `getProblems()` - Get problems linked to incident ticket
- `searchProblems()` - Autocomplete problem search

#### Advanced Operations
- `mergeTickets()` - Merge source tickets into target
  - Maintains audit trail
  - Consolidates all comments/attachments
- `markAsSpam()` - Mark single ticket as spam
- `markManyAsSpam()` - Bulk spam marking
  - Auto-suspends requester

### Phase 3: Retrieval & Analytics 

#### Multiple Ticket Retrieval
- `getTicketsByIds()` - Get multiple tickets by IDs (up to 100)
- `getOrganizationTickets()` - Get all tickets for organization
- `getUserTickets()` - Get tickets by user perspective:
  - Requested (submitted by user)
  - Assigned (assigned to agent)
  - CCd (user is collaborator)
  - Followed (user is follower)
- `getRecentTickets()` - Get agent's recently viewed tickets

#### Counting & Stats
- `getTicketCount()` - Get total ticket count
- `getOrganizationTicketCount()` - Count by organization
- `getUserTicketCount()` - Count by user

#### Enhanced Search
- Expand `searchTickets()` with advanced ZQL queries:
  - Date ranges: `created>2025-01-01`
  - Multiple conditions: `status:open AND priority:high`
  - Content search: `description:"login issue"`
  - Tag search: `tags:billing`
  - Assignee search: `assignee:john@company.com`
  - Organization search: `organization:"Acme Corp"`

### Phase 4: Smart Query Expansion 🧠

#### Natural Language → API Mapping

**Current limitations**:
- Smart query handler uses hardcoded patterns
- Limited to predefined query types
- Cannot interpret complex multi-step operations

**New approach**:
1. **Intent Classification Layer**
   - Use AI to classify query intent (create, update, delete, search, analyze, report)
   - Extract parameters from natural language
   - Map to appropriate API calls

2. **Multi-Step Query Execution**
   - Example: "Close all high priority tickets assigned to John that haven't been updated in 7 days"
   - Steps:
     1. Search tickets: `assignee:john@company.com priority:high status:!closed`
     2. Filter by updated_at < 7 days ago
     3. Bulk update status to "closed"
     4. Return confirmation with count and ticket IDs

3. **Conversational Context Enhancement**
   - Store more context: last search results, last ticket operations, last user queries
   - Support pronouns: "assign them to Sarah" (them = last ticket list)
   - Support ranges: "mark tickets 1-5 as spam" (from last results)

4. **Validation & Confirmation**
   - For destructive operations (delete, spam, merge), return preview first
   - Require explicit confirmation: "Are you sure you want to delete 42 tickets?"
   - Implement undo capability where possible

### Phase 5: Test Expansion 🧪

#### Section 4 Expansion (Complex AI Analysis)
**Current tests**: 4 tests
**Target**: 20+ tests

New test categories:
- **Trend Analysis**: "Show me ticket volume trends over the last 30 days"
- **Agent Performance**: "Which agent has the most open tickets?"
- **SLA Analysis**: "How many tickets are at risk of missing SLA?"
- **Content Analysis**: "Find all tickets mentioning 'password reset'"
- **Priority Escalation**: "Which low priority tickets should be escalated?"
- **Organization Insights**: "Show me top 5 organizations by ticket volume"
- **Tag Analysis**: "What are the most common tags in solved tickets?"
- **Response Time**: "What's the average time to first response?"
- **Resolution Analysis**: "What's the average resolution time by priority?"
- **Correlation Analysis**: "Are high priority tickets more likely to be assigned to specific agents?"

#### Section 5 Expansion (Ticket Operations)
**Current tests**: 4 tests (reply generation)
**Target**: 30+ tests

New test categories:
- **Creation**: Create ticket, bulk create, import historical
- **Status Updates**: Open → Pending, Pending → Solved, Solved → Closed
- **Priority Updates**: Escalate to high, downgrade to low
- **Assignment**: Assign to agent, assign to group, reassign
- **Tags**: Add tags, remove tags, replace tags
- **Collaboration**: Add collaborators, add followers, add email CCs
- **Type Management**: Convert to problem, link incident to problem
- **Deletion**: Soft delete, restore, permanent delete
- **Merging**: Merge duplicate tickets
- **Spam**: Mark as spam, bulk spam marking
- **Bulk Operations**: Bulk update status, bulk assign, bulk tag
- **Custom Fields**: Update custom field values
- **Private Notes**: Add internal-only comments
- **Multi-Step**: "Find high priority tickets and assign them to Sarah"

## Implementation Priority

### Week 1: Core Operations
1. Implement Phase 1 (Ticket Creation, Updates, Deletion)
2. Add corresponding tests
3. Update smart query handler to support new operations

### Week 2: Advanced Operations
1. Implement Phase 2 (Assignment, Tags, Relationships, Merging)
2. Add corresponding tests
3. Expand query patterns

### Week 3: Intelligence Layer
1. Implement Phase 4 (Intent Classification, Multi-Step Execution)
2. Add conversational context enhancement
3. Add validation/confirmation flows

### Week 4: Comprehensive Testing
1. Implement Phase 5 (Section 4 & 5 expansion)
2. Achieve 95%+ test coverage
3. Performance optimization

## Success Metrics

- **API Coverage**: Support 40+ Zendesk API operations (currently: 7)
- **Test Coverage**: 80+ tests across 6 sections (currently: 27)
- **Query Interpretation**: Handle 100+ different query patterns (currently: ~20)
- **Success Rate**: 95%+ test pass rate (currently: 84.6%)
- **Response Quality**: Zero AI disclaimers or meta-commentary [PASS]
- **Multi-Step Queries**: Support complex 3-5 step operations (currently: 1-2 steps)

## Notes

- All API methods should include proper TypeScript types
- All methods should implement caching where appropriate
- All methods should clear relevant caches after mutations
- All methods should have comprehensive error handling
- All methods should log operations for debugging
- Priority is making the system feel like "general purpose intelligence" that can interpret ANY support query
