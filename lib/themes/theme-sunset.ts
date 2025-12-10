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
    secondary: "#ff006e",
    accent: "#8338ec",
    muted: "#ffadad",
    border: "#ff7b00",
    success: "#52b788",
    error: "#ef4444",
    warning: "#fb8500",
  },

  fonts: FONTS_SANS,

  borders: {
    width: "2px",
    style: "solid",
    radius: "0.75rem",
  },

  shadows: createSoftShadows("rgba(255, 123, 0, 0.2)"),

  animation: {
    duration: "350ms",
    timing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Golden hour sunset gradients",
  },
}
