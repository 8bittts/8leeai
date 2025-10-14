# Release Notes

Comprehensive changelog for the 8lee.ai terminal portfolio project, organized in reverse chronological order.

---

## ⚠️ IMPORTANT - DO NOT MODIFY THIS FILE

**This file is manually curated by the project maintainer and should NEVER be modified unless explicitly requested.**

If you are asked to update this file, follow these rules:
- Use **date-based organization only** (e.g., "## October 12, 2025")
- **No timestamps** - all entries for a given day go under the same date heading
- Multiple updates on the same day are added as additional `###` entries under that date
- Format: `### Feature/update title` (no timestamps like "14:30 PST")
- Entries within a date are ordered most recent first (new entries added at top of date section)

---

## October 14, 2025

### Package dependency update (Next.js 15.5.5)

**Updated Next.js to latest patch version:**
- `next`: 15.5.4 → 15.5.5 (patch update)

**Verification:**
- All 44 tests passed with 132 assertions
- Biome linting passed with no issues
- Production build successful
- No breaking changes in patch update

**Documentation Updates:**
- Updated version reference in CLAUDE.md (line 7)
- Removed AGENTS.md file and all references to it
- Added release notes entry

**Files Changed:** 3 files (package.json, bun.lock, CLAUDE.md, release-notes.md)

---

## October 12, 2025

### Semantic URL redirect strategy for legacy content

**Implemented intelligent URL redirect system to preserve link equity from 20+ years of external links:**

**Feature Overview:**
- Semantic-looking 404s (≤30 chars, lowercase/numbers/hyphens) automatically redirect to homepage with 301 status
- Malformed/malicious URLs (SQL injection, path traversal, PHP probing) correctly hit 404 page
- Preserves SEO value and provides better UX for visitors from old blog posts, forums, and bookmarks

**Implementation Details:**
1. **URL Validation Utilities (`lib/utils.ts`):**
   - `isMalformedUrl()` - Detects SQL injection, path traversal, PHP/WordPress probing, XSS patterns
   - `isSemanticUrl()` - Validates legitimate slug-style URLs (30 char limit, lowercase/numbers/hyphens only)

2. **Middleware Integration (`middleware.ts`):**
   - Added redirect logic before security headers
   - Preserves Next.js internals, API routes, and static assets
   - Returns 301 permanent redirect for semantic URLs
   - Lets malicious patterns through to 404 page

3. **Comprehensive Test Coverage:**
   - Added 14 new intent-focused tests (44 total tests, 132 assertions)
   - Tests validate both security (blocks attacks) and usability (allows legitimate users)
   - All tests include WHY comments explaining business reasoning
   - Real-world examples from production analytics

**Security Patterns Detected:**
- SQL injection: `SELECT`, `UNION`, `DROP TABLE`, quotes, comments
- Path traversal: `../`, encoded variants (`%2e%2e`)
- CMS probing: `wp-admin`, `phpmyadmin`, `xmlrpc.php`
- XSS vectors: `<script>`, suspicious brackets/braces

**Example Redirects:**
- `/blog-content` → homepage (semantic)
- `/jung` → homepage (semantic)
- `/1-percent` → homepage (semantic)
- `/wp-admin.php` → 404 (malicious)
- `/../../etc/passwd` → 404 (path traversal)

**Documentation Updates:**
- Updated CLAUDE.md with redirect behavior in Security Configuration section
- Enhanced AGENTS.md Testing Guidelines with security validation principles
- Updated README.md test coverage statistics (44 tests, 132 assertions)

**Verification:**
- All 44 tests passing with 132 assertions
- Biome linting passed with no issues
- Production build successful (middleware: 34.9 kB)
- Tested with real legacy URLs from production analytics

**Impact:**
- Better SEO: Preserves link authority from decades of external backlinks
- Improved UX: Visitors from old links reach homepage instead of 404
- Enhanced Security: Blocks automated scanners and injection attempts
- Future-proof: Handles all legacy URLs without maintaining massive redirect list

**Files Changed:** 4 files (+147 lines: lib/utils.ts, middleware.ts, lib/utils.test.ts, CLAUDE.md, AGENTS.md, README.md)

---

### Package dependency updates (Biome 2.2.6, type definitions)

**Updated development dependencies to latest patch versions:**
- `@biomejs/biome`: 2.2.5 → 2.2.6 (patch update for linter/formatter)
- `@types/node`: 24.7.1 → 24.7.2 (patch update for TypeScript Node.js type definitions)
- `@types/react-dom`: 19.2.1 → 19.2.2 (patch update for TypeScript React DOM type definitions)

**Biome Configuration:**
- Updated `biome.json` schema to 2.2.6
- All linting rules remain compatible with new version

**Verification:**
- All 33 tests passed with 97 assertions
- Biome linting passed with no issues
- Production build successful
- No breaking changes in patch updates

**Documentation Updates:**
- Updated version references in CLAUDE.md (lines 7, 125)
- Updated version references in AGENTS.md (line 31)
- Updated version references in README.md (lines 155, 159)
- Added release notes entry

**Files Changed:** 6 files (package.json, bun.lock, biome.json, CLAUDE.md, AGENTS.md, README.md, release-notes.md)

---

### Slash command support for all terminal commands

**Added slash command syntax to command prompt:**
- All existing commands now accept a leading `/` prefix (e.g., `/education`, `/github`, `/clear`)
- Implemented automatic slash stripping in `handleCommand` function
- Non-breaking change - existing commands still work exactly as before
- Supports all command aliases (e.g., `/ed` and `/vol` work alongside `/education` and `/volunteer`)

**Technical Implementation:**
- Modified `command-prompt.tsx:152` to strip leading slash with `.replace(/^\//, "")`
- Maintains backward compatibility with all existing command formats
- No changes to command display labels or user-facing documentation

**Supported Slash Commands:**
- `/email`, `/education` (or `/ed`), `/volunteer` (or `/vol`)
- `/github`, `/wellfound`, `/deathnote`, `/clear`

**Verification:**
- All 33 tests passed with 97 assertions
- Biome linting passed with no issues
- Production build successful

**Files Changed:** 1 file (command-prompt.tsx)

---

## October 10, 2025

### Package dependency updates

**Updated development dependencies to latest versions:**
- `@types/node`: 24.7.0 → 24.7.1 (patch update for TypeScript Node.js type definitions)
- `happy-dom`: 19.0.2 → 20.0.0 (major version update for test DOM environment)

**Verification:**
- All 33 tests passed with 97 assertions
- Biome linting passed with no issues
- No breaking changes detected in happy-dom v20.0.0

**Documentation Updates:**
- Updated version references in CLAUDE.md (line 125)
- Updated version references in AGENTS.md (lines 19, 31)
- Updated version references in README.md (lines 124, 159)
- Added release notes entry

**Files Changed:** 5 files (package.json, bun.lock, CLAUDE.md, AGENTS.md, README.md, release-notes.md)

---

## October 9, 2025

### Remove all emojis from markdown documentation

**Removed emoji characters from documentation files:**
- Replaced checkmark/X emojis in CLAUDE.md with text labels (Good/Bad)
- Maintains clear examples without Unicode dependency
- Improves compatibility with text editors and terminal viewers

**Files Changed:** 1 file (CLAUDE.md)

---

### Comprehensive test refactoring to focus on intent over implementation

**Refactored all test suites to document user intent and business logic:**

**Philosophy Change:**
- Tests now focus on **WHY** features exist, not **HOW** they're implemented
- Test names read like requirements and user stories
- Every assertion includes comments explaining the business reason
- Makes tests resilient to refactoring while serving as living documentation

**Tests Refactored (33 tests, 97 assertions - all passing):**

1. **`components/cursor.test.tsx`** (4 tests)
   - Before: "renders with default green variant", "has correct dimensions"
   - After: "provides visible indicator that terminal is active", "renders as thin blinking line matching classic terminal cursor"

2. **`lib/utils.test.ts`** (13 tests)
   - Before: "formats single digit with leading zero", "underlines matching word"
   - After: "displays project numbers in consistent width for visual scanning", "highlights specific word to show users what's clickable"

3. **`hooks/use-typewriter.test.tsx`** (6 tests)
   - Before: "initially returns empty string", "types out text character by character"
   - After: "begins with no content visible to build anticipation", "gradually reveals text character by character for terminal aesthetic"

4. **`hooks/use-virtual-keyboard-suppression.test.tsx`** (5 tests)
   - Before: "sets readonly attribute on touch devices", "removes readonly attribute"
   - After: "prevents keyboard popup when navigating command history on touch devices", "allows keyboard to appear when user wants to type new command"

**Documentation Updates:**
- Added comprehensive "Testing Philosophy" section to CLAUDE.md with core principles and examples
- Enhanced README.md Testing section with philosophy summary (user intent focus, requirement-style test names, business reason comments)
- Updated test coverage statistics (33 tests, 97 assertions)

**Impact:**
- Tests now serve as product requirements documentation
- More maintainable - implementation can change without breaking tests
- Easier onboarding - developers understand business logic by reading tests
- Better alignment between technical tests and user needs

**Files Changed:** 7 files (~200 lines updated: 4 test files, CLAUDE.md, README.md, release-notes.md)

---

## October 8, 2025

### TypeScript configuration fix for test exclusion

**Fixed Next.js build issue:**
- Updated `tsconfig.json` to exclude test files from Next.js compilation
- Added exclusions: `**/*.test.ts`, `**/*.test.tsx`, `test-setup.ts`
- Resolved type conflict between happy-dom and Next.js Window types
- Production build now passes without test file interference

**Enhanced README.md documentation:**
- Expanded Testing section with coverage details (36 tests, 107 assertions)
- Added execution time (~900ms) and test breakdown by file
- Documented important testing notes (tsconfig exclusions, Biome compliance, DOM polyfills)
- Added reference to `release-notes.md` in Version History section
- Updated v1.0 release notes to include test coverage

**Files Changed:** 3 files (tsconfig.json, README.md, release-notes.md)

---

### Comprehensive test infrastructure implementation

**Added lightweight testing setup with Bun's native test runner:**

**Testing Dependencies Added:**
- `@testing-library/react@16.3.0` - Component testing utilities
- `@testing-library/jest-dom@6.9.1` - DOM-specific matchers
- `happy-dom@19.0.2` - Lightweight DOM environment for tests

**Test Configuration:**
- Created `test-setup.ts` with happy-dom global registration
- Added `bunfig.toml` for Bun test preloading
- Configured `requestAnimationFrame` and `matchMedia` polyfills for test environment
- Added `test` and `test:watch` npm scripts

**Test Coverage (36 tests, 107 assertions - all passing):**

1. **`lib/utils.test.ts`** (19 tests)
   - `formatIndex()` - Zero-padded index formatting
   - `isValidCommand()` - Command validation with type guards
   - `renderTextWithUnderlinedWord()` - Case-insensitive word highlighting
   - `openExternalLink()` - Secure URL opening behavior
   - Constants validation (VALID_COMMANDS, COMMAND_DISPLAY_LIST, DATA_OFFSETS)

2. **`hooks/use-typewriter.test.tsx`** (6 tests)
   - Initial state and typing behavior
   - Character-by-character animation
   - Completion callback handling
   - Empty text edge cases
   - Text prop change behavior

3. **`hooks/use-virtual-keyboard-suppression.test.tsx`** (5 tests)
   - Touch device detection with matchMedia mocking
   - Readonly attribute manipulation on mobile
   - Keyboard suppression release behavior
   - Null ref handling
   - Component unmount cleanup

4. **`components/cursor.test.tsx`** (6 tests)
   - Default green variant rendering
   - Black variant for 404 page
   - ARIA attributes validation
   - CSS class assertions (dimensions, styling)

**Documentation Updates:**
- Enhanced README.md with Testing section and test command documentation
- Updated CLAUDE.md Development Commands with test scripts
- Updated AGENTS.md Testing Guidelines with comprehensive coverage details
- Added test files to file structure documentation across all docs

**Package Audit:**
- Verified all 18 packages are at latest stable versions
- No updates needed - dependency tree fully current

**Impact:**
- Established robust testing foundation without Playwright overhead
- Targeted coverage for business logic (hooks, utilities, components)
- Fast execution (~850ms for 36 tests)
- Co-located tests beside source files for maintainability
- All tests pass Biome linting rules

**Files Changed:** 13 files (+~600 lines of test code and configuration)

---

### Refactoring cursor into single component
**Commit:** `f7e503c` by 8BIT

- Created reusable `<Cursor />` component to eliminate code duplication
- Added `variant` prop supporting "green" (terminal) and "black" (404 page) color schemes
- Refactored 9 duplicate cursor instances across boot-sequence.tsx, cv-content.tsx, and not-found.tsx
- All cursors now use identical `animate-pulse` timing
- Updated documentation (README.md, CLAUDE.md, AGENTS.md)
- **Impact:** Improved code maintainability and DRY principles

**Files Changed:** 5 files (+32, -52)

---

### Update README.md
**Commit:** `1995089` by 8BIT

- Enhanced README documentation with latest feature descriptions
- Updated version history section with comprehensive v1.0 details
- Improved formatting and readability

**Files Changed:** 1 file (+24, -14)

---

### Same same
**Commit:** `86e8c86` by 8BIT

- Minor text adjustment in command-prompt.tsx

**Files Changed:** 1 file (+1, -1)

---

### Lint and Command Prompt consolidation. Docs
**Commit:** `565a58f` by 8BIT

- Enhanced Biome configuration with additional complexity and style rules
- Added `COMMAND_DISPLAY_LIST` to utils for consistent command documentation
- Updated package versions (Next.js 15.5.4, React 19.2.0)
- Improved README with latest architecture details
- Consolidated command prompt documentation

**Files Changed:** 6 files (+69, -48)

---

### Documentation for new hook
**Commit:** `5a2b727` by 8BIT

- Added comprehensive JSDoc comments to `use-virtual-keyboard-suppression.ts`
- Updated .gitignore formatting
- Minor documentation improvements across components

**Files Changed:** 4 files (+9, -3)

---

### Optimizations for matrix, audio preload, typewriter effect, link rendering, virtual keyboard suppression, stricter command types
**Commit:** `7559c5a` by 8BIT

**Major performance and code quality improvements:**

1. **Matrix Background Optimization**
   - Converted from `setInterval` to `requestAnimationFrame` for 60fps
   - Time-based updates maintain consistent 20fps animation speed
   - Automatically pauses when tab is inactive (battery/CPU savings)

2. **Audio Preload**
   - Added Link header in next.config.ts to preload /cj.m4a
   - Eliminates delay on first user interaction

3. **Typewriter Hook Refactor**
   - Uses `useRef` for onComplete callback storage
   - Removed from dependency array to prevent unnecessary re-renders
   - More efficient re-render behavior

4. **Extracted Link Rendering Logic**
   - Created `renderTextWithUnderlinedWord()` utility in lib/utils.ts
   - Uses `React.createElement` (no JSX in .ts file)
   - Eliminated 40+ lines of duplicate code across 3 components

5. **Virtual Keyboard Suppression Hook**
   - Extracted 100+ lines into custom hook
   - Dramatically simplified command-prompt.tsx
   - Reusable pattern for future components

6. **Stricter Command Types**
   - Added `VALID_COMMANDS` const array with strict typing
   - Created `Command` type: `type Command = typeof VALID_COMMANDS[number]`
   - Added `isValidCommand()` type guard
   - Command list now auto-generated (single source of truth)

**Files Changed:** 7 files (+235, -167)

---

## October 7, 2025

### Adding to gitignore, conflict with bun.lock and package-lock.json
**Commit:** `44db52b` by 8BIT

- Updated .gitignore to handle package-lock.json conflicts
- Removed package-lock.json from repository (using bun.lock exclusively)
- Added build.log to repository for debugging reference
- Removed duplicate tsconfig.json settings

**Files Changed:** 4 files (+33, -1041)

---

### Tighter types
**Commit:** `6e7bd21` by 8BIT

- Enhanced TypeScript strict mode configuration
- Improved type safety in matrix-background.tsx with proper Canvas API types
- Added explicit Canvas2DContext type assertions
- Updated terminal-container.tsx with stricter type checking

**Files Changed:** 3 files (+23, -12)

---

### Matrix background on mobile only
**Commit:** `437db12` by 8BIT

- Created new `matrix-background.tsx` component with falling Matrix rain effect
- Mobile-only implementation (replaces ASCII "8" watermark)
- Canvas-based animation with performance optimizations
- Subtle 8% opacity for authentic terminal aesthetic
- Updated README with Matrix background documentation

**Files Changed:** 5 files (+1132, -21)

---

## October 6, 2025

### Version updates
**Commit:** `d632afd` by 8BIT

- Updated package dependencies to latest stable versions
- Next.js and React version bumps

**Files Changed:** 2 files (+7, -7)

---

## October 3, 2025

### Update .gitignore
**Commit:** `83e0b0f` by 8BIT

- Added build artifacts to .gitignore

**Files Changed:** 1 file (+1)

---

## October 2, 2025

### Update not-found.tsx
**Commit:** `37e25a5` by 8BIT

- Final 404 page text refinements

**Files Changed:** 1 file (+1, -1)

---

### Update not-found.tsx
**Commit:** `359fdf3` by 8BIT

- Adjusted 404 page styling

**Files Changed:** 1 file (+1, -1)

---

### Update not-found.tsx
**Commit:** `1e18f7c` by 8BIT

- 404 page color scheme adjustments

**Files Changed:** 1 file (+3, -3)

---

### Update not-found.tsx
**Commit:** `87d8b10` by 8BIT

- 404 page layout improvements

**Files Changed:** 1 file (+3, -3)

---

### Update not-found.tsx
**Commit:** `b1adb3b` by 8BIT

- Minor 404 page text fix

**Files Changed:** 1 file (+1, -1)

---

### Docs
**Commit:** `1e7ad1d` by 8BIT

- Added 404 page documentation to README
- Enhanced not-found.tsx with JSDoc comments
- Documented typewriter effect behavior

**Files Changed:** 2 files (+22, -2)

---

### Custom 404 page
**Commit:** `d75eee8` by 8BIT

- Created custom 404 error page with Mario background
- Implemented typewriter animation for 404 message
- Added click/keypress handlers to return to home
- Included social media share images (8-social.jpeg, 8-social.png)
- Updated layout.tsx with OpenGraph metadata

**Files Changed:** 5 files (+74, -2)

---

### Emojis...
**Commit:** `2d35a88` by 8BIT

- Updated README emoji styling

**Files Changed:** 1 file (+3, -3)

---

### Packages Update
**Commit:** `fb6b105` by 8BIT

- Updated all dependencies to latest versions:
  - Next.js 15.5.3
  - React 19.1.0
  - Tailwind CSS 4.1.10
  - Biome 2.1.3
  - TypeScript 5.8.3
- Updated Biome schema version
- Refreshed bun.lock with new dependency tree

**Files Changed:** 4 files (+57, -57)

---

## October 1, 2025

### Adding Ghostty Terminal Setup
**Commit:** `b109bca` by 8BIT

- Created comprehensive ghostty.md configuration guide
- Documented custom 8LEE Terminal Theme
- Included color palette, font settings, and keybindings
- Added Ghostty recommendation to README

**Files Changed:** 2 files (+119)

---

## September 30, 2025

### Reducing sound, slightly. Documentation
**Commit:** `46e9573` by 8BIT

- Reduced audio volume from 5% to 2% for less intrusive experience
- Enhanced README with audio integration details
- Updated terminal-container.tsx documentation

**Files Changed:** 2 files (+7, -3)

---

### Update boot-sequence.tsx
**Commit:** `f5dedae` by 8BIT

- Refined boot sequence timing

**Files Changed:** 1 file (+2, -2)

---

### Update README.md
**Commit:** `810901e` by 8BIT

- README formatting improvements

**Files Changed:** 1 file (+1, -1)

---

### Update README.md
**Commit:** `ccb51b8` by 8BIT

- README content refinements

**Files Changed:** 1 file (+1, -1)

---

### Update README.md
**Commit:** `51718bd` by 8BIT

- README documentation updates

**Files Changed:** 1 file (+2, -2)

---

### Update README.md
**Commit:** `6aeb17b` by 8BIT

- README improvements

**Files Changed:** 1 file (+3, -3)

---

### Update README.md
**Commit:** `4213a67` by 8BIT

- README adjustments

**Files Changed:** 1 file (+1, -1)

---

### Update README.md
**Commit:** `9bc8819` by 8BIT

- README fixes

**Files Changed:** 1 file (+1, -1)

---

### Update README.md
**Commit:** `ce63319` by 8BIT

- README updates

**Files Changed:** 1 file (+1, -1)

---

### Update README.md
**Commit:** `b162462` by 8BIT

- README restructuring

**Files Changed:** 1 file (+6, -8)

---

### Update LICENSE
**Commit:** `0a9633d` by 8BIT

- Updated license copyright year and details

**Files Changed:** 1 file (+2, -2)

---

### Update 8lee-screenshot.png
**Commit:** `80900af` by 8BIT

- Optimized screenshot file size (1.35MB → 1.05MB)

**Files Changed:** 1 file (binary)

---

### One more screenshot
**Commit:** `912adaf` by 8BIT

- Added boot sequence screenshot (8lee-boot-sequence.png)
- Updated README with boot sequence image

**Files Changed:** 2 files (+2)

---

### Screenshot!
**Commit:** `fd79fa4` by 8BIT

- Added main terminal screenshot (8lee-screenshot.png)
- Updated README with screenshot reference

**Files Changed:** 2 files (+2)

---

### Load 15, not 10
**Commit:** `9af88e0` by 8BIT

- Changed project pagination from 10 to 15 items per page
- Updated both cv-content.tsx and terminal-container.tsx for consistency

**Files Changed:** 2 files (+2, -2)

---

### Update README.md
**Commit:** `e6fe254` by 8BIT

- README content cleanup

**Files Changed:** 1 file (+7, -11)

---

### Update README.md
**Commit:** `e179fcf` by 8BIT

- README formatting improvements

**Files Changed:** 1 file (+15, -21)

---

### Update terminal-container.tsx
**Commit:** `e978a2a` by 8BIT

- Enhanced flash animation for invalid commands
- Improved error feedback timing

**Files Changed:** 1 file (+5, -2)

---

### Dynamic versioning based on birthday
**Commit:** `4540463` by 8BIT

- Implemented dynamic age calculation in boot sequence
- Version number now auto-updates based on birthdate (Nov 9, 1982)
- Calculates fractional age with high precision (e.g., "42.17")
- Updates hourly to reflect current age progression

**Files Changed:** 1 file (+38, -1)

---

### Update command-prompt.tsx
**Commit:** `232472e` by 8BIT

- Improved command prompt placeholder text
- Enhanced user guidance for command input

**Files Changed:** 1 file (+2, -2)

---

### Update README.md
**Commit:** `e8fb36e` by 8BIT

- Added Vercel Speed Insights to README features

**Files Changed:** 1 file (+1)

---

### Update layout.tsx
**Commit:** `605cc29` by 8BIT

- Integrated Vercel SpeedInsights component
- Added performance monitoring to layout

**Files Changed:** 1 file (+2)

---

### Vercel speed insights package
**Commit:** `7459474` by 8BIT

- Added @vercel/speed-insights dependency
- Enabled real-time performance tracking

**Files Changed:** 2 files (+4)

---

### Test input focus on mobile, soft suppression
**Commit:** `226ab85` by 8BIT

- Implemented virtual keyboard suppression for better mobile UX
- Added temporary keyboard hiding on Enter press
- Improved mobile terminal interaction flow
- Enhanced command prompt with better mobile focus handling

**Files Changed:** 2 files (+102, -36)

---

### Adding DeathNote command
**Commit:** `578c000` by 8BIT

- Added "deathnote" command to open deathnote.ai website
- Expanded command list in terminal

**Files Changed:** 1 file (+2, -1)

---

### Update cv-content.tsx
**Commit:** `1921816` by 8BIT

- Updated CV content summary text

**Files Changed:** 1 file (+1, -1)

---

### Updating commands and text
**Commit:** `c023cf6` by 8BIT

- Expanded command system with education and volunteer sections
- Added command aliases: "ed" for education, "vol" for volunteer
- Implemented numbered entries (61-65 education, 66-71 volunteer)
- Enhanced command processing logic

**Files Changed:** 1 file (+39, -10)

---

### Standardizing fonts. 7 to 5
**Commit:** `59040cc` by 8BIT

- Consolidated font size scale from 7 to 5 sizes
- Simplified typography system:
  - text-xs: Small UI elements
  - text-sm: Body text, grids
  - text-xl: Section headings
  - text-3xl: Main page title
  - text-6xl: Mobile watermark only

**Files Changed:** 2 files (+11, -11)

---

### Dupe CSS. Nice
**Commit:** `d2294ff` by 8BIT

- Removed 26 lines of duplicate CSS from tailwind.css
- Cleaned up redundant styling rules

**Files Changed:** 1 file (-26)

---

## September 29, 2025

### Update data.ts
**Commit:** `7355808` by 8BIT

- Updated project data entry

**Files Changed:** 1 file (+1, -1)

---

### Update README.md
**Commit:** `834fb11` by 8BIT

- README typo fix

**Files Changed:** 1 file (+1, -1)

---

### Code comments for future cause I'm stupid
**Commit:** `c10da06` by 8BIT

- Added comprehensive JSDoc comments across all components
- Documented complex logic and state management patterns
- Enhanced Biome configuration with 100+ error-level linting rules
- Improved code quality with stricter rules:
  - complexity checks
  - correctness validation
  - style enforcement
  - suspicious pattern detection
  - a11y considerations
  - performance optimizations
  - security checks

**Files Changed:** 7 files (+276, -101)

---

### Caps. Love caps
**Commit:** `bef715c` by 8BIT

- Reformatted all project data entries with proper capitalization
- Improved data.ts readability and consistency
- Enhanced project name formatting

**Files Changed:** 1 file (+149, -64)

---

### Updating CORs / CSP middleware. Readme. Lint
**Commit:** `c8e1950` by 8BIT

- Enhanced middleware with production-grade security headers:
  - Strict Content Security Policy (CSP)
  - CORS restrictions locked to 8lee.ai domain
  - HSTS with preload
  - X-Frame-Options
  - Permissions Policy
  - X-Robots-Tag for anti-crawling
- Updated README with security documentation
- Code quality improvements

**Files Changed:** 3 files (+51, -16)

---

### Type issue
**Commit:** `8b405a2` by 8BIT

- Fixed TypeScript type errors in command-prompt and cv-content
- Resolved type inference issues

**Files Changed:** 2 files (+6, -6)

---

### Small mobile responsive optimization
**Commit:** `6182153` by 8BIT

- Added mobile-specific layout improvements
- Enhanced responsive behavior for command prompt

**Files Changed:** 1 file (+5)

---

### Fixing keyword links. ARIA...
**Commit:** `d264f86` by 8BIT

- Implemented selective word underlining for project links
- Enhanced ARIA labels for external links
- Improved accessibility with better link descriptions
- Added "opens in new tab" notifications

**Files Changed:** 2 files (+36, -6)

---

### Outline on Command Prompt fixed. ARIA...
**Commit:** `77de61c` by 8BIT

- Fixed input outline styling for command prompt
- Improved focus state visibility

**Files Changed:** 1 file (+1, -1)

---

### Updating Readme. Lint fixes
**Commit:** `0e217f8` by 8BIT

- Enhanced README with additional features
- Added Biome linting rules for better code quality
- Fixed linting violations

**Files Changed:** 2 files (+9, -2)

---

### Adding typewriter to boot sequence. Fixing ARIA. Adding background logo on mobile
**Commit:** `3d1edae` by 8BIT

- Implemented typewriter effect for boot sequence
- Added mobile background "8" logo with Tailwind CSS
- Enhanced ARIA live regions for screen reader support
- Improved accessibility across all components:
  - Added semantic HTML
  - Implemented proper ARIA labels
  - Enhanced keyboard navigation
  - Added screen reader announcements
- Updated useTypewriter hook with completion callback
- Integrated IBM Plex Mono font

**Files Changed:** 8 files (+307, -117)

---

### Refinements
**Commit:** `345fb27` by 8BIT

- Code cleanup and optimization
- Removed unnecessary console logs
- Streamlined component logic

**Files Changed:** 3 files (+3, -9)

---

### Like the Command Prompt cursor now
**Commit:** `a062eb1` by 8BIT

- Refined cursor styling in boot sequence
- Adjusted cursor dimensions for better visual alignment

**Files Changed:** 1 file (+2, -2)

---

### Updating animation to cursor on boot sequence
**Commit:** `5bc599a` by 8BIT

- Enhanced boot sequence cursor animation
- Improved timing and visual flow

**Files Changed:** 1 file (+3, -2)

---

### Better scroll on "enter"
**Commit:** `9843515` by 8BIT

- Implemented auto-scroll functionality when loading more projects
- Enhanced mobile UX with smooth scrolling to new content
- Added scroll-into-view behavior for pagination
- Improved boot sequence spacing

**Files Changed:** 2 files (+12, -5)

---

### b/c bitcoin
**Commit:** `3a93c58` by 8BIT

- Added Bitcoin whitepaper (bitcoin.pdf) to public assets
- Easter egg for terminal enthusiasts

**Files Changed:** 1 file (binary)

---

### vercel analytics
**Commit:** `6069310` by 8BIT

- Integrated Vercel Analytics
- Added @vercel/analytics dependency
- Enabled analytics tracking in layout.tsx

**Files Changed:** 3 files (+6)

---

### Fixing blinking cursor. Personal note to CJ and JPJPJP
**Commit:** `fa9c603` by 8BIT

- Fixed cursor blinking animation
- Updated metadata description
- Removed debug console.log

**Files Changed:** 2 files (+1, -2)

---

### v1.0 Release
**Commit:** `f2059b4` by 8BIT

**Initial Production Release - Complete Terminal Portfolio**

- Full terminal interface with authentic DOS-style boot sequence
- Interactive command system supporting 60+ projects
- Education and volunteer experience sections
- Production-grade security implementation:
  - Content Security Policy (CSP)
  - CORS restrictions
  - Secure external link handling
  - Anti-crawling configuration
- Modern tech stack:
  - Next.js 15.5.1 with App Router
  - React 19.0.0
  - Tailwind CSS v4.0.12
  - TypeScript 5.8.2
  - Biome 2.1.2 for linting
  - Bun 1.2.23 as package manager
- Comprehensive accessibility features:
  - ARIA live regions
  - Semantic HTML
  - Keyboard navigation
  - Screen reader support
- Performance optimizations:
  - Turbopack for development
  - Optimized bundle size
  - Fast page loads
- Ultra-private mode configuration:
  - robots.txt blocking all crawlers
  - No-index/no-follow metadata
  - Privacy-focused settings
- Click-to-focus terminal interaction
- Typewriter effects and animations
- Custom hooks (useTypewriter)
- Vercel deployment ready
- MIT License
- Comprehensive README documentation

**Files Changed:** 35 files (+1961)

---

## Summary Statistics

- **Total Commits:** 74
- **Date Range:** September 29 - October 9, 2025
- **Contributors:** 8BIT
- **Lines Added:** ~3,700+
- **Lines Removed:** ~1,700+
- **Major Milestones:**
  - v1.0 Initial Release (Sep 29)
  - Custom 404 Page (Oct 2)
  - Matrix Background Implementation (Oct 7)
  - Major Performance Optimizations (Oct 8)
  - Cursor Component Refactoring (Oct 8)
  - Test Infrastructure & Coverage (Oct 8)
  - Intent-Focused Test Refactoring (Oct 9)
