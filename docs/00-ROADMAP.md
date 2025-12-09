# 8lee.ai Roadmap

**Last Updated:** December 9, 2025

Active development roadmap for the 8lee.ai project. Completed work is archived in release notes.

---

## Table of Contents

1. [Theme System - Current State](#theme-system---current-state)
2. [Adding New Themes](#adding-new-themes)
3. [Future Ideas](#future-ideas)

---

## Theme System - Current State

The theme system is complete with 16 themes available via the terminal `theme` command.

**All Themes (16 total):**

| Theme | Description | Category |
|-------|-------------|----------|
| `terminal` | Green-on-black DOS aesthetic (default) | Core |
| `8bit` | Retro gaming with Press Start 2P font | Core |
| `gameboy` | Classic 4-color Game Boy LCD palette | Tier 1 |
| `paper` | Academic sepia with serif typography | Tier 1 |
| `vaporwave` | 80s/90s pink/cyan nostalgia | Tier 1 |
| `cyberpunk` | Neon noir Blade Runner vibes | Tier 1 |
| `halloween` | Orange/purple spooky season | Tier 2 |
| `christmas` | Red/green/gold festive | Tier 2 |
| `matrix` | Bright green digital rain | Tier 2 |
| `synthwave` | 80s retro futurism | Tier 2 |
| `accessibility` | High contrast, no animations | Tier 3 |
| `minimal` | Black on white, system fonts | Tier 3 |
| `brutalist` | 90s web with Times New Roman | Tier 3 |
| `ocean` | Deep blues, calm underwater | Tier 3 |
| `sunset` | Warm orange/pink gradients | Tier 3 |
| `forest` | Deep greens, organic natural | Tier 3 |

**Architecture:** See `lib/themes/` for implementation details.

---

## Adding New Themes

To add a new theme:

1. **Create theme definition** in `lib/themes/theme-{name}.ts`
2. **Add ThemeId** to `lib/themes/types.ts` ThemeId union type
3. **Register theme** in `lib/themes/index.ts`
4. **Add CSS** in `app/globals.css` under `[data-theme="{name}"]` (if needed)
5. **Add fonts** (if required) in `app/layout.tsx`
6. **Test all components** with new theme
7. **Update documentation**

### Theme Template

```typescript
// lib/themes/theme-{name}.ts
import type { ThemeDefinition } from "./types"

export const exampleTheme: ThemeDefinition = {
  id: "{name}",
  name: "Display Name",
  description: "Short description",

  colors: {
    background: "#000000",
    foreground: "#ffffff",
    primary: "#ff0000",
    secondary: "#00ff00",
    accent: "#0000ff",
    muted: "#888888",
    border: "#ffffff",
    success: "#00ff00",
    error: "#ff0000",
    warning: "#ffff00",
  },

  fonts: {
    primary: "var(--font-mono), monospace",
    mono: "var(--font-mono), monospace",
    sizeBase: "1rem",
    lineHeight: "1.5",
  },

  borders: {
    width: "1px",
    style: "solid",
    radius: "0.125rem",
  },

  shadows: {
    default: "none",
    hover: "0 0 10px rgba(255, 255, 255, 0.3)",
    active: "0 0 5px rgba(255, 255, 255, 0.5)",
  },

  animation: {
    duration: "150ms",
    timing: "ease-in-out",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Source of inspiration",
  },
}
```

---

## Future Ideas

All 14 planned themes have been implemented. Potential future additions:

| Theme | Description |
|-------|-------------|
| `nord` | Arctic blue color scheme from Nord palette |
| `dracula` | Popular dark theme with purple accents |
| `monokai` | Classic code editor color scheme |
| `solarized` | Ethan Schoonover's precision colors |
| `catppuccin` | Pastel theme with multiple flavors |

### Theme Requirements

All themes MUST:
- Meet WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Support keyboard navigation
- Work with screen readers
- Respect `prefers-reduced-motion`
- Maintain all existing functionality
- Not break on any viewport size

---

## Archived Work

Completed theme system implementation is documented in:
- `docs/release-notes/2025-12-w2-december.md` - Full implementation details
- `lib/themes/` - Source code and type definitions
- `.claude/commands/theme.md` - Command documentation
