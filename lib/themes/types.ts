/**
 * Theme System Type Definitions
 *
 * Each theme provides a complete visual identity including colors,
 * typography, borders, shadows, and animations.
 */

export type ThemeId = "terminal" | "8bit"

export interface ThemeColors {
  /** Main background color */
  background: string
  /** Primary text color */
  foreground: string
  /** Primary accent color (buttons, links) */
  primary: string
  /** Secondary accent color */
  secondary: string
  /** Tertiary/highlight color */
  accent: string
  /** Muted/secondary text color */
  muted: string
  /** Border color */
  border: string
  /** Success state color */
  success: string
  /** Error state color */
  error: string
  /** Warning state color */
  warning: string
}

export interface ThemeFonts {
  /** Primary font family for body text */
  primary: string
  /** Monospace font for code/terminal */
  mono: string
  /** Base font size */
  sizeBase: string
  /** Line height multiplier */
  lineHeight: string
}

export interface ThemeBorders {
  /** Border width */
  width: string
  /** Border style (solid, dashed, etc.) */
  style: string
  /** Border radius */
  radius: string
}

export interface ThemeShadows {
  /** Default shadow */
  default: string
  /** Hover state shadow */
  hover: string
  /** Active/pressed shadow */
  active: string
}

export interface ThemeAnimation {
  /** Transition duration */
  duration: string
  /** Transition timing function */
  timing: string
  /** Whether to use stepped animations */
  stepped: boolean
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
  /** Animation settings */
  animation: ThemeAnimation
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
  /** List of all available themes */
  availableThemes: ThemeDefinition[]
}
