# Retro Terminal Homepage

A retro terminal-style portfolio experience built with modern web technologies.

**Live Demo**: [www.8lee.ai](https://8lee.ai)

[![Version](https://img.shields.io/badge/version-v1.0-green.svg)](https://github.com/8bittts/8leeai/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.1.18-38B2AC)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-1.3.3-fbf0df)](https://bun.sh)

---

## Executive Summary

An interactive portfolio website that simulates a classic DOS terminal. Visitors type commands to explore projects, education, and experience. Features 16 visual themes, 64+ projects, and full keyboard navigation.

**Key Capabilities:**
- Terminal simulation with authentic boot sequence
- 64 projects, 5 education entries, 6 volunteer roles
- 16 switchable visual themes via `theme` command
- Mobile-optimized with Matrix background effect
- WCAG 2.1 AA accessibility compliant
- Triple-layer anti-crawling protection (ultra-private mode)

**Business Value:**
- Unique portfolio format that demonstrates technical creativity
- Self-contained experimental demos for stakeholder presentations
- Production-grade code quality (96 tests, 297 assertions)

---

## Quick Start

**This project uses [Bun](https://bun.sh) v1.3.3+ exclusively** - Do NOT use npm, yarn, or pnpm.

```bash
git clone https://github.com/8bittts/8leeai.git
cd 8leeai
bun install
bun run dev
```

Open [http://localhost:1333](http://localhost:1333) to view the terminal.

---

## Terminal Commands

Once loaded, visitors can use:
- `1-64` - Open specific project by number
- `65-69` - Education items
- `70-75` - Volunteer experience
- `help` - Show all commands
- `theme` - List visual themes
- `theme [name]` - Switch theme
- `random` - Open random project
- `email` / `contact` - Contact info
- `social` - All social links
- `clear` / `reset` - Reset terminal
- `Ctrl+L` / `Cmd+K` - Clear shortcut

---

## For Engineers

### Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | [Bun](https://bun.sh) | 1.3.3 |
| Framework | [Next.js](https://nextjs.org) (App Router + Turbopack) | 16.0.10 |
| UI | [React](https://react.dev) | 19.2.3 |
| Styling | [Tailwind CSS](https://tailwindcss.com) (pure utilities) | v4.1.18 |
| Language | [TypeScript](https://www.typescriptlang.org) (strict + 4 ultra-strict flags) | 5.9.3 |
| Code Quality | [Biome](https://biomejs.dev) (100+ error rules) | 2.3.9 |
| AI/ML | [Vercel AI SDK](https://sdk.vercel.ai) | 5.0.114 |
| Email | [Resend](https://resend.com) | 6.6.0 |
| Testing | Bun native with happy-dom | - |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) + Speed Insights | 1.6.1 |
| Deployment | [Vercel](https://vercel.com) (death-note team, Pro) | - |

### Architecture

**Component Hierarchy:**
1. `BootSequence` - Terminal boot animation with typewriter effect
2. `TerminalContainer` - State orchestration (React hooks only)
3. `CVContent` - Portfolio display with auto-scroll pagination
4. `CommandPrompt` - User input handling
5. `MatrixBackground` - Canvas Matrix rain (mobile only, 13fps)

**State Management:** All state in `TerminalContainer`, passed via props. No Redux/Zustand.

**Data Layer:** Portfolio data in `lib/data.ts`. Links use `openExternalLink()` for security.

**Themes:** 16 themes in `lib/themes/` with self-contained preset system.

**Utilities:** 
- `cn()` - Tailwind class name merger (shadcn pattern)
- `focusRing()` - Standardized focus ring utility for WCAG compliance
- `openExternalLink()` - Secure external link handler

### Design System (11-Point Compliance)

Run `/design` slash command to audit. All code must pass:

| # | Rule | Description |
|---|------|-------------|
| 1 | Pure shadcn | Components in `components/ui/` unmodified from official |
| 2 | Pure Tailwind v4 | Uses `@import "tailwindcss"`, `@theme inline`, no v3 patterns |
| 3 | Zero inline styles | Exception: CSS custom properties, canvas animations, dynamic runtime values |
| 4 | Zero custom components | Use shadcn primitives or standard HTML+Tailwind |
| 5 | Zero custom classes | Exception: required animations in `globals.css` |
| 6 | Zero hardcoded values | Use CSS variables or Tailwind tokens. Exception: canvas, SVG, email |
| 7 | Zero duplicate styles | Extract repeated className patterns (e.g., `focusRing()` utility) |
| 8 | Zero style conflicts | No conflicting classes (e.g., `hidden flex`) |
| 9 | Zero unused styles | Remove orphaned CSS variables and classes |
| 10 | Full WCAG/ARIA | Focus indicators, aria-labels, 4.5:1 contrast, keyboard nav |
| 11 | Normalized patterns | Consistent typography, spacing, sizing |

**Color Contrast Standards (WCAG 2.1 AA):**

| Theme | Background | Secondary Text | Minimum Contrast |
|-------|------------|----------------|------------------|
| Terminal | Black (`#000`) | `text-green-700` | 4.5:1+ |
| Figmoo | Light (`#faf7f4`) | `text-gray-600` | 4.5:1+ |
| Placeholders | Any | `placeholder:text-gray-500` | 4.5:1+ |

### Testing

**Coverage**: 96 tests, 297 assertions across 12 files

```bash
bun test              # Run all tests
bun run test:watch    # Watch mode
```

**Philosophy**: Tests focus on user intent and business logic, not implementation details. Every assertion includes comments explaining WHY it matters.

### Project Structure

```
8leeai/
├── app/                              # Next.js app router
│   ├── api/                          # API routes
│   ├── experiments/                  # Isolated experimental features
│   │   └── _docs/                    # Experiment documentation
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Main terminal page
│   └── not-found.tsx                 # Custom 404
├── components/                       # React components
├── hooks/                            # Custom React hooks
├── lib/                              # Utilities and data
│   ├── data.ts                       # Portfolio data
│   ├── utils.ts                      # Utilities and command logic
│   └── themes/                       # Theme definitions
├── tests/                            # Test files
├── docs/                             # Documentation
│   ├── 00-ROADMAP.md                 # Active roadmap and TODOs
│   └── release-notes/                # Weekly release notes
├── _docs/                            # Historical documentation
├── .claude/commands/                 # Slash commands for Claude Code
└── proxy.ts                          # Security headers (CSP, CORS, HSTS)
```

### Security

**Triple-Layer Anti-Crawling Protection:**
1. **robots.txt** - Blocks 17+ major crawlers
2. **HTTP Headers (proxy.ts)** - X-Robots-Tag: `noindex, nofollow, noarchive`
3. **HTML Metadata** - robots: `index: false, follow: false`

**Additional Headers:** CSP, CORS, HSTS, X-Frame-Options DENY, Permissions Policy, XSS Protection

**Result**: Site will NOT appear in search engines while remaining accessible to direct visitors.

### Customizing This Template

**Before using, update these files:**
- `/public/robots.txt` - Remove crawler blocking if you want SEO
- `/proxy.ts` - Adjust headers and CORS for your domain
- `/app/layout.tsx` - Update robots metadata and OpenGraph
- `/lib/data.ts` - Replace with your portfolio content

---

## Experimental Features

Isolated proof-of-concept projects in `/app/experiments/`:

| Experiment | Purpose | Access |
|------------|---------|--------|
| Zendesk | AI-powered ticket intelligence | Hidden: `zendesk` command |
| Intercom | AI-powered conversation intelligence | Hidden: `intercom` command |
| Figmoo | Frictionless website builder | `/experiments/figmoo` |

All experiments are 100% isolated from the main portfolio. See `app/experiments/_docs/00-EXPERIMENTS-PROTOCOL.md` for standards.

---

## Version History

- **Current (November 2025+)**: Weekly notes in [docs/release-notes/](docs/release-notes/)
- **Historical**: Monthly notes in [_docs/](_docs/)

---

## Contact

Use the `email` command in the terminal or ping on [Twitter/X](https://x.com/8BIT).

## License

MIT
