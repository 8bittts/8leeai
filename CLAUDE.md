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
npx -y react-doctor@latest .            # Full AST/lint/dead-code health scan
npx -y react-doctor@latest . --diff     # Changed-files only (regression gate)
```

## Workflow

**Pre-commit:** `bun run check:full`

**React quality gate:** `npx -y react-doctor@latest . --diff` after non-trivial component changes. The repo is graded 100/100 on `react-doctor@0.5.1` — keep it. Config lives in [doctor.config.json](doctor.config.json) (renamed from the deprecated `react-doctor.config.json`). Every override exists because the "fix" would change rendered DOM or runtime behavior, violating the zero-design-change constraint:
- `nextjs-missing-metadata` (`app/page.tsx`): metadata is owned by `app/layout.tsx` per the privacy/indexing policy; `app/page.tsx` is a client component and cannot export metadata.
- `exhaustive-deps` (`terminal-container.tsx`, `cv-content.tsx`, `boot-sequence.tsx`): unmount cleanups read timeout/audio refs assigned by callbacks after mount; copying `ref.current` to a local captures `null` at mount and leaks timers. False positive.
- `no-derived-state` / `no-adjust-state-on-prop-change` / `only-export-components` (`contexts/theme-context.tsx`): intentional localStorage-hydration SSR-flash guard.
- `prefer-tag-over-role` (`not-found.tsx`, `command-prompt.tsx`, `boot-sequence.tsx`): swapping `div role=` for `<main>`/`<output>` changes the rendered element.
- `no-event-handler` (`cv-content.tsx`): moving `scrollIntoView` out of the effect changes scroll timing.

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
| React Doctor config | `doctor.config.json` |

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
- **Links:** use `openExternalLink()` from `lib/utils.ts`; do not call `window.open` directly in components. External anchors keep `href` (a11y, right-click) plus `onClick={e => { e.preventDefault(); openExternalLink(url) }}` to enforce hardened `noopener` semantics. This pattern is intentional — when `react-doctor/no-prevent-default` fires on these, suppress with `{/* react-doctor-disable-next-line react-doctor/no-prevent-default */}` directly above the `<a>`.
- **Focus:** use `focusRing()` or `interactive()` utilities for accessible focus states.
- **Formatting:** Biome enforces 2-space indent, LF line endings, 100-character line width, double quotes, and trailing commas.
- **Demos:** see `app/demos/_docs/00-demos-readme.md`; demos must stay isolated from the main app.
- **Tests:** maintain smoke coverage for routing, security, utilities, and command behavior.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Bun 1.3.14 |
| Framework | Next.js 16.2.9 (App Router + Turbopack) |
| UI | React 19.2.7 |
| Styling | Tailwind CSS 4.3.0 |
| Language | TypeScript 6.0.3 (strict) |
| Linting | Biome 2.4.16 |
| Deployment | Vercel (`death-note` scope) |

## Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Public overview and quick start |
| [AGENTS.md](AGENTS.md) | Concise external-agent quick start |
| [CLAUDE.md](CLAUDE.md) | Canonical contributor/operator guide |
| [docs/00-todos.md](docs/00-todos.md) | Active-only backlog |
| [docs/01-privacy-indexing.md](docs/01-privacy-indexing.md) | Noindex/crawler policy |

## graphify

This repo is part of 8bittts' local agent-first graphify rollout.

Rules:
- If `graphify-out/GRAPH_REPORT.md` exists, read it before broad architecture or codebase searches.
- If no graph exists and the task is broad, run `graphify .` first after checking `.graphifyignore` excludes secrets, generated output, dependencies, build artifacts, and private exports.
- Keep `graphify-out/` local and gitignored unless 8bittts explicitly asks to promote graph artifacts in this repo.
- Prefer `graphify query`, `graphify path`, or `graphify explain` for cross-module orientation, then verify with source reads, tests, and runtime evidence before making claims or edits.
- Ask 8bittts for the Product Universe graphify setup if you need a known-good example.
