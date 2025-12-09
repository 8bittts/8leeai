# CLAUDE.md

## Critical: Bun Only

This project uses **Bun 1.3.1** exclusively. Never use npm/yarn/pnpm.

```bash
bun run dev      # Development (port 1333, Turbopack)
bun run build    # Production build
bun test         # Run tests (96 tests, 297 assertions)
bun run check    # Biome lint/format
bun outdated     # Check for updates
bun update       # Update within semver range
bun audit        # Check for vulnerabilities
```

## CLI Tools

Prefer CLI over web interfaces:
- **Vercel**: Always use `--scope death-note` flag
- **GitHub**: Use `gh` for issues/PRs
- **Supabase**: Use `supabase` CLI

## Project Overview

Terminal-style portfolio at https://8lee.ai featuring DOS simulation, typewriter effects, and command-line interaction.

**Tech Stack:** Next.js 16.0.8, React 19.2.1, TypeScript 5.9.3, Tailwind v4.1.17, Biome 2.3.8, Vercel AI SDK 5.0.108

**Deployment:** Vercel team `death-note` (Pro), Project ID `prj_mAdE8dzVUbtHLhb4ckbtHqowOwiK`

## Workflow

**Pre-commit:** `bun run check && bun test`

**Git commits:** No Claude attribution or co-authorship tags. User account only.

```
type: Brief description

- Details if needed
```

## Slash Commands

Custom Claude Code commands in `.claude/commands/`:

| Command | Purpose |
|---------|---------|
| `/check` | Quality checks (TypeScript, Biome, tests) |
| `/ship` | Quality check + commit + push |
| `/push` | Fix issues (touched files), update release notes (1800 word split threshold), push |
| `/design` | Comprehensive design review (11-point checklist, ultrathink mode) |
| `/update` | Package update workflow |

## Key Files

| Purpose | Location |
|---------|----------|
| Portfolio data | `lib/data.ts` |
| Utilities/commands | `lib/utils.ts` |
| Security headers | `proxy.ts` |
| Experiments protocol | `app/experiments/_docs/00-EXPERIMENTS-PROTOCOL.md` |
| Release notes guide | `docs/release-notes/00-RN-README.md` |
| Slash commands | `.claude/commands/` |

## Rules

- **Documentation**: Use Context7 MCP to validate current documentation about software libraries
- **Styling**: Tailwind utilities only, zero custom CSS
- **State**: React hooks only, no external libraries
- **Links**: Use `openExternalLink()` from utils (never direct `window.open`)
- **Docs**: No emojis in any markdown files
- **Experiments**: Follow protocol in `app/experiments/_docs/`

## Design System (11-Point Compliance)

Run `/design` to audit. All code must pass:

1. **Pure shadcn** - Components in `components/ui/` unmodified from official versions
2. **Pure Tailwind v4** - Use `@import "tailwindcss"`, `@theme inline`, no v3 patterns
3. **Zero inline styles** - Exception: truly dynamic values (CSS custom properties, canvas)
4. **Zero custom components** - Use shadcn primitives or standard HTML+Tailwind
5. **Zero custom classes** - Exception: required animations in `globals.css`
6. **Zero hardcoded values** - Use Tailwind tokens. Exception: canvas, SVG, email templates
7. **Zero duplicate styles** - Extract repeated className patterns
8. **Zero style conflicts** - No conflicting classes (e.g., `hidden flex`, `w-full w-1/2`)
9. **Zero unused styles** - Remove orphaned CSS variables and classes
10. **Full WCAG/ARIA** - Focus indicators, aria-labels, 4.5:1 contrast, keyboard nav
11. **Normalized patterns** - Consistent typography, spacing, sizing across similar elements

**Color Contrast Rules:**
- Terminal theme (black bg): Use `text-green-700` for secondary text (not gray-400)
- Light theme (Figmoo): Use `text-gray-600` minimum (not gray-400/500)
- Placeholders: Use `placeholder:text-gray-500` minimum on light backgrounds

See README.md for architecture, testing philosophy, and detailed documentation.
