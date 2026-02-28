import { BORDERS_SUBTLE, FONTS_SYSTEM, SHADOWS_NONE } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Minimal Theme
 *
 * Elegant, refined minimalist aesthetic with warm tones.
 * Soft gray text on warm off-white background with subtle rounded corners.
 * Refined color palette with sophisticated grays.
 */
export const minimalTheme: ThemeDefinition = {
  id: "minimal",
  name: "Minimal",
  description: "Elegant minimalist with warm tones and refined grays",

  colors: {
    background: "#fafafa", // Warm off-white
    foreground: "#2d2d2d", // Soft charcoal
    primary: "#2d2d2d", // Soft charcoal
    accent: "#404040", // Darker gray for emphasis
    muted: "#8a8a8a", // Light gray (WCAG: 4.6:1 contrast)
    border: "#e0e0e0", // Subtle border (WCAG: 3:1 for UI)
    error: "#2d2d2d",
  },

  fonts: FONTS_SYSTEM,

  borders: BORDERS_SUBTLE, // Subtle rounded corners for elegance

  shadows: SHADOWS_NONE,

  metadata: {
    author: "8LEE",
    version: "1.0.0",
    inspiration: "Swiss design and modern minimalism",
  },
}
