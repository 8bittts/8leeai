/**
 * Figmoo Utility Functions
 * Helper functions for the website builder experiment
 */

import { STEPS } from "./figmoo-data"
import type { OnboardingStep, WizardState } from "./figmoo-types"

/**
 * Get step index from step ID
 */
export function getStepIndex(stepId: OnboardingStep): number {
  return STEPS.findIndex((s) => s.id === stepId)
}

/**
 * Get step ID from index
 */
export function getStepId(index: number): OnboardingStep | null {
  const step = STEPS[index]
  return step ? step.id : null
}

/**
 * Check if can proceed to next step based on current state
 */
export function canProceed(state: WizardState): boolean {
  const stepId = getStepId(state.step)

  switch (stepId) {
    case "category":
      return state.subCategory !== null
    case "name":
      return state.siteName.trim().length > 0
    case "content":
      return state.enabledSections.length > 0
    case "design":
      return state.selectedFont !== "" && state.selectedTheme !== ""
    case "final":
      return true
    default:
      return false
  }
}

/**
 * Validate site name input
 */
export function validateSiteName(name: string): {
  valid: boolean
  error?: string
} {
  const trimmed = name.trim()

  if (trimmed.length === 0) {
    return { valid: false, error: "Site name is required" }
  }

  if (trimmed.length > 100) {
    return { valid: false, error: "Site name must be 100 characters or less" }
  }

  return { valid: true }
}

/**
 * Sanitize text input for XSS prevention
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Get placeholder name based on category
 */
export function getNamePlaceholder(category: string | null): string {
  switch (category) {
    case "business":
      return "Acme Corp"
    case "personal":
      return "John Doe"
    case "event":
      return "Tech Conference 2025"
    case "other":
      return "My Awesome Website"
    default:
      return "My Website"
  }
}

/**
 * Get input label based on category
 */
export function getNameLabel(category: string | null): string {
  switch (category) {
    case "business":
      return "Business Name"
    case "personal":
      return "Your Name"
    case "event":
      return "Event Name"
    case "other":
      return "Site Name"
    default:
      return "Site Name"
  }
}

/**
 * Generate CSS variable string for theme colors
 */
export function generateThemeCSS(colors: string[]): string {
  return `
    --theme-primary: ${colors[0]};
    --theme-secondary: ${colors[1]};
    --theme-accent: ${colors[2]};
    --theme-background: ${colors[3] || "#FFFFFF"};
  `
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(currentStep: number, totalSteps: number): number {
  return Math.round((currentStep / (totalSteps - 1)) * 100)
}
