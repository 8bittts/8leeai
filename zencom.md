# ZenCom Project Plan

A technical separation project creating dedicated demo sites for Zendesk and Intercom implementations at distinct URLs with shared styling but isolated logic.

---

## Vision

Transform a single implementation containing both Zendesk and Intercom code into a cleanly separated, maintainable architecture:

- **8lee.ai/zendesk** - Zendesk integration demo with terminal UI
- **8lee.ai/intercom** - Intercom integration demo with terminal UI
- Both inherit the terminal landing page design from main site
- Independent credential management per implementation
- Isolated component logic and routing

---

## Project Structure (After Implementation)

```
8leeai/
├── app/                           # Main site (existing)
│   ├── layout.tsx                # References app/globals.css
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── globals.css               # SHARED - referenced by all 3 sites
│   └── api/
│
├── zendesk/                       # NEW: Zendesk demo site
│   ├── app/
│   │   ├── layout.tsx            # References ../app/globals.css (SHARED)
│   │   ├── page.tsx              # Zendesk-specific page logic
│   │   ├── not-found.tsx         # Zendesk 404 handler
│   │   └── api/
│   │       └── zendesk/          # Zendesk-specific API routes
│   │           ├── contact/      # Contact form submission
│   │           └── ...
│   ├── components/               # Zendesk-specific component logic only
│   ├── hooks/                    # Zendesk-specific hooks only
│   ├── lib/
│   │   ├── data.ts              # Zendesk-specific data/config
│   │   └── utils.ts             # Zendesk-specific utilities
│   └── tsconfig.json            # References root tsconfig
│
├── intercom/                      # NEW: Intercom demo site
│   ├── app/
│   │   ├── layout.tsx            # References ../app/globals.css (SHARED)
│   │   ├── page.tsx              # Intercom-specific page logic
│   │   ├── not-found.tsx         # Intercom 404 handler
│   │   └── api/
│   │       └── intercom/         # Intercom-specific API routes
│   │           ├── contact/      # Contact form submission
│   │           └── ...
│   ├── components/               # Intercom-specific component logic only
│   ├── hooks/                    # Intercom-specific hooks only
│   ├── lib/
│   │   ├── data.ts              # Intercom-specific data/config
│   │   └── utils.ts             # Intercom-specific utilities
│   └── tsconfig.json            # References root tsconfig
│
├── components/                   # GLOBAL SHARED (main site + reused as needed)
├── hooks/                        # GLOBAL SHARED (main site + reused as needed)
├── lib/                          # GLOBAL SHARED (main site + reused as needed)
├── public/                       # GLOBAL SHARED (all sites)
├── next.config.ts               # Unified Next.js config (routes all 3 sites)
├── tsconfig.json                # Root TypeScript config
├── postcss.config.mjs           # Root PostCSS + shared Tailwind
├── tailwind.config.ts           # Root Tailwind config
├── biome.json                   # Unified linting/formatting
├── package.json                 # Unified dependencies
├── zencom.md                    # THIS FILE
└── ...other files...
```

### Key Styling Architecture

**Simple approach - no new directories:**
- Existing `/app/globals.css` serves as the shared stylesheet
- Zendesk and Intercom layouts reference it via relative path: `../app/globals.css`
- Main app layout continues using: `./globals.css`
- **Result:** One style change = instant updates everywhere
- **Cleanup:** Delete `/zendesk` and `/intercom` directories → all custom code gone, main site untouched

---

## Phase 1: Directory Structure & Copying (Current Focus)

### Step 1.1: Create zendesk directory structure

```bash
mkdir -p zendesk/app/api/zendesk
mkdir -p zendesk/components
mkdir -p zendesk/hooks
mkdir -p zendesk/lib
```

**Note:** No separate styles or config files - all reference root/app

### Step 1.2: Create intercom directory structure

```bash
mkdir -p intercom/app/api/intercom
mkdir -p intercom/components
mkdir -p intercom/hooks
mkdir -p intercom/lib
```

**Note:** No separate styles or config files - all reference root/app

### Step 1.3: Copy zendesk files from main

```bash
# App files
cp app/layout.tsx zendesk/app/layout.tsx
cp app/page.tsx zendesk/app/page.tsx
cp app/not-found.tsx zendesk/app/not-found.tsx

# Components - LOGIC ONLY
cp -r components/* zendesk/components/

# Hooks - unchanged
cp -r hooks/* zendesk/hooks/

# Lib - unchanged
cp -r lib/* zendesk/lib/

# Config - symlink to root (or .gitignore if you prefer copies)
ln -s ../tsconfig.json zendesk/tsconfig.json
```

### Step 1.4: Copy intercom files from main

```bash
# App files
cp app/layout.tsx intercom/app/layout.tsx
cp app/page.tsx intercom/app/page.tsx
cp app/not-found.tsx intercom/app/not-found.tsx

# Components - LOGIC ONLY
cp -r components/* intercom/components/

# Hooks - unchanged
cp -r hooks/* intercom/hooks/

# Lib - unchanged
cp -r lib/* intercom/lib/

# Config - symlink to root (or .gitignore if you prefer copies)
ln -s ../tsconfig.json intercom/tsconfig.json
```

### Step 1.5: Update layout files to reference shared app/globals.css

**For `zendesk/app/layout.tsx`:**
```tsx
// Change from: import './globals.css'
// To:
import '../app/globals.css'
```

**For `intercom/app/layout.tsx`:**
```tsx
// Change from: import './globals.css'
// To:
import '../app/globals.css'
```

**Main `app/layout.tsx`:** No change needed (already imports `./globals.css`)

### Step 1.6: Update Next.js config to handle new routes

Modify `next.config.ts` to route `/zendesk/*` requests to zendesk app and `/intercom/*` requests to intercom app using Next.js rewrites or subdirectory structure.

---

## Phase 2: Configuration & Routing

### Step 2.1: Update next.config.ts

Configure Next.js to handle:
- Main site at `/` (existing app)
- Zendesk site at `/zendesk` → routes to `zendesk/app`
- Intercom site at `/intercom` → routes to `intercom/app`

Using Next.js import aliases or monorepo pattern.

### Step 2.2: Environment variables

Create separate `.env` sections:
```
# Main site
NEXT_PUBLIC_MAIN_ENABLED=true

# Zendesk demo
NEXT_PUBLIC_ZENDESK_ENABLED=true
NEXT_PUBLIC_ZENDESK_WORKSPACE_NAME=<workspace>
NEXT_PUBLIC_ZENDESK_CONTACT_FORM_ID=<form_id>
ZENDESK_API_KEY=<api_key>
ZENDESK_ACCOUNT_EMAIL=<email>

# Intercom demo
NEXT_PUBLIC_INTERCOM_ENABLED=true
NEXT_PUBLIC_INTERCOM_APP_ID=<app_id>
INTERCOM_API_TOKEN=<api_token>
```

### Step 2.3: Create routing strategy

Decide on one of two approaches:

**Option A: Subdirectory routing (Recommended)**
- `/` → main site (current app)
- `/zendesk/*` → zendesk/app
- `/intercom/*` → intercom/app
- Uses Next.js `rewrites` or basePath config

**Option B: Separate Next.js instances**
- Same port, different URLs
- More complex build process
- Better isolation

**Recommend: Option A** - Simpler, single build process

---

## Phase 3: Styling & Layout Harmonization

✅ **AUTOMATICALLY SOLVED BY PHASE 1 ARCHITECTURE**

All three sites share:
- ✅ Single `/styles/globals.css` (Tailwind-only, no custom CSS)
- ✅ Single `tailwind.config.ts` at root (inherited by all sites)
- ✅ Single `postcss.config.mjs` at root (inherited by all sites)
- ✅ IBM Plex Mono font globally available
- ✅ Terminal green theme (`text-green-500`, `bg-black`) globally available
- ✅ Responsive breakpoints (`sm`, `lg`) globally available

### Style Change Workflow (Example)

**Want to change terminal green from `text-green-500` to `text-emerald-500`?**

1. Edit `/styles/globals.css` (one location)
2. Changes automatically apply to:
   - Main site (`8lee.ai`)
   - Zendesk site (`8lee.ai/zendesk`)
   - Intercom site (`8lee.ai/intercom`)
3. Done (no other files need updating)

### No Validation Needed

Because all three sites reference the same files via relative imports, styling automatically stays in sync. No audit or duplication check required.

---

## Phase 4: Core Logic Removal & Architecture Review

**Status:** ✅ COMPLETED
- Main `app/` is clean (no Zendesk/Intercom references found)
- Both demo sites ready for clean implementations

### What Was Found:
- ✅ Zero integration code in main app (isolated as intended)
- ✅ Demo sites (`app/zendesk`, `app/intercom`) structurally ready
- ✅ All components copied but contain no third-party integration logic

### Result:
Clean slate for production-grade implementations in Phase 5

---

## Phase 5: Production-Grade Implementations with AI Integration

### Architecture Foundations (Recruiter-Impressing Standards)

**OpenAI Integration Pattern** (from deathnote project):
- ✅ Vercel AI SDK (`@ai-sdk/openai`) with GPT-4o
- ✅ Structured prompts with modular architecture
- ✅ Input validation via Zod schemas
- ✅ Rate limiting for cost control
- ✅ Post-processing for output quality
- ✅ Metadata generation (word count, timing, etc.)

---

### Step 5.1: Zendesk Implementation - "Intelligent Ticketing System"

**Core Features:**
1. **Contact Form → Ticket Creation**
   - User submits contact via terminal UI
   - API: `POST /api/zendesk/tickets` creates Zendesk ticket
   - Returns ticket ID, status, and auto-assigned team member

2. **AI-Powered Initial Response** (Recruiter-Impressive)
   - Uses GPT-4o to generate intelligent first response based on ticket subject
   - Suggests 3 response templates ranked by relevance
   - Team member can approve, edit, or regenerate
   - System learns from approved responses (via tagged metadata)

3. **Real-Time Ticket Status Dashboard**
   - Shows pending tickets with priority indicators
   - Updates via polling every 10 seconds
   - Color-coded by status (pending, in-progress, resolved, closed)

4. **Customer Satisfaction AI**
   - After resolution, generates satisfaction survey
   - Analyzes responses with sentiment analysis
   - Flags urgent feedback for human review

**API Endpoints:**
```
POST /api/zendesk/tickets - Create ticket
GET /api/zendesk/tickets - List tickets
GET /api/zendesk/tickets/:id - Get ticket details
POST /api/zendesk/suggest-response - AI response suggestions
POST /api/zendesk/feedback - Store customer feedback
```

**Tech Stack:**
- Zod for validation
- OpenAI GPT-4o for responses
- Zendesk SDK for API calls
- TypeScript strict mode
- Unit tests for all API handlers

---

### Step 5.2: Intercom Implementation - "AI Conversational Messenger"

**Core Features:**
1. **Intelligent Chat Interface**
   - Terminal-styled live chat widget
   - Conversation history stored with context
   - AI suggests next message topics based on conversation flow

2. **AI-Powered Responses** (Recruiter-Impressive)
   - First message: AI generates contextual response in style of brand
   - Follow-ups: AI understands conversation context, suggests answers
   - Button: "Escalate to Human" with context pre-populated
   - System routes to most relevant human agent

3. **Visitor Analytics & Personalization**
   - Tracks visitor info: page time, bounce, return status
   - AI generates greeting based on visit history
   - Suggests help topics based on current page

4. **Conversation Zoning**
   - AI categorizes conversations (sales, support, feedback)
   - Auto-routes to correct team
   - Provides human with pre-written handoff context

**API Endpoints:**
```
POST /api/intercom/conversations - Start new conversation
GET /api/intercom/conversations/:id - Get conversation history
POST /api/intercom/messages - Send message (human or AI)
POST /api/intercom/suggest-message - AI message suggestions
POST /api/intercom/route-to-human - Escalate to human agent
GET /api/intercom/visitor-analytics - Get visitor data
```

**Tech Stack:**
- Zod for validation
- OpenAI GPT-4o for responses
- Intercom API SDK
- WebSocket for real-time updates
- TypeScript strict mode
- Unit tests + integration tests

---

### Step 5.3: Code Quality Standards (Recruiter Checklist)

**All implementations MUST include:**

✅ **Type Safety**
- TypeScript strict mode
- Zod runtime validation
- No `any` types
- Proper error types

✅ **Error Handling**
- Try-catch with specific error types
- Structured error responses
- Rate limit errors (429)
- Timeout handling (>10s)

✅ **Security**
- Environment variables for all credentials
- Request validation
- CORS properly configured
- Rate limiting (5-10 req/min per user)
- No credentials in logs

✅ **Testing**
- Unit tests for API handlers
- Happy path + error paths
- Mocked external API calls
- 80%+ code coverage

✅ **Observability**
- Structured logging (JSON format)
- Request/response logging
- Performance metrics
- Error tracking

✅ **Documentation**
- JSDoc on all functions
- README with setup instructions
- Example requests/responses
- Architecture diagrams (Mermaid)

---

### Step 5.4: Testing & QA

- ✅ Verify main site unaffected: `8lee.ai`
- ✅ Test Zendesk: `8lee.ai/zendesk` - create ticket, view status, test AI responses
- ✅ Test Intercom: `8lee.ai/intercom` - start conversation, test routing, escalation
- ✅ All share identical styling/UX baseline
- ✅ Load test both with concurrent users (at least 50)
- ✅ Test error states: API timeouts, invalid input, rate limits

---

## Files to Modify/Create (Summary)

### Create (New)
- [ ] `zendesk/app/` structure (layout, page, not-found, api/)
- [ ] `zendesk/components/`, `zendesk/hooks/`, `zendesk/lib/`
- [ ] `intercom/app/` structure (layout, page, not-found, api/)
- [ ] `intercom/components/`, `intercom/hooks/`, `intercom/lib/`

### Modify
- [ ] `zendesk/app/layout.tsx` - Change import to `import '../app/globals.css'`
- [ ] `intercom/app/layout.tsx` - Change import to `import '../app/globals.css'`
- [ ] `next.config.ts` - Add routing/rewrites for `/zendesk` and `/intercom`
- [ ] `.env.local` - Add environment variables for both services
- [ ] `.gitignore` - Ensure no duplication issues

### No Changes Needed
- ✅ `app/globals.css` - Stays in place, shared by all three sites
- ✅ `app/layout.tsx` - Already imports `./globals.css`

### Remove (Later - Phase 4)
- [ ] Zendesk/Intercom code from main `app/`
- [ ] Integration APIs from main

---

## Benefits of This Approach

✅ **Clear Separation** - Each implementation is isolated and maintainable
✅ **Zero Style Duplication** - Single `/styles/globals.css` synced everywhere
✅ **Single Point of Change** - Modify style once, updates all 3 sites automatically
✅ **Independent Logic** - Can work on Zendesk or Intercom separately
✅ **Easy Demo** - Show two different integrations on one domain
✅ **Credential Isolation** - Different env vars per service
✅ **Future Proof** - Can add more integrations (Drift, HubSpot, etc.) without touching main site
✅ **Zero Maintenance** - No risk of style drift between sites

---

## Current Status

- ✅ Phase 1 complete: Directory structure & copying (app/zendesk, app/intercom created with all files)
- ✅ Phase 2 complete: Configuration & routing (Next.js routes `/zendesk` and `/intercom` working, proxy fixed)
- ✅ Phase 3 complete: Styling & layout harmonization (skipped - automatic via shared imports)
- ✅ Phase 4 complete: Core logic cleanup (main app verified clean, demo sites ready)
- 🚀 Phase 5 IN PROGRESS: Production-grade AI-integrated implementations
  - Zendesk: Intelligent Ticketing with AI response suggestions
  - Intercom: AI Conversational Messenger with routing & analytics
  - Both following recruiter-impressing code standards

---

## Phase 2 Completion: Configuration & Routing

### Executed Tasks:
1. ✅ Created `app/zendesk/` and `app/intercom/` subdirectories
2. ✅ Copied all files (layout, page, not-found, components, hooks, lib) to both subdirectories
3. ✅ Updated layout imports to reference shared `../globals.css`
4. ✅ Simplified `next.config.ts` (no rewrites needed - Next.js routes naturally)
5. ✅ Created `.env.local` template with environment variable placeholders
6. ✅ Verified build output shows all three routes:
   ```
   Route (app)
   ┌ ○ /
   ├ ○ /_not-found
   ├ ○ /intercom
   └ ○ /zendesk
   ```

### Architecture Result:
- **`/` (main)** - Portfolio (app/layout.tsx imports `./globals.css`)
- **`/zendesk`** - Zendesk demo (app/zendesk/layout.tsx imports `../globals.css`)
- **`/intercom`** - Intercom demo (app/intercom/layout.tsx imports `../globals.css`)

### Cleanup Strategy:
```bash
rm -rf app/zendesk app/intercom
```
Removes all custom code while keeping main site 100% intact.

---

## Architecture Decision: Zero New Directories

**Key Principle:** Keep root directory clean for easy cleanup

Rather than creating new shared directories like `/styles`, reuse what already exists:
- Zendesk and Intercom reference the existing `app/globals.css` via relative path `../globals.css`
- No new top-level directories created
- **Cleanup:** Delete `app/zendesk` and `app/intercom` → entire project reversion is one command

**Import Pattern:**
- `app/layout.tsx` → `import './globals.css'` (unchanged)
- `app/zendesk/layout.tsx` → `import '../globals.css'` (reference shared)
- `app/intercom/layout.tsx` → `import '../globals.css'` (reference shared)

**Result:** One style change = instant updates everywhere. Easy cleanup when sites are removed.

---

## Notes

- The copy-paste approach is intentional: allows independent development without shared state complexity
- Styling is **not** duplicated - all sites reference shared `app/globals.css`
- No new directories added to root (temporary sites should be deletable)
- `rm -rf zendesk intercom` removes all custom code, main site remains 100% intact
- Config files (tsconfig.json, PostCSS, Tailwind) stay at root and are referenced via symlink
- Future optimization could extract shared components to `/components/shared` if needed
