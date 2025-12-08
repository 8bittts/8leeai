# Push to Main

Fix issues, update release notes, and push to main branch.

## Steps

1. **Identify touched files**: Run `git diff --name-only` to get list of files modified in this session

2. **Fix lint and type issues** (only touched files):
   - Run `bunx tsc --noEmit` - fix any TypeScript errors in touched files
   - Run `bunx biome check --write .` - fix all Biome issues
   - Be aggressive - fix all issues before proceeding

3. **Update release notes**:
   - Check current week file in `docs/release-notes/` (use `2025-12-w2-december.md` for Dec 8-14)
   - Add entry for this update following the protocol in `docs/release-notes/00-RN-README.md`
   - **CRITICAL SIZE CHECK**: If file exceeds 1800 words, split into multi-part files:
     - Use pattern `YYYY-MM-wN-P-month.md` (e.g., `2025-12-w2-1-december.md`, `2025-12-w2-2-december.md`)
     - Add cross-reference header to all parts
   - Follow all rules: no emojis, date stamps, reverse chronological order, no future work, no fluff

4. **Run tests**: `bun test` - all tests must pass

5. **Commit and push**:
   - Stage all changes: `git add -A`
   - Create commit with clear message (NO Claude attribution, NO co-authorship tags)
   - Push to main: `git push origin main`

6. **Report**: Summarize what was fixed, what was added to release notes, and confirm push success
