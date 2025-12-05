/**
 * Figmoo Type Definitions
 * All TypeScript types for the Figmoo website builder experiment
 */

/** Main category for website type selection */
export interface MainCategory {
  id: string
  title: string
  description: string
  icon: "briefcase" | "user" | "calendar" | "sparkles"
}

/** Sub-category options based on main category */
export type SubCategory = string

/** Font option for design step */
export interface FontOption {
  id: string
  name: string
  family: string
  /** Google Fonts URL parameter */
  googleFont: string
}

/** Theme color palette for design step */
export interface ThemeOption {
  id: string
  name: string
  /** Array of 3-4 hex colors representing the theme */
  colors: string[]
}

/** Section that can be added to homepage */
export interface SectionOption {
  id: string
  name: string
  /** Whether it's enabled by default */
  defaultEnabled: boolean
}

/** Current state of the onboarding wizard */
export interface WizardState {
  /** Current step (0-based index) */
  step: number
  /** Selected main category */
  mainCategory: string | null
  /** Selected sub-category */
  subCategory: string | null
  /** Business/site name */
  siteName: string
  /** Enabled sections */
  enabledSections: string[]
  /** Selected font ID */
  selectedFont: string
  /** Selected theme ID */
  selectedTheme: string
  /** AI description input */
  aiDescription: string
}

/** Props for category card component */
export interface CategoryCardProps {
  category: MainCategory
  selected: boolean
  onSelect: () => void
}

/** Props for progress bar component */
export interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

/** Props for section toggle component */
export interface SectionToggleProps {
  section: SectionOption
  enabled: boolean
  onToggle: () => void
}

/** Props for font picker component */
export interface FontPickerProps {
  fonts: FontOption[]
  selectedFont: string
  onSelect: (fontId: string) => void
}

/** Props for theme picker component */
export interface ThemePickerProps {
  themes: ThemeOption[]
  selectedTheme: string
  onSelect: (themeId: string) => void
}

/** Onboarding step identifiers */
export type OnboardingStep = "category" | "name" | "content" | "design" | "final"

/** Step configuration for wizard */
export interface StepConfig {
  id: OnboardingStep
  title: string
  description: string
  nextButtonLabel: string
  backButtonLabel?: string
}
