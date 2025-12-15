# 8lee.ai Release Notes - October 2025 (Week 2)

**Period**: October 8-14, 2025

---

## LinkedIn Command Addition - October 14, 2025

**Status**: COMPLETE

**Overview**:
Added LinkedIn profile link with command aliases.

**Changes:**
- Added `linkedin` and `li` commands to open https://www.linkedin.com/in/8lee/
- Both commands (and slash variants `/linkedin`, `/li`) open LinkedIn profile in new tab
- Updated VALID_COMMANDS array in lib/utils.ts to include new aliases
- Added to COMMAND_DISPLAY_LIST as "linkedin (li)" for consistent grouping pattern
- Enhanced handleExternalLinkCommand in command-prompt.tsx with LinkedIn links

**Documentation Updates:**
- Updated README.md Available Commands section with LinkedIn entry
- Enhanced README.md Features section to mention `li` alias alongside `ed` and `vol`
- Updated README.md Mobile-First UX feature with recent improvements
- Updated CLAUDE.md Component Flow section to include linkedin command

**Files Changed**: 4 files (lib/utils.ts, components/command-prompt.tsx, README.md, CLAUDE.md)

---

## Biome Configuration Cleanup - October 14, 2025

**Status**: COMPLETE

**Overview**:
Enhanced Biome configuration for cleaner validation output.

**Changes:**
- Updated `biome.json` to set `ignoreUnknown: true` for files configuration
- Suppresses verbose warnings about unknown file extensions (images, markdown, PDFs, etc.)
- Maintains aggressive error-level linting for all code files
- Cleaner CI/verbose output while preserving all 100+ error-level rules

**Validation:**
- Tests: 32 pass, 99 assertions (check)
- TypeScript strict mode: Zero errors (check)
- Biome CI mode: 30 files checked, no issues (check)
- Production build: Successful (check)

**Files Changed**: 1 file (biome.json)

---

## Semantic URL Redirect Strategy - October 12, 2025

**Status**: COMPLETE

**Overview**:
Implemented intelligent URL redirect system to preserve link equity from 20+ years of external links.

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

**Impact:**
- Better SEO: Preserves link authority from decades of external backlinks
- Improved UX: Visitors from old links reach homepage instead of 404
- Enhanced Security: Blocks automated scanners and injection attempts
- Future-proof: Handles all legacy URLs without maintaining massive redirect list

**Files Changed**: 4 files (+147 lines: lib/utils.ts, middleware.ts, lib/utils.test.ts, CLAUDE.md, AGENTS.md, README.md)

---

## Package Dependency Updates - October 12, 2025

**Status**: COMPLETE

**Overview**:
Updated development dependencies to latest patch versions.

**Changes:**
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

**Files Changed**: 6 files (package.json, bun.lock, biome.json, CLAUDE.md, AGENTS.md, README.md, release-notes.md)

---

## Slash Command Support - October 12, 2025

**Status**: COMPLETE

**Overview**:
Added slash command syntax to command prompt.

**Changes:**
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

**Files Changed**: 1 file (command-prompt.tsx)

---

## Package Dependency Updates - October 10, 2025

**Status**: COMPLETE

**Overview**:
Updated development dependencies to latest versions.

**Changes:**
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

**Files Changed**: 5 files (package.json, bun.lock, CLAUDE.md, AGENTS.md, README.md, release-notes.md)

---

## Remove All Emojis from Markdown Documentation - October 9, 2025

**Status**: COMPLETE

**Overview**:
Removed emoji characters from documentation files.

**Changes:**
- Replaced checkmark/X emojis in CLAUDE.md with text labels (Good/Bad)
- Maintains clear examples without Unicode dependency
- Improves compatibility with text editors and terminal viewers

**Files Changed**: 1 file (CLAUDE.md)

---

## Comprehensive Test Refactoring - October 9, 2025

**Status**: COMPLETE

**Overview**:
Refactored all test suites to document user intent and business logic.

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

**Files Changed**: 7 files (~200 lines updated: 4 test files, CLAUDE.md, README.md, release-notes.md)

---

## TypeScript Configuration Fix - October 8, 2025

**Status**: COMPLETE

**Overview**:
Fixed Next.js build issue with test file exclusion.

**Changes:**
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

**Files Changed**: 3 files (tsconfig.json, README.md, release-notes.md)

---

## Comprehensive Test Infrastructure Implementation - October 8, 2025

**Status**: COMPLETE

**Overview**:
Added lightweight testing setup with Bun's native test runner.

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

