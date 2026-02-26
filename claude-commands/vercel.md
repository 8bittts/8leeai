<!-- Backup: claude-commands/ in yenchat, deathnote, 8leeai. Sync all 3 on any change. -->
# Vercel Build Audit

Comprehensive Vercel build validation. Fixes all issues aggressively - no deploy.

---

## Process

### 1. Environment Variable Newline Check

Check for literal `\n` in Vercel credentials/keys (common copy-paste issue):

```bash
# Pull env vars and check for literal \n in values
vercel env pull --environment=production .env.vercel-check 2>/dev/null
grep -E '\\n' .env.vercel-check 2>/dev/null
rm -f .env.vercel-check
```

**Common victims:**
- `CLERK_SECRET_KEY` - JWT keys with embedded newlines
- `SUPABASE_SERVICE_ROLE_KEY` - Base64 with newlines
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secrets
- Private keys (RSA, SSH)

**Symptoms of `\n` issues:**
- "Invalid key format" errors
- JWT verification failures
- Webhook signature mismatches
- Base64 decode errors

### 2. Environment Variables

Check for missing production keys:

```bash
# List Vercel env vars
vercel env ls

# Compare with .env.local
cat .env.local | grep -v "^#" | cut -d= -f1
```

**Common keys to verify:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- Clerk keys (`NEXT_PUBLIC_CLERK_*`, `CLERK_SECRET_KEY`)
- Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)
- `RESEND_API_KEY`
- `OPENAI_API_KEY`

### 3. Configuration Check

**package.json vs vercel.json:**
- Build scripts match
- Node.js version consistent
- All `@vercel/*` packages same version

**Bun adoption:**
- `packageManager` field set to `bun@X.X.X`
- No npm/yarn lockfiles
- Build commands use `bun`

### 4. Dependencies

```bash
bun outdated
```

Check for:
- Missing packages
- Conflicting versions
- Unmet peer dependencies

### 5. Code Quality (Aggressive Fix)

**Fix ALL lint, type, and format issues:**

```bash
# Fix all BiomeJS issues
bun run lint:fix
bun run format

# Run type check
bun run type-check
```

**Fix aggressively** - do not leave any errors or warnings. If BiomeJS or TypeScript reports issues, fix them all.

### 6. Build Log Analysis

**CRITICAL: This is the most important step.** Run a full Vercel build locally to capture ALL warnings and errors:

```bash
# Pull Vercel project settings (required for vercel build)
vercel pull --yes

# Run full Vercel build locally - this captures ALL build warnings
vercel build 2>&1
```

**Analyze the output for:**
- TypeScript errors
- SSG/SSR rendering warnings (e.g., Recharts dimension warnings, hydration issues)
- Missing dependencies
- Deprecation warnings
- Any other warnings or errors

**Fix ALL warnings and errors aggressively.** Common fixes:
- Recharts/chart dimension warnings → add client-side mounting check (`useState`/`useEffect`)
- Hydration mismatches → ensure consistent server/client rendering
- Missing dependencies → install them
- Deprecation warnings → update to non-deprecated APIs

Re-run `vercel build` after fixes to confirm clean output.

---

## Quality Gates

All must pass:
- No literal `\n` in credential values
- All production keys present
- package.json and vercel.json consistent
- No missing dependencies
- No lint or type errors
- **Build completes with ZERO warnings or errors**
