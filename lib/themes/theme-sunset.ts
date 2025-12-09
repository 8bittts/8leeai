import type { ThemeDefinition } from "./types"

/**
 * Sunset Theme
 *
 * Warm gradient with orange, pink, and purple tones.
 * Peaceful, warm vibes inspired by golden hour.
 */
export const sunsetTheme: ThemeDefinition = {
  id: "sunset",
  name: "Sunset",
  description: "Warm gradient with peaceful, golden hour vibes",

  colors: {
    background: "#1a0a1e",
    foreground: "#ffd6a5",
    primary: "#ff7b00",
    secondary: "#ff006e",
    accent: "#8338ec",
    muted: "#ffadad",
    border: "#ff7b00",
    success: "#52b788",
    error: "#ef4444",
    warning: "#fb8500",
  },

  fonts: {
    primary: "var(--font-geist-sans), system-ui, sans-serif",
    mono: "var(--font-mono), ui-monospace, monospace",
    sizeBase: "1rem",
    lineHeight: "1.6",
  },

  borders: {
    width: "2px",
    style: "solid",
    radius: "0.75rem",
  },

  shadows: {
    default: "0 4px 12px rgba(255, 123, 0, 0.15)",
    hover: "0 8px 24px rgba(255, 0, 110, 0.25)",
    active: "0 2px 8px rgba(131, 56, 236, 0.3)",
  },

  animation: {
    duration: "350ms",
    timing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Golden hour sunset gradients",
  },
}
