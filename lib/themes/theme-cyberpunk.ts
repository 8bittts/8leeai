import { BORDERS_ROUNDED, FONTS_SANS } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Cyberpunk Theme
 *
 * Neon noir future with hot pink and electric cyan.
 * Blade Runner and Cyberpunk 2077 inspired with intense neon glow effects.
 */
export const cyberpunkTheme: ThemeDefinition = {
  id: "cyberpunk",
  name: "Cyberpunk",
  description: "Neon noir future with hot pink and electric cyan",

  colors: {
    background: "#0d0221",
    foreground: "#ff2a6d",
    primary: "#ff2a6d",
    accent: "#f706cf",
    muted: "#7209b7",
    border: "#05d9e8",
    error: "#d90368",
  },

  fonts: FONTS_SANS,
  borders: BORDERS_ROUNDED,

  // Cyberpunk uses unique multi-layer neon glow
  shadows: {
    hover:
      "0 0 30px rgba(255, 42, 109, 0.4), 0 0 15px rgba(5, 217, 232, 0.3), 0 0 5px rgba(247, 6, 207, 0.2)",
  },

  metadata: {
    author: "8LEE",
    version: "1.0.0",
    inspiration: "Blade Runner, Cyberpunk 2077, neon-lit dystopian futures",
  },
}
