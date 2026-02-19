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
    accent: "#52b788",
    muted: "#74c69d",
    border: "#40916c",
    error: "#ef4444",
  },

  fonts: FONTS_SANS,

  borders: {
    width: "2px",
    style: "solid",
  },

  shadows: createSoftShadows("rgba(29, 53, 87, 0.2)"),

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Ancient forests and natural growth",
  },
}
