import { ANIMATION_NONE, BORDERS_SHARP, FONTS_ACCESSIBILITY, SHADOWS_NONE } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Accessibility Theme
 *
 * Maximum contrast theme optimized for readability and screen readers.
 * Pure black on pure white with 21:1 contrast ratio.
 * No animations, large fonts, clear borders.
 */
export const accessibilityTheme: ThemeDefinition = {
  id: "accessibility",
  name: "Accessibility",
  description: "Maximum contrast, screen reader optimized, zero animations",

  colors: {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
    muted: "#000000",
    border: "#000000",
    success: "#000000",
    error: "#000000",
    warning: "#000000",
  },

  fonts: FONTS_ACCESSIBILITY,
  borders: BORDERS_SHARP,
  shadows: SHADOWS_NONE,
  animation: ANIMATION_NONE,

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "WCAG AAA compliance and screen reader optimization",
  },
}
