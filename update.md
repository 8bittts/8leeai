# Package Update Workflow

Run these commands in order. Fix all issues aggressively before committing.

## 1. Check & Update

```bash
bun outdated          # See what needs updating
bun audit             # Check for vulnerabilities
bun update            # Update within semver range (respects package.json)
```

For packages outside semver range:
```bash
bun install package-name@latest
```

## 2. Fix All Issues

```bash
bunx tsc --noEmit     # Fix ALL errors until 0 remain
bun run check         # Fix ALL warnings until 0 remain (Biome)
bun test              # Ensure all tests pass
bun run build         # Must complete successfully
```

**Do not proceed until all four pass cleanly.**

## 3. Update Version Numbers Globally

Search and update version numbers in ALL these locations:

| File | What to Update |
|------|----------------|
| `CLAUDE.md` | Tech stack section with major package versions |
| `README.md` | Technology Stack section |
| `package.json` | Verify @vercel/* packages are consistent |
| `next.config.ts` | Version-specific configurations |
| `proxy.ts` | Version-locked imports |
| `vercel.json` | Build commands, framework versions |
| `tsconfig.json` | Target/lib versions if TypeScript updated |

### Vercel Package Consistency Check

Ensure all @vercel/* packages are on compatible versions:
```bash
bun ls | grep @vercel
```

## 4. Update Release Notes

Add entry to `docs/release-notes/[current-week].md`:

```markdown
## Routine Package Updates - [Date]

**Status**: X routine package updates COMPLETED

**Packages Updated**:
- package-name: X.X.X -> Y.Y.Y (description)

**Quality Validation**:
- TypeScript: Zero errors
- Biome: Zero warnings
- Tests: All passing
- Build: Successful
```

### Split Week Protocol

If the weekly release notes file exceeds **1,000-1,200 lines**, split into parts:

**Naming**: `YYYY-MM-wN-month-P.md` where P is part number

Examples:
- `2025-12-w1-december-1.md` (Part 1)
- `2025-12-w1-december-2.md` (Part 2)

**Requirements**:
- Add cross-references at top of each part file
- Split at logical date boundaries
- Keep related work together
- Entries in reverse chronological order (newest first)

## 5. Commit & Push

```bash
git add -A
git commit -m "chore: update [package-names]"
git push origin main
```

Note: NO Claude attribution or co-authorship tags per project rules.

## Quality Gates

All must pass before commit:

| Check | Requirement |
|-------|-------------|
| `bunx tsc --noEmit` | 0 errors |
| `bun run check` | 0 warnings |
| `bun test` | All passing |
| `bun run build` | Successful |
| Version consistency | All docs match package.json |
| Release notes | Updated with comprehensive entry |

## Quick Reference

| Command | Purpose |
|---------|---------|
| `bun outdated` | List packages with available updates |
| `bun update` | Update all packages within semver range |
| `bun audit` | Check for security vulnerabilities |
| `bun install pkg@latest` | Update specific package to latest |
| `bun ls \| grep @vercel` | Check Vercel package versions |
