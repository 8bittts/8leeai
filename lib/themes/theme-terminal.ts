import { FONTS_MONO } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Terminal Theme
 *
 * Classic green-on-black DOS terminal aesthetic.
 * The default theme for 8lee.ai portfolio.
 */
export const terminalTheme: ThemeDefinition = {
  id: "terminal",
  name: "Terminal",
  description: "Classic green-on-black DOS terminal aesthetic",

  colors: {
    background: "#000000",
    foreground: "#22c55e", // green-500
    primary: "#22c55e", // green-500
    accent: "#4ade80", // green-400
    muted: "#15803d", // green-700
    border: "#22c55e", // green-500
    error: "#ef4444",
  },

  fonts: FONTS_MONO,

  borders: {
    width: "1px",
    style: "solid",
  },

  shadows: {
    hover: "0 0 10px rgba(34, 197, 94, 0.3)",
  },

  metadata: {
    author: "8LEE",
    version: "1.0.0",
    inspiration: "DOS/Command Prompt terminals",
  },
}
