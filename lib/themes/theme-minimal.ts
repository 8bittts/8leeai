import { ANIMATION_QUICK, FONTS_SYSTEM, SHADOWS_NONE } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Minimal Theme
 *
 * Ultra-clean, modern minimalist aesthetic.
 * Black text on white background with system fonts.
 * Zero decorations, subtle borders only.
 */
export const minimalTheme: ThemeDefinition = {
  id: "minimal",
  name: "Minimal",
  description: "Ultra-clean modern minimalist with zero decorations",

  colors: {
    background: "#ffffff",
    foreground: "#111111",
    primary: "#111111",
    secondary: "#4b5563", // gray-600 (WCAG compliant)
    accent: "#374151", // gray-700
    muted: "#6b7280", // gray-500 (WCAG: 4.6:1 contrast)
    border: "#d1d5db", // gray-300 (WCAG: 3:1 for UI)
    success: "#111111",
    error: "#111111",
    warning: "#111111",
  },

  fonts: FONTS_SYSTEM,

  borders: {
    width: "1px",
    style: "solid",
    radius: "0",
  },

  shadows: SHADOWS_NONE,
  animation: ANIMATION_QUICK,

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Swiss design and modern minimalism",
  },
}
