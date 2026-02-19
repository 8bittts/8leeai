import { createGlowShadows, FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Matrix Theme
 *
 * Digital rain and hacker aesthetic inspired by The Matrix.
 * Bright green on pure black with glowing effects.
 */
export const matrixTheme: ThemeDefinition = {
  id: "matrix",
  name: "Matrix",
  description: "Digital rain and hacker aesthetic inspired by The Matrix",

  colors: {
    background: "#000000",
    foreground: "#00ff00", // Bright matrix green
    primary: "#00ff00", // Bright matrix green
    accent: "#39ff14", // Neon green
    muted: "#008800", // Muted green
    border: "#00ff00", // Bright matrix green
    error: "#ff0000",
  },

  fonts: FONTS_MONO,

  borders: {
    width: "1px",
    style: "solid",
  },

  shadows: createGlowShadows("rgba(0, 255, 0, 0.3)"),

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "The Matrix digital rain",
  },
}
