# 8LEE TODOs

---
## MUST FOLLOW RULES and PROTOCOLS:
1. Never remove, delete, or modify this list unless directed to do so.
2. Active work only. Completed work lives in git history.
3. This is the ONLY TODO/backlog file.
4. Keep clear separation of concerns with phase-based checklists and zero task duplication.
5. Validate, review, and test each phase before moving to the next phase.
6. Stage and commit only files touched for the active phase. Ignore unrelated edits from other agents.
7. Update `docs/01-privacy-indexing.md` whenever crawler, indexing, metadata, or deploy policy changes.
8. Add a docs-alignment phase that updates internal/public documentation and runs the documented validation commands.

---
## BACKLOG

### Work TODOs
Only this section contains active unchecked work. Parked candidates and reminders below are planning context, not active implementation tasks.

_No active work._

---
## PARKED (rejected in over-engineering review — do not implement without explicit operator approval)

Planning context only, not active work. Each was captured in the original audit and rejected because the payoff does not justify touching a working production site:

- **CSP `'unsafe-eval'` dev-gating** (`lib/api-security.ts`): `script-src` still requires `'unsafe-inline'` (Next inline scripts without nonces), so dropping eval alone adds negligible real hardening — while CSP edits are the classic broke-prod vector.
- **CORS block removal** (`proxy.ts`/`lib/api-security.ts`): the "attack surface" is theoretical — no API routes, no auth, no cookies, nothing for an allowlisted origin to read. Deleting ~60 lines of working, tested code from the file that touches every response is risk without user-visible payoff.
- **`generateCSP()` → constant**: cosmetic edit to a security-critical file for zero behavior change.
- **tsconfig `target` ES2017 → ES2022**: zero benefit — `noEmit: true` and SWC handles transpilation; pure churn.
- **`display: "swap"` on `IBM_Plex_Mono`**: verified no-op (`next/font` defaults to `'swap'`); adding config that equals the default is noise.
- **`vercel.json` `cleanUrls`/`trailingSlash` removal**: harmless if inert; verification effort exceeds value, and editing deploy config on a working site is unforced risk.
- **Unreferenced `public/` asset pruning** (`8-social.*`, `8.*`, `8lee-*.png`, `bitcoin.pdf`, `logo-*`): external hotlinks (GitHub profile README, social embeds) cannot be exhaustively verified, and deletion is the only way these assets can break anything. They cost kilobytes sitting still.
- **`matrix-background.tsx` resize recompute**: real (tiny) bug, but fixing it is a visible-behavior change — conflicts with the no-design-change constraint.
- **`autoprefixer` removal** (`postcss.config.mjs` + devDependencies): attempted and reverted under the REQUIRED PROOF gate — diffing the built CSS showed removal drops `-moz-column-gap` and the `-webkit` `@supports` prefix fallbacks (non-identical output). Tailwind v4 does not fully replace it here. Do not retry without re-proving the CSS diff is byte-identical.

---
## REMINDERS

- Keep the site public but intentionally non-indexable. Any change to `app/robots.ts`, `app/layout.tsx`, `proxy.ts`, `next.config.ts`, `lib/api-security.ts`, or `vercel.json` must preserve the noindex/noarchive/nosnippet/noimageindex posture.
