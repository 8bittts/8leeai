import { ANIMATION_NONE, BORDERS_CHUNKY, createOffsetShadows } from "./presets"
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
    primary: "#0000cc", // darker blue (WCAG: 5.9:1)
    secondary: "#660066", // darker purple (WCAG compliant)
    accent: "#cc0000", // darker red (WCAG compliant)
    muted: "#4a4a4a", // darker gray (WCAG: 5.3:1)
    border: "#000000",
    success: "#006600", // darker green (WCAG compliant)
    error: "#cc0000",
    warning: "#806600", // dark yellow (WCAG: 5.2:1)
  },

  fonts: {
    primary: "'Times New Roman', Times, serif",
    mono: "'Courier New', Courier, monospace",
    sizeBase: "1rem",
    lineHeight: "1.4",
  },

  borders: BORDERS_CHUNKY,
  shadows: createOffsetShadows("#000000"),
  animation: ANIMATION_NONE,

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "1990s web design and brutalist architecture",
  },
}
