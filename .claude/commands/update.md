Run the package update workflow:

1. Run `bun outdated` to check for available updates
2. Run `bun audit` to check for security vulnerabilities
3. If updates available, run `bun update` to update within semver range
4. For packages outside semver range, install with `bun install package@latest`
5. Run `bunx tsc --noEmit` - if errors, fix them aggressively until 0 errors
6. Run `bun run check` - if warnings, fix them aggressively until 0 warnings
7. Run `bun test` - ensure all tests pass
8. Run `bun run build` - must complete successfully for clean build verification
9. Search globally for version numbers that need updating:
   - CLAUDE.md - Tech stack section
   - README.md - Technology Stack section
   - package.json - verify all @vercel/* packages are consistent
   - next.config.ts - any version-specific configs
   - proxy.ts - check for version-locked imports
   - vercel.json - build commands and framework versions
   - Any config files with hardcoded versions
10. Commit with message "chore: update [package-names]" (NO Claude attribution) and push to main

Quality gates (all must pass before commit):
- TypeScript: 0 errors
- Biome check: 0 warnings
- Tests: all passing
- Build: successful
- Version consistency: all docs match package.json
