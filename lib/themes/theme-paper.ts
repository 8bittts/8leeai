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
    primary: "#6b5344", // Darker muted brown (was #8b7355, WCAG fix: 5.8:1)
    secondary: "#5d4e37", // Deep brown
    accent: "#7d5c3e", // Darker warm tan (was #a67c52, WCAG fix)
    muted: "#595959", // Darker gray (was #6b6b6b, WCAG fix: 5.5:1)
    border: "#b8b0a5", // Darker border (was #d4cfc7, WCAG fix: 3.1:1)
    success: "#3a6248", // Darker green (was #4a7c59, WCAG fix)
    error: "#7a3640", // Darker red (was #8b4049)
    warning: "#7a6240", // Darker amber (was #9a7b4f, WCAG fix: 4.5:1)
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
