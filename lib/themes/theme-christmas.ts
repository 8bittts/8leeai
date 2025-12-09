import type { ThemeDefinition } from "./types"

/**
 * Christmas Theme
 *
 * Festive red and green palette with gold accents.
 * Warm, holiday atmosphere perfect for the Christmas season.
 */
export const christmasTheme: ThemeDefinition = {
  id: "christmas",
  name: "Christmas",
  description: "Festive red and green palette with gold accents",

  colors: {
    background: "#0d1f0d", // Deep forest green
    foreground: "#c41e3a", // Christmas red
    primary: "#c41e3a", // Christmas red
    secondary: "#228b22", // Forest green
    accent: "#ffd700", // Gold
    muted: "#228b22", // Forest green
    border: "#c41e3a", // Christmas red
    success: "#228b22",
    error: "#8b0000",
    warning: "#ffd700",
  },

  fonts: {
    primary: "var(--font-mono), ui-monospace, monospace",
    mono: "var(--font-mono), ui-monospace, monospace",
    sizeBase: "1rem",
    lineHeight: "1.5",
  },

  borders: {
    width: "2px",
    style: "solid",
    radius: "0.25rem",
  },

  shadows: {
    default: "0 0 15px rgba(255, 215, 0, 0.15)",
    hover: "0 0 20px rgba(196, 30, 58, 0.4), 0 0 30px rgba(255, 215, 0, 0.3)",
    active: "0 0 10px rgba(196, 30, 58, 0.6), 0 0 15px rgba(255, 215, 0, 0.5)",
  },

  animation: {
    duration: "200ms",
    timing: "ease-in-out",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Warm holiday festivities with classic Christmas colors and golden lights",
  },
}
