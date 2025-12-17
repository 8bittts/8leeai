# Theme Switcher Command

Switch the global visual theme for 8lee.ai.

## Overview

The theme system allows complete visual transformation of the application. Each theme defines its own colors, typography, borders, shadows, and animations. Themes are not incremental changes - they are complete visual identity transformations.

## Current Implementation

**Status:** COMPLETE (December 15, 2025)

**User Access:**
- Terminal command only: `$: theme` or `$: theme <name>`
- Clear/reset command (`$: clear`, `$: reset`, Ctrl+L, Cmd+K): Resets theme to terminal

## Usage

### List Available Themes

If user runs `/theme` without arguments, respond with:

**Available Themes:**
- **terminal** (default) - Classic green-on-black DOS terminal aesthetic
- **8bit** - Retro 8-bit gaming style with pixel fonts (Press Start 2P)
- **minimal** - Elegant minimalist with warm off-white background, refined grays, subtle rounded corners
- **accessibility** - Maximum contrast (21:1) with blue accents, no animations, large fonts, screen reader optimized

### Terminal Commands

```
$: theme              # List available themes
$: theme terminal     # Switch to terminal theme
$: theme minimal      # Switch to minimal theme
$: theme accessibility # Switch to accessibility theme
$: clear / reset      # Reset terminal AND theme to default
```

### Reset Behavior

Theme resets to terminal (default) when:
- User runs `clear` or `reset` command
- User presses Ctrl+L or Cmd+K
- User calls `resetTheme()` programmatically

## Theme Architecture

Themes are defined in `lib/themes/` with this structure:

```
lib/themes/
├── index.ts           # Theme registry
├── types.ts           # TypeScript interfaces
├── theme-terminal.ts  # Default terminal theme
├── theme-8bit.ts      # 8-bit retro theme
```

Each theme provides:
- CSS custom properties (colors, spacing, borders)
- Font configuration
- Animation definitions
- Component style overrides

## Notes

- Theme changes affect the entire application globally
- User preferences persist in localStorage (cleared on reset)
- All themes must meet WCAG 2.1 AA contrast requirements
- Themes can dramatically change the visual appearance - this is intentional
