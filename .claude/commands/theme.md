# Theme Switcher Command

Switch the global visual theme for 8lee.ai.

## Overview

The theme system allows complete visual transformation of the application. Each theme defines its own colors, typography, borders, shadows, and animations. Themes are not incremental changes - they are complete visual identity transformations.

## Usage

### List Available Themes

If user runs `/theme` without arguments, respond with:

**Available Themes:**
- **terminal** (default) - Classic green-on-black DOS terminal aesthetic
- **8bit** - Retro 8-bit gaming style with pixel fonts (Press Start 2P)

### Switch Theme

If user specifies a theme name (e.g., `/theme 8bit`):

1. Check if theme system is implemented:
   - Look for `lib/themes/index.ts`
   - Look for `contexts/theme-context.tsx`
   - Look for `hooks/use-theme.ts`

2. If NOT implemented yet:
   - Inform user: "Theme system is planned but not yet implemented. See `docs/00-ROADMAP.md` for implementation phases."
   - Offer to begin implementation if requested

3. If implemented:
   - Validate theme exists in theme registry
   - Guide user on how to use the theme switcher UI
   - Or modify the default theme in code if permanent change requested

### Reset Theme

If user runs `/theme reset`:
- Set theme back to 'terminal' (default)
- Clear any localStorage override if applicable

## Implementation Status

Check `docs/00-ROADMAP.md` for current implementation phase:

- **Phase 1:** Foundation (infrastructure)
- **Phase 2:** Variable Migration
- **Phase 3:** 8-Bit Theme
- **Phase 4:** Theme Switcher UI
- **Phase 5:** /theme Command
- **Phase 6:** Documentation

## Theme Architecture

Themes are defined in `lib/themes/` with this structure:

```
lib/themes/
├── index.ts           # Theme registry
├── types.ts           # TypeScript interfaces
├── theme-terminal.ts  # Default terminal theme
├── theme-8bit.ts      # 8-bit retro theme
└── utils.ts           # Theme utilities
```

Each theme provides:
- CSS custom properties (colors, spacing, borders)
- Font configuration
- Animation definitions
- Component style overrides

## Notes

- Theme changes affect the entire application globally
- User preferences persist in localStorage
- All themes must meet WCAG 2.1 AA contrast requirements
- Themes can dramatically change the visual appearance - this is intentional
- See `docs/00-ROADMAP.md#global-theme-switcher-protocol` for full documentation
