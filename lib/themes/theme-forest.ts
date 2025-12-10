import { createSoftShadows, FONTS_SANS } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Forest Theme
 *
 * Deep greens and brown accents with cream highlights.
 * Organic, natural feel inspired by ancient forests.
 */
export const forestTheme: ThemeDefinition = {
  id: "forest",
  name: "Forest",
  description: "Nature-inspired with organic, deep forest vibes",

  colors: {
    background: "#081c15",
    foreground: "#b7e4c7",
    primary: "#40916c",
    secondary: "#2d6a4f",
    accent: "#52b788",
    muted: "#74c69d",
    border: "#40916c",
    success: "#52b788",
    error: "#ef4444",
    warning: "#f77f00",
  },

  fonts: FONTS_SANS,

  borders: {
    width: "2px",
    style: "solid",
    radius: "0.375rem",
  },

  shadows: createSoftShadows("rgba(29, 53, 87, 0.2)"),

  animation: {
    duration: "250ms",
    timing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Ancient forests and natural growth",
  },
}
