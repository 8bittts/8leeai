/**
 * Theme System Type Definitions
 *
 * Each theme provides a complete visual identity including colors,
 * typography, borders, shadows, and animations.
 */

export type ThemeId =
  | "terminal"
  | "8bit"
  // Tier 1: Fun and Playful
  | "gameboy"
  | "paper"
  | "vaporwave"
  | "cyberpunk"
  // Tier 2: Seasonal/Event
  | "halloween"
  | "christmas"
  | "matrix"
  | "synthwave"
  // Tier 3: Experimental
  | "accessibility"
  | "minimal"
  | "brutalist"
  | "ocean"
  | "sunset"
  | "forest"
  // Tier 4: Editor Classics
  | "nord"
  | "dracula"
  | "monokai"
  | "solarized"
  | "catppuccin"
  | "gruvbox"
  | "tokyo-night"

interface ThemeColors {
  /** Main background color */
  background: string
  /** Primary text color */
  foreground: string
  /** Primary accent color (buttons, links) */
  primary: string
  /** Tertiary/highlight color */
  accent: string
  /** Muted/secondary text color */
  muted: string
  /** Border color */
  border: string
  /** Error state color */
  error: string
}

export interface ThemeFonts {
  /** Primary font family for body text */
  primary: string
}

export interface ThemeBorders {
  /** Border width */
  width: string
  /** Border style (solid, dashed, etc.) */
  style: string
}

export interface ThemeShadows {
  /** Hover state shadow */
  hover: string
}

export interface ThemeDefinition {
  /** Unique theme identifier */
  id: ThemeId
  /** Display name for UI */
  name: string
  /** Short description */
  description: string
  /** Color palette */
  colors: ThemeColors
  /** Typography settings */
  fonts: ThemeFonts
  /** Border settings */
  borders: ThemeBorders
  /** Shadow settings */
  shadows: ThemeShadows
  /** Optional metadata */
  metadata?: {
    author?: string
    version?: string
    inspiration?: string
  }
}

export interface ThemeContextValue {
  /** Currently active theme ID */
  currentTheme: ThemeId
  /** Full theme definition */
  theme: ThemeDefinition
  /** Switch to a different theme */
  setTheme: (id: ThemeId) => void
  /** Reset to default terminal theme */
  resetTheme: () => void
  /** List of all available themes */
  availableThemes: ThemeDefinition[]
}
