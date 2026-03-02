# CLAUDE.md

> Global rules at `~/.claude/CLAUDE.md` apply to all projects. This file contains 8leeai-specific rules only.

Technical reference for Claude Code and contributors. See [README.md](README.md) for overview.

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Development server (localhost:1333)
bun run dev:clean    # Clean dev (deeper cache clear)
bun run build        # Production build
bun run start        # Production server
bun run lint         # Biome lint
bun run format       # Biome format
bun run check        # Lint + format (auto-fix)
bun run test:smoke   # Smoke tests
bun run check:full   # Lint + tests + build + knip
bunx knip            # Find dead code
```

## Workflow

**Pre-commit:** `bun run check:full`

**Data sync:** When `lib/data.ts` is updated (add/remove/reorder projects), also update the GitHub profile README at `~/Documents/8bittts/README.md` to match.

**Commit format:**
```
type: Brief description

- Details if needed
```

## CLI Tools

- **Vercel**: Always use `--scope death-note` flag
- **GitHub**: Use `gh` for issues/PRs

## Project Commands

Project-specific commands in `.claude/commands/`:

| Command | Purpose |
|---------|---------|
| `/push` | Fix issues and push to main |
| `/theme` | Global theme switcher |

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router routes/layouts |
| `components/` | Shared UI components |
| `contexts/` | React contexts |
| `hooks/` | Custom React hooks |
| `lib/` | Data and utilities |
| `lib/themes/` | Theme definitions (23 themes) |
| `public/` | Static assets |

## Key Files

| Purpose | Location |
|---------|----------|
| Portfolio data | `lib/data.ts` |
| Utilities | `lib/utils.ts` |
| Commands | `lib/commands.ts` |
| Typewriter hook | `hooks/use-typewriter.ts` |
| Theme runtime CSS vars | `contexts/theme-context.tsx` |
| Global theme selectors/styles | `app/globals.css` |
| Theme style tags | `lib/themes/styles.ts` |
| Security headers | `proxy.ts` |
| Dead code config | `knip.json` |

## Coding Rules

- **Branding**: NEVER use "Eight Lee" anywhere in the codebase. Always use "8LEE" instead. This applies to metadata, theme authors, UI text, structured data, alt text — everywhere.
- **Styling**: Tailwind-first. Theme-level custom CSS is centralized in `app/globals.css`
- **Theme tokens**: Keep CSS tokens minimal and used; if adding one, update both `app/globals.css` and `contexts/theme-context.tsx`
- **State**: React hooks only, no external libraries
- **Links**: Use `openExternalLink()` from utils (never direct `window.open`)
- **Focus**: Use `focusRing()` utility for WCAG-compliant focus indicators
- **Formatting**: Biome enforces 2-space indent, LF, 100-char lines, double quotes
- **Planning**: Track TODOs in `todos.md`; git history is the changelog
- **Demos**: See `app/demos/_docs/` for isolation guidelines
- **Tests**: Maintain smoke tests in `tests/smoke/` for routing/security/utilities regressions

## Refactor Notes (Feb 2026)

- `useTypewriter()` supports `respectReducedMotion` (default `true`) for per-surface control.
- CV summary, boot sequence, and 404 page explicitly force animation (`respectReducedMotion: false`).
- Typewriter speed is centralized at `ANIMATION_DELAYS.typewriter` in `lib/utils.ts`.
- Legacy shadcn variable blocks were removed from `app/globals.css`; only active theme tokens remain.
- `THEME_STYLE_TAGS` only includes tags with active selectors (`retro`, `neon`, `motion-heavy`).

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Bun 1.3.9 |
| Framework | Next.js 16.1.6 (App Router + Turbopack) |
| UI | React 19.2.4 |
| Styling | Tailwind CSS v4.2.1 |
| Language | TypeScript 5.9.3 (strict) |
| Linting | Biome 2.4.5 |
| Deployment | Vercel (death-note team) |

## Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | User-facing overview and quick start |
| **CLAUDE.md** | Technical reference (this file) |
| **todos.md** | Planning and task tracking |
