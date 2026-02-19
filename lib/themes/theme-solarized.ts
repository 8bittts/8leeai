import { BORDERS_SUBTLE, createSoftShadows, FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Solarized Theme (Dark variant)
 *
 * Precision colors for machines and people.
 * Carefully designed with both precise CIELAB values and aesthetic beauty.
 */
export const solarizedTheme: ThemeDefinition = {
  id: "solarized",
  name: "Solarized",
  description: "Precision color scheme designed for readability",

  colors: {
    background: "#002b36", // base03
    foreground: "#839496", // base0
    primary: "#268bd2", // blue
    accent: "#b58900", // yellow
    muted: "#586e75", // base01
    border: "#073642", // base02
    error: "#dc322f", // red
  },

  fonts: FONTS_MONO,
  borders: BORDERS_SUBTLE,
  shadows: createSoftShadows("rgba(38, 139, 210, 0.15)"),

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Solarized by Ethan Schoonover",
  },
}
