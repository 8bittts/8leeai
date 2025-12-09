import type { ThemeDefinition } from "./types"

/**
 * Synthwave Theme
 *
 * 80s retro futurism with hot pink, cyan, and purple.
 * Chrome aesthetics and grid horizon vibes.
 */
export const synthwaveTheme: ThemeDefinition = {
  id: "synthwave",
  name: "Synthwave",
  description: "80s retro futurism with hot pink, cyan, and purple",

  colors: {
    background: "#0c0a20", // Dark blue/purple
    foreground: "#00fff9", // Cyan
    primary: "#ff2975", // Hot pink
    secondary: "#7b2cbf", // Purple
    accent: "#00fff9", // Cyan
    muted: "#9d4edd", // Light purple
    border: "#ff2975", // Hot pink
    success: "#00fff9",
    error: "#ff2975",
    warning: "#ffd60a",
  },

  fonts: {
    primary: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    mono: "var(--font-mono), ui-monospace, monospace",
    sizeBase: "1rem",
    lineHeight: "1.6",
  },

  borders: {
    width: "2px",
    style: "solid",
    radius: "0.25rem",
  },

  shadows: {
    default: "0 0 10px rgba(255, 41, 117, 0.3)",
    hover: "0 0 20px rgba(255, 41, 117, 0.5), 0 0 30px rgba(0, 255, 249, 0.3)",
    active: "0 0 30px rgba(255, 41, 117, 0.7), 0 0 40px rgba(0, 255, 249, 0.5)",
  },

  animation: {
    duration: "250ms",
    timing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "80s synthwave and retro futurism",
  },
}
