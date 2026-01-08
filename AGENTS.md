# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router routes/layouts; demos docs live in `app/demos/_docs/`.
- `components/`, `contexts/`, `hooks/`: shared UI, React contexts, and custom hooks.
- `lib/`: data and utilities (`lib/data.ts`, `lib/utils.ts`); themes in `lib/themes/`.
- `public/`: static assets; `proxy.ts` defines security headers.
- `tests/`: Bun test suite with global setup in `tests/setup.ts`.
- `scripts/`: helper scripts; `knip.json` configures dead-code checks.

## Build, Test, and Development Commands
- `bun install`: install dependencies (Bun only; no npm/yarn/pnpm).
- `bun run dev`: start dev server on `http://localhost:1333` with cache cleanup.
- `bun run dev:clean`: deeper clean before starting dev.
- `bun run build` / `bun run start`: production build and server on port 1333.
- `bun test` / `bun test --watch`: run or watch the test suite.
- `bun run lint`, `bun run format`, `bun run check`: Biome lint/format (check writes fixes).
- `bunx knip`: find unused files/exports; run before shipping changes.

## Coding Style & Naming Conventions
- Formatting: Biome enforces 2-space indentation, LF, 100-char lines, double quotes, semicolons as needed.
- Styling: Tailwind utilities only; avoid custom CSS.
- State: React hooks only; no external state libraries.
- Links and focus: use `openExternalLink()` and `focusRing()` from `lib/utils.ts`.
- Docs: no emojis in Markdown.

## Planning & TODOs
- Track all TODOs and feature planning in `todos.md` at the repo root.

## Testing Guidelines
- Frameworks: Bun test runner with React Testing Library, `@testing-library/jest-dom`, and happy-dom.
- Naming: `tests/**` files use `*.test.ts` or `*.test.tsx`.
- Scope: add or update tests for behavior changes in hooks, utilities, and UI components.

## Commit & Pull Request Guidelines
- Commit format follows conventional types: `feat:`, `fix:`, `chore:`, `docs:`, etc., with a brief summary and optional bullet details.
- Do not add Claude attribution or co-author tags.
- PRs should include a concise description, testing notes, linked issues, and screenshots/recordings for UI, terminal, or theme changes.
- Pre-commit expectation: `bun run check && bun test && bunx knip`.
