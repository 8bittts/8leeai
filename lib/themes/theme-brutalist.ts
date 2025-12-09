import type { ThemeDefinition } from "./types"

/**
 * Brutalist Theme
 *
 * Raw 90s web aesthetic with Times New Roman and chunky borders.
 * Classic blue links, gray background, pure utilitarian design.
 */
export const brutalistTheme: ThemeDefinition = {
  id: "brutalist",
  name: "Brutalist",
  description: "Raw 90s web aesthetic with Times New Roman and chunky borders",

  colors: {
    background: "#c0c0c0",
    foreground: "#000000",
    primary: "#0000ff",
    secondary: "#800080", // purple for visited links
    accent: "#ff0000",
    muted: "#808080",
    border: "#000000",
    success: "#008000",
    error: "#ff0000",
    warning: "#ffff00",
  },

  fonts: {
    primary: "'Times New Roman', Times, serif",
    mono: "'Courier New', Courier, monospace",
    sizeBase: "1rem",
    lineHeight: "1.4",
  },

  borders: {
    width: "3px",
    style: "solid",
    radius: "0px",
  },

  shadows: {
    default: "2px 2px 0px #000000",
    hover: "4px 4px 0px #000000",
    active: "1px 1px 0px #000000",
  },

  animation: {
    duration: "0ms",
    timing: "linear",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "1990s web design and brutalist architecture",
  },
}
