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

#### Phase 1: Dead code and dead structure removal (pure deletions, zero behavior change)
- [ ] Delete the empty `app/api/ashby/webhook/` directory tree (no route files exist anywhere under `app/api/`).
- [ ] Remove the dead imperative-handle chain: `CommandPromptRef` interface + `ref` prop + `useImperativeHandle` in `components/command-prompt.tsx`, and the never-read `commandPromptRef` in `components/terminal-container.tsx` (`.focus()` is never called by any caller).
- [ ] Remove the no-op `releaseKeyboardSuppression` from `hooks/use-virtual-keyboard-suppression.ts` (its only caller is the dead imperative handle above; return just `suppressVirtualKeyboard`).
- [ ] Remove `renderTextWithUnderlinedWord` from `lib/utils.ts` — it duplicates `components/underlined-word.tsx` and is only referenced by its own smoke test. Repoint the regex-metacharacter test at the `UnderlinedWord` component (or extract a tiny shared `escapeRegExp` helper both can use).
- [ ] Drop the unused `"green"` variant from `components/cursor.tsx` (only `theme`/`contrast` are used).
- [ ] Simplify `pickRandomProjectNumber` in `lib/command-routing.ts`: make `projectNumberById` required and delete the `findIndex` fallback + `allProjects` param (the only production caller always passes the map). Update the smoke tests that exercise the fallback path.
- [ ] Decide: delete the intentionally-empty `tests/setup.ts` plus the `bunfig.toml` preload line, or keep as a future hook point (react-doctor flags it as an unused file).
- [ ] Validate: `bun run check:full`.

#### Phase 2: react-doctor v0.5.1 re-grade (config + judgment fixes)
- [ ] Rename `react-doctor.config.json` → `doctor.config.json` (deprecated name as of v0.5.x; still read but warns).
- [ ] Triage the 11 findings (score 70/100 on v0.5.1 vs documented 100/100 on v0.1.6 — new rules, not regressions). Per the zero-visual-change constraint, default disposition per finding:
  - `exhaustive-deps` ×3 — ref `.current` read in effect cleanup (`terminal-container.tsx:29`, `cv-content.tsx:56`, `boot-sequence.tsx:106`): SAFE to fix — copy ref to a local inside the effect body; no render output touched.
  - `no-adjust-state-on-prop-change` (error) + `no-derived-state` — `contexts/theme-context.tsx:72-73`: SUPPRESS with rationale. The localStorage hydration effect is the intentional SSR-flash guard; refactoring it risks theme-flash regressions. Do not restructure.
  - `prefer-tag-over-role` ×3 — `app/not-found.tsx:47`, `components/command-prompt.tsx:166`, `components/boot-sequence.tsx:137`: SUPPRESS with rationale by default — swapping `div role=` for `<main>`/`<output>` changes DOM elements (different default display/semantics) and violates the no-design-change constraint. Only consider where the node is `sr-only` AND rendering is verified byte-identical; otherwise keep the `role` attributes.
  - `no-event-handler` — `cv-content.tsx:50` (`scrollIntoView` effect watching `visibleProjects`): SUPPRESS with rationale — moving scroll into the handler changes scroll timing relative to render; current behavior must stay as-is.
  - `only-export-components` — `theme-context.tsx:15`: SAFE to fix — moving the `ThemeContext` object to its own module is import-graph only, no render change. Suppress instead if it ripples.
- [ ] Restore a clean grade on the current react-doctor version; update the CLAUDE.md version pin (0.1.6 → current) and config-file reference.
- [ ] Validate: `npx -y react-doctor@latest . --verbose` + `bun run check:full`.

#### Phase 3: Toolchain/config modernization (no runtime behavior change)
- [ ] Drop the redundant `--turbo` flag from the `dev` script in `package.json` (Turbopack is the default bundler in Next 16; flag is inert).
- [ ] Remove `autoprefixer` from `postcss.config.mjs` and devDependencies — Tailwind CSS v4 (`@tailwindcss/postcss`) handles vendor prefixing internally via Lightning CSS. REQUIRED PROOF: diff the built CSS in `.next` before/after removal; ship only if the production CSS output is identical (covers the hand-written rules in `app/globals.css`, e.g. `-webkit-font-smoothing`).
- [ ] React 19 context shorthand: `<ThemeContext value={...}>` instead of `<ThemeContext.Provider value={...}>` in `contexts/theme-context.tsx` (compile-target change only; no DOM/visual difference).
- [ ] Add `display: "swap"` to `IBM_Plex_Mono` in `app/layout.tsx` for declarative consistency with the other two fonts. Verified no-op: `next/font` defaults `display` to `'swap'`, so font loading behavior is unchanged.
- [ ] Bump `knip.json` `$schema` URL from `knip@5` to the installed v6 schema.
- [ ] Re-enable knip unused-export detection (remove `"exports"`/`"types"` from `exclude`) so dead exports like Phase 1's get caught automatically; resolve or tag the handful it surfaces.
- [ ] Consider `tsconfig.json` `target` bump ES2017 → ES2022 (type-level only; SWC transpiles per browserslist) — verify build output unchanged.
- [ ] Validate: `bun run check:full`.

#### Phase 4: Security-header and CSP hygiene (must preserve noindex/noarchive/nosnippet/noimageindex posture)
- [ ] Remove deprecated/legacy response headers from `proxy.ts`: `X-XSS-Protection` (deprecated; OWASP recommends removal) and `X-Download-Options` (IE-only). All anti-indexing headers stay untouched.
- [ ] Gate `'unsafe-eval'` in the CSP `script-src` (`lib/api-security.ts`) to development only. REQUIRED PROOF before production: full click-through on a Vercel preview deployment (boot, panels, theme switch, analytics/speed-insights beacons, 404) with the console open — zero CSP violations. If anything in production needs eval, keep the directive and document why.
- [ ] Decide on the CORS block: the site has zero API routes, yet `proxy.ts` serves an allowlist CORS policy with `Access-Control-Allow-Credentials: true` plus an OPTIONS preflight handler on every response. Either delete CORS handling from `proxy.ts`/`lib/api-security.ts` (and its smoke tests) as unused attack surface, or document why it stays. If deleting: confirm on a Vercel preview that page loads, fonts, analytics beacons, and the audio asset all still work (none are cross-origin consumers of these headers, but prove it, don't assume it).
- [ ] Simplify `generateCSP()` to a constant if it stays parameterless after the changes above.
- [ ] Per rule 7: update `docs/01-privacy-indexing.md` for any header changes.
- [ ] Validate: `bun run check:full`, then post-deploy `curl -I https://8lee.ai` and `curl https://8lee.ai/robots.txt`.

#### Phase 5: Content accuracy and asset hygiene
- [ ] Fix the stale hardcoded version string in `lib/command-handlers.ts` (`uname` says "Next.js 16.1 + React 19.2"; installed is 16.2.x) — drop the minor-version pin or derive it from `package.json` at build time.
- [ ] Unreferenced `public/` assets: `8-social.jpeg`, `8-social.png`, `8.jpeg`, `8.png`, `8lee-boot-sequence.png`, `8lee-screenshot.png`, `bitcoin.pdf`, `logo-00.acorn`, `logo-01.png`, `logo-02.png` are referenced nowhere in the repo. Verify no external hotlinks (GitHub profile README, social embeds) before pruning — decision item, do not bulk-delete blind.
- [ ] PARKED — requires explicit operator approval (visible-behavior change, conflicts with the no-design-change constraint): `components/matrix-background.tsx` resize handler resizes the canvas but never recomputes `columns`/`drops`, so a window widened after load leaves the right side empty until reload. Do not fix as part of this audit; skip unless separately approved.
- [ ] Verify `vercel.json` `cleanUrls`/`trailingSlash` are not inert for framework=nextjs deployments (Next handles both itself); drop only if confirmed no-ops, with proof on a Vercel preview: `curl -I` the root, a trailing-slash path, and a semantic path before/after — redirect behavior must be byte-identical.
- [ ] Validate: `bun run check:full`.

#### Phase 6: Docs alignment (rule 8)
- [ ] Sync version pins across README.md badges + tech-stack table, AGENTS.md, and CLAUDE.md: installed is Bun 1.3.14, Next.js 16.2.9, React 19.2.7, Tailwind 4.3.0, Biome 2.4.16 (docs currently say 1.3.13 / 16.2.4 / 19.2.5 / 4.2.4 / 2.4.13).
- [ ] Update CLAUDE.md react-doctor references (version pin, `doctor.config.json` rename, any changed override rationale).
- [ ] Update `docs/01-privacy-indexing.md` if Phase 4 changed headers (cross-check with rule 7).
- [ ] Run documented validation commands: `bun run check:full`, `curl -I https://8lee.ai`, `curl https://8lee.ai/robots.txt`.

---
## REMINDERS

- Keep the site public but intentionally non-indexable. Any change to `app/robots.ts`, `app/layout.tsx`, `proxy.ts`, `next.config.ts`, `lib/api-security.ts`, or `vercel.json` must preserve the noindex/noarchive/nosnippet/noimageindex posture.
