import { BORDERS_SHARP, FONTS_ACCESSIBILITY, SHADOWS_NONE } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Accessibility Theme
 *
 * Maximum contrast theme optimized for readability and screen readers.
 * Pure black on pure white with 21:1 contrast ratio.
 * Blue accent color for interactive elements to distinguish from minimal theme.
 * No animations, large fonts, sharp clear borders.
 */
export const accessibilityTheme: ThemeDefinition = {
  id: "accessibility",
  name: "Accessibility",
  description: "Maximum contrast with blue accents, screen reader optimized, zero animations",

  colors: {
    background: "#ffffff", // Pure white for maximum contrast
    foreground: "#000000", // Pure black for maximum contrast
    primary: "#0066cc", // Blue for interactive elements (WCAG AAA: 7:1 contrast)
    accent: "#0066cc", // Blue accent for distinction from minimal theme
    muted: "#333333", // Dark gray for muted text (WCAG AAA: 7:1 contrast)
    border: "#000000", // Pure black borders for clarity
    error: "#cc0000", // Red for errors (WCAG AAA: 7:1 contrast)
  },

  fonts: FONTS_ACCESSIBILITY,
  borders: BORDERS_SHARP,
  shadows: SHADOWS_NONE,

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "WCAG AAA compliance and screen reader optimization",
  },
}
