import { BORDERS_MEDIUM, FONTS_SANS } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Vaporwave Theme
 *
 * 80s/90s nostalgia aesthetic with pink/cyan color scheme.
 * Retro vibes with smooth gradients and pastel neon colors.
 */
export const vaporwaveTheme: ThemeDefinition = {
  id: "vaporwave",
  name: "Vaporwave",
  description: "80s/90s nostalgia with pink and cyan aesthetic",

  colors: {
    background: "#1a1a2e",
    foreground: "#ff71ce",
    primary: "#ff71ce",
    accent: "#05ffa1",
    muted: "#b967ff",
    border: "#01cdfe",
    error: "#ff006e",
  },

  fonts: FONTS_SANS,
  borders: BORDERS_MEDIUM,

  // Vaporwave uses unique multi-color glow shadows
  shadows: {
    hover: "0 8px 30px rgba(1, 205, 254, 0.3), 0 0 20px rgba(255, 113, 206, 0.2)",
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "80s/90s vaporwave aesthetic, Miami nights, retro nostalgia",
  },
}
