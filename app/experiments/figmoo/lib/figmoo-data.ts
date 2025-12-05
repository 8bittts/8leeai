/**
 * Figmoo Static Data
 * All categories, themes, fonts, and sections for the website builder
 */

import type {
  FontOption,
  MainCategory,
  SectionOption,
  StepConfig,
  ThemeOption,
} from "./figmoo-types"

/** Main categories for website type selection */
export const MAIN_CATEGORIES: MainCategory[] = [
  {
    id: "business",
    title: "Business",
    description: "For companies, non-profits, teams, ...",
    icon: "briefcase",
  },
  {
    id: "personal",
    title: "Personal",
    description: "For a website about you or another person",
    icon: "user",
  },
  {
    id: "event",
    title: "Event",
    description: "Conferences, meetups, concerts, weddings ...",
    icon: "calendar",
  },
  {
    id: "other",
    title: "Other",
    description: "For everything else. You'll still have all options",
    icon: "sparkles",
  },
]

/** Sub-categories grouped by main category */
export const SUB_CATEGORIES: Record<string, string[]> = {
  business: [
    "Ecommerce",
    "Restaurant",
    "Store",
    "Course",
    "Product",
    "Agency",
    "Mobile App",
    "Software Service",
    "Software",
    "Service",
    "Something Else",
  ],
  personal: ["Portfolio", "Resume", "Blog", "Personal Brand", "Something Else"],
  event: ["Conference", "Meetup", "Concert", "Wedding", "Something Else"],
  other: [
    "Ecommerce",
    "Restaurant",
    "Store",
    "Course",
    "Product",
    "Agency",
    "Mobile App",
    "Software Service",
    "Portfolio",
    "Resume",
    "Blog",
    "Conference",
    "Something Else",
  ],
}

/** Available homepage sections */
export const SECTIONS: SectionOption[] = [
  { id: "hero", name: "Hero section", defaultEnabled: true },
  { id: "logos", name: "Logos section", defaultEnabled: true },
  { id: "features", name: "Features section", defaultEnabled: true },
  { id: "team", name: "Team section", defaultEnabled: true },
  { id: "form", name: "Form section", defaultEnabled: true },
  { id: "tiered-pricing", name: "Tiered Pricing", defaultEnabled: false },
  { id: "single-pricing", name: "Single Pricing", defaultEnabled: false },
  { id: "testimonials", name: "Testimonials", defaultEnabled: false },
  { id: "testimonial", name: "Testimonial", defaultEnabled: false },
  { id: "reviews", name: "Reviews", defaultEnabled: false },
  { id: "video-player", name: "Video Player", defaultEnabled: false },
  { id: "image", name: "Image", defaultEnabled: false },
  { id: "gallery", name: "Gallery", defaultEnabled: false },
  { id: "cards", name: "Cards", defaultEnabled: false },
  { id: "faq", name: "FAQ", defaultEnabled: false },
  { id: "feature", name: "Feature", defaultEnabled: false },
  { id: "stats", name: "Stats", defaultEnabled: false },
  { id: "map", name: "Map", defaultEnabled: false },
]

/** Font options for design step */
export const FONTS: FontOption[] = [
  {
    id: "jakarta",
    name: "Jakarta Sans",
    family: "'Plus Jakarta Sans', sans-serif",
    googleFont: "Plus+Jakarta+Sans:wght@400;500;600;700",
  },
  {
    id: "noto-sans",
    name: "Noto Sans",
    family: "'Noto Sans', sans-serif",
    googleFont: "Noto+Sans:wght@400;500;600;700",
  },
  {
    id: "noto-serif",
    name: "Noto Serif",
    family: "'Noto Serif', serif",
    googleFont: "Noto+Serif:wght@400;500;600;700",
  },
  {
    id: "libre-baskerville",
    name: "Libre Baskerville",
    family: "'Libre Baskerville', serif",
    googleFont: "Libre+Baskerville:wght@400;700",
  },
  {
    id: "inter",
    name: "Inter",
    family: "'Inter', sans-serif",
    googleFont: "Inter:wght@400;500;600;700",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    family: "'Playfair Display', serif",
    googleFont: "Playfair+Display:wght@400;500;600;700",
  },
  {
    id: "roboto",
    name: "Roboto",
    family: "'Roboto', sans-serif",
    googleFont: "Roboto:wght@400;500;700",
  },
  {
    id: "open-sans",
    name: "Open Sans",
    family: "'Open Sans', sans-serif",
    googleFont: "Open+Sans:wght@400;500;600;700",
  },
]

/** Theme color palettes for design step */
export const THEMES: ThemeOption[] = [
  {
    id: "warm-earth",
    name: "Warm Earth",
    colors: ["#8B4513", "#2F4F4F", "#CD853F", "#FFF8DC"],
  },
  {
    id: "dark-gold",
    name: "Dark Gold",
    colors: ["#1A1A1A", "#2D2D2D", "#FFD700", "#B8860B"],
  },
  {
    id: "forest-sage",
    name: "Forest Sage",
    colors: ["#2D5A2D", "#355E3B", "#98FB98", "#F5F5DC"],
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    colors: ["#FF8C00", "#FFD700", "#FFFFFF", "#2C3E50"],
  },
  {
    id: "ocean-teal",
    name: "Ocean Teal",
    colors: ["#20B2AA", "#008B8B", "#FFFFFF", "#1A1A1A"],
  },
  {
    id: "mint-fresh",
    name: "Mint Fresh",
    colors: ["#98FF98", "#20B2AA", "#2D5A2D", "#FFFFFF"],
  },
  {
    id: "night-emerald",
    name: "Night Emerald",
    colors: ["#1A1A1A", "#50C878", "#2D5A2D", "#F0FFF0"],
  },
  {
    id: "royal-blue",
    name: "Royal Blue",
    colors: ["#000080", "#4169E1", "#FFFFFF", "#F0F8FF"],
  },
  {
    id: "steel-gray",
    name: "Steel Gray",
    colors: ["#2F4F4F", "#708090", "#FFFFFF", "#F5F5F5"],
  },
  {
    id: "navy-slate",
    name: "Navy Slate",
    colors: ["#1A1A2E", "#16213E", "#4A90D9", "#FFFFFF"],
  },
  {
    id: "coral-pink",
    name: "Coral Pink",
    colors: ["#FF6B6B", "#EE6B6B", "#2C3E50", "#FFFFFF"],
  },
  {
    id: "rose-blush",
    name: "Rose Blush",
    colors: ["#FFB6C1", "#FF69B4", "#4A0E4E", "#FFFFFF"],
  },
  {
    id: "burgundy-cream",
    name: "Burgundy Cream",
    colors: ["#800020", "#A52A2A", "#FFF8DC", "#1A1A1A"],
  },
  {
    id: "amber-gold",
    name: "Amber Gold",
    colors: ["#FFBF00", "#DAA520", "#2C3E50", "#FFFFFF"],
  },
  {
    id: "desert-sand",
    name: "Desert Sand",
    colors: ["#C19A6B", "#EDC9AF", "#8B4513", "#FFF8DC"],
  },
  {
    id: "lemon-drop",
    name: "Lemon Drop",
    colors: ["#FFF44F", "#FFD700", "#2C3E50", "#FFFFFF"],
  },
]

/** Step configurations for onboarding wizard */
export const STEPS: StepConfig[] = [
  {
    id: "category",
    title: "Category",
    description: "What category best describes your website?",
    nextButtonLabel: "Title",
  },
  {
    id: "name",
    title: "Give it a Name",
    description: "This will be your site title for now. You can always change it later.",
    nextButtonLabel: "Content",
  },
  {
    id: "content",
    title: "Homepage Content",
    description:
      "This is just a starting point. You can add more sections after creating your site.",
    nextButtonLabel: "Design",
  },
  {
    id: "design",
    title: "Design",
    description: "Select a theme to get started with. You can change and edit it later.",
    nextButtonLabel: "Next",
  },
  {
    id: "final",
    title: "All Done!",
    description:
      "Your site is ready to be edited! If you want, you can generate some personalized text with our AI.",
    nextButtonLabel: "Save & Edit",
  },
]

/** Default wizard state */
export const DEFAULT_WIZARD_STATE = {
  step: 0,
  mainCategory: null,
  subCategory: null,
  siteName: "",
  enabledSections: SECTIONS.filter((s) => s.defaultEnabled).map((s) => s.id),
  selectedFont: "jakarta",
  selectedTheme: "warm-earth",
  aiDescription: "",
}
