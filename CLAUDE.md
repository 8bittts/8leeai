# CLAUDE.md

Technical reference for agents and contributors. See [README.md](README.md) for the public overview.

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Development server on http://localhost:1333
bun run dev:clean    # Deeper cleanup, then start dev server
bun run build        # Production build
bun run start        # Production server on port 1333
bun run lint         # Biome lint/check
bun run format       # Biome format
bun run check        # Biome safe auto-fixes
bun run test:smoke   # Maintained smoke tests
bun run check:full   # Lint, smoke tests, build, and knip
bunx knip            # Dead file/export check
```

## Workflow

**Pre-commit:** `bun run check:full`

**Backlog:** Use [docs/00-todos.md](docs/00-todos.md). It is the only TODO/backlog file and must stay active-work-only.

**Privacy/indexing:** Use [docs/01-privacy-indexing.md](docs/01-privacy-indexing.md). Any metadata, routing, middleware, or deploy change must preserve the non-indexable posture.

**Data sync:** When `lib/data/portfolio.json` changes project ordering/content, verify the UI numbering and any profile README copies that intentionally mirror the project list.

**Commit format:**

```text
type: brief description

- Details if needed
```

## CLI Tools

- **Vercel:** always use `--scope death-note`.
- **GitHub:** use `gh` for issues, PRs, and push verification.

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router routes, metadata, robots, and layouts |
| `components/` | Shared terminal UI components |
| `contexts/` | React providers |
| `docs/` | Canonical backlog, privacy/indexing policy, and operator notes |
| `hooks/` | Custom React hooks |
| `lib/` | Data, command routing, utilities, security helpers, and themes |
| `public/` | Static assets |
| `tests/smoke/` | Maintained smoke tests |

## Key Files

| Purpose | Location |
|---------|----------|
| Canonical backlog | `docs/00-todos.md` |
| Privacy/indexing policy | `docs/01-privacy-indexing.md` |
| App metadata and robot meta | `app/layout.tsx` |
| Robots route | `app/robots.ts` |
| Middleware/proxy headers | `proxy.ts` |
| Root route headers | `next.config.ts` |
| Security helpers | `lib/api-security.ts` |
| Portfolio data | `lib/data/portfolio.json` |
| Data validation/exports | `lib/data.ts` |
| Commands | `lib/commands.ts` |
| Theme runtime CSS vars | `contexts/theme-context.tsx` |
| Global theme/composition styles | `app/globals.css` |

## Privacy And Indexing

This site is public by URL but private to crawlers. Search engines, AI crawlers, snippets, archives, and image indexing must be blocked.

Required layers:

1. `app/robots.ts` disallows `/` for `*`.
2. `app/layout.tsx` emits `noindex`, `nofollow`, `noarchive`, `nosnippet`, `noimageindex`, and `nocache` metadata.
3. `proxy.ts` sets `X-Robots-Tag` on every response.
4. `next.config.ts` sets the same `X-Robots-Tag` on the root route.
5. The app emits no sitemap, JSON-LD, OpenGraph, Twitter card, keyword, meta description, resume, or CV indexing signals.

Validate with `bun run check:full`, `curl -I https://8lee.ai`, and `curl https://8lee.ai/robots.txt` after privacy-sensitive changes.

## Coding Rules

- **Branding:** never use the spelled-out personal name anywhere in the codebase. Use "8LEE".
- **Styling:** Tailwind-first. Theme/composition CSS belongs in `app/globals.css`.
- **Theme tokens:** keep CSS tokens minimal and used; if adding one, update both `app/globals.css` and `contexts/theme-context.tsx`.
- **State:** React hooks only, no unnecessary state libraries.
- **Links:** use `openExternalLink()` from `lib/utils.ts`; do not call `window.open` directly in components.
- **Focus:** use `focusRing()` or `interactive()` utilities for accessible focus states.
- **Formatting:** Biome enforces 2-space indent, LF line endings, 100-character line width, double quotes, and trailing commas.
- **Demos:** see `app/demos/_docs/00-demos-readme.md`; demos must stay isolated from the main app.
- **Tests:** maintain smoke coverage for routing, security, utilities, and command behavior.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Bun 1.3.13 |
| Framework | Next.js 16.2.4 (App Router + Turbopack) |
| UI | React 19.2.5 |
| Styling | Tailwind CSS 4.2.4 |
| Language | TypeScript 6.0.3 (strict) |
| Linting | Biome 2.4.13 |
| Deployment | Vercel (`death-note` scope) |

## Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Public overview and quick start |
| [AGENTS.md](AGENTS.md) | Concise external-agent quick start |
| [CLAUDE.md](CLAUDE.md) | Canonical contributor/operator guide |
| [docs/00-todos.md](docs/00-todos.md) | Active-only backlog |
| [docs/01-privacy-indexing.md](docs/01-privacy-indexing.md) | Noindex/crawler policy |
