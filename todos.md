# TODOs

All TODOs and feature planning live in this file.

## Current TODOs
- None found (no TODO/FIXME/HACK/XXX markers in repo).

## Feature Planning
### Priority 1
- Consolidate section layout into a shared `Section` component to normalize heading
  spacing and animation (`components/cv-content.tsx`,
  `components/data-grid-section.tsx`, `components/theme-grid-section.tsx`,
  `components/command-prompt.tsx`).
- Consolidate grid rendering into a single `GridList` that standardizes the
  `grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm` pattern across
  Projects, Education, Volunteer, and Themes.
- Normalize interactive styling by creating shared `interactiveLink` and
  `interactiveButton` helpers using `focusRing`, then reuse them in
  `components/secure-external-link.tsx`, `components/cv-content.tsx`,
  `components/theme-grid-section.tsx`, and `components/command-prompt.tsx`.

### Priority 2
- Replace `showEducation/showVolunteer/showThemes/showEmail/showHelp` booleans
  with a single `activePanel` state plus optional `panelContent` in
  `components/command-prompt.tsx`.
- Centralize command definitions (label, aliases, handler, help text) in one
  registry and derive `VALID_COMMANDS`, `COMMAND_ALIASES`, and Help UI from it.

### Priority 3
- Replace custom animation classes (`animate-fadeIn`, `animate-logo-pulse`) with
  Tailwind or `tw-animate` utilities to reduce custom CSS in `app/globals.css`.
- Reduce theme-specific overrides in `app/globals.css` by grouping shared
  behaviors (retro, neon, minimal) into reusable classes or theme tokens.
- Normalize theme presets and remove unused font variables (for example,
  `--font-geist-*`) or load matching fonts to keep typography consistent.
- Simplify `lib/data.ts` by making `url` and `linkWord` optional and omitting empty
  strings to reduce noise and conditionals.
