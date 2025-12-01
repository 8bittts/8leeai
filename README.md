# Retro Terminal Homepage

An original, retro terminal-style portfolio experience built with modern web technologies.

## Ultra Private Mode Enabled

This codebase is configured for **triple-layer anti-crawling protection** - the site will NOT appear in search engines, archives, or indexing tools while remaining accessible to direct visitors.

**Before using this template, update these files:**
- `/public/robots.txt` - Remove crawler blocking if you want SEO
- `/middleware.ts` - Adjust X-Robots-Tag headers and CORS for your domain
- `/app/layout.tsx` - Update robots metadata and OpenGraph data
- `/lib/data.ts` - Replace with your portfolio content

See [Security](#security) section below for implementation details.

[![Version](https://img.shields.io/badge/version-v1.0-green.svg)](https://github.com/8bittts/8leeai/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.6-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.1.17-38B2AC)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org)
[![Bun](https://img.shields.io/badge/Bun-1.3.1-fbf0df)](https://bun.sh)

**Live Demo**: [www.8lee.ai](https://8lee.ai)

![8lee.ai Terminal Screenshot](public/8lee-screenshot.png)

## Features

- **Authentic Terminal Experience**: Boot sequence animation with interactive pause, command-line interface with visible cursor (2px mobile, 1px desktop), automatic input focus after boot, keyboard shortcuts (`Ctrl+L`/`Cmd+K` to clear)
- **Matrix Background Effect**: Battery-optimized falling characters on mobile (13fps) using `requestAnimationFrame`
- **Interactive Commands**: 64+ projects, education, and volunteer experience with natural language aliases (`resume`, `contact`, `social`), Unix-style commands (`whoami`, `uname`, `date`, `echo`), portfolio stats, and `random` discovery - see [Available Commands](#available-commands)
- **Typewriter Effects**: Smooth text animations with 300ms fade-in transitions and prefers-reduced-motion support
- **Custom 404 Page**: Mario-themed error page that returns to home on interaction
- **Mobile-First UX**: Optimized auto-scroll centers content in viewport, automatic cursor focus, keyboard hides after Enter, 2px visible cursor
- **Enhanced Interactivity**: Link hover states with subtle green background, smooth content transitions, polished animations
- **Performance Optimized**: 13fps Matrix animation for battery life, `requestAnimationFrame` animations, CSS-based logo pulse (4s), audio preloading, optimized React hooks with `useRef`
- **Zero Bloat**: Pure Tailwind utilities, minimal dependencies, optimal bundle size
- **WCAG 2.1 AA Compliant**: Semantic HTML, ARIA live regions, keyboard navigation, focus indicators, skip links, enhanced affordances
- **Production Security**: CSP, CORS, HSTS, secure external link handling - see [Security](#security)
- **Code Quality**: Ultra-aggressive Biome linting (100+ error rules), 96 tests with 297 assertions - see [Testing](#testing)

## Quick Start

**This project uses [Bun](https://bun.sh) v1.3.1+ exclusively** - Do NOT use npm, yarn, or pnpm.

```bash
# Clone and install
git clone https://github.com/8bittts/8leeai.git
cd 8leeai
bun install

# Run development server (port 1333, auto-kills existing process, clears caches)
bun run dev
```

Open [http://localhost:1333](http://localhost:1333) to view the terminal.

![8lee.ai Boot Sequence](public/8lee-boot-sequence.png)

## Available Commands

**Terminal Commands** (once loaded):
- `enter` - Show more projects (15 per page)
- `1-64` - Open specific project by number
- `65-69` - Education item by number
- `70-75` - Volunteer experience by number
- `help` - Show all available commands
- `random` - Open a random project
- `email` / `contact` / `hello` / `reach` - Contact email info
- `education` / `ed` / `resume` / `cv` / `about` / `bio` - Education background
- `volunteer` / `vol` - Volunteer experience
- `github` - This GitHub project
- `wellfound` - Wellfound profile
- `linkedin` / `li` - LinkedIn profile
- `x` - X/Twitter profile
- `social` - Show all social and professional links
- `clear` - Reset terminal
- `whoami` - User info
- `uname` - System info
- `date` - Current date/time
- `echo [text]` - Echo text back
- `stats` - Portfolio statistics
- `Ctrl+L` / `Cmd+K` - Keyboard shortcut to clear terminal

**Development Commands** (Bun only):
```bash
bun run dev          # Development with Turbopack (port 1333, auto-kill, clears caches)
bun run build        # Production build (clears .next first)
bun run start        # Start production server
bun test             # Run tests with Bun's native runner
bun run test:watch   # Tests in watch mode
bun run check        # Lint and format with Biome (via bunx)
bun run clean        # Clean all caches (.next, .turbo, node_modules/.cache)
```

**Package Update Monitoring** (via `scripts/x-package-monitor.js`):
```bash
bun run packages              # Check all packages with impact analysis
bun run packages:watch        # Continuous monitoring (checks every 6 hours)
bun run packages:critical     # Only critical/security updates
```

The package monitor features enhanced console output with color-coded messages for better visibility:
- Green: Success messages and safe updates
- Yellow: Warnings and caution updates
- Red: Errors and urgent updates
- Cyan: Information and headers
- Blue/Magenta: Section separators

The monitor analyzes breaking changes and categorizes updates by priority:
- **URGENT**: Security-related or major version changes (apply immediately)
- **CAUTION**: Known breaking changes (review changelog and test thoroughly)
- **SAFE**: Patch/minor updates with low impact (apply when convenient)

For simple updates (SAFE only), the plan file auto-deletes. For complex updates (CAUTION/URGENT), it's saved for review.

## Testing

**Coverage**: 96 tests, 297 assertions across 12 files (~2.3s execution)

Run `bun test` to execute all tests. Test files are organized in the `/tests/` directory:
- `tests/lib/utils.test.ts` - Data integrity, user input validation, security filtering
- `tests/hooks/use-typewriter.test.tsx` - Authentic terminal content reveal
- `tests/hooks/use-virtual-keyboard-suppression.test.tsx` - Mobile keyboard control
- `tests/components/cursor.test.tsx` - Visual feedback for terminal readiness

Additional tests exist for archived experimental projects (gitignored).

**Testing Philosophy**: Tests focus on **user intent and business logic**, not implementation details. Test names read like requirements (e.g., "hides keyboard after command submission on touch devices"). Every assertion includes comments explaining WHY it matters to users.

## Tech Stack

- **Package Manager & Runtime**: [Bun 1.3.1](https://bun.sh)
- **Framework**: [Next.js 16.0.6](https://nextjs.org) with App Router & Turbopack
- **UI**: [React 19.2.0](https://react.dev)
- **Styling**: [Tailwind CSS v4.1.17](https://tailwindcss.com) pure utilities
- **Language**: [TypeScript 5.9.3](https://www.typescriptlang.org) with strict config + 4 ultra-strict flags
- **Code Quality**: [Biome 2.3.8](https://biomejs.dev) - 100+ error rules + 5 nursery rules
- **AI/ML**: [Vercel AI SDK 5.0.105](https://sdk.vercel.ai), [OpenAI SDK 2.0.75](https://github.com/openai/openai-node)
- **Email**: [Resend 6.5.2](https://resend.com)
- **Test Runner**: Bun native with happy-dom (not Jest/Vitest)
- **Type Definitions**: `@types/node@24.10.1`, `@types/react@19.2.7`, `@types/react-dom@19.2.3`
- **Analytics**: [Vercel Analytics 1.6.0](https://vercel.com/analytics) & [Speed Insights 1.3.0](https://vercel.com/docs/speed-insights)
- **Deployment**: [Vercel](https://vercel.com) (death-note team - Pro plan)
  - Team ID: `team_UzPg3vyRGY8HESeUqDwFmCXB`
  - Project ID: `prj_mAdE8dzVUbtHLhb4ckbtHqowOwiK`
  - Live: https://8lee.ai
  - Configuration fixed November 21, 2025 (see release notes)

## Project Structure

```
8leeai/
├── app/                              # Next.js app router
│   ├── layout.tsx                    # Root layout with metadata, Analytics & SpeedInsights
│   ├── page.tsx                      # Main terminal page
│   └── not-found.tsx                 # Custom 404 with Mario background
├── components/                       # React components
│   ├── boot-sequence.tsx             # Terminal boot animation
│   ├── command-prompt.tsx            # User command interface
│   ├── cursor.tsx                    # Reusable blinking cursor (2px mobile, 1px desktop)
│   ├── cv-content.tsx                # Portfolio content display
│   ├── data-grid-section.tsx         # Reusable grid for Education/Volunteer
│   ├── matrix-background.tsx         # Matrix rain effect (mobile only)
│   ├── secure-external-link.tsx      # Secure link with opener protection
│   └── terminal-container.tsx        # State orchestration
├── hooks/                            # Custom React hooks
│   ├── use-typewriter.ts             # Optimized typewriter effect
│   └── use-virtual-keyboard-suppression.ts  # Mobile keyboard (blur on Enter)
├── lib/                              # Utilities and data
│   ├── data.ts                       # Portfolio data (64 projects, 5 education, 6 volunteer)
│   └── utils.ts                      # Utilities, constants, command types, rendering logic
├── tests/                            # Test files (Bun native runner)
│   ├── setup.ts                      # Test configuration with happy-dom
│   ├── components/                   # Component tests
│   ├── hooks/                        # Hook tests
│   └── lib/                          # Utility tests
├── public/                           # Static assets
│   ├── cj.m4a                        # Interaction audio
│   ├── mario.jpg                     # 404 background
│   ├── bitcoin.pdf                   # Bitcoin whitepaper (easter egg)
│   └── 8-social.jpeg                 # Social share image
├── scripts/                          # Development utilities
│   └── x-package-monitor.js          # Intelligent package update monitoring
├── middleware.ts                     # Security headers (CSP, CORS, HSTS)
├── _docs/                            # Historical documentation
│   ├── README.md                     # Documentation structure guide
│   ├── 2025-september.md             # September 2025 release notes (monthly)
│   └── 2025-october.md               # October 2025 release notes (monthly)
├── docs/                             # Current release notes (November 2025+)
│   └── release-notes/                # Weekly release notes directory
│       ├── 00-RN-README.md           # Release notes structure guide
│       ├── 2025-11-w1-november.md    # November Week 1 (Nov 2-8)
│       ├── 2025-11-w2-november.md    # November Week 2 (Nov 9-15)
│       ├── 2025-11-w3-november.md    # November Week 3 (Nov 16-22)
│       ├── 2025-11-w4-november.md    # November Week 4 (Nov 22-28)
│       └── 2025-11-w5-november.md    # November Week 5 (Nov 29-30)
│       # Multi-part weeks (when needed): 2025-11-wN-1-month.md, 2025-11-wN-2-month.md, etc.
└── bunfig.toml                       # Bun configuration for test preloading
```

## Security

**Triple-Layer Anti-Crawling Protection** (ultra-private mode):
1. **robots.txt** - Blocks 17+ major crawlers (Google, Bing, social media, SEO tools)
2. **HTTP Headers (middleware.ts)** - X-Robots-Tag: `noindex, nofollow, noarchive, nosnippet, noimageindex`
3. **HTML Metadata (app/layout.tsx)** - robots: `index: false, follow: false` + googleBot restrictions

**Additional Security Headers:**
- **CSP**: Strict Content Security Policy (Vercel analytics only)
- **CORS**: Restrictive cross-origin policy locked to approved domains
- **HSTS**: Strict transport security with preload
- **Frame Protection**: X-Frame-Options DENY (prevents clickjacking)
- **Permissions Policy**: Disables camera, mic, geolocation, etc.
- **XSS Protection**: X-XSS-Protection with mode=block
- **External Links**: Secure utility prevents window.opener vulnerabilities

**Result**: Site will NOT appear in search engines, archives, or indexing tools while remaining accessible to direct visitors. Social media previews WILL work when manually sharing links.

## Version History

For detailed release history and comprehensive changelog:
- **Current (November 2025+)**: See [docs/release-notes](docs/release-notes/) directory with weekly release notes
- **Historical (September-October 2025)**: See [_docs](_docs/) directory with monthly release notes

Weekly files follow the pattern `YYYY-MM-wN-month.md` (e.g., `2025-11-w1-november.md` for Week 1). Large weeks may be split into multiple parts using `YYYY-MM-wN-P-month.md` (e.g., `2025-11-w4-1-november.md`, `2025-11-w4-2-november.md`). See [docs/release-notes/00-RN-README.md](docs/release-notes/00-RN-README.md) for the complete structure guide including multi-part week guidelines.

## Archived Experimental Projects

This repository contains two archived experimental projects that are no longer under active development:

### Zendesk Intelligence Portal (`/app/zendesk/`)
- **Status**: Archived (November 2025)
- **Access**: Hidden command `zendesk` or `zen` in production terminal
- **Purpose**: Experimental AI-powered ticket intelligence system
- **Documentation**: See `app/zendesk/_docs/zendesk-MASTER.md` and `DELETION-GUIDE.md`

### Intercom Intelligence Portal (`/app/intercom/`)
- **Status**: Archived (November 2025)
- **Access**: Hidden command `intercom` in production terminal
- **Purpose**: Experimental AI-powered conversation intelligence system
- **Documentation**: See `app/intercom/_docs/intercom-MASTER.md` (v2.1) and `DELETION-GUIDE.md`

**Important Notes:**
- Both projects are **100% isolated** from the main portfolio site
- They remain accessible in production via hidden terminal commands
- Source code is **excluded from version control** (`.gitignore`)
- All tests have been removed to reduce maintenance overhead
- Projects are fully documented with deletion guides if needed
- No further development or updates planned

These projects served as proof-of-concept explorations of AI-powered customer support intelligence systems. They remain in the codebase for reference and demonstration purposes but are not part of the actively maintained portfolio.

## Contributing

This is a personal portfolio project. Feel free to make suggestions!

## Contact

For inquiries, use the `email` command in the terminal on [8lee.ai](https://8lee.ai) or ping on [Twitter](https://x.com/8BIT) on X. Check out my project [DeathNote](https://deathnote.ai).

## License

MIT for all the goodness. Enjoy!
