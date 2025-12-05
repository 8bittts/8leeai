# Figmoo: Frictionless Website Builder Experiment

**Version:** 1.0 (PLANNING)
**Status:** DEVELOPMENT
**Isolation:** 100% ISOLATED (Safe to delete)
**Target Completion:** In Progress

> **DELETION GUIDE:** See `figmoo-01-deletion-guide.md` for complete removal instructions.
> The experiment is fully isolated and can be safely deleted without affecting the main site.

---

## Executive Summary

Figmoo is a frictionless website builder experiment that clones and improves upon the Umso onboarding workflow. The key competitive advantage is **friction removal** - users can build a complete website structure before ever needing to create an account, dramatically increasing engagement and conversion.

### Strategic Positioning

| Competitor | Target User | Complexity | Friction Point |
|------------|-------------|------------|----------------|
| **Figma Sites** | Designers with Figma expertise | High | Requires Figma proficiency, design-first |
| **Framer** | Design-savvy creators | Medium-High | Learning curve for interactions |
| **Webflow** | Professional developers | Very High | Steep learning curve, overwhelming UI |
| **Umso** | Non-technical entrepreneurs | Low | Simple but limited templates |
| **Figmoo** | Anyone who wants a website | Very Low | Zero friction until value delivered |

### Core Philosophy

**"Value First, Account Later"**

Traditional website builders require sign-up before showing value. Figmoo inverts this:
1. User sees immediate value (preview of their site)
2. User builds their vision without commitment
3. Account creation happens only after emotional investment

---

## Competitive Analysis

### Figma Sites (Released 2025)

**Strengths:**
- Native Figma integration
- Design-to-web pipeline
- Familiar interface for designers
- 1,100+ free templates

**Weaknesses:**
- Requires Figma proficiency (barrier to entry)
- Designer-centric, not entrepreneur-friendly
- Limited CMS capabilities (still in development)
- Poor SEO and accessibility (afterthought)
- Generates unclean HTML code
- Not suitable for production-level sites

**Target Audience:** Designers already in Figma ecosystem

**Onboarding Friction:** High - must already know Figma design tool

### Framer

**Strengths:**
- Beautiful animations out of the box
- AI-powered Workshop tool
- Good balance of power and usability
- Strong component library

**Weaknesses:**
- Still requires design sensibility
- Can be overwhelming for true beginners
- Interaction complexity can confuse non-designers

**Target Audience:** Design-savvy creators wanting more than templates

**Onboarding Friction:** Medium - need to understand design concepts

### Webflow

**Strengths:**
- Most powerful no-code builder
- Full CMS with advanced features
- Code export capability
- Enterprise-ready scaling

**Weaknesses:**
- Steep learning curve (weeks to proficiency)
- Expensive higher-tier plans
- Overwhelming interface
- Advanced features require coding knowledge

**Target Audience:** Professional developers, agencies

**Onboarding Friction:** Very High - significant time investment required

### Umso (Our Inspiration)

**Strengths:**
- Extreme simplicity
- Fast loading sites
- All-in-one (forms, analytics, blog)
- $0-$25/month affordable pricing

**Weaknesses:**
- Limited customization
- Fewer design options
- Basic compared to competitors

**Target Audience:** Solo entrepreneurs, small businesses

**Onboarding Friction:** Low - but still requires account for full experience

---

## Figmoo Competitive Advantage

### 1. Zero-Friction Onboarding

The entire website configuration happens BEFORE any account creation:
- Category selection (Business/Personal/Event/Other)
- Sub-category refinement (Ecommerce/Restaurant/Agency/etc.)
- Business name input
- Section selection with live preview
- Theme and font selection
- Optional AI content generation

By the time a user reaches sign-up, they've invested 5-10 minutes building something they're emotionally attached to.

### 2. Progressive Disclosure

Complexity is revealed gradually:
- Step 1: Simple question ("What do you need a website for?")
- Step 2-3: Category refinement
- Step 4: Just a name
- Step 5: Section builder with instant preview
- Step 6: Visual theme selection (no abstract choices)
- Step 7: AI enhancement (optional)
- Step 8: Sign-up (after value delivered)

### 3. Live Preview

The homepage content step shows real-time updates as sections are added/removed. Users see their website taking shape immediately, creating:
- Instant gratification
- Reduced uncertainty
- Increased commitment

### 4. No Design Skills Required

Every option is pre-designed:
- Curated font combinations (not raw font lists)
- Pre-built color themes (not color pickers)
- Section templates (not blank canvases)
- AI content generation (not blank text fields)

---

## Technical Architecture

### Technology Stack

- **Framework:** Next.js 16 (App Router)
- **UI Components:** shadcn/ui (Tailwind-based)
- **Styling:** Tailwind CSS v4 (utility classes only)
- **Runtime:** Bun 1.3.1
- **TypeScript:** Strict mode
- **Linting:** Biome 2.3.8

### Directory Structure

```
app/experiments/figmoo/
├── page.tsx                      # Landing page (category selection + animated showcase)
├── layout.tsx                    # Figmoo-specific layout
├── not-found.tsx                 # Custom 404
├── components/
│   ├── figmoo-landing-hero.tsx   # Hero section with category cards
│   ├── figmoo-animated-showcase.tsx # Floating animated website previews
│   ├── figmoo-category-card.tsx  # Selectable category option
│   ├── figmoo-wizard-container.tsx # Multi-step wizard orchestrator
│   ├── figmoo-step-category.tsx  # Sub-category selection step
│   ├── figmoo-step-name.tsx      # Business name input step
│   ├── figmoo-step-content.tsx   # Section builder with live preview
│   ├── figmoo-step-design.tsx    # Font and theme selection
│   ├── figmoo-step-final.tsx     # AI generation + save
│   ├── figmoo-signup-form.tsx    # Final sign-up page
│   ├── figmoo-site-preview.tsx   # Live website preview component
│   ├── figmoo-section-toggle.tsx # Toggleable section item
│   ├── figmoo-theme-picker.tsx   # Color theme selector
│   ├── figmoo-font-picker.tsx    # Font combination selector
│   └── figmoo-progress-bar.tsx   # Step progress indicator
├── lib/
│   ├── figmoo-types.ts           # TypeScript definitions
│   ├── figmoo-data.ts            # Categories, themes, fonts, sections
│   └── figmoo-utils.ts           # Utility functions
└── onboarding/
    └── page.tsx                  # Onboarding wizard entry (/figmoo/onboarding)
```

### Isolation Strategy

Following established experiment patterns:
1. **Namespace Isolation:** All files prefixed with `figmoo-`
2. **Directory Isolation:** Complete separation in `/app/experiments/figmoo/`
3. **No Cross-Imports:** Zero dependencies on main site code
4. **Self-Contained:** Can be deleted without affecting anything else
5. **Documented Deletion:** Clear removal instructions

---

## User Flow

### Step 1: Landing Page

**URL:** `/experiments/figmoo`

**Left Panel:**
- Heading: "What do you need a website for?"
- Subheading: "Select the most suitable category below."
- Category Cards:
  - Business (For companies, non-profits, teams...)
  - Personal (For a website about you or another person)
  - Event (Conferences, meetups, concerts, weddings...)
  - Other (For everything else. You'll still have all options)
- "Next" button (disabled until selection)

**Right Panel:**
- Animated floating website screenshots
- Alternating up/down scroll animations
- Creates visual interest and showcases possibilities

### Step 2: Sub-Category Selection

**URL:** `/experiments/figmoo/onboarding?step=category`

**UI Elements:**
- Heading: "Category"
- Progress bar (step 1 of 5)
- Sub-category chips based on main category selection:
  - Business: Ecommerce, Restaurant, Store, Course, Product, Agency, Mobile App, Software Service, Software, Service, Something Else
  - Personal: Portfolio, Resume, Blog, Personal Brand, Something Else
  - Event: Conference, Meetup, Concert, Wedding, Something Else
  - Other: All options available
- Back button, "Title" button

### Step 3: Business Name

**URL:** `/experiments/figmoo/onboarding?step=name`

**UI Elements:**
- Heading: "Give it a Name"
- Subheading: "This will be your site title for now. You can always change it later."
- Text input with placeholder (e.g., "Acme Corp")
- Back button, "Content" button

### Step 4: Homepage Content

**URL:** `/experiments/figmoo/onboarding?step=content`

**Left Panel:**
- Heading: "Homepage Content"
- Subheading: "This is just a starting point. You can add more sections after creating your site."
- Pre-selected sections (toggleable):
  - Hero section
  - Logos section
  - Features section
  - Team section
  - Form section
- "Add a Section" area with available section chips:
  - Tiered Pricing, Single Pricing, Testimonials
  - Testimonial, Reviews, Video Player
  - Image, Gallery, Cards, FAQ
  - Feature, Stats, Map
- "Start Over" link, "Design" button

**Right Panel:**
- Live preview of website with selected sections
- Browser chrome mockup (arrows, URL bar, bookmark)
- Updates in real-time as sections are toggled

### Step 5: Design Selection

**URL:** `/experiments/figmoo/onboarding?step=design`

**UI Elements:**
- Heading: "Design"
- Subheading: "Select a theme to get started with. You can change and edit it later."
- Progress bar (step 4 of 5)
- Font Selection:
  - 4 font combinations visible (Jakarta Sans, Noto Sans, Noto Serif, Libre Baskerville)
  - Left/right arrows for more options
- Theme Selection:
  - Grid of color palette swatches (16 visible)
  - Each swatch shows 3-4 colors representing the theme
  - Left/right arrows for more options
- Back button, "Next" button

### Step 6: Completion & AI Generation

**URL:** `/experiments/figmoo/onboarding?step=final`

**UI Elements:**
- Heading: "All Done!"
- Subheading: "Your site is ready to be edited! If you want, you can generate some personalized text with our AI."
- Progress bar (step 5 of 5 - all complete)
- AI Generation Card:
  - "Personalize text with AI (Optional)"
  - "Enter a brief description of your site content to help the AI generate text for your site."
  - Textarea with placeholder "My website is about..."
  - "Generate AI Content" button
- Back button, "Save & Edit" button (triggers sign-up)

### Step 7: Sign-Up Gate

**URL:** `/experiments/figmoo/signup`

**UI Elements:**
- Heading: "Sign up for Figmoo"
- Subheading: "Get started for free. No credit card required."
- "Continue with Google" button
- Divider ("or")
- Email input field
- Password input field
- "Create Account" button
- Terms of Service and Privacy Policy links
- "Already have an account? Log in" link

---

## Component Specifications

### Animated Showcase Component

The right panel of the landing page features floating website screenshots that animate vertically:

```tsx
// Animation behavior:
// - Multiple columns of website preview images
// - Column 1: Scrolls up continuously
// - Column 2: Scrolls down continuously
// - Column 3: Scrolls up continuously
// - Speed: ~20px per second (smooth, not jarring)
// - Images loop seamlessly
```

**Implementation Notes:**
- Use CSS animations for performance
- Images are static placeholder screenshots
- No interaction required (pure visual decoration)
- Should be responsive (hidden on mobile, visible on desktop)

### Category Card Component

Selectable card with icon, title, and description:

```tsx
interface CategoryCardProps {
  icon: React.ReactNode
  title: string
  description: string
  selected: boolean
  onSelect: () => void
}

// States:
// - Default: Light gray border, white background
// - Hover: Subtle shadow
// - Selected: Purple border, light purple background, checkmark icon
```

### Progress Bar Component

5-step indicator showing current position:

```tsx
interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

// Visual:
// - 5 horizontal bars
// - Completed: Purple (filled)
// - Current: Purple (filled)
// - Upcoming: Gray (outlined)
```

### Section Toggle Component

Toggleable section item for content builder:

```tsx
interface SectionToggleProps {
  name: string
  enabled: boolean
  onToggle: () => void
}

// States:
// - Enabled: Checkmark icon, full opacity
// - Disabled: Empty checkbox, reduced opacity
```

### Theme Picker Component

Grid of color palette swatches:

```tsx
interface ThemePickerProps {
  themes: Theme[]
  selectedTheme: string
  onSelect: (themeId: string) => void
}

interface Theme {
  id: string
  colors: string[] // 3-4 colors representing the theme
}

// Visual:
// - Rounded pill shape
// - 3-4 color circles
// - Selected state: Purple border
```

### Font Picker Component

Font combination selector:

```tsx
interface FontPickerProps {
  fonts: FontOption[]
  selectedFont: string
  onSelect: (fontId: string) => void
}

interface FontOption {
  id: string
  name: string
  family: string
}

// Visual:
// - Card with font name in that font
// - "Body Text Font" label
// - Selected state: Purple border
```

---

## Data Structures

### Categories

```typescript
const MAIN_CATEGORIES = [
  {
    id: "business",
    title: "Business",
    description: "For companies, non-profits, teams, ...",
    icon: "briefcase"
  },
  {
    id: "personal",
    title: "Personal",
    description: "For a website about you or another person",
    icon: "user"
  },
  {
    id: "event",
    title: "Event",
    description: "Conferences, meetups, concerts, weddings ...",
    icon: "calendar"
  },
  {
    id: "other",
    title: "Other",
    description: "For everything else. You'll still have all options",
    icon: "sparkles"
  }
]

const SUB_CATEGORIES = {
  business: ["Ecommerce", "Restaurant", "Store", "Course", "Product", "Agency", "Mobile App", "Software Service", "Software", "Service", "Something Else"],
  personal: ["Portfolio", "Resume", "Blog", "Personal Brand", "Something Else"],
  event: ["Conference", "Meetup", "Concert", "Wedding", "Something Else"],
  other: ["Ecommerce", "Restaurant", "Store", "Course", "Product", "Agency", "Mobile App", "Software Service", "Software", "Service", "Portfolio", "Resume", "Blog", "Conference", "Something Else"]
}
```

### Sections

```typescript
const DEFAULT_SECTIONS = ["Hero", "Logos", "Features", "Team", "Form"]

const AVAILABLE_SECTIONS = [
  "Hero", "Logos", "Features", "Team", "Form",
  "Tiered Pricing", "Single Pricing", "Testimonials",
  "Testimonial", "Reviews", "Video Player",
  "Image", "Gallery", "Cards", "FAQ",
  "Feature", "Stats", "Map"
]
```

### Fonts

```typescript
const FONT_OPTIONS = [
  { id: "jakarta", name: "Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif" },
  { id: "noto-sans", name: "Noto Sans", family: "'Noto Sans', sans-serif" },
  { id: "noto-serif", name: "Noto Serif", family: "'Noto Serif', serif" },
  { id: "libre-baskerville", name: "Libre Baskerville", family: "'Libre Baskerville', serif" },
  { id: "inter", name: "Inter", family: "'Inter', sans-serif" },
  { id: "playfair", name: "Playfair Display", family: "'Playfair Display', serif" },
  { id: "roboto", name: "Roboto", family: "'Roboto', sans-serif" },
  { id: "open-sans", name: "Open Sans", family: "'Open Sans', sans-serif" }
]
```

### Themes

```typescript
const THEME_OPTIONS = [
  { id: "warm-earth", colors: ["#8B4513", "#2F4F4F", "#CD853F", "#FFF8DC"] },
  { id: "dark-gold", colors: ["#1A1A1A", "#2D2D2D", "#FFD700", "#B8860B"] },
  { id: "forest-sage", colors: ["#2D5A2D", "#355E3B", "#98FB98", "#F5F5DC"] },
  { id: "sunset-orange", colors: ["#FF8C00", "#FFD700", "#FFFFFF", "#2C3E50"] },
  { id: "ocean-teal", colors: ["#20B2AA", "#008B8B", "#FFFFFF", "#1A1A1A"] },
  { id: "mint-fresh", colors: ["#98FF98", "#20B2AA", "#2D5A2D", "#FFFFFF"] },
  { id: "night-emerald", colors: ["#1A1A1A", "#50C878", "#2D5A2D", "#F0FFF0"] },
  { id: "royal-blue", colors: ["#000080", "#4169E1", "#FFFFFF", "#F0F8FF"] },
  { id: "steel-gray", colors: ["#2F4F4F", "#708090", "#FFFFFF", "#F5F5F5"] },
  { id: "navy-slate", colors: ["#1A1A2E", "#16213E", "#4A90D9", "#FFFFFF"] },
  { id: "coral-pink", colors: ["#FF6B6B", "#EE6B6B", "#2C3E50", "#FFFFFF"] },
  { id: "rose-blush", colors: ["#FFB6C1", "#FF69B4", "#4A0E4E", "#FFFFFF"] },
  { id: "burgundy-cream", colors: ["#800020", "#A52A2A", "#FFF8DC", "#1A1A1A"] },
  { id: "amber-gold", colors: ["#FFBF00", "#DAA520", "#2C3E50", "#FFFFFF"] },
  { id: "desert-sand", colors: ["#C19A6B", "#EDC9AF", "#8B4513", "#FFF8DC"] },
  { id: "lemon-drop", colors: ["#FFF44F", "#FFD700", "#2C3E50", "#FFFFFF"] }
]
```

---

## Styling Guidelines

### Color Palette (Figmoo Brand)

```css
/* Primary */
--figmoo-purple: #7C3AED;      /* Purple buttons, selected states */
--figmoo-purple-light: #EDE9FE; /* Selected card backgrounds */
--figmoo-purple-dark: #5B21B6;  /* Hover states */

/* Neutral */
--figmoo-gray-50: #F9FAFB;      /* Backgrounds */
--figmoo-gray-100: #F3F4F6;     /* Card backgrounds */
--figmoo-gray-200: #E5E7EB;     /* Borders */
--figmoo-gray-400: #9CA3AF;     /* Muted text */
--figmoo-gray-600: #4B5563;     /* Secondary text */
--figmoo-gray-900: #111827;     /* Primary text */

/* Semantic */
--figmoo-success: #10B981;      /* Success states */
--figmoo-error: #EF4444;        /* Error states */
```

### Typography

```css
/* Headings */
font-family: system-ui, -apple-system, sans-serif;
font-weight: 700;

/* Body */
font-family: system-ui, -apple-system, sans-serif;
font-weight: 400;
```

### Component Patterns

1. **Cards:** Rounded corners (12px), subtle shadow, white background
2. **Buttons:** Purple primary, rounded (8px), white text
3. **Inputs:** Gray border, rounded (8px), focus ring purple
4. **Selection:** Purple border, light purple background, checkmark

---

## Implementation Phases

### Phase 1: Foundation (Current)
- [x] Planning documentation
- [ ] Directory structure setup
- [ ] Types and data definitions
- [ ] Basic layout and routing

### Phase 2: Landing Page
- [ ] Category card component
- [ ] Animated showcase component
- [ ] Landing page layout
- [ ] Responsive design

### Phase 3: Onboarding Wizard
- [ ] Wizard container with step management
- [ ] Sub-category selection step
- [ ] Name input step
- [ ] Progress bar component

### Phase 4: Content Builder
- [ ] Section toggle component
- [ ] Live preview component
- [ ] Content step with preview panel

### Phase 5: Design Selection
- [ ] Font picker component
- [ ] Theme picker component
- [ ] Design step layout

### Phase 6: Completion
- [ ] Final step with AI option
- [ ] Sign-up form
- [ ] Form validation

### Phase 7: Polish
- [ ] Animations and transitions
- [ ] Responsive refinements
- [ ] Accessibility audit
- [ ] Performance optimization

---

## Security Considerations

### Input Validation
- Business name: Max 100 characters, sanitized for XSS
- Email: Standard email validation
- Password: Min 8 characters (sign-up only)

### Data Handling
- No sensitive data stored server-side in this experiment
- All state managed client-side
- Sign-up form is mock (no actual account creation)

### External Dependencies
- No external API calls
- No database connections
- Pure frontend experiment

---

## Success Metrics

### Engagement Goals
- Time spent in wizard: Target 5-10 minutes
- Completion rate: Target 70%+ reach sign-up
- Mobile usability: Works on all devices

### Technical Goals
- Zero TypeScript errors
- Zero Biome lint issues
- Core Web Vitals passing
- Accessible (WCAG 2.1 AA)

---

## Sources & References

### Competitor Analysis Sources
- [Figma Sites vs Framer vs Webflow for MVP Development](https://fivecube.agency/blog/figma-sites-vs-framer-vs-webflow)
- [Which Tool Wins for Designers in 2025 - Figma vs Framer vs Webflow](https://www.illustration.app/blog/which-tool-wins-for-designers-in-2025-figma-vs-framer-vs-webflow)
- [2025 Comparison: Figma Sites vs Webflow](https://www.madebyunderscore.com/blog/figma-sites-vs-webflow)
- [Framer vs Figma Sites 2025 Comparison](https://clicks.supply/blog/framer-vs-figma-sites)
- [Framer vs Webflow 2025 Comparison](https://zapier.com/blog/framer-vs-webflow/)

### Design Inspiration
- [Umso.com](https://www.umso.com/) - Primary inspiration for onboarding flow
- [Umso Generator](https://app.umso.com/generator) - Onboarding workflow reference

---

**STATUS: PLANNING COMPLETE**

**Documentation Maintained By**: Development Team
**Created**: December 5, 2025
**Next Step**: Begin Phase 1 implementation
