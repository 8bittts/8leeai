import { BORDERS_SUBTLE } from "./presets"
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
    accent: "#7d5c3e", // WCAG compliant
    muted: "#595959", // WCAG compliant (5.5:1)
    border: "#b8b0a5", // WCAG compliant (3.1:1)
    error: "#7a3640",
  },

  // Paper uses unique serif typography
  fonts: {
    primary: "Georgia, 'Times New Roman', serif",
  },

  borders: BORDERS_SUBTLE,

  // Paper uses unique soft multi-layer shadows
  shadows: {
    hover: "0 4px 6px rgba(44, 44, 44, 0.1), 0 2px 4px rgba(44, 44, 44, 0.08)",
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Academic papers, printed documents, classic typography",
  },
}
