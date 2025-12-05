# Intercom Portal Deletion Guide

**Last Updated:** November 19, 2025
**Status:** 100% Isolated - Safe to Delete

---

## Overview

This guide provides step-by-step instructions for removing the Intercom Intelligence Portal from the codebase. The portal is **completely isolated** and can be deleted without affecting the main portfolio site at https://8lee.ai.

### Isolation Verification

**Build Test Passed:** Main site builds successfully without `/app/intercom/`
**Zero Import Dependencies:** No main site files import Intercom code
**Self-Contained:** All 62 files are within `/app/intercom/` directory

---

## Pre-Deletion Checklist

Before deleting, ensure you have:

- [ ] **Backup:** Created a backup of `/app/intercom/` directory (if needed)
- [ ] **Documentation:** Saved `/app/intercom/_docs/intercom-MASTER.md` externally
- [ ] **Release Notes:** Verified November 18-19 entries in `_docs/2025-november.md`
- [ ] **Environment Variables:** Documented `INTERCOM_ACCESS_TOKEN` if needed later

---

## Deletion Steps

### 1. Remove Intercom Directory

```bash
# Delete the entire Intercom portal
rm -rf app/experiments/intercom
```

**Impact:** Removes all 62 Intercom files (13,569 lines of code)

**Files Deleted:**
- 18 React components
- 15 library files
- 7 API routes
- 8 test scripts
- 6 test files
- 4 hooks
- 4 documentation files

---

### 2. Clean Up Main App References

#### A. `proxy.ts` (3 changes)

**Line 38:** Remove comment reference
```typescript
// BEFORE:
// Skip redirect for homepage, Next.js internals, API routes, and demo sites (zendesk/intercom)

// AFTER:
// Skip redirect for homepage, Next.js internals, API routes, and demo sites (zendesk)
```

**Line 42:** Remove from isDemoSite check
```typescript
// BEFORE:
const isDemoSite = pathname.startsWith("/zendesk") || pathname.startsWith("/intercom")

// AFTER:
const isDemoSite = pathname.startsWith("/zendesk")
```

**Line 92:** Remove from CSP connect-src
```typescript
// BEFORE:
"connect-src 'self' https://vercel.live wss://ws.vercel.live https://vitals.vercel-insights.com https://api.zendesk.com https://api.intercom.io",

// AFTER:
"connect-src 'self' https://vercel.live wss://ws.vercel.live https://vitals.vercel-insights.com https://api.zendesk.com",
```

#### B. `package.json` (1 change)

**Line 24:** Remove Intercom SDK dependency
```json
// BEFORE:
{
  "dependencies": {
    "@ai-sdk/openai": "^2.0.68",
    "@intercom/messenger-js-sdk": "^0.0.18",
    "@vercel/analytics": "^1.5.0",
    ...
  }
}

// AFTER:
{
  "dependencies": {
    "@ai-sdk/openai": "^2.0.68",
    "@vercel/analytics": "^1.5.0",
    ...
  }
}
```

**Then run:**
```bash
bun install
```

---

### 3. Environment Cleanup (Optional)

Remove Intercom environment variable from `.env.local`:

```bash
# Remove this line:
# INTERCOM_ACCESS_TOKEN=your_token_here
```

**Note:** Keep `OPENAI_API_KEY` if Zendesk portal is still in use.

---

### 4. Verification Steps

After deletion, verify the main site still works:

```bash
# 1. Clean build directories
bun run clean

# 2. Run TypeScript check
bunx tsc --noEmit

# 3. Run Biome check
bunx biome check .

# 4. Build production bundle
bun run build

# 5. Start dev server
bun run dev

# 6. Test homepage
open http://localhost:1333
```

**Expected Results:**
- ✅ Zero TypeScript errors
- ✅ Zero Biome errors
- ✅ Build succeeds
- ✅ Homepage loads at http://localhost:1333
- ✅ All portfolio commands work (email, github, linkedin, etc.)

---

## Rollback Plan

If you need to restore Intercom:

### Option 1: Git Restore (Recommended)

```bash
# If changes not committed yet:
git checkout app/intercom
git checkout proxy.ts
git checkout package.json

# If already committed:
git revert <commit-hash>
```

### Option 2: Manual Restore

1. Restore `/app/intercom/` directory from backup
2. Revert changes to `proxy.ts` and `package.json`
3. Run `bun install`
4. Restart dev server

---

## What Gets Deleted

### Directory Structure (62 files total)

```
app/intercom/
├── _docs/                      # 4 documentation files
│   ├── DELETION-GUIDE.md      # This file
│   ├── intercom-MASTER.md     # Main technical documentation
│   └── ... (historical docs)
├── api/                        # 7 API routes
│   ├── analyze/route.ts       # Ticket analysis
│   ├── interpret-query/route.ts
│   ├── query/route.ts         # Smart query handler
│   ├── refresh/route.ts       # Cache refresh
│   ├── reply/route.ts         # Reply generation
│   ├── suggest-response/route.ts
│   └── tickets/route.ts       # Ticket operations
├── cache/                      # Runtime cache (git-ignored)
│   └── conversation-cache.json
├── components/                 # 18 React components
│   ├── intercom-ascii-art.tsx # INTERCOM logo
│   ├── intercom-chat-container.tsx
│   ├── intercom-chat-history.tsx
│   ├── intercom-chat-input.tsx
│   ├── intercom-command-prompt.tsx
│   ├── intercom-contact-form.tsx
│   ├── intercom-cursor.tsx
│   ├── intercom-header.tsx
│   ├── intercom-message-bubble.tsx
│   ├── intercom-suggestion-bar.tsx
│   └── ... (8 more)
├── hooks/                      # 4 custom hooks
│   ├── intercom-use-typewriter.ts
│   ├── intercom-use-virtual-keyboard-suppression.ts
│   └── ... (2 test files)
├── lib/                        # 15 core library files
│   ├── intercom-api-client.ts  # Intercom API wrapper
│   ├── intercom-cached-ai-context.ts
│   ├── intercom-classify-query.ts
│   ├── intercom-conversation-cache.ts # 24-hour cache
│   ├── intercom-openai-client.ts
│   ├── intercom-query-history.ts
│   ├── intercom-query-interpreter.ts
│   ├── intercom-query-patterns.ts
│   ├── intercom-schemas.ts
│   ├── intercom-smart-query-handler.ts # Main query router
│   ├── intercom-types.ts
│   ├── intercom-utils.ts
│   └── ... (3 more)
├── scripts/                    # 8 utility scripts
│   ├── intercom-api-test.ts
│   ├── intercom-comprehensive-test.ts
│   ├── intercom-create-synthetic-tickets.ts
│   ├── intercom-generate-synthetic-data.ts
│   ├── intercom-queries-test.ts
│   └── ... (3 more)
├── __tests__/                  # 6 integration test files
│   ├── intercom-metadata-operations.test.ts
│   ├── intercom-openai-response-quality.test.ts
│   └── ... (4 more)
├── page.tsx                    # Main entry point
├── layout.tsx                  # Layout wrapper
└── not-found.tsx               # Custom 404
```

### Code Statistics

- **Total Files:** 62
- **Total Lines:** 13,569
- **Components:** 18
- **API Routes:** 7
- **Library Files:** 15
- **Test Scripts:** 8
- **Integration Tests:** 6
- **Documentation:** 4 files

---

## References Removed From Main App

### 1. Proxy Configuration (`proxy.ts`)

**Removed:**
- Demo site routing for `/intercom` path
- CSP allowlist for `https://api.intercom.io`
- Comment references in line 38

**Kept:**
- All homepage security headers
- Zendesk CSP/CORS settings
- HSTS, XSS, CORS configurations

### 2. Package Dependencies (`package.json`)

**Removed:**
- `@intercom/messenger-js-sdk` (0.0.18)

**Kept:**
- `@ai-sdk/openai` (2.0.68) - Used by Zendesk
- All Next.js, React, Vercel dependencies
- Testing and linting tools

### 3. Environment Variables (`.env.local`)

**Removed:**
- `INTERCOM_ACCESS_TOKEN`

**Kept:**
- `OPENAI_API_KEY` (if Zendesk exists)
- `RESEND_API_KEY`
- Other credentials

---

## Post-Deletion Verification

### Test Checklist

After deletion, verify:

- [ ] **Homepage loads:** http://localhost:1333
- [ ] **Commands work:** `/email`, `/github`, `/linkedin`, `/x`
- [ ] **Projects display:** Numbers 1-64 load correctly
- [ ] **Education/Volunteer:** Numbers 65-75 work
- [ ] **404 page works:** Random URL shows Mario 404
- [ ] **Build succeeds:** `bun run build` completes
- [ ] **No TypeScript errors:** `bunx tsc --noEmit` clean
- [ ] **No Biome errors:** `bunx biome check .` clean
- [ ] **Tests pass:** `bun test` (main site tests)

### Expected Build Output

```bash
$ bun run build

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/contact/intercom     # ⚠️ This should be REMOVED
├ ƒ /api/contact/zendesk
└ ○ /zendesk

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

**Note:** If `/api/contact/intercom` still appears, manually check for contact form API routes.

---

## FAQ

### Q: Will deleting Intercom break my main site?

**A:** No. The build test confirmed the main site (https://8lee.ai) builds and runs perfectly without `/app/intercom/`.

### Q: What happens to the Zendesk portal?

**A:** No impact. Zendesk portal (`/app/zendesk/`) is completely independent and will continue working.

### Q: Can I restore Intercom later?

**A:** Yes. Use git to restore from commit history, or restore from a manual backup.

### Q: Do I need to update the database?

**A:** No. The Intercom portal uses in-memory caching only. No database or persistent storage.

### Q: What about the cache files?

**A:** The `app/intercom/cache/` directory is git-ignored. Deleting `/app/intercom/` removes it automatically.

### Q: Will this affect my Vercel deployments?

**A:** No. After pushing the deletion to main branch, Vercel will deploy the updated codebase without Intercom routes.

---

## Support

If you encounter issues during deletion:

1. **Check build logs:** `bun run build` will show errors
2. **Verify TypeScript:** `bunx tsc --noEmit` for type errors
3. **Check imports:** `grep -r "intercom" app/ lib/ components/` (should return 0 matches)
4. **Rollback:** Use `git revert` or restore from backup

---

## Related Documentation

- **Main Project Docs:** `/CLAUDE.md`
- **Release Notes:** `/_docs/2025-november.md` (November 18-19 entries)
- **Intercom Technical Docs:** `/app/intercom/_docs/intercom-MASTER.md` (deleted after removal)
- **Zendesk Deletion Guide:** `/app/zendesk/_docs/DELETION-GUIDE.md`

---

## Deletion Summary

**Quick Command Sequence:**

```bash
# 1. Delete Intercom directory
rm -rf app/intercom

# 2. Edit proxy.ts (3 changes)
# - Line 38: Remove comment
# - Line 42: Remove /intercom from isDemoSite
# - Line 92: Remove api.intercom.io from CSP

# 3. Edit package.json (1 change)
# - Line 24: Remove @intercom/messenger-js-sdk

# 4. Reinstall dependencies
bun install

# 5. Verify
bunx tsc --noEmit
bunx biome check .
bun run build
bun run dev
```

**Total Time:** ~5 minutes

---

**Last Verified:** November 19, 2025
**Build Test:** ✅ Passed
**Isolation Status:** ✅ 100% Isolated
**Safe to Delete:** ✅ Yes
