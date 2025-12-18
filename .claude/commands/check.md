# Quality Check

Quick quality check (no commit).

## Steps

1. `bunx tsc --noEmit` - TypeScript compilation
2. `bunx biome check --write .` - Lint and format
3. `bun test` - All tests pass
4. `bunx knip --include-entry-exports` - Dead code detection

If any issues are found, fix them aggressively and re-run checks until everything passes.

For full workflow with commit, use `/ship`.
