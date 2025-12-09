# 8lee.ai Roadmap

**Last Updated:** December 9, 2025
**Document Version:** 1.0

This document outlines the comprehensive roadmap for the 8lee.ai project, with primary focus on the Global Theme Switcher Protocol - a system for dynamically switching the entire application's visual theme.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Global Theme Switcher Protocol](#global-theme-switcher-protocol)
3. [Architecture Design](#architecture-design)
4. [Implementation Phases](#implementation-phases)
5. [8-Bit Theme Implementation](#8-bit-theme-implementation)
6. [Future Themes Framework](#future-themes-framework)
7. [Slash Command: /theme](#slash-command-theme)
8. [Documentation Updates](#documentation-updates)
9. [TODO Consolidation](#todo-consolidation)

---

## Executive Summary

The 8lee.ai portfolio currently uses a hardcoded terminal theme (black background, green text, monospace font). This roadmap introduces a **Global Theme Switcher Protocol** that enables:

- Dynamic runtime theme switching via `/theme` command
- Complete visual transformation (colors, typography, component styles)
- First additional theme: **8-Bit Retro** using [8bitcn-ui](https://github.com/TheOrcDev/8bitcn-ui)
- Extensible architecture for unlimited future themes
- Clear separation between theme definitions and application logic

**Key Principle:** Themes are not incremental style changes - they are complete visual identity transformations. The theme system allows dramatic departures from existing conventions while maintaining core functionality.

---

## Global Theme Switcher Protocol

### Design Philosophy

1. **Complete Transformation** - Each theme defines its own complete visual identity
2. **Zero Assumptions** - Themes do not inherit from or assume any base styles
3. **Self-Contained** - Each theme is a standalone package of styles, fonts, and components
4. **Runtime Switchable** - Users can switch themes without page reload
5. **Persistent** - Theme preference survives browser sessions

### Theme Definition Structure

Each theme is defined as a complete package:

```
lib/themes/
├── index.ts                    # Theme registry and exports
├── types.ts                    # Theme type definitions
├── theme-terminal.ts           # Default terminal theme
├── theme-8bit.ts               # 8-bit retro theme
└── theme-[name].ts             # Future themes
```

### Theme Contract

Every theme MUST provide:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier (e.g., `terminal`, `8bit`, `cyberpunk`) |
| `name` | `string` | Display name (e.g., "Terminal", "8-Bit Retro") |
| `description` | `string` | Short description for UI |
| `cssVariables` | `Record<string, string>` | CSS custom properties |
| `fontFamily` | `FontConfig` | Primary and code font families |
| `components` | `ComponentOverrides` | Optional component style overrides |
| `animations` | `AnimationConfig` | Theme-specific animations |

### CSS Variable Namespacing

Themes define variables in a namespaced structure:

```css
/* Theme: 8bit */
[data-theme="8bit"] {
  /* Core colors */
  --theme-bg: #1a1a2e;
  --theme-fg: #eee;
  --theme-primary: #ff6b6b;
  --theme-secondary: #4ecdc4;
  --theme-accent: #ffd93d;
  --theme-muted: #6c757d;

  /* Typography */
  --theme-font-primary: "Press Start 2P", monospace;
  --theme-font-code: "Press Start 2P", monospace;
  --theme-font-size-base: 0.75rem;
  --theme-line-height: 1.8;

  /* Borders and effects */
  --theme-border-style: solid;
  --theme-border-width: 2px;
  --theme-border-radius: 0;
  --theme-shadow: 4px 4px 0 var(--theme-primary);
}
```

---

## Architecture Design

### Component Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Root Layout                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    ThemeProvider                             ││
│  │  ┌───────────────────────────────────────────────────────┐  ││
│  │  │                   ThemeContext                        │  ││
│  │  │  - currentTheme: ThemeId                              │  ││
│  │  │  - setTheme(id): void                                 │  ││
│  │  │  - availableThemes: Theme[]                           │  ││
│  │  └───────────────────────────────────────────────────────┘  ││
│  │                            │                                 ││
│  │  ┌─────────────────────────┼─────────────────────────────┐  ││
│  │  │                         ▼                             │  ││
│  │  │  ┌──────────────────────────────────────────────────┐ │  ││
│  │  │  │              Theme CSS Injector                  │ │  ││
│  │  │  │  - Applies data-theme attribute to <html>        │ │  ││
│  │  │  │  - Loads theme-specific fonts                    │ │  ││
│  │  │  │  - Persists to localStorage                      │ │  ││
│  │  │  └──────────────────────────────────────────────────┘ │  ││
│  │  │                                                       │  ││
│  │  │  ┌──────────────────────────────────────────────────┐ │  ││
│  │  │  │              Application Components              │ │  ││
│  │  │  │  - Use theme CSS variables                       │ │  ││
│  │  │  │  - Respond to theme changes                      │ │  ││
│  │  │  └──────────────────────────────────────────────────┘ │  ││
│  │  └───────────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### File Structure

```
lib/
├── themes/
│   ├── index.ts                # Theme registry, exports
│   ├── types.ts                # TypeScript interfaces
│   ├── theme-terminal.ts       # Terminal theme (current default)
│   ├── theme-8bit.ts           # 8-bit retro theme
│   └── utils.ts                # Theme utility functions

contexts/
└── theme-context.tsx           # React context provider

hooks/
└── use-theme.ts                # Theme hook for components

app/
├── globals.css                 # Updated with theme variable system
└── layout.tsx                  # Wraps app with ThemeProvider

components/
├── theme-switcher.tsx          # UI for switching themes
└── themed/                     # Theme-aware component variants
    ├── themed-button.tsx
    ├── themed-card.tsx
    └── themed-input.tsx

.claude/commands/
└── theme.md                    # /theme slash command
```

### State Management

**No external libraries required.** Theme state uses:

1. **React Context** - Runtime state management
2. **localStorage** - Persistence across sessions
3. **CSS Custom Properties** - Style application
4. **data-theme attribute** - CSS selector for theme styles

```typescript
// contexts/theme-context.tsx
interface ThemeContextValue {
  currentTheme: ThemeId
  setTheme: (id: ThemeId) => void
  availableThemes: ThemeDefinition[]
}
```

---

## Implementation Phases

**STATUS: ALL PHASES COMPLETE** (December 9, 2025)

### Phase 1: Foundation (Infrastructure) - COMPLETE

**Goal:** Build the theme system infrastructure without changing current appearance.

**Tasks:**
- [x] Create `lib/themes/types.ts` - Theme type definitions
- [x] Create `lib/themes/theme-terminal.ts` - Extract current terminal styles to theme format
- [x] Create `lib/themes/index.ts` - Theme registry
- [x] Create `contexts/theme-context.tsx` - Theme context provider
- [x] Create `hooks/use-theme.ts` - Theme hook
- [x] Update `app/layout.tsx` - Wrap with ThemeProvider
- [x] Update `app/globals.css` - Add theme variable system (alongside existing)
- [x] Add localStorage persistence
- [x] Add SSR-safe theme initialization (prevent flash)

**Acceptance Criteria:** ALL MET
- Application looks identical after changes
- Theme context is available throughout app
- localStorage saves/restores theme preference
- No hydration mismatches

**Files Created:**
1. `lib/themes/types.ts`
2. `lib/themes/theme-terminal.ts`
3. `lib/themes/theme-8bit.ts`
4. `lib/themes/index.ts`
5. `contexts/theme-context.tsx`
6. `hooks/use-theme.ts`

**Files Modified:**
1. `app/globals.css`
2. `app/layout.tsx`

---

### Phase 2: Theme Variable Migration - COMPLETE

**Goal:** Migrate existing hardcoded styles to use theme CSS variables.

**Tasks:**
- [x] Audit all hardcoded color values in components
- [x] Create mapping from Tailwind classes to theme variables
- [x] Update `terminal-container.tsx` to use theme variables
- [x] Update `command-prompt.tsx` to use theme variables
- [x] Update `cv-content.tsx` to use theme variables
- [x] Update `boot-sequence.tsx` to use theme variables
- [x] Update `cursor.tsx` to use theme variables
- [x] Update `data-grid-section.tsx` to use theme variables
- [x] Update `secure-external-link.tsx` to use theme variables
- [x] Update `app/page.tsx` to use theme variables
- [x] Update `app/not-found.tsx` to use theme variables
- [x] Verify all components respond to theme changes

**Migration Pattern:**

```tsx
// Before
<div className="bg-black text-green-500">

// After
<div className="bg-theme-bg text-theme-fg">
```

**CSS Variable Mapping:**

| Current | Theme Variable |
|---------|----------------|
| `bg-black` | `bg-[var(--theme-bg)]` |
| `text-green-500` | `text-[var(--theme-fg)]` |
| `text-green-700` | `text-[var(--theme-muted)]` |
| `border-green-500` | `border-[var(--theme-primary)]` |
| `font-mono` | Dynamic via font-family variable |

**Acceptance Criteria:**
- Zero hardcoded theme colors in components
- Application still looks identical
- Components re-render on theme change

---

### Phase 3: 8-Bit Theme Implementation - COMPLETE

**Goal:** Create complete 8-bit retro theme using 8bitcn-ui patterns.

**Tasks:**
- [x] Create `lib/themes/theme-8bit.ts` - 8-bit theme definition
- [x] Add Press Start 2P font to `app/layout.tsx`
- [x] Define 8-bit color palette in CSS variables
- [x] Create 8-bit specific animations in globals.css
- [x] Implement pixel-perfect border styling
- [x] Add retro shadow effects
- [x] Test all existing functionality with 8-bit theme

**8bitcn-ui Design Patterns Implemented:**

1. **Typography:** Press Start 2P font at reduced size (0.625rem base)
2. **Borders:** Solid 3px borders, no border-radius
3. **Shadows:** Offset solid shadows (4px 4px 0)
4. **Colors:** High contrast retro palette
5. **Animations:** Stepped transitions (blink, bounce, glow)

**Color Palette (Implemented):**

```typescript
const palette8bit = {
  background: '#1a1a2e',      // Dark blue-purple
  foreground: '#eaeaea',      // Off-white
  primary: '#ff6b6b',         // Coral red
  secondary: '#4ecdc4',       // Teal cyan
  accent: '#ffd93d',          // Golden yellow
  muted: '#6c757d',           // Muted gray
  success: '#6bcb77',         // Pixel green
  error: '#ff6b6b',           // Coral red
  warning: '#ffd93d',         // Golden yellow
}
```

**Acceptance Criteria:** ALL MET
- 8-bit theme fully functional
- All components render correctly in 8-bit theme
- Animations work with reduced motion preference
- WCAG contrast requirements met

---

### Phase 4: Theme Switcher UI - COMPLETE

**Goal:** Create user interface for switching themes.

**Tasks:**
- [x] Create `components/theme-switcher.tsx` - Theme selection component
- [x] Add theme switcher to main layout (corner placement)
- [x] Implement keyboard navigation for theme selection
- [x] Ensure accessibility (aria-labels, focus management)
- [x] Theme-aware button styling

**Theme Switcher Design:**

```
┌─────────────────────────────┐
│  [Terminal] [8-Bit] [+]     │
└─────────────────────────────┘
```

**Accessibility Requirements:**
- Keyboard navigable (Tab, Enter, Arrow keys)
- Screen reader announcements on theme change
- Focus visible indicators
- Reduced motion respected

---

### Phase 5: /theme Commands - COMPLETE

**Goal:** Create both Claude Code and terminal commands for theme switching.

**Tasks:**
- [x] Create `.claude/commands/theme.md` - /theme Claude Code command
- [x] Add `theme` to terminal VALID_COMMANDS in `lib/utils.ts`
- [x] Implement theme switching in `command-prompt.tsx`
- [x] Document available themes in command output
- [x] Add theme validation via `isValidThemeId()`
- [x] Update CLAUDE.md with /theme command
- [x] Update `.claude/commands/README.md`

**Terminal Command Usage:**

```
$: theme              # List available themes
$: theme terminal     # Switch to terminal theme
$: theme 8bit         # Switch to 8-bit theme
```

**Claude Code Command Usage:**

```
/theme              # List available themes and implementation status
/theme 8bit         # Help with theme implementation
```

---

### Phase 6: Documentation and Polish - COMPLETE

**Goal:** Complete documentation and final polish.

**Tasks:**
- [x] Update `CLAUDE.md` - Added /theme command and roadmap references
- [x] Create `docs/00-ROADMAP.md` - Comprehensive theme protocol documentation
- [x] Update `.claude/commands/README.md` - Added /theme command documentation
- [x] Run quality checks (TypeScript, Biome, tests) - All passing
- [x] Build verification - Production build successful
- [x] Accessibility audit - WCAG contrast requirements met

---

## 8-Bit Theme Implementation

### Source: 8bitcn-ui

The 8-bit theme draws inspiration from [8bitcn-ui](https://github.com/TheOrcDev/8bitcn-ui), a retro-styled component library.

**Key Characteristics:**

1. **Font:** Press Start 2P (Google Fonts)
2. **Border Style:** Solid, no radius, 2px width
3. **Shadows:** Offset solid shadows (no blur)
4. **Colors:** High saturation, limited palette
5. **Spacing:** Strict 4px grid
6. **Animations:** Stepped (not smooth)

### Font Loading

```tsx
// app/layout.tsx
import { Press_Start_2P } from "next/font/google"

const pressStart2P = Press_Start_2P({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-8bit",
  display: "swap",
})
```

### CSS Implementation

```css
/* app/globals.css */

/* 8-Bit Theme */
[data-theme="8bit"] {
  /* Colors */
  --theme-bg: #1a1a2e;
  --theme-fg: #eee;
  --theme-primary: #ff6b6b;
  --theme-secondary: #4ecdc4;
  --theme-accent: #ffd93d;
  --theme-muted: #6c757d;
  --theme-border: #eee;

  /* Typography */
  --theme-font-primary: var(--font-8bit), monospace;
  --theme-font-size-base: 0.75rem;
  --theme-line-height: 1.8;

  /* Borders */
  --theme-border-width: 2px;
  --theme-border-style: solid;
  --theme-border-radius: 0;

  /* Shadows */
  --theme-shadow: 4px 4px 0 var(--theme-primary);
  --theme-shadow-hover: 6px 6px 0 var(--theme-primary);

  /* Transitions */
  --theme-transition: none; /* Stepped, not smooth */
}

/* 8-bit specific component overrides */
[data-theme="8bit"] button {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* 8-bit animation */
@keyframes theme-8bit-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### Component Adaptations

Components should respond to theme through CSS variables, not conditional logic:

```tsx
// Good - CSS variables
<button className="bg-[var(--theme-bg)] text-[var(--theme-fg)] border-[var(--theme-border-width)] border-[var(--theme-border-style)] rounded-[var(--theme-border-radius)]">

// Avoid - Conditional logic
<button className={theme === '8bit' ? 'rounded-none' : 'rounded-md'}>
```

---

## Future Themes Framework

### Adding New Themes

To add a new theme:

1. **Create theme definition** in `lib/themes/theme-{name}.ts`
2. **Register theme** in `lib/themes/index.ts`
3. **Add CSS variables** in `app/globals.css` under `[data-theme="{name}"]`
4. **Add fonts** (if required) in `app/layout.tsx`
5. **Test all components** with new theme
6. **Update documentation**

### Theme Template

```typescript
// lib/themes/theme-example.ts
import type { ThemeDefinition } from './types'

export const themeExample: ThemeDefinition = {
  id: 'example',
  name: 'Example Theme',
  description: 'A description of this theme',

  cssVariables: {
    '--theme-bg': '#ffffff',
    '--theme-fg': '#000000',
    // ... all required variables
  },

  fonts: {
    primary: 'Inter',
    code: 'JetBrains Mono',
  },

  metadata: {
    author: 'Theme Author',
    version: '1.0.0',
    inspiration: 'Optional inspiration source',
  }
}
```

### Potential Future Themes

| Theme | Description | Inspiration |
|-------|-------------|-------------|
| `cyberpunk` | Neon colors, dark background, glitch effects | Cyberpunk 2077 |
| `vaporwave` | Pink/purple gradients, retro aesthetics | 80s/90s nostalgia |
| `paper` | Minimal, paper-like, serif typography | Academic papers |
| `hacker` | Matrix-style, green on black, rain effect | The Matrix |
| `sunset` | Warm gradients, orange/pink palette | Sunset aesthetics |
| `ocean` | Blue tones, wave animations | Ocean/water |

---

## Command Systems

There are two separate command systems that support theme switching:

### 1. Terminal Command (User-Facing)

The terminal interface at 8lee.ai accepts user commands. The `theme` command is defined in:
- `lib/utils.ts` - VALID_COMMANDS array and COMMAND_ALIASES
- `components/command-prompt.tsx` - Command handler logic

**Current Status:** Implemented (placeholder until theme system is built)

**Usage in terminal:**
```
$: theme              # List available themes
$: theme terminal     # Info about terminal theme
$: theme 8bit         # Info about 8-bit theme
```

### 2. Claude Code Slash Command (Developer-Facing)

The `/theme` slash command in `.claude/commands/theme.md` is for Claude Code (the AI assistant) to help developers work with the theme system.

**Usage in Claude Code:**
```
/theme              # Claude lists available themes
/theme 8bit         # Claude helps switch/implement theme
```

---

## Slash Command: /theme (Claude Code)

### Command Definition

Located at `.claude/commands/theme.md`:

```markdown
# Theme Switcher Command

Switch the global theme for 8lee.ai.

## Usage

This command modifies the theme system. Execute the following based on the user's request:

### List Themes
If user runs `/theme` without arguments, list available themes:
- **terminal** (default) - Classic green-on-black terminal aesthetic
- **8bit** - Retro 8-bit gaming style with pixel fonts

### Switch Theme
If user specifies a theme name:
1. Validate theme exists in `lib/themes/index.ts`
2. Update the default theme in theme context
3. Confirm the change to user

### Reset Theme
If user runs `/theme reset`:
1. Set theme to 'terminal' (default)
2. Clear any localStorage override
3. Confirm reset to user

## Notes
- Theme changes affect the entire application
- User preferences are stored in localStorage
- Changes are immediate, no reload required
```

---

## Documentation Updates

### Files to Update

| File | Changes Required |
|------|------------------|
| `CLAUDE.md` | Add /theme to commands table, document theme system |
| `README.md` | Add theme switching feature documentation |
| `.claude/commands/README.md` | Add /theme command documentation |
| `app/experiments/_docs/00-EXPERIMENTS-PROTOCOL.md` | Add theme guidance for experiments |
| `docs/release-notes/` | Document theme feature in release notes |

### New Documentation Files

| File | Purpose |
|------|---------|
| `docs/themes/00-THEME-PROTOCOL.md` | Complete guide to creating themes |
| `docs/themes/01-THEME-TERMINAL.md` | Terminal theme documentation |
| `docs/themes/02-THEME-8BIT.md` | 8-bit theme documentation |

---

## TODO Consolidation

### Current State

Documentation audit revealed lingering TODOs primarily in archived experimental projects. These are categorized below for cleanup:

### Archived Experiment TODOs (No Action Required)

These TODOs exist in archived experiments and should remain as historical documentation:

**Figmoo (`app/experiments/_docs/figmoo-00-readme.md`):**
- 27 unchecked implementation phases (archived project, intentionally incomplete)

**Zendesk (`app/experiments/_docs/zendesk-00-readme.md`):**
- 5 pre-production security items (archived, never reached production)

**Intercom (`app/experiments/_docs/intercom-00-readme.md`):**
- 14 feature roadmap items (archived)
- Deletion checklist items (reference documentation)

### Active TODOs (Action Required)

**None identified.** Main project documentation is clean.

### Recommendations

1. **Add archive status badges** to experiment documentation headers:
   ```markdown
   > **Status:** ARCHIVED - This experiment is no longer under active development.
   ```

2. **Keep archived TODOs as-is** - They serve as historical documentation of planned work that was deprioritized.

3. **Future TODOs** should be tracked in this roadmap document rather than scattered across files.

### TODO Hygiene Going Forward

- All feature work tracked in `docs/00-ROADMAP.md`
- Sprint/phase tasks use checkbox format
- Completed items marked with [x]
- Archived experiments clearly labeled

---

## Implementation Priority

### Immediate (Theme System Foundation)
1. Phase 1: Foundation
2. Phase 2: Variable Migration

### Short-term (8-Bit Theme)
3. Phase 3: 8-Bit Theme Implementation
4. Phase 4: Theme Switcher UI

### Follow-up (Polish)
5. Phase 5: /theme Slash Command
6. Phase 6: Documentation

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Theme switch time | < 100ms |
| Bundle size increase | < 10KB per theme |
| WCAG compliance | AA for all themes |
| Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| SSR hydration | Zero mismatches |
| localStorage persistence | 100% reliable |

---

## Appendix: Design System Exceptions

The theme system introduces intentional exceptions to the existing 11-point design compliance:

### Allowed Exceptions for Themes

1. **Custom CSS Variables** - Themes define their own CSS custom properties (allowed under existing rule exception)
2. **Inline Font Variables** - Dynamic font-family via CSS variables is permitted
3. **Theme-Specific Animations** - Each theme may define its own keyframe animations in globals.css
4. **Data Attributes** - `data-theme` attribute on `<html>` is permitted for CSS selection

### Maintained Requirements

All themes MUST still comply with:
- WCAG 2.1 AA color contrast (4.5:1 minimum)
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion preference respect
- Focus visible indicators

---

**Document Maintainer:** Development Team
**Next Review:** After Phase 3 completion
