# TODOs

All TODOs and feature planning live in this file.

## Current TODOs

### Codebase Sweep Findings (2026-02-19)

- [P0] Fix numeric command range drift between data and routing.
  - Files: `lib/utils.ts:123`, `hooks/use-command-router.ts:127`, `README.md:119`
  - `projects.length` is currently 66, but `DATA_OFFSETS.projects.end` is 65. Project #66 becomes unreachable via numeric command.
  - Refactor to derive offsets from `projects/education/volunteer` lengths instead of hardcoding.

- [P1] Remove magic number in project-scroll behavior.
  - File: `components/cv-content.tsx:35`
  - Replace `visibleProjects > 15` with `PROJECTS_PER_PAGE` so pagination behavior stays aligned.

- [P1] Split `useCommandRouter` into smaller command handlers.
  - File: `hooks/use-command-router.ts:22`
  - Current hook mixes parsing, routing, status updates, and UI side effects (~280 lines); difficult to test and maintain.
  - Extract parsing, numeric routing, and command execution map into pure helpers.

- [P1] De-duplicate repeated command side effects.
  - File: `hooks/use-command-router.ts:184`
  - `setCommand("")` and panel clearing/status patterns are repeated in many switch branches.
  - Introduce common helper wrappers to reduce branch noise and regression risk.

- [P1] Harden regex construction for underlined link words.
  - File: `lib/utils.ts:57`
  - Escape regex metacharacters in `linkWord` before `new RegExp(...)` to avoid accidental pattern behavior.

- [P1] Avoid replacing all inline styles on `<html>` during theme updates.
  - File: `contexts/theme-context.tsx:61`
  - `root.style.cssText = ...` can clobber unrelated inline styles. Use `style.setProperty(...)` per theme variable.

- [P1] Track and clear transient timers for flash/reset flows.
  - File: `components/terminal-container.tsx:56`
  - `setTimeout` calls should be ref-managed and cleaned on unmount to avoid stale async state updates.

- [P2] Clean up redundant robots header token.
  - File: `proxy.ts:30`
  - `noimageindex` appears twice in `X-Robots-Tag`.

- [P2] Refactor CORS allowlist maintenance.
  - File: `lib/api-security.ts:32`
  - Domain list is long and repetitive (`www` variants). Normalize hostnames and generate accepted origins programmatically.

- [P2] Reduce O(n^2) lookup pattern in boot rendering.
  - File: `components/boot-sequence.tsx:96`
  - `bootLines.indexOf(line)` is called inside mapped arrays; iterate with indexes directly.

- [P2] Improve class composition consistency.
  - Files: `components/grid-list.tsx:8`, `components/section.tsx:23`
  - Manual string joins can be standardized with a shared `cn` utility for readability.

- [P2] Reduce coupling of large static portfolio dataset.
  - File: `lib/data.ts:8`
  - Move data to structured JSON/content file and validate shape at load time to simplify editing and audits.

- [P2] Add minimal smoke tests for command routing and offsets.
  - Files: `hooks/use-command-router.ts`, `lib/commands.ts`, `lib/utils.ts`
  - Focus on numeric range routing, alias resolution, and unknown-command behavior.

## Feature Planning

### Refactor & Cleanup Plan (Draft)

1. Stabilize command routing by deriving offsets from data lengths and updating docs/help text.
2. Extract pure command parsing/routing helpers and add smoke tests for key command paths.
3. Apply cleanup pass for theme style updates, timer lifecycle safety, and minor security/header hygiene.
