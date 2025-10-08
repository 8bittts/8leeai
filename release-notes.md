# Release Notes

Comprehensive changelog for the 8lee.ai terminal portfolio project, organized in reverse chronological order.

---

## October 8, 2025

### 13:33 PST - Refactoring cursor into single component
**Commit:** `f7e503c` by 8BIT

- Created reusable `<Cursor />` component to eliminate code duplication
- Added `variant` prop supporting "green" (terminal) and "black" (404 page) color schemes
- Refactored 9 duplicate cursor instances across boot-sequence.tsx, cv-content.tsx, and not-found.tsx
- All cursors now use identical `animate-pulse` timing
- Updated documentation (README.md, CLAUDE.md, AGENTS.md)
- **Impact:** Improved code maintainability and DRY principles

**Files Changed:** 5 files (+32, -52)

---

### 09:17 PST - Update README.md
**Commit:** `1995089` by 8BIT

- Enhanced README documentation with latest feature descriptions
- Updated version history section with comprehensive v1.0 details
- Improved formatting and readability

**Files Changed:** 1 file (+24, -14)

---

### 09:15 PST - Same same
**Commit:** `86e8c86` by 8BIT

- Minor text adjustment in command-prompt.tsx

**Files Changed:** 1 file (+1, -1)

---

### 08:15 PST - Lint and Command Prompt consolidation. Docs
**Commit:** `565a58f` by 8BIT

- Enhanced Biome configuration with additional complexity and style rules
- Added `COMMAND_DISPLAY_LIST` to utils for consistent command documentation
- Updated package versions (Next.js 15.5.4, React 19.2.0)
- Improved README with latest architecture details
- Consolidated command prompt documentation

**Files Changed:** 6 files (+69, -48)

---

### 08:05 PST - Documentation for new hook
**Commit:** `5a2b727` by 8BIT

- Added comprehensive JSDoc comments to `use-virtual-keyboard-suppression.ts`
- Updated .gitignore formatting
- Minor documentation improvements across components

**Files Changed:** 4 files (+9, -3)

---

### 07:41 PST - Optimizations for matrix, audio preload, typewriter effect, link rendering, virtual keyboard suppression, stricter command types
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

### 07:06 PST - Adding to gitignore, conflict with bun.lock and package-lock.json
**Commit:** `44db52b` by 8BIT

- Updated .gitignore to handle package-lock.json conflicts
- Removed package-lock.json from repository (using bun.lock exclusively)
- Added build.log to repository for debugging reference
- Removed duplicate tsconfig.json settings

**Files Changed:** 4 files (+33, -1041)

---

### 07:03 PST - Tighter types
**Commit:** `6e7bd21` by 8BIT

- Enhanced TypeScript strict mode configuration
- Improved type safety in matrix-background.tsx with proper Canvas API types
- Added explicit Canvas2DContext type assertions
- Updated terminal-container.tsx with stricter type checking

**Files Changed:** 3 files (+23, -12)

---

### 06:58 PST - Matrix background on mobile only
**Commit:** `437db12` by 8BIT

- Created new `matrix-background.tsx` component with falling Matrix rain effect
- Mobile-only implementation (replaces ASCII "8" watermark)
- Canvas-based animation with performance optimizations
- Subtle 8% opacity for authentic terminal aesthetic
- Updated README with Matrix background documentation

**Files Changed:** 5 files (+1132, -21)

---

## October 6, 2025

### 16:41 PST - Version updates
**Commit:** `d632afd` by 8BIT

- Updated package dependencies to latest stable versions
- Next.js and React version bumps

**Files Changed:** 2 files (+7, -7)

---

## October 3, 2025

### 13:11 CST - Update .gitignore
**Commit:** `83e0b0f` by 8BIT

- Added build artifacts to .gitignore

**Files Changed:** 1 file (+1)

---

## October 2, 2025

### 15:58 CST - Update not-found.tsx
**Commit:** `37e25a5` by 8BIT

- Final 404 page text refinements

**Files Changed:** 1 file (+1, -1)

---

### 15:53 CST - Update not-found.tsx
**Commit:** `359fdf3` by 8BIT

- Adjusted 404 page styling

**Files Changed:** 1 file (+1, -1)

---

### 15:45 CST - Update not-found.tsx
**Commit:** `1e18f7c` by 8BIT

- 404 page color scheme adjustments

**Files Changed:** 1 file (+3, -3)

---

### 15:42 CST - Update not-found.tsx
**Commit:** `87d8b10` by 8BIT

- 404 page layout improvements

**Files Changed:** 1 file (+3, -3)

---

### 15:29 CST - Update not-found.tsx
**Commit:** `b1adb3b` by 8BIT

- Minor 404 page text fix

**Files Changed:** 1 file (+1, -1)

---

### 15:00 CST - Docs
**Commit:** `1e7ad1d` by 8BIT

- Added 404 page documentation to README
- Enhanced not-found.tsx with JSDoc comments
- Documented typewriter effect behavior

**Files Changed:** 2 files (+22, -2)

---

### 14:50 CST - Custom 404 page
**Commit:** `d75eee8` by 8BIT

- Created custom 404 error page with Mario background
- Implemented typewriter animation for 404 message
- Added click/keypress handlers to return to home
- Included social media share images (8-social.jpeg, 8-social.png)
- Updated layout.tsx with OpenGraph metadata

**Files Changed:** 5 files (+74, -2)

---

### 09:28 CST - Emojis...
**Commit:** `2d35a88` by 8BIT

- Updated README emoji styling

**Files Changed:** 1 file (+3, -3)

---

### 09:16 CST - Packages Update
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

### 10:10 CST - Adding Ghostty Terminal Setup
**Commit:** `b109bca` by 8BIT

- Created comprehensive ghostty.md configuration guide
- Documented custom 8LEE Terminal Theme
- Included color palette, font settings, and keybindings
- Added Ghostty recommendation to README

**Files Changed:** 2 files (+119)

---

## September 30, 2025

### 17:42 CST - Reducing sound, slightly. Documentation
**Commit:** `46e9573` by 8BIT

- Reduced audio volume from 5% to 2% for less intrusive experience
- Enhanced README with audio integration details
- Updated terminal-container.tsx documentation

**Files Changed:** 2 files (+7, -3)

---

### 16:54 CST - Update boot-sequence.tsx
**Commit:** `f5dedae` by 8BIT

- Refined boot sequence timing

**Files Changed:** 1 file (+2, -2)

---

### 11:52 PST - Update README.md
**Commit:** `810901e` by 8BIT

- README formatting improvements

**Files Changed:** 1 file (+1, -1)

---

### 11:51 PST - Update README.md
**Commit:** `ccb51b8` by 8BIT

- README content refinements

**Files Changed:** 1 file (+1, -1)

---

### 11:50 PST - Update README.md
**Commit:** `51718bd` by 8BIT

- README documentation updates

**Files Changed:** 1 file (+2, -2)

---

### 11:50 PST - Update README.md
**Commit:** `6aeb17b` by 8BIT

- README improvements

**Files Changed:** 1 file (+3, -3)

---

### 11:48 PST - Update README.md
**Commit:** `4213a67` by 8BIT

- README adjustments

**Files Changed:** 1 file (+1, -1)

---

### 11:48 PST - Update README.md
**Commit:** `9bc8819` by 8BIT

- README fixes

**Files Changed:** 1 file (+1, -1)

---

### 11:47 PST - Update README.md
**Commit:** `ce63319` by 8BIT

- README updates

**Files Changed:** 1 file (+1, -1)

---

### 11:46 PST - Update README.md
**Commit:** `b162462` by 8BIT

- README restructuring

**Files Changed:** 1 file (+6, -8)

---

### 11:44 PST - Update LICENSE
**Commit:** `0a9633d` by 8BIT

- Updated license copyright year and details

**Files Changed:** 1 file (+2, -2)

---

### 11:37 CST - Update 8lee-screenshot.png
**Commit:** `80900af` by 8BIT

- Optimized screenshot file size (1.35MB → 1.05MB)

**Files Changed:** 1 file (binary)

---

### 11:36 CST - One more screenshot
**Commit:** `912adaf` by 8BIT

- Added boot sequence screenshot (8lee-boot-sequence.png)
- Updated README with boot sequence image

**Files Changed:** 2 files (+2)

---

### 11:33 CST - Screenshot!
**Commit:** `fd79fa4` by 8BIT

- Added main terminal screenshot (8lee-screenshot.png)
- Updated README with screenshot reference

**Files Changed:** 2 files (+2)

---

### 11:22 CST - Load 15, not 10
**Commit:** `9af88e0` by 8BIT

- Changed project pagination from 10 to 15 items per page
- Updated both cv-content.tsx and terminal-container.tsx for consistency

**Files Changed:** 2 files (+2, -2)

---

### 09:13 PST - Update README.md
**Commit:** `e6fe254` by 8BIT

- README content cleanup

**Files Changed:** 1 file (+7, -11)

---

### 09:12 PST - Update README.md
**Commit:** `e179fcf` by 8BIT

- README formatting improvements

**Files Changed:** 1 file (+15, -21)

---

### 08:44 CST - Update terminal-container.tsx
**Commit:** `e978a2a` by 8BIT

- Enhanced flash animation for invalid commands
- Improved error feedback timing

**Files Changed:** 1 file (+5, -2)

---

### 08:38 CST - Dynamic versioning based on birthday
**Commit:** `4540463` by 8BIT

- Implemented dynamic age calculation in boot sequence
- Version number now auto-updates based on birthdate (Nov 9, 1982)
- Calculates fractional age with high precision (e.g., "42.17")
- Updates hourly to reflect current age progression

**Files Changed:** 1 file (+38, -1)

---

### 08:10 CST - Update command-prompt.tsx
**Commit:** `232472e` by 8BIT

- Improved command prompt placeholder text
- Enhanced user guidance for command input

**Files Changed:** 1 file (+2, -2)

---

### 08:02 CST - Update README.md
**Commit:** `e8fb36e` by 8BIT

- Added Vercel Speed Insights to README features

**Files Changed:** 1 file (+1)

---

### 08:00 CST - Update layout.tsx
**Commit:** `605cc29` by 8BIT

- Integrated Vercel SpeedInsights component
- Added performance monitoring to layout

**Files Changed:** 1 file (+2)

---

### 08:00 CST - Vercel speed insights package
**Commit:** `7459474` by 8BIT

- Added @vercel/speed-insights dependency
- Enabled real-time performance tracking

**Files Changed:** 2 files (+4)

---

### 07:57 CST - Test input focus on mobile, soft suppression
**Commit:** `226ab85` by 8BIT

- Implemented virtual keyboard suppression for better mobile UX
- Added temporary keyboard hiding on Enter press
- Improved mobile terminal interaction flow
- Enhanced command prompt with better mobile focus handling

**Files Changed:** 2 files (+102, -36)

---

### 07:47 CST - Adding DeathNote command
**Commit:** `578c000` by 8BIT

- Added "deathnote" command to open deathnote.ai website
- Expanded command list in terminal

**Files Changed:** 1 file (+2, -1)

---

### 07:45 CST - Update cv-content.tsx
**Commit:** `1921816` by 8BIT

- Updated CV content summary text

**Files Changed:** 1 file (+1, -1)

---

### 07:39 CST - Updating commands and text
**Commit:** `c023cf6` by 8BIT

- Expanded command system with education and volunteer sections
- Added command aliases: "ed" for education, "vol" for volunteer
- Implemented numbered entries (61-65 education, 66-71 volunteer)
- Enhanced command processing logic

**Files Changed:** 1 file (+39, -10)

---

### 07:25 CST - Standardizing fonts. 7 to 5
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

### 07:21 CST - Dupe CSS. Nice
**Commit:** `d2294ff` by 8BIT

- Removed 26 lines of duplicate CSS from tailwind.css
- Cleaned up redundant styling rules

**Files Changed:** 1 file (-26)

---

## September 29, 2025

### 19:59 CST - Update data.ts
**Commit:** `7355808` by 8BIT

- Updated project data entry

**Files Changed:** 1 file (+1, -1)

---

### 17:57 PST - Update README.md
**Commit:** `834fb11` by 8BIT

- README typo fix

**Files Changed:** 1 file (+1, -1)

---

### 19:50 CST - Code comments for future cause I'm stupid
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

### 19:42 CST - Caps. Love caps
**Commit:** `bef715c` by 8BIT

- Reformatted all project data entries with proper capitalization
- Improved data.ts readability and consistency
- Enhanced project name formatting

**Files Changed:** 1 file (+149, -64)

---

### 19:27 CST - Updating CORs / CSP middleware. Readme. Lint
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

### 19:17 CST - Type issue
**Commit:** `8b405a2` by 8BIT

- Fixed TypeScript type errors in command-prompt and cv-content
- Resolved type inference issues

**Files Changed:** 2 files (+6, -6)

---

### 19:14 CST - Small mobile responsive optimization
**Commit:** `6182153` by 8BIT

- Added mobile-specific layout improvements
- Enhanced responsive behavior for command prompt

**Files Changed:** 1 file (+5)

---

### 19:11 CST - Fixing keyword links. ARIA...
**Commit:** `d264f86` by 8BIT

- Implemented selective word underlining for project links
- Enhanced ARIA labels for external links
- Improved accessibility with better link descriptions
- Added "opens in new tab" notifications

**Files Changed:** 2 files (+36, -6)

---

### 19:09 CST - Outline on Command Prompt fixed. ARIA...
**Commit:** `77de61c` by 8BIT

- Fixed input outline styling for command prompt
- Improved focus state visibility

**Files Changed:** 1 file (+1, -1)

---

### 19:07 CST - Updating Readme. Lint fixes
**Commit:** `0e217f8` by 8BIT

- Enhanced README with additional features
- Added Biome linting rules for better code quality
- Fixed linting violations

**Files Changed:** 2 files (+9, -2)

---

### 19:04 CST - Adding typewriter to boot sequence. Fixing ARIA. Adding background logo on mobile
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

### 18:52 CST - Refinements
**Commit:** `345fb27` by 8BIT

- Code cleanup and optimization
- Removed unnecessary console logs
- Streamlined component logic

**Files Changed:** 3 files (+3, -9)

---

### 18:44 CST - Like the Command Prompt cursor now
**Commit:** `a062eb1` by 8BIT

- Refined cursor styling in boot sequence
- Adjusted cursor dimensions for better visual alignment

**Files Changed:** 1 file (+2, -2)

---

### 18:42 CST - Updating animation to cursor on boot sequence
**Commit:** `5bc599a` by 8BIT

- Enhanced boot sequence cursor animation
- Improved timing and visual flow

**Files Changed:** 1 file (+3, -2)

---

### 18:38 CST - Better scroll on "enter"
**Commit:** `9843515` by 8BIT

- Implemented auto-scroll functionality when loading more projects
- Enhanced mobile UX with smooth scrolling to new content
- Added scroll-into-view behavior for pagination
- Improved boot sequence spacing

**Files Changed:** 2 files (+12, -5)

---

### 18:18 CST - b/c bitcoin
**Commit:** `3a93c58` by 8BIT

- Added Bitcoin whitepaper (bitcoin.pdf) to public assets
- Easter egg for terminal enthusiasts

**Files Changed:** 1 file (binary)

---

### 15:29 CST - vercel analytics
**Commit:** `6069310` by 8BIT

- Integrated Vercel Analytics
- Added @vercel/analytics dependency
- Enabled analytics tracking in layout.tsx

**Files Changed:** 3 files (+6)

---

### 15:18 CST - Fixing blinking cursor. Personal note to CJ and JPJPJP
**Commit:** `fa9c603` by 8BIT

- Fixed cursor blinking animation
- Updated metadata description
- Removed debug console.log

**Files Changed:** 2 files (+1, -2)

---

### 15:00 CST - v1.0 Release
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

- **Total Commits:** 73
- **Date Range:** September 29 - October 8, 2025
- **Contributors:** 8BIT
- **Lines Added:** ~3,500+
- **Lines Removed:** ~1,500+
- **Major Milestones:**
  - v1.0 Initial Release (Sep 29)
  - Custom 404 Page (Oct 2)
  - Matrix Background Implementation (Oct 7)
  - Major Performance Optimizations (Oct 8)
  - Cursor Component Refactoring (Oct 8)
