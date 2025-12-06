# CLAUDE.md

## Critical: Bun Only

This project uses **Bun 1.3.1** exclusively. Never use npm/yarn/pnpm.

```bash
bun run dev      # Development (port 1333, Turbopack)
bun run build    # Production build
bun test         # Run tests (96 tests, 297 assertions)
bun run check    # Biome lint/format
bun run packages # Check for updates
```

## CLI Tools

Prefer CLI over web interfaces:
- **Vercel**: Always use `--scope death-note` flag
- **GitHub**: Use `gh` for issues/PRs
- **Supabase**: Use `supabase` CLI

## Project Overview

Terminal-style portfolio at https://8lee.ai featuring DOS simulation, typewriter effects, and command-line interaction.

**Tech Stack:** Next.js 16.0.7, React 19.2.1, TypeScript 5.9.3, Tailwind v4.1.17, Biome 2.3.8, Vercel AI SDK 5.0.108

**Deployment:** Vercel team `death-note` (Pro), Project ID `prj_mAdE8dzVUbtHLhb4ckbtHqowOwiK`

## Workflow

**Pre-commit:** `bun run check && bun test`

**Git commits:** No Claude attribution or co-authorship tags. User account only.

```
type: Brief description

- Details if needed
```

## Key Files

| Purpose | Location |
|---------|----------|
| Portfolio data | `lib/data.ts` |
| Utilities/commands | `lib/utils.ts` |
| Security headers | `proxy.ts` |
| Experiments protocol | `app/experiments/_docs/00-EXPERIMENTS-PROTOCOL.md` |
| Release notes guide | `docs/release-notes/00-RN-README.md` |

## Rules

- **Styling**: Tailwind utilities only, zero custom CSS
- **State**: React hooks only, no external libraries
- **Links**: Use `openExternalLink()` from utils (never direct `window.open`)
- **Docs**: No emojis in any markdown files
- **Experiments**: Follow protocol in `app/experiments/_docs/`

See README.md for architecture, testing philosophy, and detailed documentation.
