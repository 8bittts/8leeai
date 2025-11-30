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
