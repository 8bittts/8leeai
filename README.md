# Retro Terminal Homepage

An original, retro terminal-style portfolio experience built with modern web technologies.

## ⚠️ Ultra Private Mode Enabled

This codebase is configured for **triple-layer anti-crawling protection** - the site will NOT appear in search engines, archives, or indexing tools while remaining accessible to direct visitors.

**Before using this template, update these files:**
- `/public/robots.txt` - Remove crawler blocking if you want SEO
- `/middleware.ts` - Adjust X-Robots-Tag headers and CORS for your domain
- `/app/layout.tsx` - Update robots metadata and OpenGraph data
- `/lib/data.ts` - Replace with your portfolio content

See [Security](#security) section below for implementation details.

[![Version](https://img.shields.io/badge/version-v1.0-green.svg)](https://github.com/8bittts/8leeai/releases)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.1.14-38B2AC)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org)
[![Bun](https://img.shields.io/badge/Bun-1.3.0-fbf0df)](https://bun.sh)

**Live Demo**: [www.8lee.ai](https://8lee.ai)

![8lee.ai Terminal Screenshot](public/8lee-screenshot.png)

## Features

- **Authentic Terminal Experience**: Boot sequence animation with interactive pause, command-line interface with visible cursor (2px mobile, 1px desktop)
- **Matrix Background Effect**: Subtle falling characters on mobile using `requestAnimationFrame`
- **Interactive Commands**: 60+ projects, education, and volunteer experience with aliases (`ed`, `vol`, `li`) - see [Available Commands](#available-commands)
- **Typewriter Effects**: Smooth text animations with prefers-reduced-motion support
- **Custom 404 Page**: Mario-themed error page that returns to home on interaction
- **Mobile-First UX**: Boot pause for user interaction, keyboard hides after Enter, 2px visible cursor on mobile
- **Performance Optimized**: `requestAnimationFrame` animations, audio preloading, optimized React hooks with `useRef`
- **Zero Bloat**: Pure Tailwind utilities, minimal dependencies, optimal bundle size
- **WCAG 2.1 AA Compliant**: Semantic HTML, ARIA live regions, keyboard navigation, focus indicators, skip links
- **Production Security**: CSP, CORS, HSTS, secure external link handling - see [Security](#security)
- **Code Quality**: Ultra-aggressive Biome linting (100+ error rules), 32 tests with 99 assertions - see [Testing](#testing)

## Quick Start

**This project uses [Bun](https://bun.sh) v1.3.0+ exclusively** - Do NOT use npm, yarn, or pnpm.

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
- `1-60` - Open specific project by number
- `61-65` - Education item by number
- `66-71` - Volunteer experience by number
- `email` - Contact email info
- `education` / `ed` - Education background
- `volunteer` / `vol` - Volunteer experience
- `github` - This GitHub project
- `wellfound` - Wellfound profile
- `linkedin` / `li` - LinkedIn profile
- `x` - X/Twitter profile
- `deathnote` - deathnote.ai website
- `clear` - Reset terminal

**Development Commands** (Bun only):
```bash
bun run dev          # Development with Turbopack (port 1333, auto-kill, clears caches)
bun run build        # Production build (clears .next first)
bun run start        # Start production server
bun test             # Run tests with Bun's native runner
bun run test:watch   # Tests in watch mode
bun run check        # Lint and format with Biome (via bunx)
bun run clean        # Clean all caches (.next, .turbo, node_modules/.cache)
bun run packages     # Check for package updates with breaking change analysis
```

**Recommended Terminal**: [Ghostty](https://ghostty.org) with custom 8LEE Terminal Theme (see `ghostty.md`)

## Testing

**Coverage**: 32 tests, 99 assertions across 4 files (~850ms execution)

Run `bun test` to execute all tests. Tests are co-located with source files:
- `lib/utils.test.ts` - Data integrity, user input validation, security filtering
- `hooks/use-typewriter.test.tsx` - Authentic terminal content reveal
- `hooks/use-virtual-keyboard-suppression.test.tsx` - Mobile keyboard control
- `components/cursor.test.tsx` - Visual feedback for terminal readiness

**Testing Philosophy**: Tests focus on **user intent and business logic**, not implementation details. Test names read like requirements (e.g., "hides keyboard after command submission on touch devices"). Every assertion includes comments explaining WHY it matters to users.

## Tech Stack

- **Package Manager & Runtime**: [Bun 1.3.0](https://bun.sh)
- **Framework**: [Next.js 15.5.6](https://nextjs.org) with App Router & Turbopack
- **UI**: [React 19.2.0](https://react.dev)
- **Styling**: [Tailwind CSS v4.1.14](https://tailwindcss.com) pure utilities
- **Language**: [TypeScript 5.9.3](https://www.typescriptlang.org) with strict config + 4 ultra-strict flags
- **Code Quality**: [Biome 2.2.6](https://biomejs.dev) - 100+ error rules + 5 nursery rules
- **Test Runner**: Bun native with happy-dom (not Jest/Vitest)
- **Analytics**: [Vercel Analytics 1.5.0](https://vercel.com/analytics) & [Speed Insights 1.2.0](https://vercel.com/docs/speed-insights)
- **Deployment**: [Vercel](https://vercel.com)

## Project Structure

```
8leeai/
├── app/                 # Next.js app router
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main terminal page
│   └── not-found.tsx    # Custom 404 page
├── components/          # React components
│   ├── boot-sequence.tsx
│   ├── command-prompt.tsx
│   ├── cursor.tsx
│   ├── cv-content.tsx
│   ├── data-grid-section.tsx       # Reusable grid for Education/Volunteer
│   ├── matrix-background.tsx
│   ├── secure-external-link.tsx    # Secure link with opener protection
│   └── terminal-container.tsx
├── hooks/              # Custom React hooks
│   ├── use-typewriter.ts            # Optimized typewriter effect
│   └── use-virtual-keyboard-suppression.ts  # Mobile keyboard suppression (32 lines, blur on Enter)
├── lib/                # Utilities and data
│   ├── data.ts         # Portfolio data (projects, education, volunteer)
│   ├── utils.ts        # Utilities, constants, command types, rendering logic
│   └── utils.test.ts   # Utility function tests
├── public/             # Static assets
│   ├── mario.jpg       # 404 background
│   └── 8-social.jpeg   # Social share image
├── scripts/            # Development utilities
│   └── package-monitor.js       # Intelligent package update monitoring
├── middleware.ts       # Security headers
├── release-notes.md    # Comprehensive commit changelog
├── test-setup.ts       # Bun test configuration with happy-dom
└── bunfig.toml         # Bun configuration for tests
```

## Code Quality

All code includes concise, useful comments following these guidelines:
- **Component-level**: JSDoc describing purpose and behavior
- **Inline comments**: Explain complex logic, state management, and non-obvious patterns
- **No redundant comments**: Code clarity over stating the obvious

## Security

Production-ready security implementation with ultra-private mode:

**Triple-Layer Anti-Crawling Protection:**
- **robots.txt**: Blocks 17+ major crawlers including Google, Bing, social media, and SEO tools
- **HTTP Headers**: X-Robots-Tag with `noindex, nofollow, noarchive, nosnippet, noimageindex`
- **HTML Metadata**: robots metadata set to `index: false, follow: false` with googleBot restrictions

**Additional Security Headers:**
- **Content Security Policy**: Strict CSP with minimal external allowlist (Vercel analytics only)
- **CORS**: Restrictive cross-origin policy locked to approved domains
- **HSTS**: Strict transport security with preload enabled
- **Frame Protection**: X-Frame-Options DENY prevents clickjacking
- **Permissions Policy**: Disables unnecessary browser features (camera, mic, geolocation, etc.)
- **XSS Protection**: X-XSS-Protection enabled with mode=block
- **External Links**: Secure utility prevents window.opener vulnerabilities

**Result**: Site will NOT appear in search engines, archiving services, or indexing tools while maintaining normal access for direct visitors.

## Version History

For detailed commit history and comprehensive changelog, see [release-notes.md](release-notes.md).

## Contributing

This is a personal portfolio project. Feel free to make suggestions!

## Contact

For inquiries, use the `email` command in the terminal on [8lee.ai](https://8lee.ai), [@8BIT](https://x.com/8BIT) on X, and check out [DeathNote](https://deathnote.ai).
## License

MIT and all that good jazz.
