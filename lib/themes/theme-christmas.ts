import { BORDERS_ROUNDED, createGlowShadows, FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Christmas Theme
 *
 * Festive red and green palette with gold accents.
 * Warm, holiday atmosphere perfect for the Christmas season.
 */
export const christmasTheme: ThemeDefinition = {
  id: "christmas",
  name: "Christmas",
  description: "Festive red and green palette with gold accents",

  colors: {
    background: "#0d1f0d", // Deep forest green
    foreground: "#c41e3a", // Christmas red
    primary: "#c41e3a", // Christmas red
    accent: "#ffd700", // Gold
    muted: "#228b22", // Forest green
    border: "#c41e3a", // Christmas red
    error: "#8b0000",
  },

  fonts: FONTS_MONO,
  borders: BORDERS_ROUNDED,
  shadows: createGlowShadows("rgba(255, 215, 0, 0.2)", "rgba(196, 30, 58, 0.3)"),

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Warm holiday festivities with classic Christmas colors and golden lights",
  },
}
