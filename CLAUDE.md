# CLAUDE.md

Technical reference for Claude Code and contributors. See [README.md](README.md) for overview.

## Commands

This project uses **Bun 1.3.5** exclusively. Never use npm/yarn/pnpm.

```bash
bun install          # Install dependencies
bun run dev          # Development server (localhost:1333)
bun run dev:clean    # Clean dev (deeper cache clear)
bun run build        # Production build
bun run start        # Production server
bun test             # Run tests
bun test --watch     # Watch mode
bun run lint         # Biome lint
bun run format       # Biome format
bun run check        # Lint + format (auto-fix)
bunx knip            # Find dead code
```

## Workflow

**Pre-commit:** `bun run check && bun test && bunx knip`

**Git commits:** No Claude attribution or co-authorship tags.

```
type: Brief description

- Details if needed
```

## CLI Tools

Prefer CLI over web interfaces:
- **Vercel**: Always use `--scope death-note` flag
- **GitHub**: Use `gh` for issues/PRs

## Global Commands

Common slash commands available across all projects via `~/.claude/commands/`:

| Command | Purpose |
|---------|---------|
| `/dev` | Start development server |
| `/build` | Production build with cache clear |
| `/check` | Quick quality check (lint + types) |
| `/ship` | Surgical commit + push |
| `/ship-all` | YOLO commit + push all files |
| `/update` | Package update workflow |
| `/vercel` | Vercel deployment audit |
| `/docs` | Documentation audit |
| `/design` | Design review |
| `/fix` | Auto-fix lint/format issues |

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
| `tests/` | Bun test suite |

## Key Files

| Purpose | Location |
|---------|----------|
| Portfolio data | `lib/data.ts` |
| Utilities | `lib/utils.ts` |
| Commands | `lib/commands.ts` |
| Security headers | `proxy.ts` |
| Test setup | `tests/setup.ts` |
| Dead code config | `knip.json` |

## Coding Rules

- **Styling**: Tailwind utilities only, zero custom CSS
- **State**: React hooks only, no external libraries
- **Links**: Use `openExternalLink()` from utils (never direct `window.open`)
- **Focus**: Use `focusRing()` utility for WCAG-compliant focus indicators
- **Formatting**: Biome enforces 2-space indent, LF, 100-char lines, double quotes
- **Docs**: No emojis in markdown; validate with Context7 MCP
- **Planning**: Track TODOs in `todos.md`; git history is the changelog
- **Dead Code**: Run `bunx knip` before shipping; delete unused files
- **Design**: Run `/design` for 9-point compliance audit
- **Demos**: See `app/demos/_docs/` for isolation guidelines

## Testing

- **Framework**: Bun test runner + React Testing Library + happy-dom
- **Location**: `tests/**/*.test.ts` or `*.test.tsx`
- **Scope**: Add tests for behavior changes in hooks, utilities, components

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Bun 1.3.5 |
| Framework | Next.js 16.1.1 (App Router + Turbopack) |
| UI | React 19.2.3 |
| Styling | Tailwind CSS v4.1.18 |
| Language | TypeScript 5.9.3 (strict) |
| Linting | Biome 2.3.11 |
| Deployment | Vercel (death-note team) |

## Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | User-facing overview and quick start |
| **CLAUDE.md** | Technical reference (this file) |
| **todos.md** | Planning and task tracking |
