import { BORDERS_ROUNDED, createGlowShadows, FONTS_SANS } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Synthwave Theme
 *
 * 80s retro futurism with hot pink, cyan, and purple.
 * Chrome aesthetics and grid horizon vibes.
 */
export const synthwaveTheme: ThemeDefinition = {
  id: "synthwave",
  name: "Synthwave",
  description: "80s retro futurism with hot pink, cyan, and purple",

  colors: {
    background: "#0c0a20", // Dark blue/purple
    foreground: "#00fff9", // Cyan
    primary: "#ff2975", // Hot pink
    accent: "#00fff9", // Cyan
    muted: "#9d4edd", // Light purple
    border: "#ff2975", // Hot pink
    error: "#ff2975",
  },

  fonts: FONTS_SANS,
  borders: BORDERS_ROUNDED,
  shadows: createGlowShadows("rgba(255, 41, 117, 0.35)", "rgba(0, 255, 249, 0.25)"),

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "80s synthwave and retro futurism",
  },
}
