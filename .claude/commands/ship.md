# Ship to Production

Run all quality checks and push to main branch:

1. Run `bunx tsc --noEmit` - TypeScript compilation check
2. Run `bunx biome check --write .` - Lint and format
3. Run `bun test` - All tests must pass
4. If all checks pass:
   - Stage all changes with `git add -A`
   - Create commit with clear message (NO Claude attribution, NO co-authorship)
   - Push to main branch
5. Report what was committed and pushed

If any checks fail, fix issues aggressively before committing.
