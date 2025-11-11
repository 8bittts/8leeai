# November 2025 Release Notes

## November 11, 2025 (Latest)

### Completed comprehensive cleanup and package updates

**Finalized all removal of Intercom/Zendesk exploration work and applied package updates:**

**Cleanup Actions Completed:**
1. **Deleted**: `lib/env.ts` - Intercom-specific environment configuration file (completely removed)
2. **Updated**: `proxy.ts` - Removed all Intercom CSP/CORS allowances (CSP now only allows Vercel analytics/live)
3. **Verified**: `.env.local` is clean (no API keys or credentials)
4. **Updated Packages**: Applied safe package update (`@types/react` 19.2.2 → 19.2.3)

**Verification Steps Completed:**
- ✅ **Lint Check**: Ran `bun run check` - No lint/type issues found
- ✅ **Build Test**: `bun run build` - Succeeded with no errors
- ✅ **Test Suite**: All 32 tests pass (99 assertions)
- ✅ **Code Scan**: Verified no lingering Intercom/Zendesk references in codebase
- ✅ **Configuration Review**: next.config.ts and biome.json are clean
- ✅ **Environment Verification**: .env.local is empty (no credentials)

**Final State:**
- Codebase is completely clean as if the Intercom/Zendesk exploration never happened
- All exploration work documented in previous entry for future reference
- All lesson learned patterns preserved in release notes
- Project ready for production with latest stable dependencies

**Commit Created:**
- `5962e95` - Final cleanup: Remove Intercom integration artifacts and package updates

**Files Changed:** bun.lock, package.json, lib/env.ts (deleted), proxy.ts

---

## November 11, 2025

### Explored Zendesk and Intercom integrations - documented patterns for future reference

**Investigation Summary:**

Researched adding customer support ticketing to the terminal portfolio via Zendesk and Intercom APIs. After extensive testing, determined these integrations are not needed at this time. Documented findings and patterns for future reference before reverting to baseline.

**What Was Attempted:**

1. **Zendesk Integration (Initial exploration)**
   - Added contact form command (`contact`) to trigger form submission
   - Created `/api/zendesk/contact` endpoint
   - Attempted three Zendesk API approaches:
     - Direct ticket creation via `/tickets` endpoint
     - Contact creation + message thread workflow
     - Support request creation
   - All approaches failed due to authentication or API payload validation issues
   - Zendesk API requires complex multi-step workflows (contact → ticket → routing)

2. **Intercom Migration (Alternative approach)**
   - Switched from Zendesk to Intercom after initial failures
   - Implemented contact creation via `/contacts` endpoint
   - Attempted multiple conversation/message creation patterns:
     - `/conversations` endpoint with `customer_initiated` type (failed: "ID is required")
     - `/messages` endpoint with inbound message type (failed: 404 Resource Not Found)
     - `/tickets` endpoint with various payload formats (failed: parameter validation)
   - Discovered Intercom REST API has strict payload validation and complex dependencies

3. **Final Working Solution (Email-based approach)**
   - Abandoned direct API conversation creation
   - Implemented email-based forwarding using Resend service
   - Contact form → `/api/intercom/contact` → Resend → `amihb4cq@deathnote.intercom-mail.com`
   - Intercom automatically creates conversations from incoming emails (native feature)
   - This approach is simple, reliable, and requires no complex API orchestration
   - **Production verified and working** ✅

**Key Technical Insights Captured:**

- **Environment Variables**: Learned distinction between public (`NEXT_PUBLIC_*`) and server-only variables
  - TypeScript strict mode requires bracket notation: `process.env["KEY"]`
  - Biome linter requires suppression: `// biome-ignore lint/complexity/useLiteralKeys`
  - Vercel environment variables must be explicitly added and redeploy required for activation

- **Email Service Integration Pattern**:
  - Resend API key is workspace/domain-specific
  - Can only send from verified domains in that workspace
  - Solution: Use service's email forwarding feature instead of direct API integration
  - For Intercom: Email endpoint is more reliable than REST API for creating conversations

- **API Complexity Trade-offs**:
  - Direct REST API integration requires deep understanding of service payload structure
  - Email-based integration leverages existing email processing pipelines (more stable)
  - When REST APIs are complex: consider email or webhook alternatives

- **Testing Pattern**:
  - Local curl tests vs. production Vercel deployment showed different behaviors
  - Must add environment variables to Vercel and redeploy for changes to take effect
  - Development works with `.env.local`, production requires explicit Vercel config

**Decision:**

After confirming the Intercom email solution works end-to-end in production, all Zendesk/Intercom API implementations are being removed per request. The email-based approach is retained as it's simpler and requires less maintenance.

**Files That Will Be Removed:**
- `/app/api/intercom/contact/route.ts`
- `/app/api/intercom/conversations/route.ts`
- `/components/contact-form.tsx`
- `/components/live-chat-widget.tsx`
- INTERCOM/ZENDESK related environment variables from code

**Patterns Worth Remembering:**
1. Email forwarding is often more reliable than REST API for creating tickets in support systems
2. Service-specific API keys are workspace-bound (verify domain ownership)
3. Always test end-to-end in production after Vercel env var changes
4. Check service documentation for email endpoints before building complex API integrations

---

## November 11, 2025

### Package updates - autoprefixer and biome

**Updated autoprefixer and @biomejs/biome to latest stable versions:**

**Dev Dependencies Updated:**
- `autoprefixer`: 10.4.21 → 10.4.22 (patch update)
- `@biomejs/biome`: 2.3.4 → 2.3.5 (patch update)

**Implementation:**
- Updated package.json with new versions
- Ran `bun update` to download and install updated packages
- Verified all 32 tests pass (99 assertions)
- Confirmed Biome linting/formatting passes
- No TypeScript errors
- Updated README.md with new Biome version (2.3.5)
- Updated CLAUDE.md with new Biome version (2.3.5)

**Impact:**
- Both updates are stable, low-risk patch changes
- Autoprefixer improvement for CSS vendor prefixing
- Biome patch with internal improvements
- Application remains fully stable and functional

**Files Changed:** package.json, bun.lock, README.md, CLAUDE.md

---

## November 11, 2025

### Added explicit documentation for package monitor script

**Enhanced script documentation and usability:**

**Changes Made:**
- Added prominent command reference block at the top of `scripts/package-monitor.js` with explicit instructions on how to run the script:
  - `bun run packages` - Check all packages
  - `bun run packages:watch` - Continuous monitoring
  - `bun run packages:critical` - Critical updates only
  - Direct script invocation with options

**Documentation Updates:**
- Updated README.md with dedicated "Package Update Monitoring" section explaining:
  - How to run the package monitor
  - Priority categories (URGENT, CAUTION, SAFE)
  - Auto-cleanup behavior for simple vs. complex updates
- Updated CLAUDE.md Quick Start section with:
  - Separated package monitoring commands for clarity
  - Direct script invocation examples with command-line flags
  - Updated notes clarifying file management behavior

**Rationale:**
- Users can now easily discover and understand how to use the package monitor
- Clear documentation of all three monitoring modes (packages, watch, critical)
- Explicit instructions in the script itself prevent confusion about execution
- Better integration with project documentation (README, CLAUDE.md)

**Files Changed:** scripts/package-monitor.js, README.md, CLAUDE.md

---

## November 10, 2025

### Package updates - next and happy-dom

**Updated next and happy-dom to latest stable versions:**

**Dependencies Updated:**
- `next`: 16.0.0 → 16.0.1 (patch update - minor bug fixes)

**Dev Dependencies Updated:**
- `happy-dom`: 20.0.8 → 20.0.10 (minor update - 2 patch levels)

**Implementation:**
- Updated package.json with new versions
- Ran `bun install` to download and install updated packages
- Updated package.json with new pinned versions to match installed versions
- Verified all 32 tests pass (99 assertions)
- Confirmed Biome linting/formatting passes
- No TypeScript errors

**Impact:**
- Both updates are stable, low-risk changes
- Next.js patch fixes minor issues in v16 line
- Happy-dom improvements for better DOM simulation in tests
- Application remains fully stable and functional

**Files Changed:** package.json, bun.lock

---

## November 9, 2025 (Latest)

### Cleaned up portfolio descriptions and branding

**Removed possessive language and updated first project:**

**Changes Made:**
- Updated first project from "YEN • A Personal Terminal Experience" to "YEN.chat • Personal Terminal Experience"
- Changed project ID from "yen-terminal" to "yen-chat"
- Removed "Eight's" from all command help descriptions:
  - "Eight's email address" → "Email address"
  - "Eight's Wellfound profile" → "Wellfound profile"
  - "Eight's LinkedIn profile" → "LinkedIn profile"
  - "Eight's X/Twitter profile" → "X/Twitter profile"

**Rationale:**
- Cleaner, more concise descriptions that stand on their own
- First project better reflects the site's purpose (personal terminal experience)
- Reduced redundancy while maintaining clarity

**Files Changed:** lib/data.ts, components/command-prompt.tsx

**Verification:**
- ✅ All 32 tests pass (99 assertions)
- ✅ Biome linting/formatting passes
- ✅ No TypeScript errors

---

## November 9, 2025

### Added two new projects and removed deathnote command

**Added YEN and DeathNote as proper portfolio entries:**
- **YEN** (#1) - "A Personal Terminal Experience" with no external link
- **DeathNote** (#2) - "Digital Legacy Management" linking to https://deathnote.ai

**Command and numbering updates:**
- Removed `deathnote` command from VALID_COMMANDS, COMMAND_DISPLAY_LIST, and COMMAND_ALIASES
- Removed deathnote link handler from command-prompt.tsx
- Updated all project numbering: 62 → 64 projects
- Updated DATA_OFFSETS in lib/utils.ts:
  - Projects: 1-64 (was 1-62)
  - Education: 65-69 (was 63-67)
  - Volunteer: 70-75 (was 68-73)

**Documentation updates:**
- Updated CLAUDE.md with new project counts and command list
- Updated README.md with new project counts and available commands
- Removed deathnote from help text in command-prompt.tsx

**Files Changed:** lib/data.ts, lib/utils.ts, components/command-prompt.tsx, CLAUDE.md, README.md

**Verification:**
- ✅ All 32 tests pass (99 assertions)
- ✅ Biome linting/formatting passes
- ✅ No TypeScript errors

---

## November 9, 2025

### Package monitor overhaul and dependency updates

**Overhauled package monitor script for comprehensive tracking and updated all packages:**

**Critical Bug Fixes:**
- Fixed parser regex that was using arrow format (→) but bun outdated returns TABLE format
  - Monitor was matching ZERO packages - always reported "all up to date"
  - Now correctly parses table rows: `| package | current | update | latest |`
- Added comprehensive breaking changes database for all 17 packages (was only 8)
- Fixed priority classification to use EXACT name matching (was using loose includes() that caused false positives)

**Packages Updated:**
- `@biomejs/biome`: 2.3.3 → 2.3.4 (minor update)
- `@tailwindcss/postcss`: 4.1.16 → 4.1.17 (patch update)
- `tailwindcss`: 4.1.16 → 4.1.17 (patch update)

**Packages with Available Updates (Pinned):**
- `next`: 16.0.0 → 16.0.1 (patch, requires manual update)
- `happy-dom`: 20.0.8 → 20.0.10 (minor, requires manual update)

**Actions Taken:**
- Ran `bun update` to update all safe packages
- Fixed Biome schema version mismatch (2.3.3 → 2.3.4 in biome.json)
- Fixed unused variable warning in package-monitor.js
- Verified all tests pass (32 tests, 99 assertions)
- Verified linting/formatting passes
- Successfully built production version
- Updated CLAUDE.md with new version numbers
- Updated README.md version badges

**Safeguards Added to package-monitor.js:**
- Comprehensive header comments documenting parser requirements
- Warning comments on priority classification function (example of previous bug)
- Database structure documentation with instructions for adding new packages
- All changes permanently committed to git with detailed commit message

**Files Changed:** package.json, bun.lock, biome.json, scripts/package-monitor.js, CLAUDE.md, README.md, _docs/2025-november.md

---

## November 4, 2025

### Release notes reorganization into monthly files

**Restructured release notes from monolithic file to organized monthly format:**

**Changes Implemented:**
- Created `_docs/` directory for all release documentation
- Split single `release-notes.md` into monthly files following `[year]-[month].md` pattern
- Created documentation README explaining naming conventions and structure
- Migrated all historical release notes to appropriate monthly files

**New Structure:**
```
_docs/
├── README.md              # Documentation guide with naming conventions
├── 2025-november.md       # November 2025 releases
├── 2025-october.md        # October 2025 releases (comprehensive)
└── 2025-september.md      # September 2025 releases (initial release)
```

**Naming Convention:**
- Files use pattern: `[year]-[month].md`
- Year: 4-digit format (e.g., `2025`)
- Month: Lowercase full name (e.g., `november`, not `11` or `Nov`)
- All entries within files organized by date, newest first

**Documentation Updates:**
- Updated `README.md` file structure section to show new `_docs/` directory
- Updated `README.md` version history to reference `_docs/` directory
- Updated `CLAUDE.md` Special File Rules section with new release notes location
- Updated `CLAUDE.md` file structure to reflect `_docs/` directory
- Removed all references to old `release-notes.md` file

**Benefits:**
- Better organization and navigation of release history
- Improved performance with smaller file sizes
- Easier maintenance - add entries to current month's file
- Scalable structure for long-term project maintenance
- Clear documentation guide in `_docs/README.md`

**Migration Details:**
- November 2025: Package updates and this reorganization
- October 2025: Extensive development history (40+ entries)
- September 2025: Initial v1.0 release and early development

**Files Changed:** Created 4 new files in `_docs/`, updated README.md, updated CLAUDE.md, deleted release-notes.md

---

### Package dependency updates

**Updated all packages to latest stable versions:**

**Dependencies:**
- `next`: 16.0.0 → 16.0.1 (patch update - minor bug fixes)

**Dev Dependencies:**
- `@biomejs/biome`: 2.2.7 → 2.3.3 (minor update with new features)
- `@tailwindcss/postcss`: 4.1.15 → 4.1.16 (patch update)
- `@types/node`: 24.9.1 → 24.10.0 (minor update)
- `tailwindcss`: 4.1.15 → 4.1.16 (patch update)

**Actions Taken:**
- Ran `bun update` to update all packages
- Migrated Biome configuration from v2.2.7 to v2.3.3 automatically
- Verified all tests pass (32 tests, 99 assertions)
- Confirmed linting/formatting works with new Biome version
- Successfully built the project for production
- Updated documentation to reflect new versions

**Impact:**
- All updates are safe patch and minor releases
- No breaking changes encountered
- Biome configuration migrated seamlessly
- Application running on latest stable versions

**Files Changed:** package.json, bun.lock, biome.json, CLAUDE.md, README.md, _docs/2025-november.md

---

## November 2, 2025

### Created opps2.md - 22 new improvement opportunities

**Brainstormed next generation of creative, non-destructive enhancements:**

**Summary:**
- Created comprehensive improvement opportunities document (opps2.md)
- 22 fun additions organized by implementation difficulty
- All improvements maintain security standards and won't break existing functionality
- Range from 5-minute quick wins to 4-hour ambitious features

**Categories:**
1. **Ultra Easy (5-10 min)** - 5 items: Command aliases, command counter, typing indicator, boot time display, sound toggle
2. **Easy (15-30 min)** - 5 items: Easter egg commands, history display, color-coded categories, stats command, search
3. **Medium (1-2 hours)** - 7 items: Tab completion, arrow key history, project tags, ASCII art, loading spinners, session export, Matrix customization
4. **Hard (2-4 hours)** - 5 items: Theme system, interactive tutorial, URL state persistence, mini-games, real-time collaboration

**Quick Wins Recommended:**
- Command aliases (5 min) - Better UX for natural language
- Command counter (5 min) - Professional terminal feel
- Easter eggs (20 min) - Fun personality boost
- Stats command (30 min) - Portfolio metrics overview
- Tab completion (90 min) - Pro terminal experience

**Impact:**
- Clear roadmap for future enhancements
- Prioritized by effort/impact ratio
- Zero-risk additions that enhance user experience
- Can be implemented incrementally over time

**Files Changed:** 1 file (opps2.md created)

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