# 8lee.ai Release Notes - December 2025 (Week 3)

**Period**: December 15-21, 2025

---

## Vercel Comprehensive Review Command - December 19, 2025

**Status**: COMPLETE

**Overview**:
Created new `/vercel` slash command for both Claude and Cursor to perform comprehensive Vercel deployment reviews via CLI. Command includes full workflow for reviewing credentials, configuration, dependencies, warnings, and ensuring 100% Bun adoption.

**New Command Created:**
- `.claude/commands/vercel.md` - Claude Code command definition
- `.cursor/commands/vercel.md` - Cursor command definition
- Updated `.claude/commands/README.md` to include `/vercel` command
- Created `.cursor/commands/README.md` with command listing

**Command Workflow:**
1. Production keys and credentials review (.env.local, Vercel env vars, newline issue detection)
2. Configuration review (package.json vs vercel.json consistency)
3. Dependencies review (missing libraries, conflicting versions)
4. Warnings review and Bun adoption verification (100% Bun adoption check)
5. Iterative fix and deploy cycle (fix → /ship → tail Vercel → verify → repeat)
6. Documentation update (run /docs to update canonical docs)

**Initial Review Results:**

**Environment Variables:**
- `.env.local` exists and contains required keys ✓
- No newline issues detected in environment variables ✓
- Stale variables identified (ZENDESK, INTERCOM, RESEND) - not used in codebase (experiments removed)
- Vercel project has 6 environment variables configured (some stale)

**Configuration:**
- `package.json` and `vercel.json` consistent ✓
- `buildCommand: "bun run build"` explicitly set ✓
- `installCommand: "bun install"` explicitly set ✓
- `framework: "nextjs"` explicitly set ✓
- Vercel project settings UI shows npm/yarn/pnpm (cosmetic - vercel.json takes precedence)

**Dependencies:**
- All packages up to date (no outdated packages) ✓
- No conflicting versions detected ✓
- All `@vercel/*` packages consistent ✓
- `bun.lock` up to date ✓

**Bun Adoption:**
- 100% Bun adoption verified:
  - `packageManager: "bun@1.3.3"` in package.json ✓
  - `buildCommand: "bun run build"` in vercel.json ✓
  - `installCommand: "bun install"` in vercel.json ✓
  - No npm/yarn/pnpm references in code or configs ✓

**Warnings:**
- One informational warning: Node.js version auto-upgrade notice (non-blocking)
- All deployments successful with clean builds ✓

**Documentation Updated:**
- CLAUDE.md: Added `/vercel` command to slash commands table
- Release notes: This entry documenting command creation and initial review

**Files Created:**
- `.claude/commands/vercel.md`
- `.cursor/commands/vercel.md`
- `.cursor/commands/README.md`

**Files Modified:**
- `.claude/commands/README.md`: Added `/vercel` command
- `CLAUDE.md`: Added `/vercel` to slash commands table

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings
- All Vercel deployments successful

---

## Documentation Audit - December 19, 2025 (Second Pass)

**Status**: COMPLETE

**Overview**:
Comprehensive second-pass audit of all project documentation confirming full compliance with established policies and no issues found.

**Audit Scope:**
- CLAUDE.md - Technical canonical
- README.md - Architecture and design system
- docs/00-ROADMAP.md - Active TODOs and future work
- docs/release-notes/00-RN-README.md - Release notes guidelines
- .claude/commands/README.md - Slash commands documentation
- app/demos/_docs/00-demos-readme.md - Demos guidelines

**Findings:**

**1. Duplication Check - PASS:**
- CLAUDE.md properly references README.md for tech stack (no duplication)
- Both mention Bun 1.3.3 (acceptable - critical requirement)
- Separation of concerns maintained correctly

**2. Separation of Concerns - PASS:**
- CLAUDE.md: Commands, workflow, coding rules, references ✓
- README.md: Executive summary, architecture, design system, tech stack ✓
- ROADMAP.md: Active TODOs and future ideas only ✓
- Release notes: Completed work only ✓

**3. Content Rules - PASS:**
- No emojis found in any markdown files ✓
- No TODOs outside ROADMAP.md (all references are policy documentation) ✓
- Dates only in allowed locations (release notes, ROADMAP.md, Version History) ✓
- No future work in release notes (references are about archived code, not plans) ✓

**4. Stale Content Check - PASS:**
- Version numbers verified against package.json:
  - Next.js: 16.1.0 ✓
  - React: 19.2.3 ✓
  - Bun: 1.3.3 ✓
  - TypeScript: 5.9.3 ✓
  - Tailwind: v4.1.18 ✓
  - Biome: 2.3.10 ✓
- Test counts match current state (32 tests, 100 assertions) ✓
- All version references consistent ✓

**5. Consolidation Opportunities - PASS:**
- No duplicate content found ✓
- Cross-references working correctly ✓
- Documentation hierarchy properly maintained ✓

**Audit Results:**
- Issues Found: 0
- Policy Violations: 0
- Version Inconsistencies: 0
- Duplication: None
- Stale Content: None

**Summary:**
Documentation is clean, consistent, and fully compliant with all established policies. No changes required.

---

## Vercel Bun Adoption - December 19, 2025

**Status**: COMPLETE

**Overview**:
Explicitly configured Vercel to use Bun 100% for all build and install operations, ensuring complete Bun adoption globally.

**Configuration Changes:**
- Updated `vercel.json` to explicitly set build and install commands:
  - `buildCommand`: `bun run build` (replaces default npm/yarn detection)
  - `installCommand`: `bun install` (replaces default npm/yarn/pnpm detection)
  - `framework`: `nextjs` (explicitly set)

**Rationale:**
- Project uses Bun exclusively (`packageManager: "bun@1.3.3"` in package.json)
- Vercel auto-detects Bun but UI may show npm/yarn commands
- Explicit configuration ensures 100% Bun adoption and clarity
- Prevents any ambiguity about which package manager is used

**Verification:**
- All 20 recent deployments show "Ready" status
- Build duration: 21-30 seconds (consistent)
- No build warnings or errors detected
- Configuration validated via Biome check

**Files Modified:**
- vercel.json: Added buildCommand, installCommand, framework settings

**Quality Validation:**
- Biome: Zero warnings
- Configuration syntax: Valid JSON

---

## Documentation Audit - December 19, 2025

**Status**: COMPLETE

**Overview**:
Comprehensive audit of all project documentation to eliminate duplication, fix stale content, and ensure consistency across all files.

**Issues Fixed:**

**Duplication Removal:**
- CLAUDE.md: Removed tech stack version list (Next.js 16.1.0, React 19.2.3, etc.) - now only references README.md as source of truth

**Stale Content Updates:**
- ROADMAP.md: Updated test count from "96 tests, 297 assertions" to "32 tests, 100 assertions" (matches current state)
- `.claude/commands/README.md`: Updated design checklist reference from "11-point" to "9-point" (matches README.md)
- package.json: Updated packageManager from `bun@1.3.1` to `bun@1.3.3` (matches CLAUDE.md)

**Audit Results:**
- No emojis found in any markdown files (policy compliant)
- No TODOs outside of ROADMAP.md (policy compliant)
- Version numbers consistent across all documentation
- Cross-references verified and working
- Documentation hierarchy properly maintained

**Files Modified:**
- CLAUDE.md: Removed duplicate tech stack versions
- docs/00-ROADMAP.md: Updated test count
- .claude/commands/README.md: Updated design checklist reference
- package.json: Updated Bun version

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings
- All documentation policies verified

---

## Package Updates - December 19, 2025

**Status**: COMPLETE

**Overview**:
Updated Next.js to 16.1.0 and knip to 5.75.2. All quality gates passed with zero errors or warnings.

**Packages Updated:**

| Package | Previous | Updated |
|---------|----------|---------|
| next | 16.0.10 | 16.1.0 |
| knip (dev) | 5.75.1 | 5.75.2 |

**Update Method:**
- Both packages updated within semver range using `bun update`
- Next.js: Minor version update (16.0.10 -> 16.1.0)
- knip: Patch version update (5.75.1 -> 5.75.2)

**Security Audit:**
- `bun audit`: No vulnerabilities found

**Quality Validation:**
- TypeScript: Zero errors (`bunx tsc --noEmit`)
- Biome: Zero warnings (`bun run check` - 54 files checked)
- Tests: 32 tests, 100 assertions passing
- Build: Successful (Next.js 16.1.0 with Turbopack)

**Documentation Updated:**
- CLAUDE.md: Next.js 16.0.10 -> 16.1.0 in tech stack section
- README.md: Next.js badge and tech stack table 16.0.10 -> 16.1.0

---

## Dead Code Cleanup and Knip Integration - December 18, 2025

**Status**: COMPLETE

**Overview**:
Added knip for dead code detection and cleaned up all unused exports across the codebase.

**Knip Integration:**
- Installed `knip@5.75.1` as devDependency
- Created `knip.json` configuration with entry points and exclusions
- Updated `/ship` command with dead code quality gate
- Updated `/check` command to include knip
- Added dead code prevention rules to CLAUDE.md

**Dead Code Cleaned:**
- `isAllowedOrigin` - removed export (internal only)
- `ALLOWED_ORIGINS` - removed export (internal only)
- `cn` - removed export (only used by focusRing)
- `COMMAND_DISPLAY_LIST` - deleted (unused)
- `themes` - removed export (internal only)
- `ThemeColors/ContextValue/Definition/Fonts` re-exports - removed from index.ts
- `ThemeColors` interface - removed export (internal)
- `Command` type - removed export (internal)

**Files Modified:**
- `lib/api-security.ts` - removed exports from internal functions
- `lib/utils.ts` - removed cn export, deleted COMMAND_DISPLAY_LIST
- `lib/themes/index.ts` - removed themes export, cleaned re-exports
- `lib/themes/types.ts` - removed ThemeColors export

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings (54 files)
- Knip: Zero unused files/exports
- Tests: 32 tests, 100 assertions passing
- Build: Successful

---

## Package Updates - December 18, 2025

**Status**: COMPLETE

**Overview**:
Updated Biome to 2.3.10.

**Packages Updated:**

| Package | Previous | Updated |
|---------|----------|---------|
| @biomejs/biome | 2.3.9 | 2.3.10 |

**Configuration Changes:**
- Migrated biome.json schema from 2.3.9 to 2.3.10

**Security Audit:**
- `bun audit`: No vulnerabilities found

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings
- Knip: Zero unused files
- Tests: 32 tests, 100 assertions passing
- Build: Successful

**Documentation Updated:**
- CLAUDE.md: Biome 2.3.9 -> 2.3.10
- README.md: Tech stack table Biome 2.3.9 -> 2.3.10

---

## Experiments to Demos Rename - December 17, 2025

**Status**: COMPLETE

**Overview**:
Renamed "experiments" to "demos" throughout the codebase for clearer terminology.

**Directory Renamed:**
- `app/experiments/` -> `app/demos/`
- `app/experiments/_docs/00-experiments-readme.md` -> `app/demos/_docs/00-demos-readme.md`

**Files Updated:**
- `proxy.ts`: `isExperiment` -> `isDemo`, `/experiments` -> `/demos`
- `tsconfig.json`: Updated exclude path
- `.cursorrules`: Updated documentation hierarchy reference
- `.claude/commands/docs.md`: Updated file reference
- `docs/00-ROADMAP.md`: Updated documentation reference
- `CLAUDE.md`: Updated key files table and coding rules
- `README.md`: Updated project structure

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings (53 files)
- Tests: 32 tests, 100 assertions passing
- Build: Successful (2 routes)

---

## Final Cleanup Pass - December 17, 2025

**Status**: COMPLETE

**Overview**:
Final cleanup pass to remove all remaining stale references from the codebase after experiments and shadcn removal.

**Files Deleted:**
- `components.json` - shadcn configuration file (no longer needed)

**Files Updated:**
- `lib/utils.ts`: Updated comment from "shadcn/ui class name utility" to "Tailwind class name utility"
- `README.md`: Removed AI SDK and Resend from tech stack table (packages were deleted)

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings (54 files)
- Tests: 32 tests, 100 assertions passing
- Build: Successful (2 routes)

---

## Dependency and Component Cleanup - December 17, 2025

**Status**: COMPLETE

**Overview**:
Removed all unused dependencies and shadcn UI components left over from deleted experiments. Updated design system from 11-point to 9-point checklist (removed shadcn-specific rules).

**Dependencies Removed (11 packages):**
- `@ai-sdk/openai` - AI SDK for OpenAI (experiments)
- `ai` - Vercel AI SDK core (experiments)
- `@vercel/edge-config` - Edge config storage (experiments)
- `resend` - Email sending (contact forms)
- `@radix-ui/react-checkbox` - Radix checkbox (shadcn)
- `@radix-ui/react-label` - Radix label (shadcn)
- `@radix-ui/react-progress` - Radix progress (shadcn)
- `@radix-ui/react-separator` - Radix separator (shadcn)
- `@radix-ui/react-slot` - Radix slot (shadcn)
- `class-variance-authority` - CVA utility (shadcn)
- `lucide-react` - Icons (shadcn)

**Files Deleted (11 files):**
- `components/ui/badge.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/checkbox.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- `components/ui/progress.tsx`
- `components/ui/separator.tsx`
- `components/theme-switcher.tsx`
- `components/ui/` directory (empty)
- `components.json` - shadcn configuration

**Documentation Updated:**
- README.md: Design system 11-point -> 9-point, removed shadcn and AI SDK/Resend references
- CLAUDE.md: Design checklist 11-point -> 9-point
- .cursorrules: Removed shadcn references, updated design checklist
- .claude/commands/design.md: Rewrote for 9-point checklist
- .claude/commands/theme.md: Removed ThemeSwitcher references
- app/experiments/_docs/00-experiments-readme.md: Removed `@/components/ui` reference
- app/page.tsx: Removed ThemeSwitcher comments
- lib/utils.ts: Updated cn() comment

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings (54 files)
- Tests: 32 tests, 100 assertions passing
- Build: Successful (2 routes)
- Dependencies: 18 -> 7 (61% reduction)

---

## Experiments Removal - December 17, 2025

**Status**: COMPLETE

**Overview**:
Removed all experiments (Zendesk, Intercom, Figmoo) from the codebase. Kept only the experiments protocol documentation for future reference.

**Files Deleted:**
- 148 files across 3 experiment directories
- ~36,470 lines of code removed

**Directories Removed:**
- `app/experiments/zendesk/` - AI-powered ticket intelligence
- `app/experiments/intercom/` - AI-powered conversation intelligence
- `app/experiments/figmoo/` - Frictionless website builder

**Documentation Kept:**
- `app/experiments/_docs/00-experiments-readme.md` - Simplified experiment guidelines

**Main App Cleanup:**
- `lib/utils.ts`: Removed `zendesk` and `zen` commands
- `package.json`: Removed `@intercom/messenger-js-sdk` dependency, `test:zendesk` script
- `lib/api-security.ts`: Removed Zendesk/Intercom API from CSP allowlist
- `app/globals.css`: Removed Figmoo brand colors
- `README.md`: Removed Experimental Features section, Figmoo from color contrast table, updated test counts
- `app/api/contact/intercom/`: Deleted contact API route
- `app/api/contact/zendesk/`: Deleted contact API route
- `scripts/test-contact-forms.ts`: Deleted test script
- `components/command-prompt.tsx`: Removed zendesk/zen URLs from link handler
- `proxy.ts`: Removed experiment names from comment
- `app/experiments/_docs/`: Consolidated protocol into simplified readme

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings (63 files checked)
- Tests: 32 tests passing (main app tests)
- Build: Successful (3 routes down from 25)

---

## Package Updates - December 17, 2025

**Status**: COMPLETE

**Overview**:
Updated 2 packages: @ai-sdk/openai patch update and @types/node major version update. Also updated Bun version references in documentation.

**Packages Updated:**

| Package | Previous | Updated |
|---------|----------|---------|
| @ai-sdk/openai | 2.0.87 | 2.0.88 |
| @types/node | 24.10.4 | 25.0.3 |

**Notes:**
- `@ai-sdk/openai`: Patch update within semver range
- `@types/node`: Major version update (v24 -> v25) - Node.js type definitions

**Security Audit:**
- `bun audit`: No vulnerabilities found

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings
- Tests: 92 tests, 294 assertions passing
- Build: Successful (25 routes generated)

**Documentation Updated:**
- CLAUDE.md: Bun version 1.3.1 -> 1.3.3
- README.md: Bun badge and version references 1.3.1 -> 1.3.3

---

## Package Updates - December 16, 2025

**Status**: COMPLETE

**Overview**:
Updated 9 packages to their latest versions, including React 19.2.3, Biome 2.3.9, and AI SDK 5.0.114.

**Packages Updated:**

| Package | Previous | Updated |
|---------|----------|---------|
| @ai-sdk/openai | 2.0.85 | 2.0.87 |
| ai | 5.0.112 | 5.0.114 |
| lucide-react | 0.559.0 | 0.561.0 |
| react | 19.2.1 | 19.2.3 |
| react-dom | 19.2.1 | 19.2.3 |
| @biomejs/biome | 2.3.8 | 2.3.9 |
| @testing-library/react | 16.3.0 | 16.3.1 |
| @types/node | 24.10.3 | 24.10.4 |
| autoprefixer | 10.4.22 | 10.4.23 |

**Configuration Changes:**
- Migrated biome.json schema from 2.3.8 to 2.3.9

**Security Audit:**
- `bun audit`: No vulnerabilities found

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings
- Tests: 92 tests, 294 assertions passing
- Build: Successful (25 routes generated)

**Documentation Updated:**
- CLAUDE.md: Tech stack versions (React 19.2.3, Biome 2.3.9)
- README.md: Badges and tech stack table (React 19.2.3, Biome 2.3.9, AI SDK 5.0.114)

---

## Cursor Rules Hardcore Cleanup - December 15, 2025

**Status**: COMPLETE

**Overview**:
Completely overhauled cursor rules to eliminate stale content and contradictions. Created minimal reference-based `.cursorrules` file that points to canonical documentation instead of duplicating content.

**Problem**:
- Cursor rules were stale (not updated since September)
- Contained contradictions with existing documentation
- Duplicated content already present in CLAUDE.md, README.md, and other docs
- Violated principle of single source of truth

**Solution**:
- Created minimal 37-line `.cursorrules` file
- Established CLAUDE.md as canonical technical resource
- Removed all duplication - rules now reference existing docs
- Added clear documentation hierarchy section
- Included only essential quick-reference rules

**Files Created:**
- `.cursorrules` - Minimal reference-based cursor rules

**Documentation Hierarchy Established:**
- **CLAUDE.md** - Technical canonical (commands, workflow, coding rules, references)
- **README.md** - Architecture, design system, tech stack (source of truth)
- **docs/00-ROADMAP.md** - Active TODOs and future work (ONLY place for plans)
- **docs/release-notes/** - Weekly development logs
- **app/experiments/_docs/00-experiments-readme.md** - Experiment guidelines

**Key Principles:**
- Prefer simple solutions using existing patterns
- Avoid duplication - check codebase first
- Fix issues without introducing new patterns/technologies
- Keep codebase clean and organized
- Reference documentation instead of recreating it

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings
- All rules align with existing documentation
- No contradictions identified

---

