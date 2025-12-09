# 8lee.ai Roadmap

**Last Updated:** December 9, 2025

Active development roadmap for the 8lee.ai project. Completed work is archived in release notes.

---

## Table of Contents

1. [Theme System - Future Themes](#theme-system---future-themes)
2. [Adding New Themes](#adding-new-themes)
3. [Theme Ideas Backlog](#theme-ideas-backlog)

---

## Theme System - Future Themes

The theme system is complete and supports runtime theme switching via the terminal `theme` command.

**Current Themes:**
- `terminal` (default) - Classic green-on-black DOS terminal aesthetic
- `8bit` - Retro 8-bit gaming style with Press Start 2P font

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

## Theme Ideas Backlog

Future theme concepts for implementation. Each theme should provide a complete visual transformation while maintaining usability and accessibility.

### Tier 1: High Priority (Fun and Playful)

| Theme | Description | Key Features | Complexity |
|-------|-------------|--------------|------------|
| `vaporwave` | 80s/90s nostalgia aesthetic | Pink/cyan gradients, sunset palette, Japanese text accents, VHS scan lines | Medium |
| `gameboy` | Classic Game Boy green | 4-color palette (#0f380f, #306230, #8bac0f, #9bbc0f), pixel font, LCD effect | Low |
| `cyberpunk` | Neon noir future | Hot pink/electric blue on dark, glitch effects, Blade Runner vibes | Medium |
| `paper` | Minimal academic | Sepia/cream background, serif fonts, paper texture, ink colors | Low |

### Tier 2: Medium Priority (Seasonal/Event)

| Theme | Description | Key Features | Complexity |
|-------|-------------|--------------|------------|
| `halloween` | Spooky season | Orange/purple/black, dripping text, cobweb decorations | Low |
| `christmas` | Holiday cheer | Red/green/gold, snow effects, festive fonts | Low |
| `matrix` | Digital rain | Bright green on black, falling characters effect, Neo vibes | Medium |
| `synthwave` | Retro future | Grid horizon, sunset gradient, chrome text, 80s synth aesthetic | Medium |

### Tier 3: Experimental

| Theme | Description | Key Features | Complexity |
|-------|-------------|--------------|------------|
| `accessibility` | High contrast mode | Maximum contrast, large fonts, no animations, screen reader optimized | Low |
| `minimal` | Ultra-clean | Black text on white, system fonts, zero decorations | Low |
| `brutalist` | Raw web | Times New Roman, blue links, gray backgrounds, 90s web | Low |
| `ocean` | Underwater calm | Deep blues, wave animations, bubble effects | High |
| `sunset` | Warm gradients | Orange/pink sky, warm tones, peaceful vibes | Medium |
| `forest` | Nature inspired | Deep greens, wood textures, organic shapes | Medium |

### Implementation Notes

**Quick Wins (Low Complexity):**
- `gameboy`, `paper`, `halloween`, `christmas`, `accessibility`, `minimal`, `brutalist`
- Can be implemented in 1-2 hours each
- Mostly color/font changes, minimal custom CSS

**Medium Effort:**
- `vaporwave`, `cyberpunk`, `matrix`, `synthwave`, `sunset`, `forest`
- Require custom animations or effects
- May need additional fonts
- 2-4 hours each

**High Effort:**
- `ocean`
- Complex animations, particle effects
- May require Canvas or WebGL
- 4+ hours

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
