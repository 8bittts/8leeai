# TODOs

All TODOs and feature planning live in this file.

## Current TODOs

### Review Sweep (2026-02-19, Round 2)

- [P0] Limit no-cache headers to HTML app routes only.
  - File: `next.config.ts`
  - Current `Cache-Control: no-store` is applied to `/:path*`, which disables CDN/browser caching for JS/CSS/images and hurts performance.
  - Refactor headers so static assets can use Next/Vercel defaults.

- [P1] Harden proxy redirect behavior to avoid interfering with non-page requests.
  - File: `proxy.ts`
  - Apply semantic redirect only for `GET` requests that accept `text/html`.
  - Prevent accidental redirects for non-browser requests.

- [P1] Add explicit CORS preflight and cache variance handling.
  - Files: `proxy.ts`, `lib/api-security.ts`
  - Return early for `OPTIONS` preflight with CORS headers.
  - Include `Vary: Origin` when reflecting allowed origins.

- [P2] Improve OSS contributor ergonomics in scripts.
  - File: `package.json`
  - Add `test` alias for `test:smoke` and a `check:full` command.

- [P2] Clean `.gitignore` tracked-file confusion.
  - File: `.gitignore`
  - Remove `next-env.d.ts` from ignored patterns (file is tracked in repo).

## Feature Planning

1. Apply config/proxy hardening changes.
2. Update scripts and ignore rules.
3. Run `bun run lint && bun run test:smoke && bun run build && bunx knip`.
4. Clear `todos.md` once all items pass.
