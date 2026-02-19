# Repository Guidelines

## Source of Truth
- `CLAUDE.md` is the canonical contributor guide for workflows, coding rules, and operational policy.
- This file is a quick-start summary for external agents/contributors; keep it concise and avoid rule duplication.
- If guidance conflicts, follow `CLAUDE.md` and update this file only as a short pointer.

## Project Structure & Module Organization
- `app/`: Next.js App Router entry points (`layout.tsx`, `page.tsx`, `not-found.tsx`). Demo notes live in `app/demos/_docs/`.
- `components/`: Reusable terminal UI components.
- `lib/`: Core data and logic (`data.ts`, `commands.ts`, `utils.ts`, `api-security.ts`); themes in `lib/themes/theme-*.ts`.
- `hooks/`: Custom React hooks. `contexts/`: React providers.
- `public/`: Static assets (images, PDFs, favicon set).
- `scripts/`: Utility scripts not bundled into the app.

## Build, Test, and Development Commands
- `bun install`: Install dependencies (Bun `1.3.9+`).
- `bun run dev`: Start local dev server on `http://localhost:1333` (includes cache/port cleanup).
- `bun run dev:clean`: Deeper cleanup, then start dev server.
- `bun run build`: Create production build.
- `bun run start`: Serve the production build on port `1333`.
- `bun run lint`: Run Biome checks.
- `bun run format`: Apply Biome formatting.
- `bun run check`: Run Biome with safe auto-fixes.
- `bun run test:smoke`: Run maintained smoke tests.
- `bun run check:full`: Run lint, smoke tests, build, and knip in one command.
- `bunx knip`: Detect unused files/exports.

## Coding Style & Naming Conventions
- Language: TypeScript with strict compiler options enabled.
- Formatting (Biome): 2-space indent, LF line endings, 100-char line width, double quotes, trailing commas `es5`.
- Imports: use `@/*` alias where it improves readability.
- Naming patterns: kebab-case files (`terminal-container.tsx`), hook files prefixed with `use-`, theme modules as `theme-*.ts`.
- For detailed conventions (including Tailwind-first styling and link/focus utilities), defer to `CLAUDE.md`.

## Testing Guidelines
- Smoke tests are maintained in `tests/smoke/` (routing/security/utils coverage).
- Minimum validation before merge: `bun run check:full`.
- For UI/interaction changes, manually verify terminal flows (`help`, `theme`, numeric navigation) on desktop and mobile.

## Commit & Pull Request Guidelines
- Commit subject format: `type: brief description` (examples: `chore: update packages`, `docs: refresh README`).
- Keep commits focused and avoid mixing unrelated changes.
- PRs should include: change summary, linked issue (if applicable), commands run for validation, and screenshots/GIFs for visual changes.
- If `lib/data.ts` changes project ordering/content, follow the sync workflow in `CLAUDE.md`.
