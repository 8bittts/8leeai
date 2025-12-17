# CLAUDE.md

Technical reference for Claude Code. See [README.md](README.md) for architecture and design system.

## Bun Only

This project uses **Bun 1.3.3** exclusively. Never use npm/yarn/pnpm.

```bash
bun run dev      # Development (port 1333, Turbopack)
bun run build    # Production build
bun test         # Run tests
bun run check    # Biome lint/format
```

## CLI Tools

Prefer CLI over web interfaces:
- **Vercel**: Always use `--scope death-note` flag
- **GitHub**: Use `gh` for issues/PRs

## Workflow

**Pre-commit:** `bun run check && bun test`

**Git commits:** No Claude attribution or co-authorship tags.

```
type: Brief description

- Details if needed
```

## Slash Commands

| Command | Purpose |
|---------|---------|
| `/check` | Quality checks (TypeScript, Biome, tests) |
| `/ship` | Quality check + commit + push |
| `/push` | Fix issues, update release notes (1800 word split threshold), push |
| `/design` | Comprehensive design review (11-point checklist) |
| `/theme` | Global theme switcher |
| `/update` | Package update workflow |
| `/docs` | Documentation audit and consolidation |

## Key Files

| Purpose | Location |
|---------|----------|
| Portfolio data | `lib/data.ts` |
| Utilities/commands | `lib/utils.ts` |
| Security headers | `proxy.ts` |
| Project roadmap | `docs/00-ROADMAP.md` |
| Theme system | `lib/themes/` |
| Experiments | `app/experiments/_docs/00-experiments-readme.md` |
| Release notes | `docs/release-notes/` |

## Coding Rules

- **Documentation**: Use Context7 MCP to validate library documentation
- **Styling**: Tailwind utilities only, zero custom CSS
- **State**: React hooks only, no external libraries
- **Links**: Use `openExternalLink()` from utils (never direct `window.open`)
- **Focus States**: Use `focusRing()` utility from utils for consistent WCAG-compliant focus indicators
- **Docs**: No emojis in any markdown files
- **Design**: Run `/design` for 9-point compliance audit (see README.md for full checklist)
- **Experiments**: See `app/experiments/_docs/` for guidelines

## Tech Stack

Next.js 16.0.10, React 19.2.3, TypeScript 5.9.3, Tailwind v4.1.18, Biome 2.3.9

See [README.md#tech-stack](README.md#tech-stack) for complete stack with versions.

## Documentation Hierarchy

| Document | Purpose |
|----------|---------|
| **CLAUDE.md** | Technical canonical for Claude Code (this file) |
| **README.md** | Architecture, design system, tech stack (source of truth) |
| **docs/00-ROADMAP.md** | Active TODOs and future work (only place for plans) |
| **docs/release-notes/** | Weekly development logs |
