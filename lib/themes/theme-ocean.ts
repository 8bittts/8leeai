import type { ThemeDefinition } from "./types"

/**
 * Ocean Theme
 *
 * Deep underwater calm with blues and cyan accents.
 * Flowing, peaceful aesthetic inspired by the depths of the ocean.
 */
export const oceanTheme: ThemeDefinition = {
  id: "ocean",
  name: "Ocean",
  description: "Deep underwater calm with flowing, peaceful vibes",

  colors: {
    background: "#03045e",
    foreground: "#90e0ef",
    primary: "#0077b6",
    secondary: "#023e8a",
    accent: "#48cae4",
    muted: "#0096c7",
    border: "#0077b6",
    success: "#48cae4",
    error: "#ef4444",
    warning: "#fbbf24",
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
    radius: "0.5rem",
  },

  shadows: {
    default: "0 4px 12px rgba(0, 119, 182, 0.15)",
    hover: "0 8px 24px rgba(72, 202, 228, 0.25)",
    active: "0 2px 8px rgba(0, 119, 182, 0.3)",
  },

  animation: {
    duration: "300ms",
    timing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Underwater depths and ocean calm",
  },
}
