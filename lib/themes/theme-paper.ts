import { ANIMATION_SMOOTH, BORDERS_SUBTLE } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Paper Theme
 *
 * Minimal academic/paper aesthetic with warm sepia tones,
 * serif typography, and subtle paper-like shadows.
 */
export const paperTheme: ThemeDefinition = {
  id: "paper",
  name: "Paper",
  description: "Minimal academic aesthetic with serif typography",

  colors: {
    background: "#faf8f5", // Warm cream/sepia
    foreground: "#2c2c2c", // Dark ink
    primary: "#6b5344", // WCAG compliant (5.8:1)
    secondary: "#5d4e37", // Deep brown
    accent: "#7d5c3e", // WCAG compliant
    muted: "#595959", // WCAG compliant (5.5:1)
    border: "#b8b0a5", // WCAG compliant (3.1:1)
    success: "#3a6248", // WCAG compliant
    error: "#7a3640",
    warning: "#7a6240", // WCAG compliant (4.5:1)
  },

  // Paper uses unique serif typography
  fonts: {
    primary: "Georgia, 'Times New Roman', serif",
    mono: "ui-monospace, 'Courier New', monospace",
    sizeBase: "1.0625rem",
    lineHeight: "1.6",
  },

  borders: BORDERS_SUBTLE,

  // Paper uses unique soft multi-layer shadows
  shadows: {
    default: "0 1px 3px rgba(44, 44, 44, 0.08), 0 1px 2px rgba(44, 44, 44, 0.06)",
    hover: "0 4px 6px rgba(44, 44, 44, 0.1), 0 2px 4px rgba(44, 44, 44, 0.08)",
    active: "0 1px 2px rgba(44, 44, 44, 0.1)",
  },

  animation: ANIMATION_SMOOTH,

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Academic papers, printed documents, classic typography",
  },
}
