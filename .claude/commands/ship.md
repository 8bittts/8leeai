# Ship to Production

Complete quality validation, commit, and push to main.

## Quality Gates (all must pass)

1. **TypeScript**: `bunx tsc --noEmit`
2. **Lint/Format**: `bunx biome check --write .`
3. **Tests**: `bun test`
4. **Dead Code**: `bunx knip --include-entry-exports`
   - BLOCKING: Files with 0 imports - delete them
   - ACCEPTABLE: Unused exports in used files (utility pattern)

## Process

1. Run all quality gates above
2. If dead code found: delete unused files, fix imports
3. Review changes: `git status && git diff`
4. Stage: `git add -A`
5. Commit with concise message (NO Claude attribution, NO co-authorship)
6. Push: `git push origin main`
7. Report what was committed and pushed

## Dead Code Prevention

- Never write "future use" utilities - integrate immediately or don't write
- New utility files MUST have at least one import in the same commit
- If consolidating code, wire it up immediately - no speculative refactors
