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

## Coding Style
- TypeScript is strict.
- Biome enforces 2-space indent, LF line endings, 100-character line width, double quotes, and trailing commas.
- Use `@/*` imports when they improve readability.
- Use kebab-case component filenames, `use-` hook filenames, and `theme-*.ts` theme modules.
- Styling is Tailwind-first; app-wide theme/composition CSS belongs in `app/globals.css`.
- Use `openExternalLink()` for external links and `focusRing()`/`interactive()` for focusable UI.

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
