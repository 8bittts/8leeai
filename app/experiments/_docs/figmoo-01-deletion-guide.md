# Figmoo Deletion Guide

**Status:** Safe to Delete
**Last Verified:** December 5, 2025

---

## Overview

This guide provides step-by-step instructions for completely removing the Figmoo experiment from the codebase. The experiment is 100% isolated and can be deleted without affecting any other part of the application.

---

## Pre-Deletion Checklist

Before deleting, verify:

- [ ] No active development on the experiment
- [ ] No external dependencies on experiment code
- [ ] Decision documented (if needed)
- [ ] Git status is clean (commit any pending changes first)

---

## Quick Deletion (Single Command)

```bash
# Delete the entire Figmoo experiment
rm -rf app/experiments/figmoo

# Delete documentation
rm app/experiments/_docs/figmoo-00-readme.md
rm app/experiments/_docs/figmoo-01-deletion-guide.md
```

---

## Detailed Step-by-Step Deletion

### Step 1: Delete Experiment Directory

```bash
rm -rf app/experiments/figmoo
```

This removes:
- `app/experiments/figmoo/page.tsx` - Landing page
- `app/experiments/figmoo/layout.tsx` - Layout wrapper
- `app/experiments/figmoo/not-found.tsx` - 404 page
- `app/experiments/figmoo/onboarding/page.tsx` - Onboarding wizard
- `app/experiments/figmoo/signup/page.tsx` - Sign up page
- `app/experiments/figmoo/components/` - All React components
- `app/experiments/figmoo/lib/` - Types, data, and utilities

### Step 2: Delete Documentation

```bash
rm app/experiments/_docs/figmoo-00-readme.md
rm app/experiments/_docs/figmoo-01-deletion-guide.md
```

### Step 3: Verify Main App References (Should Be None)

The Figmoo experiment has zero dependencies on the main application. However, verify:

```bash
# Search for any imports from figmoo
grep -r "figmoo" app/ --include="*.ts" --include="*.tsx" | grep -v "experiments/figmoo"

# Should return empty (no results)
```

### Step 4: Check proxy.ts (No Changes Needed)

Unlike the Intercom/Zendesk experiments, Figmoo doesn't require external API access, so no changes to `proxy.ts` are needed.

### Step 5: Check package.json (No Changes Needed)

Figmoo doesn't add any new dependencies, so no changes to `package.json` are needed.

### Step 6: Remove Shared Component Reference (if last experiment)

If Figmoo is the last experiment using the shared PasswordGate, also delete:

```bash
rm -rf app/experiments/_shared
```

**Note:** If Intercom or Zendesk still exist, keep `_shared/` as they depend on it.

### Step 7: Clean Up globals.css Animations (Optional)

Remove Figmoo-specific animations from `app/globals.css`:

```css
/* Remove these blocks */
@keyframes figmoo-scroll-up { ... }
@keyframes figmoo-scroll-down { ... }
.animate-figmoo-scroll-up { ... }
.animate-figmoo-scroll-down { ... }
.animate-figmoo-scroll-up-slow { ... }
```

---

## Post-Deletion Verification

### Verify Build Success

```bash
bun run build
```

Expected: Build completes successfully with no errors.

### Verify Tests Pass

```bash
bun test
```

Expected: All existing tests pass (Figmoo has no tests of its own).

### Verify No Broken Imports

```bash
bunx tsc --noEmit
```

Expected: No TypeScript errors.

### Verify Lint Check

```bash
bunx biome check app/
```

Expected: No lint errors related to Figmoo.

---

## Rollback Procedure

If deletion was a mistake, restore from git:

```bash
# Option 1: Restore from last commit
git checkout HEAD -- app/experiments/figmoo
git checkout HEAD -- app/experiments/_docs/figmoo-00-readme.md
git checkout HEAD -- app/experiments/_docs/figmoo-01-deletion-guide.md

# Option 2: Restore from specific commit
git checkout <commit-hash> -- app/experiments/figmoo
```

---

## File Inventory (For Reference)

### Components (13 files)
- `figmoo-animated-showcase.tsx`
- `figmoo-category-card.tsx`
- `figmoo-header.tsx`
- `figmoo-progress-bar.tsx`
- `figmoo-site-preview.tsx`
- `figmoo-step-category.tsx`
- `figmoo-step-content.tsx`
- `figmoo-step-design.tsx`
- `figmoo-step-final.tsx`
- `figmoo-step-name.tsx`

### Library Files (3 files)
- `figmoo-data.ts`
- `figmoo-types.ts`
- `figmoo-utils.ts`

### Pages (4 files)
- `page.tsx` (landing)
- `layout.tsx`
- `not-found.tsx`
- `onboarding/page.tsx`
- `signup/page.tsx`

### Documentation (2 files)
- `figmoo-00-readme.md`
- `figmoo-01-deletion-guide.md`

**Total: ~22 files**

---

## Why This Experiment Is Safe to Delete

1. **Zero Main App Dependencies**: No main application code imports from Figmoo
2. **No External APIs**: Unlike Intercom/Zendesk, no external API configurations needed
3. **No Database**: All state is client-side only
4. **No Environment Variables**: No secrets or config to clean up
5. **Self-Contained Routing**: Next.js App Router handles cleanup automatically

---

**Guide Maintained By:** Development Team
**Created:** December 5, 2025
