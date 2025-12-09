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
    secondary: "#01cdfe",
    accent: "#05ffa1",
    muted: "#b967ff",
    border: "#01cdfe",
    success: "#05ffa1",
    error: "#ff006e",
    warning: "#ffb627",
  },

  fonts: {
    primary: "var(--font-sans), ui-sans-serif, sans-serif",
    mono: "var(--font-mono), ui-monospace, monospace",
    sizeBase: "1rem",
    lineHeight: "1.6",
  },

  borders: {
    width: "2px",
    style: "solid",
    radius: "0.5rem",
  },

  shadows: {
    default: "0 4px 20px rgba(255, 113, 206, 0.15)",
    hover: "0 8px 30px rgba(1, 205, 254, 0.3), 0 0 20px rgba(255, 113, 206, 0.2)",
    active: "0 2px 10px rgba(5, 255, 161, 0.4)",
  },

  animation: {
    duration: "300ms",
    timing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "80s/90s vaporwave aesthetic, Miami nights, retro nostalgia",
  },
}
