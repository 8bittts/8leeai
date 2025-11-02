# Release Notes

Comprehensive changelog for the 8lee.ai terminal portfolio project, organized in reverse chronological order.

---

## IMPORTANT - DO NOT MODIFY THIS FILE

**This file is manually curated by the project maintainer and should NEVER be modified unless explicitly requested.**

If you are asked to update this file, follow these rules:
- Use **date-based organization only** (e.g., "## October 12, 2025")
- **No timestamps** - all entries for a given day go under the same date heading
- Multiple updates on the same day are added as additional `###` entries under that date
- Format: `### Feature/update title` (no timestamps like "14:30 PST")
- Entries within a date are ordered most recent first (new entries added at top of date section)

---

## November 1, 2025

### Completed all improvement opportunities from opps.md

**Closed out opps.md tracking document - all planned improvements completed:**

**Summary:**
- Completed all low-effort improvements from improvement opportunities list
- Deleted opps.md file after finishing final items
- Two improvements completed today, both focused on polish and UX

**Completed Improvements:**
1. **Smooth scroll padding** (5 min) - Mobile pagination UX enhancement
2. **Desktop ASCII logo glow** (5 min) - Branding visibility improvement

**Status:**
- All high-impact, low-effort items: Completed
- All low-impact, low-effort items: Completed
- Medium-effort items: Removed from scope (loading indicators)
- Priority matrix: Empty

**Impact:**
- Portfolio now has all planned quick-win improvements
- Focus can shift to new features or maintenance
- Clean slate for future enhancement tracking

---

### Mobile UX and branding polish

**Enhanced mobile experience and desktop branding with two subtle improvements:**

**Feature Overview:**
- Improved mobile auto-scroll behavior when paginating through projects
- Added slow pulsing animation to desktop ASCII logo for better visibility
- Both changes maintain terminal aesthetic while improving usability

**Implementation:**

1. **Smooth Scroll Padding (Mobile UX):**
   - Changed `scrollIntoView` behavior from `block: "end"` to `block: "center"`
   - Prevents last project from being cut off at screen edge on mobile
   - Provides better reading experience with content centered in viewport
   - File: `components/cv-content.tsx:35`

2. **Desktop ASCII Logo Pulse Animation (Branding):**
   - Created custom `logoPulse` keyframe animation with 4-second cycle
   - Pulses between 100% → 50% → 100% opacity for subtle visibility
   - Uses cubic-bezier easing matching Tailwind's default pulse
   - Slower than cursor (4s vs 2s) for more relaxed, ambient effect
   - Desktop-only enhancement (logo hidden on mobile)
   - Files: `app/globals.css`, `components/terminal-container.tsx:98`

**User Experience:**
- Mobile: Last project in pagination no longer gets cut off at screen bottom
- Desktop: ASCII "8" logo in top-right corner gently pulses to draw attention
- Both improvements are subtle and don't break terminal authenticity
- Animation feels organic and non-intrusive

**Impact:**
- Better mobile UX when loading more projects
- Improved desktop branding visibility through motion
- Zero risk - purely visual enhancements
- CSS-based animation (no JS overhead)
- Total implementation time: ~15 minutes

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues
- TypeScript strict mode: Zero errors

**Files Changed:** 3 files (components/cv-content.tsx, components/terminal-container.tsx, app/globals.css)

---

### Command alias improvements in status messages

**Enhanced status message clarity by showing full command names instead of aliases:**

**Feature Overview:**
- When users type command aliases like `li`, `ed`, or `vol`, status messages now show full names
- Example: Typing `li` shows "Opening LinkedIn in new tab" instead of "Opening li in new tab"
- Improves clarity and professionalism of user feedback
- Applies to all command aliases across the terminal

**Implementation:**
- Created `COMMAND_ALIASES` constant in `lib/utils.ts` mapping all aliases to full names
- Updated `handleSectionCommand()` to use alias lookup for Education/Volunteer
- Updated `handleExternalLinkCommand()` to use alias lookup for external links
- Fallback to original command if alias not found (defensive programming)

**Alias Mappings:**
- `li` / `linkedin` → "LinkedIn"
- `ed` / `education` → "Education"
- `vol` / `volunteer` → "Volunteer"
- `x` / `twitter` → "X/Twitter"
- `github` → "GitHub"
- `wellfound` → "Wellfound"
- `deathnote` → "DeathNote"
- `random` → "random project"

**User Experience:**
- More professional and clear feedback messages
- Users immediately understand what command executed
- Reduces confusion especially for new visitors
- Maintains all existing alias functionality

**Impact:**
- Better UX with clearer communication
- More polished terminal experience
- No breaking changes - pure enhancement
- Minimal code addition (15 lines total)

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues
- TypeScript strict mode: Zero errors

**Files Changed:** 2 files (lib/utils.ts, components/command-prompt.tsx)

---

### UX polish - animations, hover states, and performance improvements

**Added subtle transitions and improved interactivity across the portfolio:**

**Feature Overview:**
- Reduced Matrix background CPU usage from 20fps to 13fps for better mobile battery life
- Enhanced link hover states with background highlight for better affordance
- Added fade-in transitions to project grid and section displays
- Improved visual feedback across all interactive elements

**Implementation:**

1. **Matrix Background Optimization:**
   - Changed `MATRIX_UPDATE_INTERVAL` from 50ms to 75ms in `matrix-background.tsx`
   - Reduces frame rate from 20fps to 13fps
   - Imperceptible visual difference at 8% opacity
   - Significant battery savings on mobile devices

2. **Link Hover Enhancements:**
   - Updated `SecureExternalLink` component with `hover:bg-green-500/10`
   - Changed transition from `transition-colors` to `transition-all duration-150`
   - Applied same hover treatment to inline "chat" button in CV content
   - Provides better visual feedback that elements are clickable

3. **Fade-in Transitions:**
   - Created `animate-fadeIn` CSS animation in `globals.css` (300ms ease-in)
   - Applied to project grid section when it appears
   - Applied to Education/Volunteer sections via `DataGridSection` component
   - Matches typewriter aesthetic with smooth content reveals

**User Experience:**
- Mobile users experience better battery life with optimized Matrix animation
- All links and buttons have clear hover feedback with subtle background highlight
- Content sections fade in smoothly instead of appearing instantly
- More polished, professional feel while maintaining terminal authenticity

**Impact:**
- Better mobile performance and battery efficiency
- Improved discoverability of interactive elements (especially on mobile)
- Smoother content transitions matching existing typewriter effects
- Enhanced accessibility with clearer interactive affordances

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues
- TypeScript strict mode: Zero errors

**Files Changed:** 4 files (components/matrix-background.tsx, components/secure-external-link.tsx, components/cv-content.tsx, components/data-grid-section.tsx, app/globals.css)

---

### Random command - discover projects serendipitously

**Added "random" command to open a random project from the portfolio:**

**Feature Overview:**
- New `random` command opens a random project in a new tab
- Only selects from projects with actual URLs (42 projects out of 62 total)
- Filters out projects with empty URL fields
- Easter egg-style discovery feature for exploring portfolio

**Implementation:**
- Added `"random"` to `VALID_COMMANDS` array in `lib/utils.ts`
- Created handler in `command-prompt.tsx` with smart URL filtering:
  - Filters projects array to only include entries with non-empty URLs
  - Randomly selects from filtered array using `Math.random()`
  - Finds original project number (1-62) for proper routing
  - Opens via existing `openProject()` function
- Added to help screen: `• random · Open a random project`
- Status message shows: "Opening random project [number] in new tab"

**User Experience:**
- Type `random` (or `/random`) to open a surprise project
- Great for discovery and exploration of portfolio
- Prevents landing on projects without links (cleaner UX)
- Fun, low-stakes way to browse work

**Impact:**
- Encourages portfolio exploration beyond sequential browsing
- Easter egg feature adds personality to terminal interface
- Zero risk - only opens projects with valid URLs
- Complements existing navigation (numbered access, pagination)

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues
- TypeScript strict mode: Zero errors (added explicit null check for type safety)

**Files Changed:** 2 files (lib/utils.ts, components/command-prompt.tsx)

---

### Keyboard shortcuts for clear (Ctrl+L / Cmd+K)

**Added standard terminal keyboard shortcuts for clearing the screen:**

**Feature Overview:**
- Implemented `Ctrl+L` (Windows/Linux) and `Cmd+K` (macOS) shortcuts to clear terminal
- Shortcuts work even when input is focused, matching real terminal behavior
- Provides familiar muscle-memory experience for terminal users

**Implementation:**
- Added keyboard event listener in `terminal-container.tsx` with `useEffect` hook
- Detects `Ctrl+L` or `Cmd+K` key combinations
- Calls `clearToStart()` to reset terminal state
- Uses `e.preventDefault()` to override default browser behavior
- Only activates after boot sequence completes
- Properly cleans up event listener on component unmount

**User Experience:**
- Power users can quickly clear terminal with familiar keyboard shortcuts
- Works regardless of whether input field is focused
- Matches standard terminal conventions (Ctrl+L for Unix/Linux, Cmd+K for macOS)
- No interference with normal typing or other keyboard shortcuts

**Impact:**
- Professional terminal behavior matching real CLI tools
- Improved workflow efficiency for keyboard-focused users
- Zero friction - shortcuts "just work" as expected
- Enhances authenticity of terminal simulation

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues

**Files Changed:** 1 file (components/terminal-container.tsx)

---

### Help command and streamlined command prompt interface

**Improved command discoverability with cleaner UI:**

**Feature Overview:**
- Added new `help` command that displays all available commands and usage instructions
- Streamlined command prompt interface with concise placeholder and minimal instructions
- Users can now discover all commands without cluttering the interface

**Implementation:**
- Added `"help"` to `VALID_COMMANDS` and `COMMAND_DISPLAY_LIST` in `lib/utils.ts`
- Created help command handler in `command-prompt.tsx` with dedicated Help Section
- Designed compact, space-efficient help display:
  - Single header: "Available Commands"
  - Inline descriptions using middot (·) separator
  - Format: `• command · Description` (e.g., `• email · Eight's email address`)
  - Tighter vertical spacing with `space-y-1`
  - Removed redundant number range instructions
- Updated placeholder text: `Hit "return" for more projects, "help" for all commands`
- Simplified command instructions to: `Commands: email, help, clear`

**User Experience:**
- **Before**: Long placeholder text with all commands listed below prompt (cluttered)
- **After**: Clean interface with `help` command for full command discovery
- Help screen uses compact single-column format with descriptions
- Every command shows inline explanation (e.g., `github · Link to this project`)
- More scannable and space-efficient than previous multi-section layout
- Essential commands still visible below prompt for quick reference

**Impact:**
- Cleaner, less overwhelming interface for new users
- Better command discoverability through dedicated help section
- Reduced visual clutter while maintaining accessibility
- Professional terminal behavior matching standard CLI conventions

**Verification:**
- All 32 tests passed with 97 assertions
- Biome linting passed (removed unused import)

**Files Changed:** 2 files (lib/utils.ts, components/command-prompt.tsx)

---

### Automatic cursor focus after boot sequence

**Enhanced user experience with immediate input readiness:**

**Feature Overview:**
- Command prompt input now automatically focuses after boot sequence completes
- Cursor is ready for user input without requiring manual click or tap
- Eliminates extra interaction step between boot and typing commands

**Implementation:**
- Added `useEffect` hook in `command-prompt.tsx` that runs once on mount
- Automatically calls `inputRef.current?.focus()` when component appears
- Works seamlessly on both desktop and mobile devices
- Maintains existing keyboard suppression behavior on mobile (keyboard hides after Enter)

**User Experience:**
1. Boot sequence completes and displays `$:` prompt
2. Content and command prompt appear
3. Input is immediately focused and ready for typing
4. User can start typing commands without additional click/tap

**Impact:**
- Smoother transition from boot to interactive terminal
- Reduces friction in user interaction flow
- Natural terminal behavior where cursor is always ready
- Preserves all existing mobile keyboard management features

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues
- Focus management works correctly with existing ref API

**Files Changed:** 1 file (components/command-prompt.tsx)

---

### Next.js 16 proxy migration - deprecated middleware replaced

**Migrated from deprecated middleware.ts to new proxy.ts convention for Next.js 16:**

**Migration Steps:**
- Renamed `middleware.ts` → `proxy.ts` (Next.js 16 naming convention)
- Updated function export from `middleware()` → `proxy()` (API requirement)
- Updated all documentation references in CLAUDE.md
- Verified build completes without deprecation warnings

**Why This Matters:**
- Next.js 16 deprecated the "middleware" convention in favor of "proxy"
- New naming clarifies network boundary and runtime behavior
- Prevents confusion with Express.js middleware patterns
- Aligns with Next.js team's recommended architecture
- Eliminates build warning: "middleware file convention is deprecated"

**Technical Details:**
- Same security headers and logic (CSP, CORS, HSTS, XSS, Permissions Policy)
- Same redirect strategy for legacy URLs and semantic 404s
- Function signature unchanged: `proxy(request: NextRequest)`
- Config matcher unchanged: `/:path*`

**Files Changed:** 3 files (middleware.ts → proxy.ts, CLAUDE.md, release-notes.md)

---

### Package monitor auto-cleanup - intelligent .md file management

**Enhanced package monitor script with automatic cleanup of generated plan files:**

**Automatic Cleanup Logic:**
- **Simple/Safe Updates**: Auto-removes `.md` file after routine updates (no manual review needed)
- **Complex Updates** (CAUTION/URGENT): Preserves `.md` file when breaking changes or security updates require review
- **All Up-to-Date**: Cleans up old plan files when all packages are current

**Implementation:**
- `saveActionPlan()` returns `{ filename, keepFile }` with intelligent decision logic
- `cleanupPlanFile()` removes files for simple updates with user-friendly console output
- `cleanupOldPlans()` removes stale plan files when everything is up-to-date
- Conditional cleanup in `checkPackageUpdates()` based on update complexity

**User Experience:**
- Reduces file clutter - only see `.md` files when you need them
- Clear console messages explain cleanup actions
- Breaking changes database still guides CAUTION/URGENT classifications
- Documentation updated in CLAUDE.md and script header

**Files Changed:** 2 files (scripts/package-monitor.js, CLAUDE.md)

---

## October 31, 2025

### Package version verification - all packages at latest stable releases

**Verified all dependencies are running the absolute latest versions:**

**Research conducted via web search to confirm current releases:**
- **Next.js 16.0.0** - Latest stable (released October 21, 2025)
- **React 19.2.0** - Latest stable (released October 1, 2025)
- **TypeScript 5.9.3** - Latest stable (released August 2025)
- **Tailwind CSS 4.1.15** - Latest patch (v4.0 released January 2025)
- **Biome 2.2.7** - Latest v2.x release
- **Bun 1.3.1** - Latest stable (released October 2025)

**Verification:**
- Package monitor confirmed: "All packages are up to date!"
- All major packages running cutting-edge stable releases
- No available updates or security patches needed

**Impact:**
- Project dependencies fully current with ecosystem
- Benefits from latest performance improvements and features
- No breaking changes or migrations required
- Ready for production deployment with latest stable tooling

**Files Changed:** 1 file (release-notes.md)

---

## October 30, 2025

### Added two new projects to portfolio

**Portfolio expansion with mobile and enterprise projects:**

- Added **Shibuyaaa** • Mobile Music Creation App as newest project (#1)
- Added **Influur** • Enterprise Marketing AI Platform after Valkyrie AI (#4)
- Total projects increased from 60 to 62

**Data Updates:**
- `lib/data.ts`: Added 2 new project entries with proper formatting
- Project order: Shibuyaaa (newest), Cascading AI, Valkyrie AI, Influur, dotEARTH...

**Documentation Updates:**
- Updated DATA_OFFSETS in `lib/utils.ts`:
  - Projects: 1-62 (was 1-60)
  - Education: 63-67 (was 61-65)
  - Volunteer: 68-73 (was 66-71)
- Updated `CLAUDE.md` with new project counts and number ranges
- Updated `README.md` in 3 locations:
  - Features section: "62+ projects" (was "60+ projects")
  - Available Commands: "1-62", "63-67", "68-73"
  - Project Structure: "62 projects"
- Updated test comments in `lib/utils.test.ts` to reflect new max project number

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues
- DATA_OFFSETS ranges remain non-overlapping (critical business rule)

**Files Changed:** 5 files (lib/data.ts, lib/utils.ts, CLAUDE.md, README.md, lib/utils.test.ts, release-notes.md)

---

## October 22, 2025

### Package dependency updates (Next.js 16.0.0, Biome 2.2.7, Tailwind v4.1.15, Bun 1.3.1)

**Updated dependencies to latest versions:**

**Dependencies:**
- `next`: 15.5.6 → 16.0.0 (major version upgrade)

**Dev Dependencies:**
- `@biomejs/biome`: ^2.2.6 → ^2.2.7
- `@tailwindcss/postcss`: ^4.1.14 → ^4.1.15
- `@types/node`: ^24.8.1 → ^24.9.1
- `happy-dom`: 20.0.5 → 20.0.8
- `tailwindcss`: ^4.1.14 → ^4.1.15

**Package Manager:**
- Bun: 1.3.0 → 1.3.1 (updated in package.json)

**Biome Configuration:**
- Updated `biome.json` schema to 2.2.7

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues
- Production build successful
- No breaking changes detected (Next.js 16.0.0 is backward compatible)

**Documentation Updates:**
- Updated version references in README.md where applicable
- Added release notes entry

**Files Changed:** 4 files (package.json, bun.lock, biome.json, release-notes.md)

---

## October 21, 2025

### Removed Ghostty terminal configuration

**Removed terminal-specific configuration file:**

- Deleted `ghostty.md` file from repository
- Removed all references to Ghostty from documentation
- Updated CLAUDE.md file structure section (removed ghostty.md line)
- Updated CLAUDE.md to remove Terminal Setup section
- Updated README.md to remove Recommended Terminal section
- Updated README.md file structure section (removed ghostty.md line)

**Rationale:**
- Terminal configuration is user-specific and not project-specific
- Reduces repository scope to focus on application code only
- Users can configure their own terminal preferences independently

**Files Changed:** 3 files (ghostty.md deleted, CLAUDE.md, README.md)

---

### Documentation update - Bun version sync

**Updated CLAUDE.md to reflect current Bun version:**

- Updated Bun version references from 1.2.23 to 1.3.0 in CLAUDE.md
- Synced documentation with package.json packageManager field
- Two locations updated:
  - "CRITICAL: This Project Uses Bun" section (line 7)
  - "Tech Stack" section (line 59)

**Verification:**
- README.md already current with Bun 1.3.0 references
- All documentation now consistent across files

**Files Changed:** 1 file (CLAUDE.md)

---

## October 18, 2025

### Added twitter command alias

**Enhanced Twitter command with additional alias:**
- Added `twitter` as an alias command alongside `x` (both open https://twitter.com/8bit)
- Supports all variations: `x`, `/x`, `twitter`, `/twitter`
- Only "x" displayed in command list to maintain clean UI
- Both commands route to identical Twitter URL

**Technical Implementation:**
- Updated `VALID_COMMANDS` array in lib/utils.ts to include "twitter"
- Added `twitter: "https://twitter.com/8bit"` to links object in command-prompt.tsx
- Maintains backward compatibility with existing "x" command

**Files Changed:**
- `lib/utils.ts` - Added "twitter" to VALID_COMMANDS array
- `components/command-prompt.tsx` - Added twitter link to handleExternalLinkCommand

---

### Added X/Twitter command

**New terminal command for social media:**
- Added `x` command to open Twitter profile at https://twitter.com/8bit
- Command integrated into all validation arrays (VALID_COMMANDS, COMMAND_DISPLAY_LIST)
- Updated documentation in README.md and CLAUDE.md
- Links object in command-prompt.tsx updated with Twitter URL

**Files Changed:**
- `lib/utils.ts` - Added "x" to VALID_COMMANDS and COMMAND_DISPLAY_LIST
- `components/command-prompt.tsx` - Added x: "https://twitter.com/8bit" to links object
- `CLAUDE.md` - Updated command list documentation
- `README.md` - Added "x" command to Available Commands section

### Enhanced ultra-private mode documentation

**Comprehensive documentation of triple-layer anti-crawling protection:**

**README.md Updates:**
- Added detailed breakdown of triple-layer protection (robots.txt, HTTP headers, HTML metadata)
- Listed all 17+ blocked crawlers (search engines, social media, SEO tools)
- Explained what ultra-private mode prevents (search indexing, archiving, snippets)
- Clarified what still works (social media previews when manually shared, direct access)
- Enhanced Security section with organized subsections

**Documentation Structure:**
1. **Opening Section (Lines 5-38):**
   - Layer 1: robots.txt details with specific crawlers blocked
   - Layer 2: HTTP Headers (X-Robots-Tag, HSTS, CSP, frame protection)
   - Layer 3: HTML Metadata (robots configuration, googleBot settings)
   - "What This Means" section with clear expectations

2. **Security Section (Lines 283-301):**
   - Triple-Layer Anti-Crawling Protection subsection
   - Additional Security Headers subsection with specific details
   - Clear result statement about site visibility

**SEO Configuration Audit:**
- robots.txt: Blocks all crawlers with Disallow: / and 24-hour crawl delay
- middleware.ts: X-Robots-Tag with comprehensive noindex directives
- app/layout.tsx: robots metadata set to index: false, follow: false
- No sitemap.xml or sitemap configuration
- Result: TRIPLE-LAYER PROTECTION fully operational

**Verification:**
- All 31 files passed Biome linting
- Documentation now clearly communicates ultra-private mode to template users

**Files Changed:** 1 file (README.md)

---

### Intelligent package update monitoring system

**Added Package Monitor Agent - sophisticated dependency analysis tool:**

**Feature Overview:**
- Intelligent package update monitoring with breaking change detection
- Adapted from DeathNote project and tailored for 8leeai tech stack (Next.js 15.x, React 19.x, Tailwind v4.x, Biome 2.x)
- Analyzes impact and effort required for each update
- Categorizes updates by priority (critical, high, medium, low)
- Generates actionable update plans with step-by-step instructions

**Implementation Details:**

1. **Package Monitor Script (scripts/package-monitor.js):**
   - Uses Bun native commands instead of npm
   - Breaking changes database for Next.js, React, TypeScript, Tailwind, Biome
   - Color-coded CLI output with priority indicators ([URGENT], [CAUTION], [SAFE])
   - Security update detection
   - Generates markdown action plans with testing checklist

2. **Three Operating Modes:**
   - `bun run packages` - Check all package updates with analysis
   - `bun run packages:watch` - Continuous monitoring (checks every 6 hours)
   - `bun run packages:critical` - Only show critical/security updates

3. **Smart Features:**
   - Priority scoring based on package importance
   - Breaking change warnings before you update
   - Batch update commands for safe packages
   - Impact assessment (high/medium/low)
   - Effort estimation for migration work
   - Automatic action plan generation saved as markdown

**Usage Examples:**

```bash
# Check for updates with intelligent analysis
bun run packages

# Monitor continuously (6-hour intervals)
bun run packages:watch

# Only show critical/security updates
bun run packages:critical
```

**Benefits:**
- Prevents breaking change surprises
- Prioritizes security updates automatically
- Saves time with batch update commands
- Documents breaking changes before you encounter them
- Generates testing checklists for verification

**Code Quality:**
- Zero emojis (uses text labels: [MONITOR], [URGENT], [CAUTION], [SAFE], [BREAKING], [SECURITY])
- Passes all 100+ Biome error-level rules (removed unnecessary async, replaced forEach with for...of loops)
- Reduced function complexity by extracting helper methods (formatUrgentUpdates, formatCautionUpdates, formatSafeUpdates)
- Full TypeScript strict mode compliance

**Verification:**
- Script tested successfully on current package.json
- All 32 tests passed with 99 assertions
- Production build successful (3.0s compile)

**Files Changed:** 4 files (scripts/package-monitor.js, package.json, README.md, release-notes.md)

---

### Package dependency update (Bun 1.3.0)

**Updated Bun to latest minor version:**

- `bun`: 1.2.23 → 1.3.0 (minor, backwards-compatible update)

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues
- No breaking changes in minor update

**Documentation Updates:**
- Updated version references in README.md (lines 23, 54, 71, 160)
- Updated packageManager field in package.json

**Files Changed:** 3 files (package.json, README.md, release-notes.md)

---

## October 17, 2025

### Package dependency updates (Next.js 15.5.6, type definitions, test DOM)

**Updated dependencies to latest patch versions:**

- `next`: 15.5.5 → 15.5.6 (patch update)
- `@types/node`: 24.8.0 → 24.8.1 (patch update for TypeScript Node.js type definitions)
- `happy-dom`: 20.0.2 → 20.0.5 (patch update for test DOM environment)

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues
- No breaking changes in patch updates

**Documentation Updates:**
- Updated version references in CLAUDE.md (line 45)
- Updated version references in README.md (lines 19, 133, 162, 171)

**Files Changed:** 5 files (package.json, bun.lock, CLAUDE.md, README.md, release-notes.md)

---

## October 16, 2025

### Dependency maintenance - type definitions and test DOM

**Kept development dependencies current to maintain editor hints and test parity:**

- `@types/node`: 24.7.2 → 24.8.0
- `happy-dom`: 20.0.1 → 20.0.2

**Verification:**
- `bun run check` (Biome) ✓
- `bun test` ✓

**Files Changed:** 2 files (package.json, bun.lock)


### Audio timing and typewriter speed improvements

**Enhanced user experience with improved audio trigger and faster text animations:**

**Audio Trigger Refinement:**
- Audio now plays exclusively on boot-to-content transition (when user clicks/presses key on boot prompt)
- Removed audio trigger from command input focus handler
- Simplified audio flow: single trigger point at exact moment user transitions from boot screen
- File: components/terminal-container.tsx

**Typewriter Speed Increase:**
- Changed typewriter delay from 15ms to 5ms (3x faster)
- Applies to both boot sequence and CV content typewriter effects
- More responsive feel while maintaining authentic terminal aesthetic
- File: lib/utils.ts (ANIMATION_DELAYS.typewriter: 15 → 5)

**Boot Sequence Content Updates:**
- MS-DOS version now displays dynamic age instead of static "v3.08"
- Shows actual age value (e.g., "MS-DOS v43.45") calculated from birthdate
- Removed "Writing to" line entirely for cleaner boot sequence
- Boot sequence now shows: MS-DOS version, copyright, tagline, booting message
- Files: components/boot-sequence.tsx

**Impact:**
- More intuitive audio trigger tied to user's explicit transition action
- Faster content reveal improves perceived performance
- Dynamic version display adds personalization and authenticity
- Cleaner boot sequence with fewer lines

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues

**Files Changed:** 3 files (components/terminal-container.tsx, components/command-prompt.tsx, components/boot-sequence.tsx, lib/utils.ts)

---

### Boot sequence interactive pause

**Added user interaction requirement before terminal proceeds:**

- Boot sequence now pauses after completing all boot text
- Displays `$:` prompt with blinking cursor and waits for user action
- Any click or key press continues to main terminal interface
- Simple implementation using single `waitingForInteraction` state variable
- Event listeners for `click` and `keydown` trigger continuation
- Provides clear visual feedback that boot is complete and ready for interaction

**Implementation Details:**
- Added `waitingForInteraction` state to track pause status
- Modified `handleLineComplete` callback to pause instead of immediately calling `onComplete()`
- Added `useEffect` hook with window-level event listeners (15 lines of code)
- Automatically cleans up event listeners when user interacts

**User Experience:**
- Boot sequence types out all messages
- Pauses with visible blinking cursor at `$:` prompt
- User clearly sees system is ready
- Any interaction (click anywhere or press any key) proceeds
- Natural "press any key to continue" terminal behavior

**Files Changed:** 1 file (components/boot-sequence.tsx)

---

### Package dependency update (happy-dom 20.0.1)

**Updated test environment dependency to latest patch version:**
- `happy-dom`: 20.0.0 → 20.0.1 (patch update for test DOM environment)

**Verification:**
- All 32 tests passed with 99 assertions
- Biome linting passed with no issues
- No breaking changes in patch update

**Files Changed:** 2 files (package.json, bun.lock)

---

## October 14, 2025

### Biome configuration cleanup

**Enhanced Biome configuration for cleaner validation output:**

- Updated `biome.json` to set `ignoreUnknown: true` for files configuration
- Suppresses verbose warnings about unknown file extensions (images, markdown, PDFs, etc.)
- Maintains aggressive error-level linting for all code files
- Cleaner CI/verbose output while preserving all 100+ error-level rules

**Validation:**
- Tests: 32 pass, 99 assertions ✓
- TypeScript strict mode: Zero errors ✓
- Biome CI mode: 30 files checked, no issues ✓
- Production build: Successful ✓

**Files Changed:** 1 file (biome.json)

---

### LinkedIn command addition

**Added LinkedIn profile link with command aliases:**

- Added `linkedin` and `li` commands to open https://www.linkedin.com/in/8lee/
- Both commands (and slash variants `/linkedin`, `/li`) open LinkedIn profile in new tab
- Updated VALID_COMMANDS array in lib/utils.ts to include new aliases
- Added to COMMAND_DISPLAY_LIST as "linkedin (li)" for consistent grouping pattern
- Enhanced handleExternalLinkCommand in command-prompt.tsx with LinkedIn links

**Documentation Updates:**
- Updated README.md Available Commands section with LinkedIn entry
- Enhanced README.md Features section to mention `li` alias alongside `ed` and `vol`
- Updated README.md Mobile-First UX feature with recent improvements (2px cursor, immediate content)
- Removed code reduction percentage mentions from README.md
- Updated CLAUDE.md Component Flow section to include linkedin command

**Files Changed:** 4 files (lib/utils.ts, components/command-prompt.tsx, README.md, CLAUDE.md)

---

### Mobile UX overhaul - natural browser behavior and simplified interactions

**Comprehensive mobile experience improvements prioritizing default browser behavior over custom solutions:**

**Cursor Visibility Enhancement:**
- Increased cursor width from 1px to 2px on mobile devices (`w-0.5 sm:w-px`)
- Desktop maintains thin 1px cursor for authentic terminal aesthetic
- Mobile users can now clearly see blinking cursor on retina displays
- File: components/cursor.tsx

**Removed Click-to-Reveal Interaction:**
- Eliminated post-boot "click anywhere to continue" requirement
- Content and command prompt appear immediately after boot sequence completes
- Removed `showContent` state variable entirely
- Removed document-wide click/keydown event listeners
- Removed container-wide `onClick`, `onKeyDown`, `tabIndex`, and `role` attributes
- Audio still plays on first input focus (respects browser autoplay policies)
- File: components/terminal-container.tsx

**Natural Focus Behavior:**
- Removed aggressive auto-focus on component mount
- Input focuses naturally when user explicitly taps it
- Eliminated frustrating "keyboard keeps appearing" loop
- Users can read content without keyboard covering 40% of screen
- Added `onFirstInteraction` callback for audio playback trigger
- File: components/command-prompt.tsx

**Simplified Virtual Keyboard Suppression (73% code reduction):**
- Reduced hook from 116 lines to 32 lines
- Mobile: Simple `blur()` call to hide keyboard after Enter key
- Desktop: No-op, maintains focus for continuous typing
- Removed complex readonly/inputmode attribute manipulation
- Removed double `requestAnimationFrame` nesting
- Removed pointerdown/keydown event listener juggling
- User taps input naturally when ready to type again
- File: hooks/use-virtual-keyboard-suppression.ts

**Updated Test Suite:**
- Refactored 3 tests to verify blur behavior instead of readonly attributes
- Added desktop focus retention test
- Updated intent-focused comments to match new behavior
- All 32 tests passing with 99 assertions
- File: hooks/use-virtual-keyboard-suppression.test.tsx

**Impact:**
- **Before:** Invisible cursor, click-to-reveal confusion, aggressive auto-focus, keyboard covering content
- **After:** Visible cursor, immediate content display, user-controlled focus, natural keyboard behavior
- **Code Quality:** 84 lines removed, simpler architecture, fewer edge cases
- **User Experience:** Terminal behaves like standard web form on mobile while maintaining terminal aesthetic on desktop
- **Accessibility:** Natural focus management, no focus trapping, respects user intent

**Verification:**
- Tests: 32 pass, 99 assertions (874ms)
- Biome: 30 files checked, 0 issues
- Production build: Successful (2.6s compile)

**Files Changed:** 5 files (components/cursor.tsx, components/terminal-container.tsx, components/command-prompt.tsx, hooks/use-virtual-keyboard-suppression.ts, hooks/use-virtual-keyboard-suppression.test.tsx)

---

### Documentation cleanup - removed all emojis

**Removed all emoji characters from documentation files:**
- Removed warning emoji from CLAUDE.md section headers
- Removed warning emoji from README.md important notices
- Removed warning emoji from release-notes.md header
- Maintains clear documentation without Unicode dependency
- Improves compatibility with text editors and terminal viewers

**Files Changed:** 3 files (CLAUDE.md, README.md, release-notes.md)

---

### Comprehensive documentation review and Bun emphasis

**Enhanced all documentation to clearly emphasize Bun as exclusive package manager:**

**CLAUDE.md Updates:**
- Added critical "CRITICAL: This Project Uses Bun" section at top with explicit warnings
- Bullet points emphasizing NEVER use npm/yarn/pnpm, ALWAYS use bun
- Listed all Bun-specific features: packageManager field, bunx usage, native test runner
- Updated Development Notes with "BUN ONLY" reminder
- Updated test coverage statistics (32 tests, 99 assertions)

**README.md Updates:**
- Prerequisites section: "This project uses Bun exclusively as its package manager and runtime"
- Added "Required: Bun v1.2.23 or higher" with "Do NOT use: npm, yarn, or pnpm"
- Installation section: Emphasized "Install dependencies with Bun" and "Run development server with Bun"
- Added note about packageManager enforcement in package.json
- Development section: "IMPORTANT: All development commands use Bun exclusively"
- Available Commands section: Renamed to "Available Commands (Bun Only)" with detailed annotations
- Tech Stack: Bun listed first as "Package Manager & Runtime - Exclusively used for all operations"
- Updated test runner description to emphasize Bun native test runner (not Jest/Vitest)

**Comprehensive Package & Configuration Review:**
- Verified all 16 dependencies at latest stable versions
- Reviewed middleware.ts security implementation (14 allowed origins, comprehensive CSP, CORS, HSTS)
- Reviewed 3 app routes (page.tsx, layout.tsx, not-found.tsx)
- Verified all 10 package.json scripts use bun or bunx exclusively
- Reviewed configuration files: next.config.ts, tsconfig.json, biome.json, bunfig.toml, postcss.config.mjs

**Impact:**
- Crystal-clear communication that this is a Bun-only project
- New contributors immediately understand package manager requirements
- Eliminates confusion about npm/yarn/pnpm compatibility
- Documentation now serves as authoritative Bun usage guide

**Files Changed:** 2 files (CLAUDE.md, README.md)

---

### Aggressive linting and type checking enhancements

**Enhanced TypeScript and Biome configurations for maximum code quality:**

**TypeScript Configuration (4 new ultra-strict flags):**
- Added `noUnusedLocals: true` - Catches unused local variables
- Added `noUnusedParameters: true` - Catches unused function parameters
- Added `exactOptionalPropertyTypes: true` - Stricter optional property handling
- Added `noPropertyAccessFromIndexSignature: true` - Requires bracket notation for index signatures

**Type Safety Fix:**
- Updated `SecureExternalLink` interface to explicitly allow `string | undefined` for linkWord prop
- Resolved incompatibility with exactOptionalPropertyTypes strict mode
- File: components/secure-external-link.tsx

**Biome Configuration (3 new nursery rules):**
- Added `noUnnecessaryConditions: error` - Detects redundant conditionals
- Added `noShadow: error` - Prevents variable shadowing
- Added `noSecrets: off` - Disabled due to false positives on test descriptions and URLs

**Variable Shadowing Fix:**
- Fixed component/command-prompt.tsx function name shadowing
- Renamed inner function from CommandPrompt to CommandPromptComponent
- Eliminates shadowing while maintaining React forwardRef pattern

**Package.json Scripts Update:**
- Changed all Biome scripts to use `bunx biome` instead of global `biome` command
- Ensures consistent version (2.2.6) across all environments
- Prevents version mismatch between global and local installations

**Code Quality Metrics:**
- 107+ total Biome error-level rules active (100+ base + 7 nursery)
- TypeScript strict mode with 9 total strictness flags
- Zero warnings, zero errors across entire codebase
- Maximum possible strictness with current tooling

**Validation:**
- Biome: 30 files checked, 0 issues
- TypeScript: 0 errors with ultra-strict configuration
- Tests: 32 pass, 99 assertions (874ms)
- Production build: Successful (2.7s compile, bundle sizes maintained)

**Files Changed:** 4 files (tsconfig.json, biome.json, package.json, components/secure-external-link.tsx, components/command-prompt.tsx)

---

### Test suite optimization and code comment cleanup

**Comprehensive review and cleanup of test suite and code comments for open source contributors:**

**Test Suite Refactoring (27% reduction):**
- Removed 12 superficial/useless tests that provided no real value
- Eliminated tests that checked TypeScript types, obvious behavior, or implementation details
- Improved tests to focus on user intent and observable behavior over implementation
- Enhanced security test for `openExternalLink` to actually verify `opener` is nullified

**Tests Removed:**
1. **cursor.test.tsx (2)** - CSS class verification tests (`bg-green-500`, `w-px`, `animate-pulse`)
2. **use-virtual-keyboard-suppression.test.tsx (2)** - Function existence check, empty unmount test
3. **utils.test.ts (8)** - Constant array content tests, redundant coverage

**Tests Improved:**
- `openExternalLink` - Now verifies actual security property (opener = null) instead of just no-throw
- `renderTextWithUnderlinedWord` - Streamlined to 3 essential tests vs 4 with redundant coverage
- All tests now have clear intent-focused comments explaining business value

**Code Comment Cleanup (9 comments removed):**
- Removed redundant comments that stated the obvious (e.g., "Initialize audio once", "Continue animation loop")
- Made complex comments more concise while preserving meaning
- Kept all high-value comments: JSDoc, security explanations, browser compatibility notes, business logic
- Applied principle: Remove "what" comments, keep "why" comments

**Results:**
- Before: 44 tests, 132 assertions
- After: 32 tests, 99 assertions (27% fewer tests, 25% fewer assertions)
- All tests passing with zero linting errors
- Cleaner codebase with useful comments for open source contributors

**Impact:**
- **Test Quality:** Every remaining test documents real user intent and business logic
- **Maintainability:** Tests resilient to refactoring, focused on observable behavior
- **Code Clarity:** Comments explain non-obvious decisions without stating the obvious
- **Open Source Ready:** New contributors can understand WHY through concise, meaningful comments

**Files Changed:** 6 files (4 test files, 6 component/hook files for comment cleanup)

---

### Comprehensive codebase refactoring and type safety improvements

**Major refactoring initiative to eliminate duplication and improve code quality:**

**Feature Overview:**
- Completed 15-task refactoring plan addressing critical issues, high-priority duplications, and low-priority optimizations
- Eliminated ~160 lines of duplicate code through component extraction
- Enhanced TypeScript type safety with aggressive lint rule compliance
- Zero test failures, zero linting errors, production build verified

**Implementation Details:**

1. **Critical Fixes (Tasks 1-2):**
   - Fixed cache header conflict between vercel.json and next.config.ts
   - Removed unused function parameters (resetProjects, showMoreProjects) and related code

2. **High Priority Refactoring (Tasks 3-5):**
   - Created `SecureExternalLink` component (~40 lines saved)
   - Created `DataGridSection` component for Education/Volunteer sections (~60 lines saved)
   - Refactored boot sequence to array-driven approach (~30 lines saved, simplified from 5 state variables to 1)

3. **Medium Priority Improvements (Tasks 6-9):**
   - Simplified CSS import chain (merged globals.css and tailwind.css)
   - Extracted PROJECTS_PER_PAGE constant (fixed magic number `10`)
   - Added formatIndexWithOffset helper function for cleaner DATA_OFFSETS math
   - Optimized audio with useRef (prevents recreating Audio instances on each interaction)

4. **Low Priority Optimizations (Tasks 10-12):**
   - Extracted Matrix background magic numbers to named constants (MATRIX_FONT_SIZE, MATRIX_UPDATE_INTERVAL, MATRIX_DROP_RESET_PROBABILITY)
   - Removed custom generateBuildId strategy (allows Next.js default caching)
   - Verified type standardization (already using `interface` consistently)

5. **Type Safety Enhancements:**
   - Improved array access safety in command-prompt.tsx (extract item before access)
   - Enhanced Record type safety with proper type guards and `as const`
   - Improved isValidCommand type guard implementation (safer type assertion)
   - Zero unsafe array accesses, zero `any` types, zero non-null assertions

**New Components Created:**
- `components/secure-external-link.tsx` - Reusable secure link with window.opener protection
- `components/data-grid-section.tsx` - Reusable grid layout for Education/Volunteer data

**Files Deleted:**
- `app/tailwind.css` - Consolidated into globals.css

**Code Quality Metrics:**
- Lines of code: 2,572 → 2,571 (stable despite adding 2 new components)
- Component duplication: 3 locations → 1 reusable component
- Link rendering duplication: 3 locations → 1 SecureExternalLink component
- Boot sequence complexity: ~150 lines → ~130 lines (array-driven)
- Magic numbers: 5 hardcoded → 5 named constants

**Verification:**
- All 44 tests passed with 132 assertions
- Zero Biome linting errors (30 files checked)
- TypeScript strict mode compilation: zero errors
- Production build successful (compiled in 2.6s)
- Bundle size maintained: 8.58 kB main route, 34.9 kB middleware

**Impact:**
- **Maintainability:** Significantly improved through DRY principles and component extraction
- **Type Safety:** Elite-level TypeScript safety with strict null checks and proper type guards
- **Performance:** Audio optimization prevents memory leaks, Matrix background uses constants
- **Developer Experience:** Clearer code organization, reusable components, no magic numbers
- **Zero Regressions:** All existing functionality preserved with full test coverage

**Files Changed:** 15 files modified, 2 new components created, 1 file deleted (~180 lines net change)

---

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

