import { BORDERS_ROUNDED, createGlowShadows, FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Halloween Theme
 *
 * Spooky orange and purple palette with dark backgrounds.
 * Perfect for the Halloween season with creepy, fun vibes.
 */
export const halloweenTheme: ThemeDefinition = {
  id: "halloween",
  name: "Halloween",
  description: "Spooky orange and purple palette with dark backgrounds",

  colors: {
    background: "#1a1a1a",
    foreground: "#ff6600", // Orange
    primary: "#ff6600", // Orange
    accent: "#ff8c00", // Bright orange
    muted: "#8b008b", // Dark purple
    border: "#ff6600", // Orange
    error: "#cc0000",
  },

  fonts: FONTS_MONO,
  borders: BORDERS_ROUNDED,
  shadows: createGlowShadows("rgba(255, 102, 0, 0.3)", "rgba(139, 0, 139, 0.25)"),

  metadata: {
    author: "8LEE",
    version: "1.0.0",
    inspiration: "Spooky season vibes with orange pumpkins and purple night skies",
  },
}
