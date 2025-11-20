# Scripts Documentation

This directory contains utility scripts for testing and managing the Zendesk Intelligence Portal.

## Quick Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `test-credentials.sh` | Validate API credentials | `./scripts/test-credentials.sh` |
| `zendesk-generate-tickets.ts` | Create realistic test tickets | `bun scripts/zendesk-generate-tickets.ts [options]` |
| `zendesk-full-workflow-test.ts` | Comprehensive integration test | `bun scripts/zendesk-full-workflow-test.ts` |
| `zendesk-api-test.ts` | API connectivity test | `bun scripts/zendesk-api-test.ts` |
| `zendesk-queries-test.ts` | Query classification test | `bun scripts/zendesk-queries-test.ts` |
| `zendesk-create-synthetic-tickets.ts` | Generate test tickets with metadata | `bun scripts/zendesk-create-synthetic-tickets.ts [count]` |
| `zendesk-add-ticket-metadata.ts` | Add metadata to existing tickets | `bun scripts/zendesk-add-ticket-metadata.ts` |
| `zendesk-generate-tickets-with-replies.ts` | Generate tickets with AI replies | `bun scripts/zendesk-generate-tickets-with-replies.ts` |

---

## 1. test-credentials.sh

### Purpose
Validates that both Zendesk and OpenAI API credentials are correctly configured and authenticated.

### What It Does
- Checks all required environment variables are set
- Tests Zendesk API authentication (makes actual API call)
- Tests OpenAI API authentication (makes actual API call)
- Displays account information and available models
- Shows success/failure status with clear error messages

### Usage

**Basic usage:**
```bash
./scripts/test-credentials.sh
```

**Output Example:**
```
================================================
CREDENTIAL VALIDATION TEST
================================================

Checking environment variables...

ZENDESK_EMAIL: jleekun@gmail.com
ZENDESK_API_TOKEN: xhUpLvStmz...OM7qQOGrKY
ZENDESK_SUBDOMAIN: 8lee
OPENAI_API_KEY: sk-proj-Dr...BiZbU-mwA

================================================
TESTING ZENDESK API
================================================

HTTP Status: 200

ZENDESK API - AUTHENTICATED

Total tickets in account: 15

First ticket (sample):
{
  "id": 2,
  "subject": "Compliance certification status",
  ...
}

================================================
TESTING OPENAI API
================================================

HTTP Status: 200

OPENAI API - AUTHENTICATED

Available models: 108
```

### When to Use
- **Initial setup**: After updating credentials in `.env.local`
- **Troubleshooting**: If API calls are failing in the application
- **Verification**: Before deploying to production
- **Monitoring**: Periodic checks that credentials haven't expired

### Required Environment Variables
```bash
ZENDESK_EMAIL=your-admin-email@example.com
ZENDESK_API_TOKEN=your-api-token
ZENDESK_SUBDOMAIN=your-subdomain
OPENAI_API_KEY=sk-proj-your-key
```

### Troubleshooting

**Zendesk returns 401 Unauthorized:**
- Verify email matches your Zendesk admin account
- Check API token hasn't been revoked in Zendesk admin panel
- Regenerate API token at: `https://your-subdomain.zendesk.com/admin/apps-and-integrations/apis/zendesk-api`

**OpenAI returns 401 Unauthorized:**
- Check API key hasn't been disabled/revoked
- Verify API key has billing method attached
- Make sure key isn't restricted to specific IPs (if applicable)

---

## 2. zendesk-generate-tickets.ts

### Purpose
Generates realistic, varied support tickets directly in your Zendesk account. Useful for testing analytics, UI rendering, and AI analysis features with actual data.

### What It Does
- Generates realistic ticket data (names, emails, subjects, descriptions)
- Creates tickets directly in Zendesk via API
- Rate-limited to prevent API overwhelming (configurable delay)
- Shows success/failure summary
- Adds relevant tags by category (support, sales, feedback, general)
- Varies priority and status for realistic distribution

### Usage

**Create 10 random tickets (default):**
```bash
bun scripts/zendesk-generate-tickets.ts
```

**Create 100 tickets with slower rate limiting:**
```bash
bun scripts/zendesk-generate-tickets.ts --count 100 --delay 1000
```

**Create 50 tickets with fixed priority:**
```bash
bun scripts/zendesk-generate-tickets.ts --count 50 --priority high
```

**Create 25 tickets with all settings customized:**
```bash
bun scripts/zendesk-generate-tickets.ts --count 25 --delay 750 --priority urgent --status open
```

### Command-Line Options

| Option | Default | Range | Description |
|--------|---------|-------|-------------|
| `--count` | 10 | 1-100 | Number of tickets to create |
| `--delay` | 500ms | 100ms-∞ | Milliseconds between API requests (rate limiting) |
| `--priority` | random | low, normal, high, urgent | Fixed priority for all tickets (if set, random otherwise) |
| `--status` | random | new, open, pending, solved | Fixed status for all tickets (if set, random otherwise) |

### Examples

**Populate account with 100 realistic tickets:**
```bash
bun scripts/zendesk-generate-tickets.ts --count 100 --delay 500
# Takes ~50 seconds (100 tickets × 500ms delay)
```

**Quick load test with 50 high-priority urgent tickets:**
```bash
bun scripts/zendesk-generate-tickets.ts --count 50 --priority high --delay 250
```

**Generate support tickets in pending status for workflow testing:**
```bash
bun scripts/zendesk-generate-tickets.ts --count 30 --status pending
```

### Output Example

```
╔═══════════════════════════════════════════════════════════════════╗
║         ZENDESK TICKET GENERATOR - Create Realistic Tickets      ║
╚═══════════════════════════════════════════════════════════════════╝

🔧 Configuration:
   Subdomain: 8lee
   Email: jleekun@gmail.com
   Tickets to create: 15
   Delay between requests: 500ms

🎲 Generating 15 random tickets...

📬 Submitting tickets to Zendesk (500ms delay between requests)...

📤 Creating ticket 1/15...
   From: Diana Martinez <diana.martinez@work.email>
   Subject: Compliance certification status
   Priority: urgent | Status: pending
   Tags: question
   ✅ Created! Ticket ID: 2

[... continues for all tickets ...]

╔═══════════════════════════════════════════════════════════════════╗
║                        TEST RESULTS                             ║
╠═══════════════════════════════════════════════════════════════════╣
║ Total Created:    15                                                     ║
║ Successful:       15                                                     ║
║ Failed:           0                                                      ║
║ Success Rate:     100%                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

✅ All tickets created successfully!
   View them at: https://8lee.zendesk.com/agent/dashboard
```

### Data Generated

The script generates varied, realistic data across 4 categories:

**Support Category** (20% of tickets)
- Subjects: Login issues, bugs, integrations, API questions
- Descriptions: Technical error reports, debugging information
- Tags: bug, account, integration, api, urgent
- Priority: Varies (more urgent tickets)

**Sales Category** (25% of tickets)
- Subjects: Quote requests, pricing questions, demo requests
- Descriptions: Enterprise inquiries, licensing questions
- Tags: opportunity, enterprise, quote, demo
- Priority: Mix of normal and high

**Feedback Category** (30% of tickets)
- Subjects: Feature requests, UI improvements, suggestions
- Descriptions: User experience feedback, improvement ideas
- Tags: feature-request, ux, improvement, performance
- Priority: Mostly normal/low

**General Category** (25% of tickets)
- Subjects: General questions, policy, information
- Descriptions: Compliance questions, integration inquiries
- Tags: question, information, policy
- Priority: Varies

### Rate Limiting

The `--delay` option controls the millisecond pause between API requests. This is important to avoid:
- **Rate limiting** (Zendesk limits requests per minute)
- **API overload** (overwhelming the server)
- **Database locks** (multiple concurrent writes)

**Recommended delays:**
- **Development/testing**: 250-500ms (fast, safe)
- **Production**: 500-1000ms (conservative, safe)
- **Large batch (100+ tickets)**: 1000ms+ (very safe)

### When to Use

**Regular Testing:**
```bash
# Start of week - refresh test data
bun scripts/zendesk-generate-tickets.ts --count 50
```

**Feature Development:**
```bash
# Need lots of tickets for UI testing
bun scripts/zendesk-generate-tickets.ts --count 100 --delay 500
```

**Analytics Testing:**
```bash
# Test with varied priorities
bun scripts/zendesk-generate-tickets.ts --count 100 --delay 500
```

**Workflow Testing:**
```bash
# Test with specific statuses
bun scripts/zendesk-generate-tickets.ts --count 30 --status pending
```

### Troubleshooting

**Script fails with "Missing required environment variables":**
- Ensure `.env.local` has all required variables set
- Run `./scripts/test-credentials.sh` first to verify setup

**Many tickets fail to create:**
- Increase `--delay` (API rate limiting)
- Check that Zendesk account has API access enabled
- Verify email/token credentials are still valid

**Takes too long:**
- Reduce `--delay` (but be careful of rate limits)
- Create in smaller batches: `--count 50` twice instead of `--count 100`

**Tickets created but don't appear immediately:**
- Zendesk may cache results, refresh the dashboard
- API response shows ticket ID even if not visible yet
- Wait 30 seconds and refresh browser

---

## 3. Environment Configuration

Both scripts require the following in `.env.local`:

```bash
# Required for both scripts
ZENDESK_EMAIL=your-admin-email@example.com
ZENDESK_API_TOKEN=your-zendesk-api-token
ZENDESK_SUBDOMAIN=your-subdomain

# Required for ticket generation (AI analysis features)
OPENAI_API_KEY=sk-proj-your-openai-key
```

### How to Get Credentials

**Zendesk API Token:**
1. Go to: `https://your-subdomain.zendesk.com/admin/apps-and-integrations/apis/zendesk-api`
2. Click "Add API Token"
3. Name it (e.g., "8lee-app-token")
4. Copy the token (shown only once)
5. Add to `.env.local`

**OpenAI API Key:**
1. Go to: `https://platform.openai.com/api/keys`
2. Click "Create new secret key"
3. Copy the key
4. Add to `.env.local`

---

## 4. Common Workflows

### Setup New Development Environment
```bash
# 1. Verify credentials
./scripts/test-credentials.sh

# 2. Create initial test data
bun scripts/zendesk-generate-tickets.ts --count 50 --delay 500

# 3. Start dev server
bun run dev

# 4. Access at http://localhost:1333/zendesk
```

### Refresh Test Data
```bash
# Clear old tickets in Zendesk manually, then:
bun scripts/zendesk-generate-tickets.ts --count 100 --delay 500
```

### Load Testing Analytics
```bash
# Create lots of varied tickets for analytics testing
bun scripts/zendesk-generate-tickets.ts --count 200 --delay 250

# Then test:
# - http://localhost:1333/zendesk
# - Type: "how many tickets are open"
# - Type: "what areas need help" (AI analysis)
```

### Create Specific Test Scenarios
```bash
# All urgent tickets
bun scripts/zendesk-generate-tickets.ts --count 30 --priority urgent

# All pending (for workflow testing)
bun scripts/zendesk-generate-tickets.ts --count 30 --status pending

# Mixed with normal delays
bun scripts/zendesk-generate-tickets.ts --count 50 --delay 500
```

---

## 5. Performance Notes

### Script Performance

**test-credentials.sh:**
- Takes ~2-3 seconds
- Makes 2 HTTP requests (one to Zendesk, one to OpenAI)

**zendesk-generate-tickets.ts:**
- Time = (count × delay) + setup time
- Example: 100 tickets × 500ms delay = ~50 seconds + 2 seconds setup = ~52 seconds
- Makes count HTTP requests to Zendesk API

### API Rate Limits

**Zendesk API:**
- Standard plan: 10,000 requests/minute
- With 500ms delay: 120 requests/minute = Well under limit
- Safe for generating up to 200-300 tickets per batch

**OpenAI API:**
- Rate limits depend on plan
- This script doesn't call OpenAI (only the Zendesk analysis endpoint does)

### Recommended Batch Sizes

| Use Case | Count | Delay | Time |
|----------|-------|-------|------|
| Quick test | 10 | 250ms | ~4 sec |
| Development | 50 | 500ms | ~28 sec |
| Full dataset | 100 | 500ms | ~53 sec |
| Production test | 100 | 1000ms | ~103 sec |

---

## 6. Tips & Best Practices

✅ **DO:**
- Run credential test before generating tickets
- Start with small batches (10-20) to verify it works
- Use `--delay 500` as default safe setting
- Monitor success rate in output
- Check Zendesk dashboard after creation

❌ **DON'T:**
- Run generator multiple times simultaneously (creates duplicate load)
- Use `--delay` below 100ms (risk of rate limiting)
- Run with very large counts (>500) in single batch
- Assume instant appearance in Zendesk dashboard (may cache)

💡 **TIPS:**
- Save common commands as aliases in your shell
- Use `--count 0` would fail; minimum is 1
- Ticket IDs are returned in output for verification
- All tickets are created with current timestamp
- Tags help filter and organize test data

---

## 7. Script Source Files

- **test-credentials.sh** - `/scripts/test-credentials.sh` (150 lines, shell)
- **zendesk-generate-tickets.ts** - `/scripts/zendesk-generate-tickets.ts` (400+ lines, TypeScript)

Both are well-commented and can be modified for custom test scenarios.

---

---

## 3. zendesk-full-workflow-test.ts

### Purpose
Comprehensive integration test for the entire Zendesk Intelligence Portal. Tests all query types, context awareness, two-way communication, and error handling.

### What It Does
- 🧪 Tests 25+ different query types and scenarios
- ✅ Validates general conversation handling (weather, greetings, etc.)
- ✅ Tests ticket querying and information retrieval
- ✅ Validates context-aware ticket listing
- ✅ Tests complex AI-powered analysis
- ✅ Tests two-way communication (reply generation and posting)
- ✅ Validates error handling and edge cases
- 📊 Provides detailed test summary with success rates

### Usage

**IMPORTANT**: Dev server must be running on port 1333

**Step 1: Start dev server in one terminal:**
```bash
bun run dev
```

**Step 2: Run tests in another terminal:**
```bash
bun run test:zendesk
```

**Or run directly:**
```bash
bun scripts/zendesk-full-workflow-test.ts
```

### Test Sections

**Section 1: General Conversation & System Commands**
- Empty query returns help text
- Help command shows comprehensive guide
- Greeting responses are professional and zen-like
- "How are you" gets calm, focused response
- Weather queries politely redirect
- Time queries provide helpful answers
- Thank you acknowledgments are professional

**Section 2: Ticket Querying & Information Retrieval**
- Total ticket count queries
- Open tickets count
- Status breakdown
- Priority distribution
- High priority tickets
- Recent tickets (last 7 days)

**Section 3: Context-Aware Ticket Listing**
- Show top 5 tickets (stores in context)
- List top 10 tickets (updates context)
- Validates ticket data is returned

**Section 4: Complex AI-Powered Analysis**
- Most common problems analysis
- Tickets needing attention
- Content search (e.g., "login issues")
- Word count analysis (descriptions > 200 words)

**Section 5: Context-Aware Reply Generation**
- Reply request without context (graceful failure)
- Reply generation for first ticket (with context)
- Reply generation for second ticket
- Invalid ticket index handling
- Validates reply posted to Zendesk
- Validates direct link returned

**Section 6: Error Handling & Edge Cases**
- Very long queries (600+ characters)
- Special characters in queries
- Mixed case queries

### Output Example

```
╔═══════════════════════════════════════════════════════════════════╗
║   ZENDESK INTELLIGENCE PORTAL - COMPREHENSIVE TEST SUITE        ║
╚═══════════════════════════════════════════════════════════════════╝

API Base URL: http://localhost:1333
Starting comprehensive tests...

================================================================================
SECTION 1: General Conversation & System Commands
================================================================================

🧪 Testing: Empty Query → Help Text
   Query: ""
   Source: cache
   Confidence: 100%
   Duration: 45ms
   ✅ PASSED

🧪 Testing: Help Command
   Query: "help"
   Source: cache
   Confidence: 100%
   Duration: 38ms
   ✅ PASSED

...

================================================================================
SECTION 5: Context-Aware Reply Generation
================================================================================

🧪 Testing: Reply Request - First Ticket
   Query: "build a reply for the first ticket and send it to zendesk"
   Source: ai
   Confidence: 95%
   Duration: 4532ms
   ✉️  Reply generated and posted to Zendesk
   🔗 Direct link included in response
   ✅ PASSED

================================================================================
TEST SUMMARY
================================================================================

Total Tests: 27
Passed: 27
Failed: 0
Success Rate: 100.0%

================================================================================
✅ ALL TESTS PASSED!
```

### What Gets Tested

**API Endpoints:**
- `/api/zendesk/query` - All query types
- `/api/zendesk/reply` - Reply generation and posting

**Query Handler Features:**
- General conversation detection
- Help text generation
- Ticket list queries with context storage
- Complex AI analysis
- Reply request handling
- Error handling

**Context Awareness:**
- Ticket storage after list queries
- Context propagation between queries
- Ticket index parsing ("first", "second", etc.)
- Graceful failure when context missing

**Two-Way Communication:**
- AI reply generation via OpenAI
- Reply posting to Zendesk API
- Direct link generation
- Comment ID extraction

### Performance Metrics

**Expected Response Times:**
- Cache queries (help, stats): 20-100ms
- Discrete queries (counts): 100-500ms
- AI queries (analysis): 2-5 seconds
- Reply generation: 3-6 seconds (includes API posting)

### Troubleshooting

**Script fails with "Connection refused":**
- Ensure dev server is running: `bun run dev`
- Check server is on port 1333
- Wait 10 seconds after starting dev server

**Tests fail with "No tickets found":**
- Run ticket generator first: `bun scripts/zendesk-generate-tickets.ts --count 50`
- Refresh cache manually via UI: type "refresh"
- Check Zendesk credentials are valid

**Reply tests fail:**
- Verify OpenAI API key is correct in `.env.local`
- Check Zendesk API allows ticket updates
- Ensure test tickets exist (run generator)
- Check API rate limits haven't been exceeded

**Some tests timeout:**
- AI analysis can take 5-10 seconds
- Increase timeout if needed
- Check internet connection
- Verify OpenAI API is responsive

### When to Run

**After Feature Changes:**
```bash
# Changed query handler logic? Test it:
bun run test:zendesk
```

**Before Deployment:**
```bash
# Ensure everything works:
bun run test:zendesk
```

**After Credential Updates:**
```bash
# Verify new keys work:
./scripts/test-credentials.sh
bun run test:zendesk
```

**Continuous Integration:**
```bash
# Can be integrated into CI/CD pipeline
bun run test:zendesk
```

### Exit Codes

- **0**: All tests passed
- **1**: One or more tests failed (process exits with failure code)

---

## Support & Troubleshooting

For detailed troubleshooting, see the individual script sections above.

**Quick checklist if things aren't working:**
1. ✅ Run `./scripts/test-credentials.sh` - should pass both tests
2. ✅ Check `.env.local` has all required variables
3. ✅ Verify Zendesk account has API access enabled
4. ✅ Verify OpenAI account has valid billing method
5. ✅ Try with smaller batch size (`--count 5`) first
6. ✅ Increase delay (`--delay 1000`) if rate limiting errors
7. ✅ Run comprehensive test: `bun run test:zendesk`
