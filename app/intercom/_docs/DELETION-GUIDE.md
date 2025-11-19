# Intercom Intelligence Portal - Deletion Guide

**Status:** Complete Isolation Achieved ✓
**Can be safely deleted:** YES
**Last Updated:** 2025-11-17

---

## Quick Delete Instructions

To completely remove the Intercom experiment from the codebase:

### 1. Delete the Intercom Directory
```bash
rm -rf app/intercom
```

### 2. Remove Command References (4 files)

**File: `components/command-prompt.tsx`**
- Remove lines containing: `intercom: "https://8lee.ai/intercom"`
- Remove lines containing: `zen: "https://8lee.ai/intercom"`

**File: `lib/utils.ts`**
- Remove `"intercom"` from `VALID_COMMANDS` array
- Remove `"zen"` from `VALID_COMMANDS` array
- Remove `intercom: "Intercom Portal"` from `COMMAND_NAMES`
- Remove `zen: "Intercom Portal"` from `COMMAND_NAMES`

**File: `proxy.ts`**
- Remove or update the line:
  ```typescript
  const isDemoSite = pathname.startsWith("/intercom") || pathname.startsWith("/intercom")
  ```
  Change to:
  ```typescript
  const isDemoSite = pathname.startsWith("/intercom")
  ```

- Remove from CSP `connect-src` directive:
  ```
  https://api.intercom.com
  ```

**File: `package.json`**
- Remove the script:
  ```json
  "test:intercom": "bun app/intercom/scripts/intercom-full-workflow-test.ts"
  ```

### 3. Remove Test Contact Form References (1 file)

**File: `scripts/test-contact-forms.ts`**
- Remove all intercom-related code (search for "intercom" and remove those sections)
- Or delete the entire file if no longer needed after removing intercom

### 4. Verify Build
```bash
bun run build
```

### 5. Clean Up Environment Variables (Optional)

From `.env.local`, remove:
```bash
INTERCOM_EMAIL=
INTERCOM_API_TOKEN=
INTERCOM_SUBDOMAIN=
```

**Note:** Keep `support@8lee.intercom.com` email in `app/api/contact/intercom/route.ts` - this is for the contact form, NOT the experiment.

---

## What Gets Deleted

### Code Files (13,569 lines total)
- **49 TypeScript files** with intercom- prefix
- **7 API routes** in `app/intercom/api/`
- **18 components** in `app/intercom/components/`
- **4 hooks** in `app/intercom/hooks/`
- **15 lib files** in `app/intercom/lib/`
- **7 scripts** in `app/intercom/scripts/`
- **6 test files**
- **4 documentation files** in `app/intercom/_docs/`
- **2 Next.js pages** (page.tsx, layout.tsx, not-found.tsx)
- **Cache directory** at `app/intercom/cache/`

### Features Removed
- Intercom Intelligence Portal UI
- Natural language query processing
- AI-powered ticket analysis
- Smart caching system
- Two-tier query classification
- Context-aware conversations
- Metadata operations
- Reply generation and posting

---

## What Remains (Safe to Keep)

These files are **NOT** part of the experiment and should remain:

### Contact Form Email Handler
- `app/api/contact/intercom/route.ts` - Sends contact form emails to support@8lee.intercom.com
- This is a separate feature for your website's contact form

### Intercom Integration
- `app/intercom/*` - Completely separate experiment
- No code dependencies with intercom

---

## Isolation Verification

### No Code Dependencies ✓
- Main app does NOT import from `app/intercom/`
- Intercom does NOT import from main app
- Deleting intercom will NOT break homepage
- Build succeeds without errors after deletion

### Command References Only
The only connections are URL strings in command handlers:
- `"intercom"` command → navigates to `/intercom`
- `"zen"` command → alias for intercom
- These are safe to remove (see step 2 above)

### Code Duplication (Intentional)
Intercom has **independent copies** of shared utilities:
- Components (9): boot-sequence, command-prompt, cursor, cv-content, data-grid-section, matrix-background, secure-external-link, terminal-container
- Hooks (2): use-typewriter, use-virtual-keyboard-suppression
- Lib (3): data, utils, utils.test

These duplicates ensure complete isolation - deleting intercom won't affect main app.

---

## Testing After Deletion

### 1. Build Verification
```bash
bun run build
```
Should complete with no errors.

### 2. Homepage Test
```bash
bun run dev
```
Navigate to `http://localhost:1333` - homepage should work perfectly.

### 3. Command Test
Try typing commands in terminal:
- `email` - should work
- `github` - should work
- `intercom` - should show "Invalid command" (expected)

### 4. Contact Form Test
The contact form should still work and send emails to support@8lee.intercom.com

---

## Environment Variables

### Required After Deletion
```bash
OPENAI_API_KEY=         # For AI features (if any)
NEXT_PUBLIC_VERCEL_ENV= # For analytics
```

### Can Be Removed
```bash
INTERCOM_EMAIL=
INTERCOM_API_TOKEN=
INTERCOM_SUBDOMAIN=
```

---

## Rollback Plan

If you need to restore intercom:

```bash
# 1. Restore from git
git checkout main app/intercom

# 2. Restore command references
git checkout main components/command-prompt.tsx
git checkout main lib/utils.ts
git checkout main proxy.ts
git checkout main package.json

# 3. Restore environment variables
# Add back to .env.local:
INTERCOM_EMAIL=jleekun@gmail.com
INTERCOM_API_TOKEN=<your-token>
INTERCOM_SUBDOMAIN=8lee

# 4. Rebuild
bun run build
```

---

## Why This Was Built

The Intercom Intelligence Portal was an experiment to create a natural language interface for querying Intercom APIs. It featured:
- Terminal-style chat interface
- AI-powered query analysis
- Smart caching for performance
- Two-tier query classification
- Context-aware conversations

**Experiment Status:** COMPLETE
**Isolation Status:** 100% ISOLATED
**Deletion Safety:** SAFE TO DELETE

---

## Questions?

If anything breaks after deletion, check:
1. Did you remove the command references? (step 2)
2. Did you update proxy.ts? (step 2)
3. Did you run `bun run build`? (step 4)

The homepage and all main features should work perfectly after deletion.
