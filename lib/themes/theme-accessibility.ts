import type { ThemeDefinition } from "./types"

/**
 * Accessibility Theme
 *
 * Maximum contrast theme optimized for readability and screen readers.
 * Pure black on pure white with 21:1 contrast ratio.
 * No animations, large fonts, clear borders.
 */
export const accessibilityTheme: ThemeDefinition = {
  id: "accessibility",
  name: "Accessibility",
  description: "Maximum contrast, screen reader optimized, zero animations",

  colors: {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
    muted: "#000000",
    border: "#000000",
    success: "#000000",
    error: "#000000",
    warning: "#000000",
  },

  fonts: {
    primary: "system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, monospace",
    sizeBase: "1.125rem",
    lineHeight: "1.75",
  },

  borders: {
    width: "2px",
    style: "solid",
    radius: "0px",
  },

  shadows: {
    default: "none",
    hover: "none",
    active: "none",
  },

  animation: {
    duration: "0ms",
    timing: "linear",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "WCAG AAA compliance and screen reader optimization",
  },
}
