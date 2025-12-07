# Update Dependencies

Comprehensive dependency update workflow:

1. Run `bun outdated` to check for available updates
2. Run `bun update` to update packages within semver range
3. Run `bun audit` to check for security vulnerabilities

After updates are applied:

4. Update documentation with new versions:
   - `CLAUDE.md` - Update version numbers in Tech Stack section
   - `README.md` - Update badges and Tech Stack section
   - `docs/release-notes/YYYY-MM-wN-month.md` - Add entry for updated packages

5. Fix all issues aggressively:
   - Run `bunx tsc --noEmit` - Fix any TypeScript errors
   - Run `bunx biome check --write .` - Fix lint and format issues
   - Run `bun test` - Ensure all tests pass
   - Run `bun run build` - Verify production build succeeds

6. If all checks pass:
   - Stage all changes with `git add -A`
   - Create commit with clear message (NO Claude attribution, NO co-authorship)
   - Push to main branch

7. Report summary of what was updated and committed
