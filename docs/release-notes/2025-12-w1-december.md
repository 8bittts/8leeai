# 8lee.ai Release Notes - December 2025 (Week 1)

**Period**: December 1-7, 2025

---

## Enhanced Update Workflow - December 7, 2025

**Status**: COMPLETE

**Overview**:
Ported comprehensive package update workflow from deathnote project.

**New File:** `update.md`

Root-level documentation providing detailed package update workflow:
- Step-by-step commands with explanations
- Quality gates table
- Split week protocol for release notes
- Version consistency check locations
- Quick reference command table

**Updated File:** `.claude/commands/update.md`

Enhanced slash command with:
- Security vulnerability check (`bun audit`)
- Aggressive fix requirements (0 errors, 0 warnings)
- Global version number search (CLAUDE.md, README.md, package.json, etc.)
- Split week protocol for long release notes
- Quality gates checklist

**Files Changed:**
- `.claude/commands/update.md` - Enhanced update workflow
- `update.md` - New comprehensive workflow documentation

## Package Updates - December 7, 2025

**Status**: COMPLETE

**Overview**:
Updated AI SDK OpenAI provider to latest version.

**Updated Packages:**
- @ai-sdk/openai 2.0.77 -> 2.0.79

**Quality Verification:**
- TypeScript: Zero errors
- Biome: Zero warnings
- Tests: All 96 passing (297 assertions)
- Build: Successful

## Package Updates - December 1, 2025

**Status**: COMPLETE

**Overview**:
Updated 5 packages to latest versions.

**Updated Packages:**
- Next.js 16.0.5 to 16.0.6
- @vercel/analytics 1.5.0 to 1.6.0
- @vercel/speed-insights 1.2.0 to 1.3.0
- Vercel AI SDK (ai) 5.0.104 to 5.0.105
- @ai-sdk/openai 2.0.74 to 2.0.75

**Quality Verification:**
- All 96 tests passing (297 assertions)
- Zero Biome lint errors
- Zero TypeScript errors

**Documentation Updated:**
- CLAUDE.md Tech Stack section
- README.md badges and Tech Stack section

## Package Updates - December 2, 2025

**Status**: COMPLETE

**Overview**:
Updated 3 packages to latest versions.

**Updated Packages:**
- @vercel/analytics 1.6.0 to 1.6.1
- Vercel AI SDK (ai) 5.0.105 to 5.0.106
- @ai-sdk/openai 2.0.75 to 2.0.76

**Quality Verification:**
- All 96 tests passing (297 assertions)
- Zero Biome lint errors
- Production build successful

**Documentation Updated:**
- CLAUDE.md Tech Stack section
- README.md Tech Stack section

## Package Updates - December 3, 2025

**Status**: COMPLETE

**Overview**:
Updated 3 packages to latest versions.

**Updated Packages:**
- Next.js 16.0.6 to 16.0.7
- React 19.2.0 to 19.2.1
- react-dom 19.2.0 to 19.2.1

**Quality Verification:**
- All 96 tests passing (297 assertions)
- Zero Biome lint errors
- Production build successful

**Documentation Updated:**
- CLAUDE.md Tech Stack section
- README.md badges and Tech Stack section

## Bun Adoption Audit - December 4, 2025

**Status**: COMPLETE

**Overview**:
Completed comprehensive Bun adoption audit across all owned repositories.

**Repositories Reviewed:**
- **8leeai**: Fully migrated, removed orphan `.npmrc` file
- **altoaxcom**: Fully migrated (confirmed via recent commits)
- **yenchat**: Fully migrated (confirmed via recent commits)

**8leeai Cleanup:**
- Removed `.npmrc` guard file (no longer needed with `packageManager` field enforcement)
- Updated CLAUDE.md file structure (corrected `x-package-monitor.js` filename, added `test-contact-forms.ts`)
- Updated README.md file structure (added `test-contact-forms.ts`, December release notes)
- Added December 2025 Week 1 to file structure listings

**altoaxcom Bun Migration (Verified):**
- Complete npm to Bun migration cleanup (commit `1c15710`)
- Package monitor converted to Bun-native TypeScript (commit `fdc50f7`)
- All scripts updated for Bun compatibility (commit `bb5e369`)
- Migrated from npm to Bun 1.3.1 (commit `6e3c294`)

**yenchat Bun Migration (Verified):**
- Package monitor optimized with Bun-native TypeScript APIs (commit `65216f1`)
- Scripts audit completed, stale scripts removed (commit `09925d5`)

**All Projects Status:**
- `packageManager: "bun@1.3.1"` enforced
- `bun.lock` present (no npm/yarn/pnpm lock files)
- All scripts use `bun`/`bunx` commands
- No orphan npm/yarn/pnpm artifacts

## Documentation Audit - December 4, 2025

**Status**: COMPLETE

**Overview**:
Comprehensive documentation review and cleanup across all project files.

**CLAUDE.md Updates:**
- Fixed file structure to include `app/api/` and `app/experiments/` directories
- Removed duplicate `app/experiments/` section
- All paths now accurately reflect actual codebase structure

**README.md Updates:**
- Fixed `middleware.ts` references to `proxy.ts` (Next.js 16 convention)
- Fixed archived experiments paths from `app/zendesk/` to `app/experiments/zendesk/`
- Fixed archived experiments paths from `app/intercom/` to `app/experiments/intercom/`
- Updated documentation references to use correct filenames
- Added `app/api/` and `app/experiments/` to project structure

**00-RN-README.md Updates:**
- Updated tech stack versions (Next.js 16.0.7, React 19.2.1)
- Updated status from November 2025 to December 2025
- Added Vercel Analytics 1.6.1 and Speed Insights 1.3.1 versions
- Added November weeks 4-5 to Current Files section
- Added December 2025 weekly section

**All Documentation Now:**
- Uses `proxy.ts` (not `middleware.ts`) for security headers reference
- Has accurate file paths for experimental projects
- Has up-to-date version numbers
- Has complete weekly release notes listings

## Package Monitor TypeScript Migration - December 4, 2025

**Status**: COMPLETE

**Overview**:

Converted `x-package-monitor.js` to Bun-native TypeScript (`x-package-monitor.ts`).

**Key Changes:**
- Full TypeScript implementation with proper types and interfaces
- Added missing packages to breaking changes database (ai, @ai-sdk/openai, resend, @intercom/messenger-js-sdk, @vercel/edge-config)
- Updated all documentation references from `.js` to `.ts`
- Updated package.json scripts to use `.ts` extension

**Files Updated:**
- `scripts/x-package-monitor.ts` - New Bun-native TypeScript version
- `scripts/x-package-monitor.js` - Removed
- `package.json` - Scripts updated for `.ts`
- `CLAUDE.md` - Updated file structure and script references
- `README.md` - Updated file structure and script references

## Package Updates - December 4, 2025

**Status**: COMPLETE

**Overview**:
Updated @ai-sdk/openai to latest version.

**Updated Packages:**
- @ai-sdk/openai 2.0.76 to 2.0.77

**Quality Verification:**
- All 96 tests passing (297 assertions)
- Zero Biome lint errors
- Zero TypeScript errors
- Production build successful

## Final Documentation Verification - December 4, 2025

**Status**: COMPLETE

**Overview**:

Comprehensive documentation review ensuring all references are accurate.

**Additional README.md Fix:**
- Fixed remaining `middleware.ts` reference in "Before using this template" section to `proxy.ts`

**Verification Complete:**
- All documentation files cross-checked for accuracy
- No stale references to deprecated filenames
- Code comments reviewed for clarity and helpfulness

## Next.js Telemetry Disabled - December 4, 2025

**Status**: COMPLETE

**Overview**:

Confirmed Next.js telemetry is disabled for privacy.

**Command:** `bun next telemetry disable`

**Documentation Updated:**
- CLAUDE.md - Added telemetry disabled note to Bun section
- README.md - Added telemetry disable command to Quick Start

## Figmoo Experiment - December 5, 2025

**Status**: COMPLETE

**Overview**:

New experiment: Figmoo - a frictionless website builder proof-of-concept inspired by great product design.

**Purpose:**
- Demonstrate AI-powered website builder workflow
- Showcase "Value First, Account Later" philosophy
- Competitive positioning against Figma Sites, Framer, Webflow

**Features Implemented:**
- Landing page with animated website showcase
- Multi-step onboarding wizard (category, name, design, content, final)
- Live website preview component
- Font and theme selection system
- Section toggle/ordering system
- Sign-up page with email authentication

**Technical Implementation:**
- 22 files in `/app/experiments/figmoo/`
- Complete isolation with `figmoo-` namespace prefix
- Password-protected with purple brand styling
- Pure Tailwind utility classes (no custom CSS)
- CSS keyframe animations for floating website previews

**Documentation:**
- `figmoo-00-readme.md` - Comprehensive planning and architecture
- `figmoo-01-deletion-guide.md` - Safe removal instructions

## Experiments Protocol - December 5, 2025

**Status**: COMPLETE

**Overview**:
Established formal protocol for all experiments in `00-EXPERIMENTS-PROTOCOL.md`.

**Protocol Standards:**
- Password protection: `booya` password with brand-appropriate styling
- Session storage pattern: `{experiment}_auth` key
- Complete isolation from main app
- File naming convention: `{experiment}-{component}.tsx`
- Required documentation structure
- Deletion workflow checklist

**Theme Guidelines:**
| Experiment | Theme | Background | Border | Text |
|------------|-------|------------|--------|------|
| Intercom | Terminal Green | bg-black | border-green-500 | text-green-500 |
| Zendesk | Terminal Green | bg-black | border-green-500 | text-green-500 |
| Figmoo | Modern Purple | bg-gray-50 | border-purple-500 | text-purple-600 |

**Quality Verification:**
- All 3 experiments audited for consistency
- All experiments follow protocol standards
- Zero Biome lint errors
- Zero TypeScript errors

**CLAUDE.md Updated:**
- Added "Creating Experiments" section referencing protocol
- Added Figmoo to file structure
- Updated `_docs/` comment to reference protocol document

## Deep Competitive Analysis - December 5, 2025

**Status**: COMPLETE

**Overview**:
Added comprehensive competitive analysis to Figmoo documentation covering the "friction spectrum" in website builders.

**Key Insights:**

1. **The Friction Spectrum**
   - Website builders fail at both extremes
   - "Overwhelming complexity" (Webflow, Figma Sites): "I don't know where to start"
   - "False simplicity" (Replit blank prompts): "I don't know what to ask for"
   - Optimal zone: "I'm making choices, not decisions" (Figmoo)

2. **The Replit Problem: False Simplicity**
   - Minimal UI that actually demands high cognitive load
   - Blank canvas paralysis - users must invent projects from scratch
   - Technical vocabulary required ("automation", "integrate")
   - High creative burden - writing good prompts is a skill
   - False promise: appears frictionless but user does ALL the thinking

3. **The Figma Sites Problem: Overwhelming Complexity**
   - Designer-centric assumptions (typography, Auto Layout, color theory)
   - Blank canvas problem - infinite modification options
   - Tool proficiency required before website building
   - Integration friction for non-Figma users

4. **What Figma Sites Does Well**
   - Native ecosystem integration for existing users
   - Visual fidelity - pixel-perfect control
   - Template quality - 1,100+ professionally designed
   - Developer handoff - clean export options
   - Brand consistency - design tokens work across projects

5. **Recommendations for Figma's Team**
   - Add "Quick Start" mode for non-designers
   - Implement progressive disclosure (content, layout, colors, advanced)
   - Pre-populate with smart defaults based on industry
   - Add constraint rails ("Beginner mode")
   - Value-first onboarding (preview before sign-up)
   - Mobile-first consideration

**Documentation Updated:**
- `figmoo-00-readme.md` - Added 150+ lines of competitive analysis

## Build Fix - December 5, 2025

**Status**: COMPLETE

**Overview**:
Fixed TypeScript strict mode errors preventing Vercel deployment.

**Issues Fixed:**
- `aria-hidden` prop type: Changed from string `"true"` to boolean `{true}` in animated showcase component
- Theme prop type: Added explicit `| undefined` to handle `exactOptionalPropertyTypes` strict mode

**Files Fixed:**
- `figmoo-animated-showcase.tsx` - 3 occurrences of aria-hidden type
- `figmoo-site-preview.tsx` - Theme prop type definition

**Verification:**
- Production build successful
- All TypeScript strict mode checks passing
- Zero Biome lint errors

## Design Implementation Audit - December 5, 2025

**Status**: COMPLETE

**Overview**:
Comprehensive design audit of Figmoo experiment with refactoring based on findings.

**Issues Identified:**
1. styled-jsx usage for animations (35+ lines of custom CSS)
2. Inline styles for dynamic theming (35+ occurrences)
3. No shadcn/ui components (all custom implementations)
4. Figmoo not in .gitignore with other archived experiments

**Fixes Applied:**
1. **Moved animations to globals.css**
   - Created `@keyframes figmoo-scroll-up` and `figmoo-scroll-down`
   - Added `.animate-figmoo-scroll-*` utility classes
   - Removed styled-jsx from `figmoo-animated-showcase.tsx`
   - Follows experiment naming convention `{experiment}-*`

2. **Updated .gitignore**
   - Added `/app/experiments/figmoo/` to archived experiments
   - Consistent with zendesk and intercom patterns

3. **Updated Experiment Protocol (v1.1)**
   - Added Section 7: Design Implementation Standards
   - Added Section 8: Git Tracking
   - Documented animation patterns
   - Documented dynamic theming patterns with CSS variables
   - Added DO/DON'T guidelines for styling

**Remaining Technical Debt (Documented):**
- Inline styles for dynamic theme preview (35+ occurrences) - required for runtime theming feature
- shadcn/ui not installed - would require major refactor
- CSS variables for theming - potential future improvement

**Quality Verification:**
- All 96 tests passing (297 assertions)
- Zero Biome lint errors
- Production build successful

## Package Update - December 5, 2025

**Status**: COMPLETE

**Overview**:

Updated Vercel AI SDK to latest version.

**Updated Packages:**
- ai 5.0.106 to 5.0.107

**Quality Verification:**
- All 96 tests passing (297 assertions)
- Production build successful

## Figmoo Overview Page - December 5, 2025

**Status**: COMPLETE

**Overview**:

Added post-sign-up overview page showcasing competitive analysis and product vision.

**New Route:** `/experiments/figmoo/overview`

**Features:**
- Friction Spectrum visualization (complexity vs simplicity)
- Three-column insight cards (Replit problem, Figma problem, Solution)
- Five key recommendations with visual hierarchy
- Figma Sites strengths acknowledgment
- Contact signature with email link

**Files Added:**
- `app/experiments/figmoo/overview/page.tsx`

**Files Updated:**
- `app/experiments/figmoo/signup/page.tsx` - Redirects to overview on sign-up
- `app/experiments/_docs/figmoo-00-readme.md` - Added overview page documentation

**User Flow:**
- Sign-up buttons now redirect to overview page instead of showing alerts
- Overview page presents competitive analysis in a professional, visual format

## Shared Password Gate Component - December 5, 2025

**Status**: COMPLETE

**Overview**:

Created standardized password gate component for all experiments using main site terminal brand colors.

**New File:** `app/experiments/_shared/password-gate.tsx`

**Standardized Styling:**
- Black background (`bg-black`)
- Green terminal text (`text-green-500`)
- Green border (`border-green-500`)
- Monospace font (`font-mono`)
- Matches main 8lee.ai terminal aesthetic

**Component Props:**
- `title` - Display name for the experiment
- `sessionKey` - Unique sessionStorage key
- `children` - Content to render after auth

**Experiments Updated:**
- Intercom - Now uses shared PasswordGate
- Zendesk - Now uses shared PasswordGate
- Figmoo - Now uses shared PasswordGate

**Protocol Updated:**
- `00-EXPERIMENTS-PROTOCOL.md` updated to v1.2
- Documented shared component requirement
- Added `_shared/` directory to experiment structure
- Updated isolation rules to allow `_shared/` imports

## Experiment Documentation Audit - December 5, 2025

**Status**: COMPLETE

**Overview**:

Comprehensive documentation update for all experiments covering styling architecture and safe deletion.

**Styling Documentation:**

| Experiment | Styling Approach | Documentation |
|------------|-----------------|---------------|
| Intercom | Terminal (inherited) | Added "Styling Architecture" section |
| Zendesk | Terminal (inherited) | Added "Styling Architecture" section |
| Figmoo | Independent (Modern minimal) | Added prominent styling comparison table |

**Intercom/Zendesk Updates:**
- Document that they inherit root terminal styles (`bg-black text-green-500 font-mono`)
- No custom CSS overrides needed
- Layout uses minimal wrapper that passes through root styles

**Figmoo Updates:**
- Document complete style independence from main site
- Added comparison table (Terminal vs Modern minimal palette)
- Explained why: product simulation, competitor comparison, design range demonstration
- Layout wraps content in override div (`bg-[#faf7f4] text-[#171a1a] font-sans`)

**Deletion Guide Updates (All Experiments):**
- Fixed directory paths (`app/experiments/` not `app/`)
- Added `_shared/` component cleanup instructions
- Clarified: only delete `_shared/` when removing last experiment
- Figmoo: Added globals.css animation cleanup step

**Protocol v1.2 Updates:**
- Added "Two Styling Approaches" section with code examples
- Updated experiments table with Styling column
- Added styling legend (Terminal inherited vs Independent)

## Major Experiments Refactor - December 5, 2025

**Status**: COMPLETE

**Overview**:

Complete overhaul of experiments architecture: removed password gate, added shadcn/ui, redesigned Figmoo with modern minimal color palette.

**Password Gate Removal:**
- Deleted `app/experiments/_shared/password-gate.tsx`
- Removed PasswordGate wrapper from all experiments (Figmoo, Intercom, Zendesk)
- Experiments now directly accessible without authentication
- Updated all deletion guides to remove `_shared/` references

**shadcn/ui Installation:**
- Initialized shadcn/ui with `bunx shadcn@latest init --defaults`
- Added Button, Card, Input components to `components/ui/`
- Added `cn()` utility function to `lib/utils.ts`
- Fixed `globals.css` to not override main site body styles (terminal theme preserved)
- Created `components.json` configuration

**Figmoo Redesign with Modern Minimal Colors:**

| Element | Color |
|---------|------------|
| Background | `#faf7f4` (cream) |
| Text | `#2c2c2c` (charcoal) |
| Secondary text | `#3c3c3c` |
| Accent | `#d6595b` (coral/rose) |
| Buttons | `#17161a` (dark) |
| Borders | `#dbdbdb` |
| Border radius | `11px` |
| Max width | `1280px` |
| Horizontal padding | `30px` |

**Files Updated:**
- `app/experiments/figmoo/layout.tsx` - Modern minimal color palette
- `app/experiments/figmoo/page.tsx` - Modern minimal styling
- `app/experiments/figmoo/components/figmoo-header.tsx` - Clean navigation
- `app/experiments/figmoo/components/figmoo-category-card.tsx` - Card styling
- `app/experiments/intercom/page.tsx` - Removed PasswordGate
- `app/experiments/zendesk/page.tsx` - Removed PasswordGate

**Protocol Updated to v2.0:**
- Removed all password gate requirements
- Added shadcn/ui usage instructions
- Updated styling guidelines for independent experiments
- Added "Using shadcn/ui Components" section
- Updated deletion workflow checklist

**New Dependencies:**
- `clsx` - Class name utility
- `tailwind-merge` - Tailwind class merging
- `class-variance-authority` - Component variants
- `lucide-react` - Icon library
- `tw-animate-css` - Animation utilities

**Quality Verification:**
- All TypeScript checks passing
- Production build successful
- Main site terminal theme preserved

## Figmoo Design Audit and Privacy Hardening - December 5, 2025

**Status**: COMPLETE

**Overview**:

Comprehensive refactor of Figmoo experiment: removed all third-party references, added CSS variables for brand colors, eliminated inline styles, updated Hire Eight page for Figma PM application context, and hardened privacy with maximum no-index directives.

**Brand Reference Removal:**
- Removed all third-party brand references from code comments and documentation
- Updated to generic "inspired by great product design" language
- Cleaned 13 component files, 4 documentation files, and globals.css

**CSS Variables for Brand Colors:**
- Added `--figmoo-bg`, `--figmoo-text`, `--figmoo-button` to globals.css
- Registered with Tailwind v4 via `@theme inline` block
- Replaced all hardcoded hex values (`#faf7f4`, `#2c2c2c`) with CSS variable classes

**Inline Styles Elimination:**
- Refactored `figmoo-step-design.tsx` to use CSS custom properties for font preview
- Refactored `figmoo-site-preview.tsx` to use CSS custom properties for theme colors
- Pattern: Set CSS variables on container, consume with Tailwind arbitrary values

**Hire Eight Page Update:**
- Rewritten for Figma PM application context
- Key message: "The Problem Isn't Features. It's Onboarding."
- Four-step approach: Immediate value signal, Progressive disclosure, Live feedback, Delayed authentication
- PM-relevant skills: User Research, Data Analysis, Product Strategy, Prototyping, Design Systems, Experimentation

**Privacy Hardening:**
- Maximum robots meta directives in layout.tsx:
  - `index: false`, `follow: false`, `nocache: true`
  - `noarchive: true`, `nosnippet: true`, `noimageindex: true`
  - Specific googleBot directives with `max-video-preview: -1`, `max-image-preview: "none"`
- `referrer: "no-referrer"` to prevent referrer leakage
- Explicitly nulled `openGraph` and `twitter` metadata
- Combined with existing proxy.ts X-Robots-Tag headers

**Files Updated:**
- `app/experiments/figmoo/layout.tsx` - Enhanced privacy metadata
- `app/experiments/figmoo/hire-eight/page.tsx` - PM application narrative
- `app/experiments/figmoo/components/*.tsx` - CSS variable classes
- `app/experiments/figmoo/*/page.tsx` - CSS variable classes
- `app/globals.css` - Figmoo brand CSS variables
- `app/experiments/_docs/figmoo-00-readme.md` - Documentation cleanup
- `app/experiments/_docs/00-EXPERIMENTS-PROTOCOL.md` - Updated styling reference
- `docs/release-notes/2025-12-w1-december.md` - Updated references

## Package Updates - December 6, 2025

**Status**: COMPLETE

**Overview**:

Updated Vercel AI SDK to latest version.

**Updated Packages:**
- ai 5.0.107 to 5.0.108

**Quality Verification:**
- All 96 tests passing (297 assertions)
- Production build successful

**Documentation Updated:**
- CLAUDE.md Tech Stack section
- README.md Tech Stack section

## Biome CSS Parser Fix - December 6, 2025

**Status**: COMPLETE

**Overview**:

Fixed Biome CSS parser to recognize Tailwind v4 directives.

**Issue:** Biome was erroring on Tailwind v4 syntax (`@custom-variant`, `@theme inline`, `@apply`) in globals.css

**Fix:** Enabled `tailwindDirectives: true` in biome.json CSS parser options

**Files Updated:**
- `biome.json` - Added CSS parser configuration with `tailwindDirectives: true`

## CLAUDE.md Optimization - December 6, 2025

**Status**: COMPLETE

**Overview**:

Major refactor of CLAUDE.md following HumanLayer best practices for AI assistant instructions.

**Before:** 427 lines with duplicated content, code examples, task-specific details
**After:** 60 lines focused on universal workflows and file references

**Key Changes:**
- Reduced from 427 to 60 lines (86% reduction)
- Removed code style guidelines (linter's job)
- Removed duplicated file structure (already in README)
- Removed task-specific instructions (security config, adding commands)
- Added "Key Files" reference table instead of reproducing content
- Moved Architecture section to README.md
- Added Figmoo to README project structure

**Principles Applied (from humanlayer.dev/blog/writing-a-good-claude-md):**
- Target < 100 lines (achieved: 60)
- Focus on WHAT, WHY, HOW
- Reference over reproduction
- Universal applicability for every session
- Progressive disclosure via file references

**Files Updated:**
- `CLAUDE.md` - Trimmed to 60 lines
- `README.md` - Added Architecture section, added Figmoo to structure

## Package Monitor Archival - December 6, 2025

**Status**: COMPLETE

**Overview**:

Archived custom package monitor script in favor of native Bun commands.

**Rationale:** Bun 1.3.1 natively provides `bun outdated`, `bun update`, and `bun audit` commands that cover the core functionality.

**Files Removed:**
- `scripts/x-package-monitor.ts` - Custom package monitoring script
- `.package-monitor-config.json.example` - Configuration template

**New Slash Command:** `.claude/commands/update.md`

Comprehensive dependency update workflow:
1. `bun outdated` - Check for available updates
2. `bun update` - Update within semver range
3. `bun audit` - Check for vulnerabilities
4. Update documentation (CLAUDE.md, README.md, release notes)
5. Fix all lint/type issues
6. Push to main

**Files Updated:**
- `package.json` - Removed `packages`, `packages:watch`, `packages:critical` scripts
- `CLAUDE.md` - Replaced custom script with native bun commands
- `README.md` - Simplified package monitoring section
