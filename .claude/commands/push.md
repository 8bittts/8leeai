# Push to Main

Fix issues and push to main branch.

## Steps

1. **Identify touched files**: Run `git diff --name-only` to get list of files modified in this session

2. **Fix lint and type issues** (only touched files):
   - Run `bunx tsc --noEmit` - fix any TypeScript errors in touched files
   - Run `bunx biome check --write .` - fix all Biome issues
   - Be aggressive - fix all issues before proceeding

3. **Run tests**: `bun test` - all tests must pass

4. **Commit and push**:
   - Stage all changes: `git add -A`
   - Create commit with clear message (NO Claude attribution, NO co-authorship tags)
   - Push to main: `git push origin main`

5. **Report**: Summarize what was fixed and confirm push success
