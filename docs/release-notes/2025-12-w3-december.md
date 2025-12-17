# 8lee.ai Release Notes - December 2025 (Week 3)

**Period**: December 15-21, 2025

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
- `app/experiments/_docs/00-EXPERIMENTS-PROTOCOL.md` - Protocol for future experiments

**Main App Cleanup:**
- `lib/utils.ts`: Removed `zendesk` and `zen` commands
- `package.json`: Removed `@intercom/messenger-js-sdk` dependency, `test:zendesk` script
- `lib/api-security.ts`: Removed Zendesk/Intercom API from CSP allowlist
- `app/globals.css`: Removed Figmoo brand colors
- `README.md`: Removed Experimental Features section

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings
- Tests: 32 tests passing (main app tests)
- Build: Successful (5 routes down from 25)

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
- **app/experiments/_docs/00-EXPERIMENTS-PROTOCOL.md** - Experiment standards

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

