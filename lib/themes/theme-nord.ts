import { ANIMATION_SMOOTH, BORDERS_SUBTLE, createSoftShadows, FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Nord Theme
 *
 * Arctic, north-bluish color palette inspired by the arctic landscape.
 * Clean, calm, and icy aesthetic with excellent readability.
 */
export const nordTheme: ThemeDefinition = {
  id: "nord",
  name: "Nord",
  description: "Arctic blue color scheme inspired by polar landscapes",

  colors: {
    background: "#2e3440", // Polar Night
    foreground: "#eceff4", // Snow Storm
    primary: "#88c0d0", // Frost - arctic water
    secondary: "#81a1c1", // Frost - ice
    accent: "#5e81ac", // Frost - deep arctic
    muted: "#4c566a", // Polar Night lighter
    border: "#4c566a", // Polar Night lighter
    success: "#a3be8c", // Aurora - green
    error: "#bf616a", // Aurora - red
    warning: "#ebcb8b", // Aurora - yellow
  },

  fonts: FONTS_MONO,
  borders: BORDERS_SUBTLE,
  shadows: createSoftShadows("rgba(136, 192, 208, 0.15)"),
  animation: ANIMATION_SMOOTH,

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Nord color palette by Arctic Ice Studio",
  },
}
