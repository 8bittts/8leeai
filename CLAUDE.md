# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: This Project Uses Bun

**This project exclusively uses Bun 1.3.1 as its package manager and runtime.**

- **NEVER use npm, yarn, or pnpm commands**
- **ALWAYS use `bun` commands for all operations**
- `package.json` has `"packageManager": "bun@1.3.1"` enforcing this
- All scripts in `package.json` use `bun` or `bunx` exclusively
- Test runner: Bun's native test runner (not Jest, Vitest, or others)
- All dependencies installed via `bun install`
- Biome (linting/formatting) installed as devDependency, executed via `bunx biome` for consistency

**If you see any npm/yarn/pnpm references, they are incorrect and must be replaced with Bun equivalents.**

## Quick Start

```bash
# Development (port 1333 with Turbopack, auto-kills existing process, clears caches)
bun run dev

# Build for production (clears caches first)
bun run build

# Run tests
bun test

# Run tests in watch mode
bun run test:watch

# Lint and format code (via bunx biome)
bun run check

# Clean all caches manually (.next, .turbo, node_modules/.cache)
bun run clean

# Check for package updates with breaking change analysis
bun run packages
# Note: Auto-removes .md file after simple/safe updates
# Keeps .md file only for complex updates (CAUTION/URGENT) requiring review

# Continuous package monitoring (checks every 6 hours)
bun run packages:watch

# Only critical/security updates
bun run packages:critical

# Or run the script directly with options:
bun scripts/x-package-monitor.js
bun scripts/x-package-monitor.js --watch
bun scripts/x-package-monitor.js --critical
```

## Git Commit Guidelines

**IMPORTANT: When committing to the main branch:**

- **NO Claude attribution**: Do not include "Generated with Claude Code" or similar callouts
- **NO co-authorship**: Do not add "Co-Authored-By: Claude <noreply@anthropic.com>"
- **User account only**: Commits should be attributed solely to the user's Git account
- Write clear, conventional commit messages describing the changes
- Use standard git commit format without any AI-related metadata

**Example commit message format:**
```
type: Brief description

Detailed explanation of changes if needed.

- Bullet points for specifics
- No Claude attribution
- No co-authorship tags
```

## Project Overview

Terminal-style portfolio website featuring authentic DOS simulation with boot sequence, typewriter effects, and command-line interaction.

**Tech Stack:**
- Next.js 16.0.3 + React 19.2.0 + TypeScript 5.9.3 (strict mode)
- Tailwind CSS v4.1.17 (utility classes only, zero custom CSS)
- Vercel Analytics 1.5.0 + Speed Insights 1.2.0
- Biome 2.3.6 (linting/formatting with 100+ error-level rules)
- AI/ML: Vercel AI SDK 5.0.95 + OpenAI SDK 2.0.68
- Email: Resend 6.5.1
- Bun 1.3.1 (package manager, runtime, test runner)
- Type Definitions: `@types/node@24.10.1`, `@types/react@19.2.6`, `@types/react-dom@19.2.3`

## Architecture

### Component Hierarchy
1. **BootSequence** - Terminal boot animation with typewriter effect and blinking cursor
2. **TerminalContainer** - State orchestration hub (no external state libraries, React hooks only)
3. **CVContent** - Portfolio content display with typewriter effect and auto-scroll on pagination
4. **CommandPrompt** - Command interface handling user input
5. **MatrixBackground** - Canvas-based Matrix rain effect (mobile only, 8% opacity)
6. **NotFound** (404) - Mario-themed error page, returns to home on interaction
7. **Cursor** - Reusable blinking cursor component (2px mobile, 1px desktop, 2s pulse)
8. **DataGridSection** - Reusable grid layout for Education/Volunteer sections
9. **SecureExternalLink** - Secure link component preventing window.opener vulnerabilities
10. **ASCII Logo** - Desktop-only branding (top-right, 4s slow pulse animation for subtle visibility)

### State Management
- All state managed in `TerminalContainer`, passed down via props
- Command state flows: TerminalContainer → CVContent & CommandPrompt
- No Redux, Zustand, or other external state libraries

### Data Layer
All portfolio data lives in `/lib/data.ts`:
- **Projects**: 64 entries (DATA_OFFSETS.projects: 1-64) with `id`, `name`, `url`, `linkWord`
- **Education**: 5 entries (DATA_OFFSETS.education: 65-69)
- **Volunteer**: 6 entries (DATA_OFFSETS.volunteer: 70-75)
- Projects paginated (15 per page), auto-scroll on mobile
- Links: Only words matching `linkWord` are underlined/clickable
- All external links use secure `openExternalLink()` utility (never direct `window.open()`)

### Styling System
- **ONLY Tailwind utility classes** - zero custom CSS
- Terminal green theme: `text-green-500`, `bg-black`
- IBM Plex Mono font for authentic terminal feel
- Responsive breakpoints: `sm`, `lg`
- **Font size scale** (5 sizes only):
  - `text-xs` - Small UI elements (command instructions, version number)
  - `text-sm` - Body text, grids, contact info
  - `text-xl` - Section headings
  - `text-3xl` - Main page title
  - `text-6xl` - Mobile watermark only

### User Experience Flow
1. Boot sequence displays dynamic version (MS-DOS v[age]) and boot messages with typewriter effect
2. Boot sequence pauses at `$:` prompt, waiting for user interaction (click or keypress)
3. User clicks or presses any key to transition from boot screen to main content
4. Audio plays at 2% volume during boot-to-content transition (`/public/cj.m4a`, preloaded)
5. Main content displays with command prompt after boot completes
6. Matrix-style falling characters animate in background (mobile only, 13fps for battery efficiency)
7. Blinking cursor visible at `$:` prompt (animations use `requestAnimationFrame` for performance)
8. **Input automatically focuses on mount** - cursor is immediately ready for typing without requiring click/tap
9. **Command prompt accepts:**
   - Text commands (optional `/` prefix): `email`, `github`, `wellfound`, `linkedin`, `x`, `education`, `volunteer`, `clear`, `random`, `help`
   - Project numbers: 1-64
   - Education numbers: 65-69
   - Volunteer numbers: 70-75
   - **Keyboard shortcuts**: `Ctrl+L` / `Cmd+K` to clear terminal
10. Pressing Enter shows 15 more projects with smooth auto-scroll centered in viewport (mobile UX optimized)
11. On mobile, keyboard hides after Enter via simple blur/focus pattern
12. Invalid commands/numbers trigger red flash animation
13. Links have hover states with subtle green background highlight for better affordance
14. Content sections fade in smoothly with 300ms transitions

## Development Workflow

### Pre-Commit Checklist
1. Run `bun run check` - Biome linting/formatting
2. Run `bun test` - Execute all unit and component tests (32 tests, 99 assertions)

### Special File Rules
**Release notes are now organized in the `_docs/` directory by month.** Files follow the pattern `[year]-[month].md` (e.g., `2025-november.md`). These files are manually curated by the project maintainer. Only modify release notes when explicitly requested. Formatting: date-based organization within each monthly file (no timestamps), all entries for a day under same date heading.

### Zendesk Intelligence Portal Documentation

**EXPERIMENT STATUS: CONCLUDED - FULLY ISOLATED AND READY FOR DELETION**

**All Zendesk files are consolidated in `/app/zendesk/` with complete isolation from main app:**

**Isolation Status (VERIFIED):**
- Zero code dependencies - no imports between main app and zendesk
- Complete file consolidation - all 49 files in `/app/zendesk/`
- Global prefix standardization - all files prefixed with `zendesk-`
- Safe to delete - removing `/app/zendesk/` will NOT break homepage
- 13,569 lines of experimental code fully isolated

**Deletion Guide:**
- **See `app/zendesk/_docs/DELETION-GUIDE.md`** for step-by-step deletion instructions
- Requires cleanup of 4 main app files (command references only):
  - `components/command-prompt.tsx` - Remove "zendesk" and "zen" commands
  - `lib/utils.ts` - Remove zendesk from VALID_COMMANDS
  - `proxy.ts` - Remove zendesk demo site routing and CSP
  - `package.json` - Remove test:zendesk script

**Documentation** (`app/zendesk/_docs/`):
- **`zendesk-README.md`** - Main documentation (architecture, API reference, quick start, usage)
- **`zendesk-TESTING.md`** - Test results and coverage (28 integration tests, 92.9% success rate)
- **`zendesk-ARCHIVE.md`** - Historical documentation (implementation status, expansion plans, demo guides)
- **`zendesk-SCRIPTS.md`** - Script documentation and usage guides
- **`DELETION-GUIDE.md`** - Complete deletion instructions and rollback plan

**Key Features (Experimental):**
- Natural language query processing with AI-powered analysis
- Ticket operations: Create, update, delete, assign, tag management
- Smart caching with two-tier query classification (cache <100ms, AI 2-10s)
- Pattern recognition for discrete queries (status, priority, type, tags)
- Context-aware conversation with memory of last query and ticket list
- Comprehensive metadata support (assignees, tags, ticket types, groups)
- 92.9% query classification accuracy with sub-2ms metadata queries

**Directory Structure:**
```
app/zendesk/
├── _docs/           # Documentation (5 files including DELETION-GUIDE.md)
├── api/             # API routes (7 endpoints)
├── cache/           # Cache files (tickets/, conversation-cache.json)
├── components/      # React components (18 files, all prefixed)
├── hooks/           # React hooks (4 files, all prefixed)
├── lib/             # Utilities and core logic (15 files, all prefixed)
├── scripts/         # Test and utility scripts (8 files, all prefixed)
├── __tests__/       # Integration tests (6 files)
├── page.tsx         # Main entry point (password: booya)
├── layout.tsx       # Layout wrapper
└── not-found.tsx    # Custom 404 page
```

**When working with Zendesk code:**
1. Refer to `app/zendesk/_docs/zendesk-README.md` for comprehensive documentation
2. All API methods in `app/zendesk/lib/zendesk-api-client.ts`
3. Query handling in `app/zendesk/lib/zendesk-smart-query-handler.ts`
4. Pattern matching in `app/zendesk/lib/zendesk-query-patterns.ts`
5. Cache management in `app/zendesk/lib/zendesk-ticket-cache.ts`
6. API routes in `app/zendesk/api/*/route.ts`
7. Test scripts in `app/zendesk/scripts/zendesk-*.ts`

**File Organization Rules (ALL Zendesk files in app/zendesk/):**
- **Documentation** → `app/zendesk/_docs/` (zendesk-README.md, zendesk-TESTING.md, zendesk-ARCHIVE.md)
- **API Routes** → `app/zendesk/api/[endpoint]/route.ts`
- **Scripts** → `app/zendesk/scripts/zendesk-[name].ts`
- **Components** → `app/zendesk/components/[name].tsx`
- **Library** → `app/zendesk/lib/[name].ts`
- **Tests** → `app/zendesk/__tests__/[name].test.ts`
- **Cache** → `app/zendesk/cache/` (ignored by git)

### Intercom Intelligence Portal Documentation

**STATUS: PRODUCTION READY**

**All Intercom files are consolidated in `/app/intercom/` with complete isolation from main app:**

**Production Status:**
- Zero TypeScript errors
- Zero Biome lint issues
- Complete Intercom API integration
- 116 synthetic test tickets
- Comprehensive documentation in single MASTER.md file
- 62 TypeScript files (17 components, 7 API routes, 14 scripts, 14 lib files)

**Documentation:**
- **See `app/intercom/_docs/intercom-MASTER.md`** for complete documentation
- Single consolidated documentation file (no duplication)
- Comprehensive coverage: architecture, API reference, testing, troubleshooting

**Key Features (Production Ready):**
- Natural language query processing with OpenAI GPT-4o
- Ticket & conversation operations (create, read, update, search)
- Smart caching with two-tier query system (cache <100ms, AI 2-10s)
- Automatic pagination for tickets (page-based) and conversations (cursor-based)
- Context-aware conversation history
- Safe synthetic data generation (5 tickets/batch, 3s delays)
- Comprehensive metadata support (admins, teams, tags, ticket types, contacts)

**Directory Structure:**
```
app/intercom/
├── _docs/                     # Documentation (1 file)
│   └── intercom-MASTER.md       # Complete documentation
├── api/                       # API routes (7 routes)
├── components/                # React components (17 files)
├── hooks/                     # React hooks (2 files)
├── lib/                       # Core logic (14 files)
├── scripts/                   # Utility scripts (14 files)
├── __tests__/                 # Integration tests (6 files)
├── page.tsx                   # Main entry point (password: booya)
├── layout.tsx                 # Layout wrapper
└── not-found.tsx              # Custom 404 page
```

**When working with Intercom code:**
1. **Always refer to `app/intercom/_docs/intercom-MASTER.md`** for complete documentation
2. API Client: `app/intercom/lib/intercom-api-client.ts`
3. Query Handler: `app/intercom/lib/intercom-smart-query-handler.ts`
4. Cache Layer: `app/intercom/lib/intercom-conversation-cache.ts`
5. Types: `app/intercom/lib/intercom-types.ts`
6. Main UI: `app/intercom/components/intercom-terminal-container.tsx`

**File Organization Rules (ALL Intercom files in app/intercom/):**
- **Documentation** → `app/intercom/_docs/intercom-MASTER.md` (single consolidated file)
- **API Routes** → `app/intercom/api/[endpoint]/route.ts`
- **Scripts** → `app/intercom/scripts/[name].ts` (all prefixed with `intercom-`)
- **Components** → `app/intercom/components/intercom-[name].tsx`
- **Library** → `app/intercom/lib/intercom-[name].ts`
- **Hooks** → `app/intercom/hooks/use-intercom-[name].ts`
- **Tests** → `app/intercom/__tests__/[name].test.ts`
- **No cache directory** (in-memory only, no persistent files)

**Environment Variables:**
```bash
INTERCOM_ACCESS_TOKEN   # Bearer token from Intercom Developer Hub
OPENAI_API_KEY          # OpenAI API key for GPT-4o
INTERCOM_SUBDOMAIN      # Optional: for ticket links
```

**Quick Start:**
```bash
# Test credentials
./app/intercom/scripts/test-credentials.sh

# Generate synthetic data
bun app/intercom/scripts/intercom-generate-synthetic-data.ts --count 50

# Verify cache
bun app/intercom/scripts/verify-cache-data.ts

# Access portal
# http://localhost:1333/intercom (password: booya)
```

### Adding New Content

**Commands:**
1. Add to `VALID_COMMANDS` array in `/lib/utils.ts`
2. Update `handleCommand` logic in `command-prompt.tsx`

**Projects/Education/Volunteer:**
- Edit `/lib/data.ts`
- Maintain format with bullet points (not dashes)
- Update DATA_OFFSETS if ranges change

**Link Text Rendering:**
- Use `renderTextWithUnderlinedWord()` from `/lib/utils.ts` for consistent highlighting

**Animation Timing:**
- Adjust constants in `/lib/utils.ts` ANIMATION_DELAYS

### Security Configuration

**Headers:**
- Update `/proxy.ts` for CSP, CORS, HSTS, XSS protection

**URL Redirects:**
- Edit `isSemanticUrl()` and `isMalformedUrl()` in `/lib/utils.ts`
- Update proxy logic in `/proxy.ts` if needed
- Semantic URLs (≤30 chars, lowercase/numbers/hyphens) → 301 redirect to homepage (preserves link equity from 20+ years of external links)
- Malformed URLs (SQL injection, path traversal, PHP probing) → 404 page

## Quality Standards

### Code Organization
- Shared rendering logic extracted to utilities (`/lib/utils.ts`)
- Reusable components: Cursor, DataGridSection, SecureExternalLink
- All code includes concise, useful comments:
  - JSDoc at component-level
  - Inline comments for complex logic
  - Comments explain WHY, not just what

### Accessibility
Full WCAG 2.1 AA compliance:
- Semantic HTML
- ARIA live regions
- Keyboard navigation
- Focus indicators
- Skip links
- Prefers-reduced-motion support

### Performance
- Matrix background uses `requestAnimationFrame` at 13fps (battery-optimized for mobile)
- Audio preloaded (`/public/cj.m4a`)
- Typewriter hook optimized with `useRef`
- All caches cleared automatically on dev/build runs
- Smooth fade-in transitions (300ms) for content sections
- Optimized auto-scroll behavior centers content in viewport
- ASCII logo uses CSS animation (4s pulse cycle, desktop-only)

### Security
Production-grade security with comprehensive proxy:
- **CSP**: Minimal external allowlist, strict directives
- **CORS**: Restrictive policy locked to https://8lee.ai
- **HSTS**: HTTP Strict Transport Security enabled
- **XSS Protection**: Browser XSS filters enabled
- **Permissions Policy**: Disables unnecessary features (camera, mic, etc.)
- **Robot Blocking**: Comprehensive no-index/no-follow (robots.txt + X-Robots-Tag)
- **External Links**: Secure `openExternalLink()` prevents window.opener vulnerabilities
- **Legacy URL Redirects**:
  - Semantic URLs (≤30 chars, lowercase/numbers/hyphens) → 301 redirect to homepage
  - Malformed URLs (SQL injection, path traversal, PHP probing) → 404 page

### Testing Philosophy

Tests focus on **user intent and business logic**, not implementation details. This makes tests resilient to refactoring while documenting why features exist.

**Core Principles:**

1. **Test WHY, not HOW**
   - Good: "prevents keyboard popup when navigating command history on touch devices"
   - Bad: "sets readonly attribute to true"

2. **Test observable behavior**
   - Good: "gradually reveals text character by character for terminal aesthetic"
   - Bad: "types out text with 50ms intervals using setInterval"

3. **Document user needs in test names**
   - Good: "highlights specific word to show users what's clickable"
   - Bad: "underlines matching word (case-insensitive)"

4. **Explain intent in comments**
   - Every assertion includes a comment explaining the business reason
   - Comments answer: "Why does this matter to users?"

**Test Coverage (32 tests, 99 assertions):**
- **`lib/utils.test.ts`** - Data integrity, user input validation, security filtering (URL validation, malicious pattern detection)
- **`hooks/use-typewriter.test.tsx`** - Authentic terminal content reveal
- **`hooks/use-virtual-keyboard-suppression.test.tsx`** - Mobile keyboard control (hide after Enter)
- **`components/cursor.test.tsx`** - Visual feedback for terminal readiness

**Example: Intent-Focused Test**

```typescript
test("hides keyboard after command submission on touch devices", () => {
  // Intent: After pressing Enter, keyboard should hide so user can see terminal output
  input.focus()
  expect(document.activeElement).toBe(input)

  result.current.suppressVirtualKeyboard()

  // Keyboard should hide (blur removes focus on mobile)
  expect(document.activeElement).not.toBe(input)
})
```

## Reference

### File Structure

```
8leeai/
├── app/
│   ├── layout.tsx          # Root layout with metadata, Analytics & SpeedInsights
│   ├── page.tsx            # Main page component
│   ├── not-found.tsx       # Custom 404 with Mario background
│   └── globals.css         # Pure Tailwind import
├── components/
│   ├── boot-sequence.tsx   # Terminal boot animation
│   ├── command-prompt.tsx  # User command interface
│   ├── cursor.tsx          # Reusable blinking cursor component
│   ├── cv-content.tsx      # Portfolio content display
│   ├── data-grid-section.tsx # Reusable grid layout for Education/Volunteer
│   ├── matrix-background.tsx # Matrix rain effect (mobile only)
│   ├── secure-external-link.tsx # Secure external link with opener protection
│   └── terminal-container.tsx # State orchestration
├── hooks/
│   ├── use-typewriter.ts   # Typewriter effect hook with optimized callback handling
│   └── use-virtual-keyboard-suppression.ts # Mobile keyboard suppression (simple blur on Enter)
├── lib/
│   ├── data.ts            # All portfolio data
│   ├── utils.ts           # Utilities, constants, command types, and shared rendering logic
│   └── utils.test.ts      # Utility function tests
├── public/
│   ├── cj.m4a            # Interaction audio
│   ├── mario.jpg         # 404 page background
│   ├── bitcoin.pdf       # Bitcoin whitepaper (easter egg)
│   └── 8-social.jpeg     # Social media share image
├── scripts/
│   └── package-monitor.js # Intelligent package update monitoring (Bun Edition)
├── proxy.ts              # Security headers (Next.js 16 proxy convention)
├── next.config.ts         # Next.js configuration
├── postcss.config.mjs     # PostCSS + Tailwind
├── tsconfig.json          # TypeScript config
├── biome.json            # Linting/formatting
├── _docs/                # Release notes documentation
│   ├── README.md         # Documentation structure guide
│   └── [year]-[month].md # Monthly release notes files
├── test-setup.ts         # Bun test configuration with happy-dom
├── bunfig.toml           # Bun configuration for test preloading
└── CLAUDE.md             # AI assistant guidance (this file)
```

