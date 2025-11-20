# Project Isolation Status

**Last Verified:** November 20, 2025
**Status:** ✅ ARCHIVED

## Archival Complete

Both experimental projects (Zendesk and Intercom) have been **officially archived** and are no longer under active development.

### Zendesk Intelligence Portal
- **Status:** 🗄️ ARCHIVED (November 20, 2025)
- **Location:** `app/zendesk/` (gitignored)
- **Production Access:** Hidden command `zendesk` or `zen`
- **Deletion Guide:** `app/zendesk/_docs/DELETION-GUIDE.md`
- **Documentation:** `app/zendesk/_docs/zendesk-MASTER.md`

### Intercom Intelligence Portal
- **Status:** 🗄️ ARCHIVED (November 20, 2025)
- **Location:** `app/intercom/` (gitignored)
- **Production Access:** Hidden command `intercom`
- **Deletion Guide:** `app/intercom/_docs/DELETION-GUIDE.md`
- **Master Doc:** `app/intercom/_docs/intercom-MASTER.md` (v2.1)

## Archival Actions Taken

**Version Control:**
- ✅ Added to `.gitignore` - future changes not tracked
- ✅ Existing code remains in production for reference
- ✅ All integration tests removed (4 test files deleted)

**Documentation:**
- ✅ README.md updated with "Archived Experimental Projects" section
- ✅ Clear notes about discontinued status
- ✅ Hidden terminal command access documented

**Isolation Verified:**
- ✅ No references in `CLAUDE.md` (main development guide)
- ✅ Zero import dependencies from main portfolio site
- ✅ Build passes without both projects
- ✅ Main site at https://8lee.ai completely independent

## Production Status

**Both projects remain functional in production:**
- Routes still work: `/zendesk` and `/intercom`
- Hidden terminal commands still function
- No impact on main portfolio functionality
- Can be safely deleted when ready (see deletion guides)

## Future Actions

**When ready to fully remove:**
1. Follow deletion guides in each project's `_docs/` directory
2. Remove routes from Next.js app router
3. Clean up any remaining environment variables
4. Update terminal commands in `lib/utils.ts`

**Current Focus:**
- Main portfolio improvements (see `portfolio-improvements-master.md`)
- Terminal UX enhancements
- Core feature development
