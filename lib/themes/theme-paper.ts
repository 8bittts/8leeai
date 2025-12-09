import type { ThemeDefinition } from "./types"

/**
 * Paper Theme
 *
 * Minimal academic/paper aesthetic with warm sepia tones,
 * serif typography, and subtle paper-like shadows.
 *
 * Features:
 * - Warm sepia/cream background
 * - Dark ink color for high readability
 * - Classic serif typography (Georgia)
 * - Subtle refined borders
 * - Soft paper-like shadows
 * - Smooth elegant transitions
 */
export const paperTheme: ThemeDefinition = {
  id: "paper",
  name: "Paper",
  description: "Minimal academic aesthetic with serif typography",

  colors: {
    background: "#faf8f5", // Warm cream/sepia
    foreground: "#2c2c2c", // Dark ink
    primary: "#8b7355", // Muted brown
    secondary: "#5d4e37", // Deep brown
    accent: "#a67c52", // Warm tan
    muted: "#6b6b6b", // Medium gray for secondary text
    border: "#d4cfc7", // Subtle warm gray border
    success: "#4a7c59", // Muted green
    error: "#8b4049", // Muted red
    warning: "#9a7b4f", // Muted amber
  },

  fonts: {
    primary: "Georgia, 'Times New Roman', serif",
    mono: "ui-monospace, 'Courier New', monospace",
    sizeBase: "1.0625rem", // 17px for better serif readability
    lineHeight: "1.6", // Generous line height for academic reading
  },

  borders: {
    width: "1px",
    style: "solid",
    radius: "0.25rem", // Subtle rounded corners
  },

  shadows: {
    default: "0 1px 3px rgba(44, 44, 44, 0.08), 0 1px 2px rgba(44, 44, 44, 0.06)",
    hover: "0 4px 6px rgba(44, 44, 44, 0.1), 0 2px 4px rgba(44, 44, 44, 0.08)",
    active: "0 1px 2px rgba(44, 44, 44, 0.1)",
  },

  animation: {
    duration: "200ms",
    timing: "cubic-bezier(0.4, 0, 0.2, 1)", // Smooth, elegant easing
    stepped: false,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Academic papers, printed documents, classic typography",
  },
}
