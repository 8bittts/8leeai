import { ANIMATION_FLOWING, BORDERS_MEDIUM, createSoftShadows, FONTS_SANS } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Ocean Theme
 *
 * Deep underwater calm with blues and cyan accents.
 * Flowing, peaceful aesthetic inspired by the depths of the ocean.
 */
export const oceanTheme: ThemeDefinition = {
  id: "ocean",
  name: "Ocean",
  description: "Deep underwater calm with flowing, peaceful vibes",

  colors: {
    background: "#03045e",
    foreground: "#90e0ef",
    primary: "#0077b6",
    secondary: "#023e8a",
    accent: "#48cae4",
    muted: "#0096c7",
    border: "#0077b6",
    success: "#48cae4",
    error: "#ef4444",
    warning: "#fbbf24",
  },

  fonts: FONTS_SANS,
  borders: BORDERS_MEDIUM,
  shadows: createSoftShadows("rgba(0, 119, 182, 0.2)"),
  animation: ANIMATION_FLOWING,

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Underwater depths and ocean calm",
  },
}
