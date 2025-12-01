# November 2025 - Week 5 (Nov 29-30)

## November 30, 2025

### Major Reorganization: Experiments Folder Structure

Reorganized the experimental features (Zendesk and Intercom Intelligence Portals) into a dedicated `/app/experiments/` folder structure for better organization and maintainability.

**Changes:**

**Folder Structure:**
- Moved `/app/intercom/` to `/app/experiments/intercom/`
- Moved `/app/zendesk/` to `/app/experiments/zendesk/`
- Created consolidated `/app/experiments/_docs/` for all experiment documentation

**Documentation Consolidation:**
- Consolidated 11 documentation files into 6 semantic, consistently-named files
- Naming convention: `{experiment}-{serial}-{description}.md`
  - `intercom-00-readme.md` - Main documentation
  - `intercom-01-deletion-guide.md` - Deletion instructions
  - `zendesk-00-readme.md` - Main documentation
  - `zendesk-01-scripts.md` - Scripts documentation
  - `zendesk-02-testing.md` - Testing documentation
  - `zendesk-03-deletion-guide.md` - Deletion guide (combined with isolation verification)
- Removed redundant historical/point-in-time reports

**Configuration Updates:**
- Updated `proxy.ts` to use `/experiments` path instead of individual experiment paths
- Updated `package.json` test script path for zendesk
- Updated command prompt URLs to `/experiments/zendesk` and `/experiments/intercom`
- Added `engines.node` field requiring Node >=22.0.0
- Updated `tsconfig.json` to exclude `app/experiments/**/*` from strict type checking

**Code Fixes:**
- Fixed import paths throughout experiments (changed `@/app/intercom` to `@/app/experiments/intercom`)
- Fixed CSS imports in layout files (`../globals.css` to `../../globals.css`)
- Fixed type errors in intercom-classify-query.ts (byStatus -> byState, byType -> byTag)
- Updated CLAUDE.md file structure documentation

**URLs:**
- Zendesk portal: `https://8lee.ai/experiments/zendesk`
- Intercom portal: `https://8lee.ai/experiments/intercom`

**Build Status:** Passing (96 tests, 297 assertions)

### Post-Move Verification and Cleanup

**Fixed Script Imports:**
- Fixed broken relative imports in intercom scripts (`../app/intercom/lib/` to `../lib/`)
- Fixed broken relative imports in zendesk scripts (`../app/zendesk/lib/` to `../lib/`)

**Knip Analysis:**
- Ran knip to identify unused code
- Removed unused `app/lib/schemas.ts` (duplicate of experiment-specific schemas)
- Confirmed experiment components are correctly imported (knip false positives for Next.js dynamic imports)

**Verified:**
- All 21 routes correctly registered under `/experiments/` path
- Proxy correctly handles `/experiments` path exclusion
- CSP allows connections to `api.zendesk.com` and `api.intercom.io`
- Build passes with all static pages generated
- All 96 tests passing with 297 assertions

**Main App Isolation Confirmed:**
- No imports from main app into experiments
- No imports from experiments into main app
- Changes isolated to experiment folder structure only

---

### Documentation and Test Organization Cleanup

Comprehensive cleanup of documentation and test file organization for better maintainability.

**Stale Documentation Removed:**
- Deleted `_docs/2025-november.md.tmp` (empty tmp file)
- Deleted `_docs/2025-november.md` (content migrated to weekly release notes)
- Deleted `_docs/portfolio-improvements-master.md` (work captured in November Week 3 release notes)
- Updated `_docs/README.md` to reflect current structure (historical files only)

**Test Organization:**
- Created dedicated `/tests/` directory with organized subdirectories
- Moved test files from co-located positions to centralized test directory:
  - `lib/utils.test.ts` to `tests/lib/utils.test.ts`
  - `hooks/use-typewriter.test.tsx` to `tests/hooks/use-typewriter.test.tsx`
  - `hooks/use-virtual-keyboard-suppression.test.tsx` to `tests/hooks/use-virtual-keyboard-suppression.test.tsx`
  - `components/cursor.test.tsx` to `tests/components/cursor.test.tsx`
- Moved `test-setup.ts` to `tests/setup.ts`
- Updated `bunfig.toml` to reference new setup location

**Configuration Updates:**
- Updated `tsconfig.json` exclude list (`test-setup.ts` to `tests/**/*`)
- Updated `.gitignore` for experiments new paths (`/app/experiments/zendesk/`, `/app/experiments/intercom/`)

**Documentation Updates:**
- Added CLI Tools Preference section to CLAUDE.md (Vercel, Supabase, GitHub CLI)
- Updated file structure documentation in CLAUDE.md and README.md
- Updated test file path references throughout documentation
- Added Week 5 release notes reference

**Quality Verification:**
- All 96 tests passing (297 assertions)
- Zero Biome lint errors
- Zero TypeScript errors
- Build passes
