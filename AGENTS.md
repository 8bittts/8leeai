# Repository Guidelines

## Source Of Truth
- `CLAUDE.md` is the canonical contributor guide for workflows, coding rules, privacy/indexing policy, and operational policy.
- This file is a concise quick-start for external agents. If guidance conflicts, follow `CLAUDE.md`.
- Active planning lives only in `docs/00-todos.md`.

## Project Structure
- `app/`: Next.js App Router entry points, metadata, robots, and layouts.
- `components/`: Reusable terminal UI components.
- `contexts/`: React providers.
- `docs/`: Canonical backlog, privacy/indexing policy, and operator notes.
- `hooks/`: Custom React hooks.
- `lib/`: Core data, commands, utilities, security helpers, and themes.
- `public/`: Static assets.
- `tests/smoke/`: Maintained smoke tests.

## Build, Test, And Development Commands
- `bun install`: Install dependencies with Bun `1.3.13+`.
- `bun run dev`: Start local dev server on `http://localhost:1333`.
- `bun run dev:clean`: Deeper cleanup, then start dev server.
- `bun run build`: Create production build.
- `bun run start`: Serve the production build on port `1333`.
- `bun run lint`: Run Biome checks.
- `bun run format`: Apply Biome formatting.
- `bun run check`: Run Biome with safe auto-fixes.
- `bun run test:smoke`: Run maintained smoke tests.
- `bun run check:full`: Run lint, smoke tests, build, and knip.
- `bunx knip`: Detect unused files/exports.
- `npx -y react-doctor@latest .`: Full React/Next.js health scan (0–100 score). Repo is graded 100/100 on `react-doctor@0.1.6` — keep it.
- `npx -y react-doctor@latest . --diff`: Scoped to changed files; use as the regression gate after non-trivial component changes.

## Coding Style
- TypeScript is strict.
- Biome enforces 2-space indent, LF line endings, 100-character line width, double quotes, and trailing commas.
- Use `@/*` imports when they improve readability.
- Use kebab-case component filenames, `use-` hook filenames, and `theme-*.ts` theme modules.
- Styling is Tailwind-first; app-wide theme/composition CSS belongs in `app/globals.css`.
- Use `openExternalLink()` for external links and `focusRing()`/`interactive()` for focusable UI. External anchors keep `href` and use `onClick={e => { e.preventDefault(); openExternalLink(url) }}` — `react-doctor/no-prevent-default` should be suppressed with `{/* react-doctor-disable-next-line ... */}` above the `<a>` when it fires on these.
- `doctor.config.json` suppresses findings whose "fix" would change rendered DOM or runtime behavior (e.g. `nextjs-missing-metadata` on `app/page.tsx` — metadata is owned by `app/layout.tsx` per the privacy/indexing policy). See CLAUDE.md for the full override rationale.

## Privacy And Indexing
- This site should be reachable directly but never intentionally indexable.
- Keep `robots.txt`, metadata robots, `X-Robots-Tag`, and no-sitemap/no-structured-data guarantees intact.
- Review `docs/01-privacy-indexing.md` before changing metadata, routes, middleware, headers, public assets, or deploy config.

## Testing
- Minimum validation before merge: `bun run check:full`.
- For UI/interaction changes, manually verify terminal flows: boot, `help`, `theme`, `clear`, Return-to-load, and numeric navigation on desktop and mobile.

## Commits And Deployment
- Commit subject format: `type: brief description`.
- Keep commits focused and avoid unrelated changes.
- Deploy with Vercel using the `death-note` scope.
- If `lib/data/portfolio.json` changes project ordering/content, verify UI numbering and any intended mirrored project lists.

## graphify

This repo is part of 8bittts' local agent-first graphify rollout.

Rules:
- If `graphify-out/GRAPH_REPORT.md` exists, read it before broad architecture or codebase searches.
- If no graph exists and the task is broad, run `graphify .` first after checking `.graphifyignore` excludes secrets, generated output, dependencies, build artifacts, and private exports.
- Keep `graphify-out/` local and gitignored unless 8bittts explicitly asks to promote graph artifacts in this repo.
- Prefer `graphify query`, `graphify path`, or `graphify explain` for cross-module orientation, then verify with source reads, tests, and runtime evidence before making claims or edits.
- Ask 8bittts for the Product Universe graphify setup if you need a known-good example.
