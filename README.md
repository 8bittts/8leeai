# Retro Terminal Homepage - Focused on Privacy

An original, retro terminal-style portfolio experience built with modern web technologies.

**FYI**: The codebase is configured for **"ultra private" mode** with aggressive anti-crawling settings:
- `robots.txt` blocks all search engines and crawlers
- Security headers prevent indexing and archiving
- Metadata includes `noindex, nofollow` directives

**Before using this template, please review and update:**
- `/public/robots.txt` - Remove restrictive crawler blocking if you want SEO
- `/middleware.ts` - Adjust security headers and CORS settings for your domain
- `/app/layout.tsx` - Update metadata, robots settings, and OpenGraph data
- `/lib/data.ts` - Replace with your own portfolio content

The current settings are designed for a completely private portfolio that won't appear in search results.

[![Version](https://img.shields.io/badge/version-v1.0-green.svg)](https://github.com/8bittts/8leeai/releases)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.1.14-38B2AC)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org)
[![Bun](https://img.shields.io/badge/Bun-1.3.0-fbf0df)](https://bun.sh)

## Live Demo

Take it for a test-drive at [www.8lee.ai](https://8lee.ai).

![8lee.ai Terminal Screenshot](public/8lee-screenshot.png)

## Features

- **Authentic Terminal Experience**: Complete boot sequence animation with interactive pause, command-line interface with visible cursor (2px mobile, 1px desktop)
- **Matrix Background Effect**: Subtle falling characters animation on mobile using `requestAnimationFrame` for optimal performance
- **Interactive Commands**: Navigate through 60+ projects, education, and volunteer experience with command aliases (`ed`, `vol`, `li`)
- **Typewriter Effects**: Smooth text animations with nostalgic terminal feel and prefers-reduced-motion support
- **Custom 404 Page**: Mario-themed error page with typewriter effect that returns to home on interaction
- **Comprehensive Portfolio**: Professional work and achievements spanning multiple decades
- **Production Security**: CSP headers, CORS restrictions, and secure external link handling
- **Mobile-First UX**: Natural browser behavior, 2px visible cursor on mobile, boot sequence pauses for user interaction, user-controlled focus, keyboard hides after Enter
- **Performance Optimized**: `requestAnimationFrame` animations, audio preloading, optimized React hooks with `useRef`, extracted shared rendering utilities
- **Zero Bloat**: Pure Tailwind utilities, minimal dependencies, optimal bundle size
- **Audio Integration**: Preloaded interaction sound effects at 2% volume on first user interaction
- **PWA Ready**: Includes favicon set and Apple Touch icons for mobile home screen installation
- **WCAG 2.1 AA Compliant**: Full accessibility with semantic HTML, ARIA live regions, keyboard navigation, focus indicators, skip links, and reduced motion support
- **Code Quality**: Ultra-aggressive Biome linting with 100+ error-level rules, zero tolerance for code smells

## Quick Start

### Prerequisites

**This project uses Bun exclusively as its package manager and runtime.**

- **Required**: [Bun](https://bun.sh) v1.3.0 or higher
- **Do NOT use**: npm, yarn, or pnpm - only Bun is supported

### Installation

```bash
# Clone the repository
git clone https://github.com/8bittts/8leeai.git
cd 8leeai

# Install dependencies with Bun
bun install

# Run development server with Bun
bun run dev
```

**Note**: All commands in this project use `bun` or `bunx`. The `package.json` has `"packageManager": "bun@1.3.0"` to enforce this.

Open [http://localhost:1333](http://localhost:1333) to view the terminal.

![8lee.ai Boot Sequence](public/8lee-boot-sequence.png)

## Available Commands

Once the terminal loads, you can use these commands:

- `enter` - Show more projects (pagination is 15 by default)
- `1-60` - Open specific project by number (e.g., `42`)
- `61-65` - Open education item by number
- `66-71` - Open volunteer experience by number
- `email` - Display contact email info
- `education` or `ed` - Show education background
- `volunteer` or `vol` - Display volunteer experience
- `github` - Open this GitHub project
- `wellfound` - Open Wellfound profile
- `linkedin` or `li` - Open LinkedIn profile
- `deathnote` - Open deathnote.ai website
- `clear` - Reset terminal display

## Development

**IMPORTANT**: All development commands use Bun exclusively. Do not use npm, yarn, or pnpm.

### Recommended Terminal Setup

For optimal development experience on macOS, use [Ghostty](https://ghostty.org) with the custom 8LEE Terminal Theme. Configuration details available in `ghostty.md`.

### Available Commands (Bun Only)

```bash
# Development with Turbopack (auto-kills port 1333, clears caches)
bun run dev

# Build for production (clears .next before build)
bun run build

# Start production server
bun run start

# Run tests with Bun's native test runner
bun test

# Run tests in watch mode
bun run test:watch

# Lint and format code with Biome (via bunx)
bun run check

# Clean all caches (.next, .turbo, node_modules/.cache)
bun run clean
```

### Testing

Lightweight unit and component testing with Bun's native test runner and React Testing Library:

- **Test Framework**: Bun test (native)
- **Component Testing**: @testing-library/react 16.3.0
- **DOM Environment**: happy-dom 20.0.5
- **Test Utilities**: @testing-library/jest-dom 6.9.1
- **Coverage**: 32 tests, 99 assertions across 4 files
- **Execution Time**: ~850ms for full test suite

Run `bun test` to execute all tests. Tests are co-located with source files:
- `lib/utils.test.ts` - Data integrity, user input validation, and security filtering (URL validation, malicious pattern detection)
- `hooks/use-typewriter.test.tsx` - Authentic terminal content reveal
- `hooks/use-virtual-keyboard-suppression.test.tsx` - Mobile keyboard control (hide after Enter, natural focus behavior)
- `components/cursor.test.tsx` - Visual feedback for terminal readiness

**Testing Philosophy:**
- Tests focus on **user intent and business logic**, not implementation details
- Test names read like requirements (e.g., "hides keyboard after command submission on touch devices")
- Every assertion includes comments explaining the business reason
- Tests document WHY features exist, making them resilient to refactoring
- Observable behavior over internal mechanisms

**Important Notes:**
- Test files are excluded from Next.js builds via `tsconfig.json`
- All tests pass Biome's strict linting rules
- DOM environment configured with `requestAnimationFrame` and `matchMedia` polyfills for comprehensive browser API coverage

### Package Monitoring

Intelligent package update monitoring with breaking change detection and impact analysis:

```bash
# Check for updates with intelligent analysis
bun run packages

# Monitor continuously (checks every 6 hours)
bun run packages:watch

# Only show critical/security updates
bun run packages:critical
```

**Package Monitor Agent Features:**
- **Breaking Change Detection**: Database of known breaking changes for Next.js, React, TypeScript, Tailwind, Biome
- **Priority Scoring**: Categorizes updates as critical, high, medium, or low priority
- **Impact Assessment**: Analyzes effort (high/medium/low) required for each update
- **Security Detection**: Automatically identifies security-related updates
- **Smart Recommendations**: Color-coded output with [URGENT], [CAUTION], [SAFE] indicators
- **Action Plans**: Generates markdown files with step-by-step update instructions
- **Batch Commands**: Creates ready-to-run commands for safe updates
- **Testing Checklist**: Includes verification steps after updates

**Example Output:**
```
[MONITOR] Package Update Monitor - Bun Edition

[PLAN] Update Recommendations:

[CAUTION] next
   Current: 15.5.6 → Latest: 16.0.0
   Priority: HIGH
   Impact: high | Effort: high
   [BREAKING] Breaking changes:
      • Potential App Router changes
      • Node.js version requirements
   [CAUTION] Review breaking changes first
```

The monitor saves detailed action plans as `package-update-plan-YYYY-MM-DD.md` with breaking change details and testing checklists.

## Tech Stack

### Core Dependencies

**Package Manager & Runtime**: [Bun 1.3.0](https://bun.sh) - **Exclusively used for all operations**

- **Framework**: [Next.js 15.5.6](https://nextjs.org) with App Router & Turbopack
- **UI**: [React 19.2.0](https://react.dev) with modern hooks
- **Styling**: [Tailwind CSS v4.1.14](https://tailwindcss.com) pure utilities
- **Language**: [TypeScript 5.9.3](https://www.typescriptlang.org) with strict configuration + 4 ultra-strict flags
- **Code Quality**: [Biome 2.2.6](https://biomejs.dev) for ultra-aggressive linting (100+ error rules + 5 nursery rules)
- **Test Runner**: Bun native test runner with happy-dom (not Jest/Vitest)
- **Analytics**: [Vercel Analytics 1.5.0](https://vercel.com/analytics) and [Speed Insights 1.2.0](https://vercel.com/docs/speed-insights)

### Development Tools
- **Type Definitions**: @types/react 19.2.2, @types/react-dom 19.2.2, @types/node 24.8.1
- **Build Tools**: PostCSS 8.5.6, Autoprefixer 10.4.21
- **Security**: Production-grade middleware with CSP and CORS
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

Production-ready security implementation:
- **Content Security Policy**: Strict CSP with minimal external allowlist
- **CORS**: Restrictive cross-origin policy locked to 8lee.ai
- **HSTS**: Strict transport security with preload
- **External Links**: Secure utility prevents window.opener vulnerabilities
- **Anti-Crawling**: Comprehensive robot blocking configuration
- **Headers**: XSS protection, frame options, content type options

## Version History

For detailed commit history and comprehensive changelog, see [release-notes.md](release-notes.md).

v1.0 - October 2025:
- **Production Release**: Terminal interface with authentic boot sequence
- **Interactive Commands**: Full command system with 60+ projects, command aliases (`ed`, `vol`)
- **Security Hardened**: Production-grade middleware and secure link handling
- **Performance Optimized**: `requestAnimationFrame` animations, audio preloading, optimized React hooks, minimal dependencies, Turbopack, zero custom CSS
- **Comprehensive Data**: Complete portfolio with projects, education, and volunteer experience
- **Audio Integration**: Preloaded sound effects for enhanced immersion
- **Full Accessibility**: WCAG 2.1 AA compliant with semantic HTML, ARIA support, keyboard navigation, skip links, and reduced motion
- **Code Quality**: Ultra-aggressive Biome linting with 100+ error-level rules, all packages on latest stable versions, concise useful comments for open source contributors
- **Shared Utilities**: Extracted rendering logic (`renderTextWithUnderlinedWord`), custom hooks (`useVirtualKeyboardSuppression`), typed command constants
- **Test Coverage**: Intent-focused testing with Bun native test runner (32 tests, 99 assertions) - tests document user needs and business logic, not implementation details
- **Component Architecture**: Reusable components (`SecureExternalLink`, `DataGridSection`) eliminate duplication and improve maintainability
- **Type Safety**: Elite-level TypeScript with strict null checks, proper type guards, and zero unsafe patterns
- **Mobile-First UX**: Natural browser behavior, 2px cursor visibility on mobile, no click-to-reveal or auto-focus traps, simplified keyboard suppression, immediate content display after boot

## Contributing

This is a personal portfolio project. Feel free to make suggestions!

## Contact

For inquiries, use the `email` command in the terminal on [8lee.ai](https://8lee.ai), [@8BIT](https://x.com/8BIT) on X, and check out [DeathNote](https://deathnote.ai).
## License

MIT and all that good jazz.
