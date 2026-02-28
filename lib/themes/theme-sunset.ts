import { createSoftShadows, FONTS_SANS } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Sunset Theme
 *
 * Warm gradient with orange, pink, and purple tones.
 * Peaceful, warm vibes inspired by golden hour.
 */
export const sunsetTheme: ThemeDefinition = {
  id: "sunset",
  name: "Sunset",
  description: "Warm gradient with peaceful, golden hour vibes",

  colors: {
    background: "#1a0a1e",
    foreground: "#ffd6a5",
    primary: "#ff7b00",
    accent: "#8338ec",
    muted: "#ffadad",
    border: "#ff7b00",
    error: "#ef4444",
  },

  fonts: FONTS_SANS,

  borders: {
    width: "2px",
    style: "solid",
  },

  shadows: createSoftShadows("rgba(255, 123, 0, 0.2)"),

  metadata: {
    author: "8LEE",
    version: "1.0.0",
    inspiration: "Golden hour sunset gradients",
  },
}
