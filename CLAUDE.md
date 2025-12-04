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

## CLI Tools Preference

**Always prefer CLI tools for external services:**

- **Vercel CLI**: Use `vercel` commands for deployments, environment variables, and project management. Always include `--scope death-note` flag.
- **Supabase CLI**: Use `supabase` commands for database operations, migrations, and project management.
- **GitHub CLI**: Use `gh` commands for issues, PRs, and repository operations.

These CLI tools provide faster, more reliable operations than web interfaces and maintain context within the terminal workflow.

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

## Script Development

### Console Output Guidelines

**When creating or updating utility scripts, use color-coded console output for better readability:**

Use ANSI escape codes for consistent, professional terminal output. Example pattern from `scripts/x-package-monitor.js`:

```javascript
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

// Usage examples:
console.log(`${COLORS.green}[OK] Success message${COLORS.reset}`)
console.log(`${COLORS.red}[ERROR] Error message${COLORS.reset}`)
console.log(`${COLORS.yellow}[WARNING] Warning message${COLORS.reset}`)
console.log(`${COLORS.cyan}${COLORS.bright}[INFO] Header${COLORS.reset}`)
```

**Color Conventions:**
- **Green**: Success messages, safe operations
- **Red**: Errors, failures, urgent actions
- **Yellow**: Warnings, caution, attention needed
- **Cyan**: Headers, information, sections
- **Blue/Magenta**: Section separators, metadata
- **Bright**: Combined with colors for emphasis

**Best Practices:**
- Always reset colors after each message (`${COLORS.reset}`)
- Use bright for headers and important labels
- Combine colors for visual hierarchy (e.g., `${COLORS.cyan}${COLORS.bright}`)
- Maintain consistency across scripts for familiar UX

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
- Next.js 16.0.7 + React 19.2.1 + TypeScript 5.9.3 (strict mode)
- Tailwind CSS v4.1.17 (utility classes only, zero custom CSS)
- Vercel Analytics 1.6.1 + Speed Insights 1.3.1
- Biome 2.3.8 (linting/formatting with 100+ error-level rules)
- AI/ML: Vercel AI SDK 5.0.106 + OpenAI SDK 2.0.76
- Email: Resend 6.5.2
- Bun 1.3.1 (package manager, runtime, test runner)
- Type Definitions: `@types/node@24.10.1`, `@types/react@19.2.7`, `@types/react-dom@19.2.3`

**Deployment Configuration:**
- **Vercel Team**: death-note (Pro plan) - `team_UzPg3vyRGY8HESeUqDwFmCXB`
- **Project ID**: `prj_mAdE8dzVUbtHLhb4ckbtHqowOwiK`
- **Live URL**: https://8lee.ai
- **IMPORTANT**: Always use `--scope death-note` flag for all Vercel CLI operations
- Configuration fixed November 21, 2025 - see `docs/release-notes/2025-11-w3-november.md` for details

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
2. Run `bun test` - Execute all unit and component tests (96 tests, 297 assertions)

### Special File Rules
**Release notes are now organized with a hybrid structure:**
- **Weekly files** (November 2025+): Located in `/docs/release-notes/` directory, following pattern `YYYY-MM-wN-month.md` (e.g., `2025-11-w1-november.md` for Week 1, `2025-11-w2-november.md` for Week 2)
- **Multi-part weeks** (when needed): If a week becomes too large, split into parts using `YYYY-MM-wN-P-month.md` (e.g., `2025-11-w4-1-november.md`, `2025-11-w4-2-november.md`). Each part MUST include cross-references to all other parts at the top of the file.
- **Monthly files** (Historical): September and October 2025 remain in `_docs/` directory as `[year]-[month].md` (e.g., `2025-september.md`, `2025-october.md`)
- **Week assignment**: Week 1 (days 1-7), Week 2 (days 8-14), Week 3 (days 15-21), Week 4 (days 22-28), Week 5 (days 29-31 if applicable)
- **Structure guide**: See `/docs/release-notes/00-RN-README.md` for complete documentation including multi-part week guidelines

These files are manually curated by the project maintainer. Only modify release notes when explicitly requested. Formatting: date-based organization (no timestamps), all entries for a day under same date heading, reverse chronological order.

**Documentation Style:** NEVER add emojis to any documentation files. All documentation must use clean, professional text without emojis or decorative Unicode characters. This applies to all markdown files including README.md, CLAUDE.md, release notes, and any technical documentation.

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

**Test Coverage (96 tests, 297 assertions):**
- **`tests/lib/utils.test.ts`** - Data integrity, user input validation, security filtering (URL validation, malicious pattern detection)
- **`tests/hooks/use-typewriter.test.tsx`** - Authentic terminal content reveal
- **`tests/hooks/use-virtual-keyboard-suppression.test.tsx`** - Mobile keyboard control (hide after Enter)
- **`tests/components/cursor.test.tsx`** - Visual feedback for terminal readiness

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
│   └── utils.ts           # Utilities, constants, command types, and shared rendering logic
├── tests/                 # Test files (Bun native runner)
│   ├── setup.ts           # Test configuration with happy-dom
│   ├── components/        # Component tests
│   │   └── cursor.test.tsx
│   ├── hooks/             # Hook tests
│   │   ├── use-typewriter.test.tsx
│   │   └── use-virtual-keyboard-suppression.test.tsx
│   └── lib/               # Utility tests
│       └── utils.test.ts
├── public/
│   ├── cj.m4a            # Interaction audio
│   ├── mario.jpg         # 404 page background
│   ├── bitcoin.pdf       # Bitcoin whitepaper (easter egg)
│   └── 8-social.jpeg     # Social media share image
├── scripts/
│   ├── test-contact-forms.ts # Contact form testing script
│   └── x-package-monitor.js  # Intelligent package update monitoring
├── proxy.ts              # Security headers (Next.js 16 proxy convention)
├── next.config.ts         # Next.js configuration
├── postcss.config.mjs     # PostCSS + Tailwind
├── tsconfig.json          # TypeScript config
├── biome.json            # Linting/formatting
├── app/experiments/      # Experimental features (isolated from main app)
│   ├── _docs/            # Consolidated experiment documentation
│   │   ├── intercom-00-readme.md        # Intercom main documentation
│   │   ├── intercom-01-deletion-guide.md # Intercom deletion guide
│   │   ├── zendesk-00-readme.md         # Zendesk main documentation
│   │   ├── zendesk-01-scripts.md        # Zendesk scripts documentation
│   │   ├── zendesk-02-testing.md        # Zendesk testing documentation
│   │   └── zendesk-03-deletion-guide.md # Zendesk deletion guide
│   ├── intercom/         # Intercom Intelligence Portal experiment
│   └── zendesk/          # Zendesk Intelligence Portal experiment
├── _docs/                # Historical documentation
│   ├── README.md         # Documentation structure guide
│   ├── 2025-september.md # September 2025 release notes (monthly)
│   └── 2025-october.md   # October 2025 release notes (monthly)
├── docs/                 # Current release notes (November 2025+)
│   └── release-notes/    # Weekly release notes directory
│       ├── 00-RN-README.md              # Release notes structure guide
│       ├── 2025-11-w1-november.md       # November Week 1 (Nov 2-8)
│       ├── 2025-11-w2-november.md       # November Week 2 (Nov 9-15)
│       ├── 2025-11-w3-november.md       # November Week 3 (Nov 16-22)
│       ├── 2025-11-w4-november.md       # November Week 4 (Nov 22-28)
│       ├── 2025-11-w5-november.md       # November Week 5 (Nov 29-30)
│       └── 2025-12-w1-december.md       # December Week 1 (Dec 1-7)
│       # Multi-part weeks (when needed): 2025-11-wN-1-month.md, 2025-11-wN-2-month.md, etc.
├── bunfig.toml           # Bun configuration for test preloading
└── CLAUDE.md             # AI assistant guidance (this file)
```

