# 8lee.ai Release Notes - December 2025 (Week 3)

**Period**: December 15-21, 2025

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

