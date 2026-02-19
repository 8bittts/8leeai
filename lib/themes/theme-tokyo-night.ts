import { BORDERS_MEDIUM, createSoftShadows, FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Tokyo Night Theme
 *
 * Clean, dark theme inspired by the vibrant lights of Tokyo at night.
 * A celebration of the beautiful lights of Tokyo.
 */
export const tokyoNightTheme: ThemeDefinition = {
  id: "tokyo-night",
  name: "Tokyo Night",
  description: "Clean dark theme inspired by Tokyo city lights",

  colors: {
    background: "#1a1b26", // Background
    foreground: "#a9b1d6", // Foreground
    primary: "#7aa2f7", // Blue
    accent: "#9ece6a", // Green
    muted: "#565f89", // Comment
    border: "#24283b", // Terminal black
    error: "#f7768e", // Red
  },

  fonts: FONTS_MONO,
  borders: BORDERS_MEDIUM,
  shadows: createSoftShadows("rgba(122, 162, 247, 0.15)"),

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Tokyo Night by Enkia",
  },
}
