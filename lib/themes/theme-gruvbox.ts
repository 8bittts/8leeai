import { BORDERS_ROUNDED, createSoftShadows, FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Gruvbox Theme (Dark variant)
 *
 * Retro groove color scheme with warm, earthy tones.
 * Designed for comfortable coding with reduced eye strain.
 */
export const gruvboxTheme: ThemeDefinition = {
  id: "gruvbox",
  name: "Gruvbox",
  description: "Retro groove colors with warm, earthy tones",

  colors: {
    background: "#282828", // bg0
    foreground: "#ebdbb2", // fg
    primary: "#fe8019", // orange
    accent: "#fabd2f", // yellow
    muted: "#928374", // gray
    border: "#3c3836", // bg1
    error: "#fb4934", // red
  },

  fonts: FONTS_MONO,
  borders: BORDERS_ROUNDED,
  shadows: createSoftShadows("rgba(254, 128, 25, 0.15)"),

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Gruvbox by Pavel Pertsev",
  },
}
