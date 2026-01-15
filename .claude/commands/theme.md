# Theme Switcher Command

Switch the global visual theme for 8lee.ai.

## Overview

The theme system allows complete visual transformation of the application. Each theme defines its own colors, typography, borders, shadows, and animations. Themes are not incremental changes - they are complete visual identity transformations.

## Current Implementation

**Status:** COMPLETE (January 15, 2026)

**User Access:**
- Terminal command only: `$: theme` or `$: theme <name>`
- Clear/reset command (`$: clear`, `$: reset`, Ctrl+L, Cmd+K): Resets theme to terminal

## Usage

### List Available Themes

If user runs `/theme` without arguments, respond with available themes from the theme registry.

**Core Themes:**
- **terminal** (default) - Classic green-on-black DOS terminal aesthetic
- **8bit** - Retro 8-bit gaming style with pixel fonts

**Fun and Playful:**
- **gameboy** - Nintendo Game Boy inspired
- **paper** - Clean paper-like aesthetic
- **vaporwave** - 80s/90s retro aesthetic
- **cyberpunk** - Neon-lit dystopian future

**Seasonal/Event:**
- **halloween** - Spooky orange and purple
- **christmas** - Festive red and green
- **matrix** - Digital rain aesthetic
- **synthwave** - 80s synth neon

**Experimental:**
- **accessibility** - Maximum contrast, no animations, screen reader optimized
- **minimal** - Clean minimalist design
- **brutalist** - Raw, chunky 90s web aesthetic
- **ocean** - Calm blue ocean tones
- **sunset** - Warm gradient colors
- **forest** - Natural green palette

**Editor Classics:**
- **nord** - Arctic, north-bluish color palette
- **dracula** - Dark theme with purple accents
- **monokai** - Sublime Text inspired
- **solarized** - Precision colors for light/dark
- **catppuccin** - Pastel color palette
- **gruvbox** - Retro groove colors
- **tokyo-night** - Clean dark Tokyo aesthetic

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
├── index.ts           # Theme registry and exports
├── types.ts           # TypeScript interfaces
├── presets.ts         # Shared font, border, shadow, animation presets
├── theme-*.ts         # Individual theme definitions (23 themes)
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
