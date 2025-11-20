# Quality Check Command

Fix all lint, biome, and type issues aggressively:

1. Run `bunx tsc --noEmit` to check TypeScript compilation
2. Run `bunx biome check --write .` to fix all Biome issues
3. Run `bun test` to verify all tests pass
4. Report results clearly

If any issues are found, fix them aggressively and re-run checks until everything passes.
