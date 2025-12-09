import type { ThemeDefinition } from "./types"

/**
 * Matrix Theme
 *
 * Digital rain and hacker aesthetic inspired by The Matrix.
 * Bright green on pure black with glowing effects.
 */
export const matrixTheme: ThemeDefinition = {
  id: "matrix",
  name: "Matrix",
  description: "Digital rain and hacker aesthetic inspired by The Matrix",

  colors: {
    background: "#000000",
    foreground: "#00ff00", // Bright matrix green
    primary: "#00ff00", // Bright matrix green
    secondary: "#00cc00", // Darker green
    accent: "#39ff14", // Neon green
    muted: "#008800", // Muted green
    border: "#00ff00", // Bright matrix green
    success: "#00ff00",
    error: "#ff0000",
    warning: "#ffff00",
  },

  fonts: {
    primary: "var(--font-mono), ui-monospace, monospace",
    mono: "var(--font-mono), ui-monospace, monospace",
    sizeBase: "1rem",
    lineHeight: "1.5",
  },

  borders: {
    width: "1px",
    style: "solid",
    radius: "0rem",
  },

  shadows: {
    default: "0 0 5px rgba(0, 255, 0, 0.3)",
    hover: "0 0 15px rgba(0, 255, 0, 0.5)",
    active: "0 0 20px rgba(0, 255, 0, 0.7)",
  },

  animation: {
    duration: "200ms",
    timing: "ease-out",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "The Matrix digital rain",
  },
}
