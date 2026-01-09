# TODOs

All TODOs and feature planning live in this file.

## Current TODOs
- None found (no TODO/FIXME/HACK/XXX markers in repo).

## Feature Planning
- None.

## Completed
- Refactored `command-prompt.tsx` (446 → 175 lines): extracted command handlers to `lib/command-handlers.ts`, created `hooks/use-command-router.ts` and `hooks/use-active-panel.ts`.
- Extracted duplicated age calculation to `lib/age.ts` with `calculateAge()` and `calculateAgeInYears()` functions.
- Consolidated `interactiveLink()`/`interactiveButton()` into single `interactive()` function.
- Added test coverage for age calculation and command handlers (18 new tests).
- Reviewed matrix animation constants (already well-organized at component level).
- Consolidated shared section and grid layout patterns.
- Added shared interactive styles for links, buttons, and command input.
- Centralized command registry and simplified CommandPrompt panel state.
- Replaced custom animation classes with Tailwind/tw-animate utilities.
- Grouped theme behaviors via `data-theme-style` tags and reduced overrides.
- Added IBM Plex Sans and normalized theme font presets.
- Simplified `lib/data.ts` by omitting empty `url` and `linkWord` fields.
