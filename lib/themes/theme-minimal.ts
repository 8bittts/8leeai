import type { ThemeDefinition } from "./types"

/**
 * Minimal Theme
 *
 * Ultra-clean, modern minimalist aesthetic.
 * Black text on white background with system fonts.
 * Zero decorations, subtle borders only.
 */
export const minimalTheme: ThemeDefinition = {
  id: "minimal",
  name: "Minimal",
  description: "Ultra-clean modern minimalist with zero decorations",

  colors: {
    background: "#ffffff",
    foreground: "#111111",
    primary: "#111111",
    secondary: "#6b7280", // gray-500
    accent: "#374151", // gray-700
    muted: "#9ca3af", // gray-400
    border: "#e5e7eb", // gray-200
    success: "#111111",
    error: "#111111",
    warning: "#111111",
  },

  fonts: {
    primary: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "ui-monospace, monospace",
    sizeBase: "1rem",
    lineHeight: "1.6",
  },

  borders: {
    width: "1px",
    style: "solid",
    radius: "0px",
  },

  shadows: {
    default: "none",
    hover: "none",
    active: "none",
  },

  animation: {
    duration: "100ms",
    timing: "ease-out",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Swiss design and modern minimalism",
  },
}
