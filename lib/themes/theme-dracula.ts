import { BORDERS_SUBTLE, createSoftShadows, FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Dracula Theme
 *
 * Dark theme with a vibrant purple and pink color palette.
 * Popular dark theme used across many code editors.
 */
export const draculaTheme: ThemeDefinition = {
  id: "dracula",
  name: "Dracula",
  description: "Dark theme with vibrant purple and pink accents",

  colors: {
    background: "#282a36", // Background
    foreground: "#f8f8f2", // Foreground
    primary: "#bd93f9", // Purple
    accent: "#8be9fd", // Cyan
    muted: "#6272a4", // Comment
    border: "#44475a", // Current Line
    error: "#ff5555", // Red
  },

  fonts: FONTS_MONO,
  borders: BORDERS_SUBTLE,
  shadows: createSoftShadows("rgba(189, 147, 249, 0.15)"),

  metadata: {
    author: "8LEE",
    version: "1.0.0",
    inspiration: "Dracula theme by Zeno Rocha",
  },
}
