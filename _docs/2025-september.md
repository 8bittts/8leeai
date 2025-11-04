# September 2025 Release Notes

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