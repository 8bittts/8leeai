Run the package update workflow:

1. Run `bun outdated` to check for available updates
2. Run `bun audit` to check for security vulnerabilities
3. If updates available, run `bun update` to update within semver range
4. For packages outside semver range, install with `bun install package@latest`
5. Run `bunx tsc --noEmit` - if errors, fix them aggressively until 0 errors
6. Run `bun run check` - if warnings, fix them aggressively until 0 warnings
7. Run `bun test` - ensure all tests pass
8. Run `bun run build` - must complete successfully for clean build verification
9. Sync documentation versions with package.json (MANDATORY - always update to match actual versions):

   Extract versions from package.json and update these files:

   **README.md** - Update ALL version references:
   - Badges: `[![Next.js](https://img.shields.io/badge/Next.js-X.X.X-black)]`
   - Badges: `[![React](https://img.shields.io/badge/React-X.X.X-blue)]`
   - Badges: `[![Tailwind CSS](https://img.shields.io/badge/Tailwind-vX.X.X-38B2AC)]`
   - Badges: `[![Bun](https://img.shields.io/badge/Bun-X.X.X-fbf0df)]`
   - Quick Start: `[Bun](https://bun.sh) vX.X.X+`
   - Tech Stack table: All version numbers in the Version column

   **CLAUDE.md** - Update:
   - Bun version: `**Bun X.X.X**`

   Version mapping (package.json field -> docs):
   - `packageManager: "bun@X.X.X"` -> Bun version
   - `next` -> Next.js version
   - `react` -> React version
   - `tailwindcss` -> Tailwind CSS version
   - `typescript` -> TypeScript version
   - `@biomejs/biome` -> Biome version
   - `@vercel/analytics` -> Vercel Analytics version

10. Commit with message "chore: update [package-names]" (NO Claude attribution) and push to main

Quality gates (all must pass before commit):
- TypeScript: 0 errors
- Biome check: 0 warnings
- Tests: all passing
- Build: successful
- Version consistency: all docs MUST match package.json exactly
