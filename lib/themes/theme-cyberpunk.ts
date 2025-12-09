import type { ThemeDefinition } from "./types"

/**
 * Cyberpunk Theme
 *
 * Neon noir future with hot pink and electric cyan.
 * Blade Runner and Cyberpunk 2077 inspired with intense neon glow effects.
 */
export const cyberpunkTheme: ThemeDefinition = {
  id: "cyberpunk",
  name: "Cyberpunk",
  description: "Neon noir future with hot pink and electric cyan",

  colors: {
    background: "#0d0221",
    foreground: "#ff2a6d",
    primary: "#ff2a6d",
    secondary: "#05d9e8",
    accent: "#f706cf",
    muted: "#7209b7",
    border: "#05d9e8",
    success: "#00f5d4",
    error: "#d90368",
    warning: "#ffbe0b",
  },

  fonts: {
    primary: "var(--font-sans), ui-sans-serif, sans-serif",
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
    default: "0 0 15px rgba(255, 42, 109, 0.2), 0 0 5px rgba(5, 217, 232, 0.1)",
    hover:
      "0 0 30px rgba(255, 42, 109, 0.4), 0 0 15px rgba(5, 217, 232, 0.3), 0 0 5px rgba(247, 6, 207, 0.2)",
    active: "0 0 20px rgba(5, 217, 232, 0.5), 0 0 10px rgba(255, 42, 109, 0.3)",
  },

  animation: {
    duration: "200ms",
    timing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Blade Runner, Cyberpunk 2077, neon-lit dystopian futures",
  },
}
