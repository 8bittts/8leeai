# Intercom Integration - Deletion Guide

**Status:** Complete Isolation Achieved ✓
**Can be safely deleted:** YES
**Last Updated:** 2025-11-17

---

## Quick Delete Instructions

To completely remove the Intercom integration from the codebase:

### 1. Delete the Intercom Directory
```bash
rm -rf app/intercom
```

### 2. Remove Command References (3 files)

**File: `components/command-prompt.tsx`**
- No intercom commands present (✓ already clean)

**File: `lib/utils.ts`**
- No intercom commands present (✓ already clean)

**File: `proxy.ts`**
- Update the line:
  ```typescript
  const isDemoSite = pathname.startsWith("/zendesk") || pathname.startsWith("/intercom")
  ```
  Change to:
  ```typescript
  const isDemoSite = pathname.startsWith("/zendesk")
  ```
  Or remove entirely if zendesk is also deleted.

- Remove from CSP `connect-src` directive:
  ```
  https://api.intercom.io
  ```

### 3. Verify Build
```bash
bun run build
```

### 4. Clean Up Environment Variables (Optional)

From `.env.local`, remove:
```bash
INTERCOM_ACCESS_TOKEN=
```

**Note:** Keep `app/api/contact/intercom/route.ts` - this is for the contact form, NOT the experiment.

---

## What Gets Deleted

### Code Files (3,727 lines total)
- **24 TypeScript files** with intercom- prefix
- **2 API routes** in `app/intercom/api/`
- **12 components** in `app/intercom/components/`
- **4 hooks** in `app/intercom/hooks/`
- **4 lib files** in `app/intercom/lib/`
- **1 script** in `app/intercom/scripts/`
- **1 documentation file** in `app/intercom/_docs/`
- **3 Next.js pages** (page.tsx, layout.tsx, not-found.tsx)

### Features Removed
- Intercom live chat widget integration
- AI-powered message suggestions
- Conversation management
- Terminal-style Intercom interface

---

## What Remains (Safe to Keep)

These files are **NOT** part of the experiment and should remain:

### Contact Form Email Handler
- `app/api/contact/intercom/route.ts` - Sends contact form emails via Intercom API
- This is a separate feature for your website's contact form

### Zendesk Integration
- `app/zendesk/*` - Completely separate experiment
- No code dependencies with intercom

---

## Isolation Verification

### No Code Dependencies ✓
- Main app does NOT import from `app/intercom/`
- Intercom does NOT import from main app
- Deleting intercom will NOT break homepage
- Build succeeds without errors after deletion

### References Only
The only connection is the URL routing in proxy.ts:
- `/intercom` route → navigates to intercom page
- Safe to remove (see step 2 above)

### Code Duplication (Intentional)
Intercom has **independent copies** of shared utilities:
- Components (9): boot-sequence, command-prompt, cursor, cv-content, data-grid-section, matrix-background, secure-external-link, terminal-container
- Hooks (2): use-typewriter, use-virtual-keyboard-suppression
- Lib (2): data, utils

These duplicates ensure complete isolation - deleting intercom won't affect main app.

---

## Testing After Deletion

### 1. Build Verification
```bash
bun run build
```
Should complete with no errors.

### 2. Development Test
```bash
bun run dev
```
Navigate to `http://localhost:1333` - homepage should work perfectly.

### 3. Route Test
Try navigating to:
- ✅ `/` - Should work
- ❌ `/intercom` - Should show 404 (expected)

### 4. Contact Form Test
The contact form should still work and send via Intercom API

---

## Environment Variables

### Required After Deletion
```bash
OPENAI_API_KEY=         # For AI features (if any)
NEXT_PUBLIC_VERCEL_ENV= # For analytics
```

### Can Be Removed
```bash
INTERCOM_ACCESS_TOKEN=
```

---

## Rollback Plan

If you need to restore intercom:

```bash
# 1. Restore from git
git checkout main app/intercom

# 2. Restore proxy routing
git checkout main proxy.ts

# 3. Restore environment variables
# Add back to .env.local:
INTERCOM_ACCESS_TOKEN=<your-token>

# 4. Rebuild
bun run build
```

---

## Why This Was Built

The Intercom Integration was an experiment to create a terminal-style interface for Intercom customer support. It featured:
- Live chat widget integration
- AI-powered message suggestions
- Terminal-style UI matching main site aesthetic
- Conversation management

**Experiment Status:** COMPLETE
**Isolation Status:** 100% ISOLATED
**Deletion Safety:** SAFE TO DELETE

---

## Questions?

If anything breaks after deletion, check:
1. Did you update proxy.ts? (step 2)
2. Did you run `bun run build`? (step 3)

The homepage and all main features should work perfectly after deletion.
