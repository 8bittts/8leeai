# 8lee.ai Roadmap

**Last Updated:** December 9, 2025

Active development roadmap for the 8lee.ai project. Completed work is archived in release notes.

---

## Table of Contents

1. [Theme System - Complete](#theme-system---complete)
2. [Architecture and Separation of Concerns](#architecture-and-separation-of-concerns)
3. [Adding New Themes](#adding-new-themes)
4. [Removing Themes](#removing-themes)
5. [Theme Requirements](#theme-requirements)
6. [Future Ideas](#future-ideas)

---

## Theme System - Complete

The theme system is fully implemented with 16 themes available via the terminal `theme` command.

### All Available Themes (16 total)

| Theme | Description | Category |
|-------|-------------|----------|
| `terminal` | Green-on-black DOS aesthetic (default) | Core |
| `8bit` | Retro gaming with Press Start 2P font | Core |
| `gameboy` | Classic 4-color Game Boy LCD palette | Tier 1: Fun |
| `paper` | Academic sepia with Georgia serif | Tier 1: Fun |
| `vaporwave` | 80s/90s pink/cyan nostalgia | Tier 1: Fun |
| `cyberpunk` | Neon noir Blade Runner vibes | Tier 1: Fun |
| `halloween` | Orange/purple spooky season | Tier 2: Seasonal |
| `christmas` | Red/green/gold festive | Tier 2: Seasonal |
| `matrix` | Bright green digital rain | Tier 2: Seasonal |
| `synthwave` | 80s retro futurism | Tier 2: Seasonal |
| `accessibility` | High contrast (21:1), no animations | Tier 3: Experimental |
| `minimal` | Black on white, system fonts | Tier 3: Experimental |
| `brutalist` | 90s web with Times New Roman | Tier 3: Experimental |
| `ocean` | Deep blues, calm underwater | Tier 3: Experimental |
| `sunset` | Warm orange/pink gradients | Tier 3: Experimental |
| `forest` | Deep greens, organic natural | Tier 3: Experimental |

### User Access

**Terminal commands:**
```
$: theme              # List all 16 available themes
$: theme terminal     # Switch to terminal theme
$: theme gameboy      # Switch to gameboy theme
$: theme [name]       # Switch to any theme
$: clear              # Reset terminal AND theme to default
```

**Keyboard shortcuts:**
- `Ctrl+L` or `Cmd+K`: Clear terminal and reset theme to default

---

## Architecture and Separation of Concerns

The theme system is designed with strict separation to prevent contamination of core app code.

### File Structure

```
lib/themes/
├── index.ts              # Theme registry (imports, exports, utilities)
├── types.ts              # TypeScript interfaces (ThemeId, ThemeDefinition)
├── theme-terminal.ts     # Core: Default terminal theme
├── theme-8bit.ts         # Core: 8-bit retro theme
├── theme-gameboy.ts      # Tier 1: Game Boy LCD theme
├── theme-paper.ts        # Tier 1: Academic paper theme
├── theme-vaporwave.ts    # Tier 1: Vaporwave theme
├── theme-cyberpunk.ts    # Tier 1: Cyberpunk theme
├── theme-halloween.ts    # Tier 2: Halloween theme
├── theme-christmas.ts    # Tier 2: Christmas theme
├── theme-matrix.ts       # Tier 2: Matrix theme
├── theme-synthwave.ts    # Tier 2: Synthwave theme
├── theme-accessibility.ts # Tier 3: High contrast theme
├── theme-minimal.ts      # Tier 3: Minimal theme
├── theme-brutalist.ts    # Tier 3: Brutalist theme
├── theme-ocean.ts        # Tier 3: Ocean theme
├── theme-sunset.ts       # Tier 3: Sunset theme
└── theme-forest.ts       # Tier 3: Forest theme
```

### Isolation Principles

1. **Self-Contained Files**: Each theme is a single TypeScript file exporting a `ThemeDefinition`
2. **No External Dependencies**: Themes use only CSS custom properties and standard fonts
3. **No Core App Modifications**: Themes never modify components, hooks, or app logic
4. **Data Attribute Scoping**: Theme-specific CSS uses `[data-theme="..."]` selectors
5. **Clean Removal**: Delete file + remove from index.ts + remove from types.ts

### What Themes Define

Each theme provides ONLY:
- **Colors**: background, foreground, primary, secondary, accent, muted, border, success, error, warning
- **Fonts**: primary font family, mono font family, base size, line height
- **Borders**: width, style, radius
- **Shadows**: default, hover, active states
- **Animation**: duration, timing function, stepped flag

### What Themes Do NOT Touch

- No component modifications
- No hook changes
- No state management changes
- No routing changes
- No external package additions
- No build configuration changes

### Theme-Specific CSS (Minimal)

Only 4 themes require additional CSS in `globals.css`:

| Theme | CSS Override | Reason |
|-------|-------------|--------|
| `gameboy` | `image-rendering: pixelated` | LCD pixel-perfect rendering |
| `brutalist` | `a { text-decoration: underline }` | 90s web link style |
| `accessibility` | No transitions, forced focus | WCAG compliance |
| `matrix` | `::selection` colors | Green selection highlighting |

All CSS is scoped with `[data-theme="..."]` and does not affect other themes.

---

## Adding New Themes

### Step 1: Create Theme File

Create `lib/themes/theme-{name}.ts`:

```typescript
import type { ThemeDefinition } from "./types"

export const exampleTheme: ThemeDefinition = {
  id: "example",
  name: "Example",
  description: "Short description for theme list",

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
    author: "Your Name",
    version: "1.0.0",
    inspiration: "Source of inspiration",
  },
}
```

### Step 2: Add ThemeId

Edit `lib/themes/types.ts`:

```typescript
export type ThemeId =
  | "terminal"
  | "8bit"
  // ... existing themes ...
  | "example"  // Add new theme ID
```

### Step 3: Register Theme

Edit `lib/themes/index.ts`:

```typescript
import { exampleTheme } from "./theme-example"

export const themes: Record<ThemeId, ThemeDefinition> = {
  // ... existing themes ...
  example: exampleTheme,
}
```

### Step 4: Add Theme-Specific CSS (If Needed)

If the theme requires CSS that can't be expressed in the definition, add to `globals.css`:

```css
[data-theme="example"] {
  /* Only add if absolutely necessary */
}
```

### Step 5: Test

1. Run `bun run check` - Biome lint/format
2. Run `bun test` - All tests pass
3. Run `bunx tsc --noEmit` - TypeScript check
4. Test in browser: `$: theme example`

---

## Removing Themes

To completely remove a theme:

### Step 1: Delete Theme File

```bash
rm lib/themes/theme-{name}.ts
```

### Step 2: Remove from Types

Edit `lib/themes/types.ts` and remove the theme ID from the union type.

### Step 3: Remove from Registry

Edit `lib/themes/index.ts`:
- Remove the import statement
- Remove from the `themes` object

### Step 4: Remove CSS (If Any)

Search `globals.css` for `[data-theme="{name}"]` and remove any matching rules.

### Step 5: Verify

```bash
bun run check && bun test && bunx tsc --noEmit
```

---

## Theme Requirements

All themes MUST comply with:

### Accessibility (WCAG 2.1 AA)
- Color contrast ratio: 4.5:1 minimum for normal text
- Color contrast ratio: 3:1 minimum for large text
- Focus indicators must be visible
- Works with screen readers

### Reduced Motion
- Respect `prefers-reduced-motion` media query
- Animated themes must disable animations when preference is set

### Cross-Browser
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Graceful degradation for unsupported features

### Responsive
- Works on all viewport sizes
- No horizontal scrolling caused by theme

### Functional
- All existing functionality must work
- Links must be distinguishable
- Interactive elements must be identifiable

---

## Future Ideas

All 14 planned themes have been implemented. Potential future additions:

| Theme | Description | Source |
|-------|-------------|--------|
| `nord` | Arctic blue color scheme | Nord palette |
| `dracula` | Popular dark theme | Dracula theme |
| `monokai` | Classic code editor colors | Monokai Pro |
| `solarized` | Precision colors | Ethan Schoonover |
| `catppuccin` | Pastel flavors | Catppuccin |
| `gruvbox` | Retro groove colors | Gruvbox |
| `tokyo-night` | Tokyo city lights | Tokyo Night |

---

## Archived Work

Completed theme system implementation is documented in:
- `docs/release-notes/2025-12-w2-december.md` - Full implementation details
- `lib/themes/` - Source code and type definitions
- `.claude/commands/theme.md` - Command documentation
