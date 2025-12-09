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
    secondary: "#2d6a4f",
    accent: "#52b788",
    muted: "#74c69d",
    border: "#40916c",
    success: "#52b788",
    error: "#ef4444",
    warning: "#f77f00",
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
    radius: "0.375rem",
  },

  shadows: {
    default: "0 4px 12px rgba(29, 53, 87, 0.2)",
    hover: "0 8px 24px rgba(64, 145, 108, 0.3)",
    active: "0 2px 8px rgba(45, 106, 79, 0.4)",
  },

  animation: {
    duration: "250ms",
    timing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Ancient forests and natural growth",
  },
}
