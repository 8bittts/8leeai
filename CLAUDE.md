# CLAUDE.md

Technical reference for Claude Code. See [README.md](README.md) for architecture and design system.

## Bun Only

This project uses **Bun 1.3.5** exclusively. Never use npm/yarn/pnpm.

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

**Pre-commit:** `bun run check && bun test && bunx knip`

**Git commits:** No Claude attribution or co-authorship tags.

```
type: Brief description

- Details if needed
```

## Slash Commands

| Command | Purpose |
|---------|---------|
| `/check` | Quality checks (TypeScript, Biome, tests, dead code) |
| `/ship` | Quality check + dead code + commit + push |
| `/push` | Fix issues and push to main |
| `/design` | Comprehensive design review (9-point checklist) |
| `/theme` | Global theme switcher |
| `/update` | Package update workflow |
| `/docs` | Documentation audit and consolidation |
| `/vercel` | Comprehensive Vercel review via CLI |

## Key Files

| Purpose | Location |
|---------|----------|
| Portfolio data | `lib/data.ts` |
| Utilities/commands | `lib/utils.ts` |
| Security headers | `proxy.ts` |
| Project roadmap | `docs/00-ROADMAP.md` |
| Theme system | `lib/themes/` |
| Demos | `app/demos/_docs/00-demos-readme.md` |

## Coding Rules

- **Documentation**: Use Context7 MCP to validate library documentation
- **Styling**: Tailwind utilities only, zero custom CSS
- **State**: React hooks only, no external libraries
- **Links**: Use `openExternalLink()` from utils (never direct `window.open`)
- **Focus States**: Use `focusRing()` utility from utils for consistent WCAG-compliant focus indicators
- **Docs**: No emojis in any markdown files
- **Release Notes**: Never create release note .md files. Git commit history serves as the changelog.
- **Design**: Run `/design` for 9-point compliance audit (see README.md for full checklist)
- **Demos**: See `app/demos/_docs/` for guidelines
- **Dead Code**: Never write "future use" utilities. Wire them up in the same commit. Run `bunx knip` before shipping. Delete files with 0 imports.

## Tech Stack

See [README.md#tech-stack](README.md#tech-stack) for complete stack with versions.

## Documentation Hierarchy

| Document | Purpose |
|----------|---------|
| **CLAUDE.md** | Technical canonical for Claude Code (this file) |
| **README.md** | Architecture, design system, tech stack (source of truth) |
| **docs/00-ROADMAP.md** | Active TODOs and future work (only place for plans) |
