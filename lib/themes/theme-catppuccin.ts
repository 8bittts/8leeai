import { BORDERS_MEDIUM, createSoftShadows, FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Catppuccin Theme (Mocha variant)
 *
 * Soothing pastel theme for the high-spirited.
 * Warm, cozy colors with excellent contrast and readability.
 */
export const catppuccinTheme: ThemeDefinition = {
  id: "catppuccin",
  name: "Catppuccin",
  description: "Soothing pastel colors with warm, cozy vibes",

  colors: {
    background: "#1e1e2e", // Base
    foreground: "#cdd6f4", // Text
    primary: "#cba6f7", // Mauve
    accent: "#fab387", // Peach
    muted: "#6c7086", // Overlay0
    border: "#313244", // Surface0
    error: "#f38ba8", // Red
  },

  fonts: FONTS_MONO,
  borders: BORDERS_MEDIUM,
  shadows: createSoftShadows("rgba(203, 166, 247, 0.15)"),

  metadata: {
    author: "8LEE",
    version: "1.0.0",
    inspiration: "Catppuccin Mocha palette",
  },
}
