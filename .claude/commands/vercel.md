# Vercel Comprehensive Review

Complete Vercel deployment review and validation workflow via CLI.

## Process

### 1. Production Keys and Credentials Review

**Review .env.local and local keys:**
- Check `.env.local` exists and contains all required production keys
- Verify no missing environment variables needed for Vercel deployment
- Check for `\n` newline issues in environment variables (common problem)
- Review any local credential files for completeness
- Compare against Vercel project environment variables via CLI: `vercel --scope death-note env ls`

**Newline Issue Detection:**
- Check each env var for embedded `\n` characters
- Verify multiline values are properly formatted
- Fix any newline issues that could break deployment

### 2. Configuration Review

**Review package.json and vercel.json for issues/conflicts:**
- Verify `package.json` and `vercel.json` are consistent
- Check `buildCommand` and `installCommand` in vercel.json match package.json scripts
- Verify `framework` setting matches actual framework (nextjs)
- Check for conflicting Node.js version requirements
- Verify Bun adoption: `packageManager` field, build commands use `bun`
- Review `regions` and other Vercel-specific settings

### 3. Dependencies Review

**Review missing libraries and conflicting versions:**
- Run `bun outdated` to check for available updates
- Check for missing dependencies that should be installed locally
- Verify all `@vercel/*` packages are consistent versions
- Review for conflicting package versions
- Check `bun.lock` is up to date and consistent

### 4. Warnings and Bun Adoption

**Review all warnings and fix/update:**
- Run `vercel --scope death-note inspect [latest-deployment] --logs` to check build logs
- Identify all warnings in build output
- Fix warnings or ask user for clarification if needed
- Verify 100% Bun adoption:
  - `packageManager: "bun@1.3.3"` in package.json
  - `buildCommand: "bun run build"` in vercel.json
  - `installCommand: "bun install"` in vercel.json
  - No npm/yarn/pnpm references in scripts or configs
- Update any non-Bun references

### 5. Iterative Fix and Deploy Cycle

**If issues found:**
1. Fix all identified issues
2. Run `/ship` command to commit and push changes
3. Tail Vercel deployment via CLI:
   - `vercel --scope death-note ls` to get latest deployment URL
   - `vercel --scope death-note inspect [url] --wait --timeout 5m` to monitor deployment
   - `vercel --scope death-note inspect [url] --logs` to review build logs
4. Verify deployment is successful and warnings are resolved
5. Repeat steps 1-4 until deployment is perfect and clean

**Success Criteria:**
- All warnings resolved or clarified
- Build completes successfully
- No errors in deployment logs
- 100% Bun adoption confirmed
- All environment variables properly configured

### 6. Documentation Update

**Update canonical documentation:**
- Run `/docs` slash command to audit documentation
- Ensure all Vercel configuration changes are documented
- Update CLAUDE.md if new patterns or requirements discovered
- Update README.md if architecture or deployment process changed
- Add entry to release notes documenting Vercel review and fixes

## Vercel CLI Commands Reference

**Always use `--scope death-note` flag:**
- `vercel --scope death-note ls` - List deployments
- `vercel --scope death-note inspect [url]` - Inspect deployment
- `vercel --scope death-note inspect [url] --logs` - View build logs
- `vercel --scope death-note inspect [url] --wait` - Wait for deployment
- `vercel --scope death-note env ls` - List environment variables
- `vercel --scope death-note project inspect 8leeai` - Project configuration

## Quality Gates

All must pass before completion:
- No missing environment variables
- No newline issues in env vars
- package.json and vercel.json consistent
- No conflicting package versions
- All warnings resolved or clarified
- 100% Bun adoption verified
- Deployment successful with clean logs
- Documentation updated

