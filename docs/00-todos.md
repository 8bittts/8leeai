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

Source: global audit (fresh CLI verification: `bun run lint` clean, 23/23 smoke tests pass, `bunx knip` clean, `bun outdated` empty — all deps at latest published versions, react-doctor v0.5.1 full scan).

**NON-NEGOTIABLE CONSTRAINT (operator directive): zero design/visual changes, zero functional breakage.** Rendered output must stay pixel-identical: DOM structure, CSS output, fonts, animations, spacing, scroll behavior, theme rendering, boot sequence. When a lint/tooling finding can only be satisfied by changing rendered markup or runtime behavior, suppress it with a written rationale instead of "fixing" it. After every phase: run `bun run check:full`, then spot-check in the dev server — boot sequence, projects grid, all panels (help/email/education/volunteer/themes), theme switching + persistence, command input, 404 page — at desktop and mobile widths. Anything that cannot be verified visually unchanged does not ship.

Over-engineering review (operator-directed second pass): every item re-judged on payoff vs breakage risk. Items that touch working runtime behavior for theoretical gain were rejected and moved to PARKED below. Notably, the originally suggested `exhaustive-deps` "fix" was found to be actively harmful and corrected to a suppression.

#### Phase 1: Dead code removal (pure deletions, zero behavior change)
- [ ] `rmdir` the empty `app/api/ashby/webhook/` tree — it is untracked local residue (`git ls-files app/api` is empty; git never tracked it). No commit involved.
- [ ] Remove the dead imperative-handle chain: `CommandPromptRef` interface + `ref` prop + `useImperativeHandle` in `components/command-prompt.tsx`, and the never-read `commandPromptRef` in `components/terminal-container.tsx` (`.focus()` is never called by any caller).
- [ ] Remove the no-op `releaseKeyboardSuppression` from `hooks/use-virtual-keyboard-suppression.ts` (its only caller is the dead imperative handle above; return just `suppressVirtualKeyboard`).
- [ ] Delete `renderTextWithUnderlinedWord` from `lib/utils.ts` and its smoke test — it duplicates `components/underlined-word.tsx` and is referenced only by that test. Do NOT add a DOM testing library or extract shared helpers to preserve the test; that is more machinery than the dead code it covers.
- [ ] Drop the unused `"green"` variant from `components/cursor.tsx` (only `theme`/`contrast` are used).
- [ ] Delete the intentionally-empty `tests/setup.ts` and the `bunfig.toml` preload line (both do literally nothing; also resolves react-doctor's unused-file warning honestly).
- [ ] OPTIONAL: simplify `pickRandomProjectNumber` in `lib/command-routing.ts` (make `projectNumberById` required, drop the `findIndex` fallback + `allProjects` param; only production caller always passes the map; tests cover both paths). Working, tested code — fine to skip if not already touching the file.
- [ ] Validate: `bun run check:full`.

#### Phase 2: react-doctor v0.5.1 re-grade (config rename + suppressions only — zero code-behavior changes)
- [ ] Rename `react-doctor.config.json` → `doctor.config.json` (deprecated name as of v0.5.x; still read but warns).
- [ ] Suppress all remaining findings with written rationale — none survive scrutiny as safe fixes:
  - `exhaustive-deps` ×3 (`terminal-container.tsx:29`, `cv-content.tsx:56`, `boot-sequence.tsx:106`): FALSE POSITIVE. These unmount cleanups read timeout/audio refs that are assigned by callbacks after mount, not inside the effect. The canonical "copy `ref.current` to a local" fix would capture `null` at mount and the cleanup would clear nothing — leaking timers and risking setState-after-unmount. Suppress; do not "fix".
  - `no-adjust-state-on-prop-change` (error) + `no-derived-state` (`contexts/theme-context.tsx:72-73`): intentional localStorage-hydration SSR-flash guard. Suppress; do not restructure.
  - `prefer-tag-over-role` ×3 (`app/not-found.tsx:47`, `components/command-prompt.tsx:166`, `components/boot-sequence.tsx:137`): swapping `div role=` for `<main>`/`<output>` changes DOM elements — violates the no-design-change constraint. Suppress.
  - `no-event-handler` (`cv-content.tsx:50`): moving `scrollIntoView` out of the effect changes scroll timing. Suppress.
  - `only-export-components` (`theme-context.tsx:15`): module shuffling for a Fast Refresh nicety on working code. Suppress.
- [ ] Confirm clean grade after suppressions; update the CLAUDE.md version pin (0.1.6 → current) and config-file reference with the suppression rationales.
- [ ] Validate: `npx -y react-doctor@latest . --verbose` + `bun run check:full`.

#### Phase 3: Toolchain/config hygiene (config-only; no runtime output change)
- [ ] Drop the redundant `--turbo` flag from the `dev` script in `package.json` (Turbopack is the default bundler in Next 16; flag is inert).
- [ ] Remove `autoprefixer` from `postcss.config.mjs` and devDependencies — Tailwind CSS v4 (`@tailwindcss/postcss`) handles vendor prefixing internally via Lightning CSS. REQUIRED PROOF: diff the built CSS in `.next` before/after removal; ship only if the production CSS output is identical (covers the hand-written rules in `app/globals.css`, e.g. `-webkit-font-smoothing`). If the diff is not clean, keep autoprefixer and stop.
- [ ] Bump `knip.json` `$schema` URL from `knip@5` to the installed v6 schema.
- [ ] Re-enable knip unused-export detection (remove `"exports"`/`"types"` from `exclude`) so dead exports like Phase 1's get caught automatically. Effort cap: if it surfaces more than a handful of false positives, restore the exclude and move on.
- [ ] OPTIONAL: React 19 context shorthand `<ThemeContext value={...}>` in `contexts/theme-context.tsx` — one line, identical output; fine to skip.
- [ ] Validate: `bun run check:full`.

#### Phase 4: Legacy header removal (response-header-only; rendering untouched; noindex posture preserved)
- [ ] Remove `X-XSS-Protection` and `X-Download-Options` from `proxy.ts` — both deprecated (the XSS auditor is removed from all modern browsers and OWASP recommends dropping the header; X-Download-Options was IE-only). Removing response headers cannot affect rendering. All anti-indexing and CSP headers stay byte-identical.
- [ ] Per rule 7: update `docs/01-privacy-indexing.md` to reflect the removed headers.
- [ ] Validate: `bun run check:full`, then post-deploy `curl -I https://8lee.ai` (confirm X-Robots-Tag intact) and `curl https://8lee.ai/robots.txt`.

#### Phase 5: Content accuracy
- [ ] Fix the stale hardcoded version string in `lib/command-handlers.ts` (`uname` says "Built with Next.js 16.1 + React 19.2") by dropping the minor pins — e.g. "Built with Next.js 16 + React 19" — so it cannot go stale again. No build-time derivation from `package.json`; that is machinery an easter egg does not need.
- [ ] Validate: `bun run check:full`.

#### Phase 6: Docs alignment (rule 8 — cannot affect runtime)
- [ ] Sync version pins across README.md badges + tech-stack table, AGENTS.md, and CLAUDE.md: installed is Bun 1.3.14, Next.js 16.2.9, React 19.2.7, Tailwind 4.3.0, Biome 2.4.16 (docs currently say 1.3.13 / 16.2.4 / 19.2.5 / 4.2.4 / 2.4.13).
- [ ] Update CLAUDE.md react-doctor references (version pin, `doctor.config.json` rename, suppression rationales from Phase 2).
- [ ] Run documented validation commands: `bun run check:full`, `curl -I https://8lee.ai`, `curl https://8lee.ai/robots.txt`.

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

---
## REMINDERS

- Keep the site public but intentionally non-indexable. Any change to `app/robots.ts`, `app/layout.tsx`, `proxy.ts`, `next.config.ts`, `lib/api-security.ts`, or `vercel.json` must preserve the noindex/noarchive/nosnippet/noimageindex posture.
