# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router entry points, layouts, and API routes; main terminal UI at `app/page.tsx`.
- `components/` and `hooks/`: Reusable UI and custom hooks (state stays in `TerminalContainer`).
- `lib/`: Shared utilities, portfolio data (`lib/data.ts`), and themes (`lib/themes/`).
- `public/`: Static assets and robots/metadata.
- `docs/` and `_docs/`: Roadmap and release notes.
- `tests/`: colocated unit tests (happy-dom) mirroring source folders.
- `proxy.ts`: Centralized security headers (CSP, CORS, HSTS, X-Robots-Tag).

## Build, Test, and Development Commands
- `bun install`: Install dependencies (Bun 1.3.3+ only).
- `bun run dev`: Start the app on port 1333 (Turbopack); pre-kills any process on that port.
- `bun run dev:clean`: Clean caches then start dev server.
- `bun run build`: Production build (`.next` rebuilt from scratch).
- `bun run start`: Serve the built app on port 1333.
- `bun test` / `bun run test:watch`: Run Bun tests (happy-dom).
- `bun run lint`: Biome lint/format check; `bun run format` or `bun run check` auto-fixes.

## Coding Style & Naming Conventions
- Language: TypeScript (strict). Components/hooks in PascalCase exports; files kebab-case (`terminal-container.tsx`).
- Styling: Tailwind CSS v4 utility-first; avoid custom classes/inline styles except where required (canvas, CSS vars).
- Formatting: Biome auto-format with 2-space indent; no unused imports. Run `bun run lint` before commits.
- Imports: Prefer `@/` alias for internal modules to keep paths short.

## Testing Guidelines
- Framework: Bun test runner with happy-dom + Testing Library for React.
- Location: Mirror source (`tests/components`, `tests/hooks`, `tests/lib`); name files `*.test.ts`/`*.test.tsx`.
- Expectations: Cover command handling, focus states, and accessibility helpers; add intent-focused assertions.
- Command: `bun test` must pass before PRs; use `test:watch` during development.

## Commit & Pull Request Guidelines
- Commits follow `<type>: <description>` (e.g., `feat: add theme presets`, `chore: update knip`, `security: harden CSP`).
- Keep commits scoped and readable; include why when touching security headers or robots rules.
- PRs: Link related issue/roadmap item, summarize behavior changes, and note UI impacts or screenshots. Call out CSP/robots changes explicitly.
- Verification: Mention commands run (`bun test`, `bun run lint`, `bun run build` when relevant) and any manual terminal interactions tested.

## Security & Configuration Notes
- Anti-crawling is enforced via `proxy.ts` headers and `public/robots.txt`; coordinate before relaxing them.
- Changes to CSP/CORS should list allowed origins and rationale; ensure external fonts/scripts stay within policy.
- Port 1333; update docs if changed.
