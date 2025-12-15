# 8lee.ai Release Notes - December 2025 (Week 2, Part 1 of 4)

**Period**: December 8-14, 2025

**Other Parts**:
- [Part 1](2025-12-w2-december-1.md) - December 8 (this file)
- [Part 2](2025-12-w2-december-2.md) - December 9 (Design Audit, Theme System)
- [Part 3](2025-12-w2-december-3.md) - December 9-10 (14 New Themes, Presets, UI Redesign)
- [Part 4](2025-12-w2-december-4.md) - December 10-14

---

## Package Updates - December 8, 2025

**Status**: COMPLETE

Updated core dependencies with full quality validation:

**Packages Updated:**
- `next`: 16.0.7 -> 16.0.8
- `@ai-sdk/openai`: 2.0.79 -> 2.0.80
- `@types/node`: 24.10.1 -> 24.10.2

**Quality Gates Passed:**
- TypeScript: 0 errors
- Biome: 42 files checked, no issues
- Tests: 96 tests, 297 assertions
- Build: Successful (Turbopack, 25 routes)

**Documentation Updated:**
- CLAUDE.md: Tech stack section (Next.js 16.0.8)
- README.md: Badge and Tech Stack sections (Next.js 16.0.8, @types/node 24.10.2)

**Security:**
- `bun audit`: No vulnerabilities found

---

## Claude Code Slash Commands Expansion - December 8, 2025

**Status**: COMPLETE

**Overview**:
Added two new slash commands to streamline development workflows.

**`/push` Command:**
- Fixes lint and type issues aggressively (only files touched in current session)
- Updates release notes following the 1800-word split threshold protocol
- Pushes to main branch with no Claude attribution (per CLAUDE.md rules)
- Combines quality checks with release note management in a single workflow

**`/design` Command:**
- Comprehensive design implementation review using ultrathink mode
- 11-point checklist covering:
  1. Pure shadcn (unmodified components)
  2. Pure Tailwind v4 (no v3 logic)
  3. Zero inline styles
  4. Zero custom components
  5. Zero custom classes
  6. Zero hardcoded values
  7. Zero duplicate design styles
  8. Zero style conflicts
  9. Zero unused/orphaned styles (careful knip for production)
  10. Full WCAG/ARIA coverage
  11. Normalized typography, sizing, spacing, grid patterns
- Asks before proceeding when uncertain

**Documentation Updates:**
- CLAUDE.md: Added Slash Commands section with command reference table
- README.md: Added `.claude/commands/` directory to project structure
- `.claude/commands/README.md`: Updated with `/push` and `/design` command documentation

**Files Created:**
- `.claude/commands/push.md`
- `.claude/commands/design.md`

---

## Context7 MCP Integration - December 8, 2025

**Status**: COMPLETE

**Overview**:
Installed Context7 MCP globally for real-time documentation validation across all projects.

**Configuration:**
- MCP Server: `context7` via HTTP transport
- Endpoint: `https://mcp.context7.com/mcp`
- Scope: User-level (global, available to all projects)

**Purpose:**
- Validate current documentation about software libraries
- Access up-to-date API references and examples
- Reduce reliance on potentially outdated training data

**CLAUDE.md Updated:**
- Added documentation validation rule: "Use Context7 MCP to validate current documentation about software libraries"

---

## WCAG 2.1 AA Accessibility Improvements - December 8, 2025

**Status**: COMPLETE

**Overview**:
Comprehensive design audit identified and resolved accessibility issues affecting color contrast, focus indicators, and motion preferences.

**Color Contrast Fixes (WCAG 1.4.3):**
- Changed `text-gray-500` to `text-gray-400` across terminal UI for better contrast on black backgrounds
- Affected files: `command-prompt.tsx` (placeholder, instructions), `cv-content.tsx` (index numbers), `data-grid-section.tsx` (index numbers)

**Focus Indicator Improvements (WCAG 2.4.7):**
- Added visible focus ring to terminal input: `focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black`
- Added matching focus styles to email link in contact section
- Keyboard users can now see which element is focused

**Reduced Motion Support (WCAG 2.3.3):**
- Added `@media (prefers-reduced-motion: reduce)` block in `globals.css` to disable `animate-fadeIn` and `animate-logo-pulse`
- Updated `matrix-background.tsx` to skip animation entirely when user prefers reduced motion
- Respects system-level accessibility preferences

**Unused Code Removal:**
- Removed 3 unused figmoo scroll animations from `globals.css`:
  - `@keyframes figmoo-scroll-up` and `@keyframes figmoo-scroll-down`
  - `.animate-figmoo-scroll-up`, `.animate-figmoo-scroll-down`, `.animate-figmoo-scroll-up-slow`
- Zero references found in codebase; confirmed safe to remove

**Quality Gates Passed:**
- Biome: 42 files checked, no issues
- Tests: 96 tests, 297 assertions
