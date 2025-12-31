import { ANIMATION_QUICK, BORDERS_SUBTLE, createSoftShadows, FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Monokai Theme
 *
 * Classic code editor theme with warm, vibrant colors.
 * Originally created for Sublime Text, now a beloved classic.
 */
export const monokaiTheme: ThemeDefinition = {
  id: "monokai",
  name: "Monokai",
  description: "Classic code editor colors with warm, vibrant tones",

  colors: {
    background: "#272822", // Background
    foreground: "#f8f8f2", // Foreground
    primary: "#f92672", // Pink/Red
    secondary: "#a6e22e", // Green
    accent: "#66d9ef", // Cyan
    muted: "#75715e", // Comment
    border: "#49483e", // Line highlight
    success: "#a6e22e", // Green
    error: "#f92672", // Pink/Red
    warning: "#fd971f", // Orange
  },

  fonts: FONTS_MONO,
  borders: BORDERS_SUBTLE,
  shadows: createSoftShadows("rgba(249, 38, 114, 0.15)"),
  animation: ANIMATION_QUICK,

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Monokai by Wimer Hazenberg",
  },
}
