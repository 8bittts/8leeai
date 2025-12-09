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
    secondary: "#8b008b", // Dark purple
    accent: "#ff8c00", // Bright orange
    muted: "#8b008b", // Dark purple
    border: "#ff6600", // Orange
    success: "#ff6600",
    error: "#cc0000",
    warning: "#ff8c00",
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
    default: "0 0 15px rgba(255, 102, 0, 0.2)",
    hover: "0 0 20px rgba(255, 102, 0, 0.4), 0 0 30px rgba(139, 0, 139, 0.3)",
    active: "0 0 10px rgba(255, 102, 0, 0.6), 0 0 15px rgba(139, 0, 139, 0.5)",
  },

  animation: {
    duration: "200ms",
    timing: "ease-in-out",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Spooky season vibes with orange pumpkins and purple night skies",
  },
}
