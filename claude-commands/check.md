<!-- Backup: claude-commands/ in yenchat, deathnote, 8leeai. Sync all 3 on any change. -->
# Quick Quality Check

Run quality checks without committing.

## Process

```bash
# Type check
bunx tsc --noEmit

# Lint check
bun run lint

# Build verification (optional but recommended)
bun run build
```

**Quality gates (all must pass):**
- TypeScript: 0 errors
- Lint: 0 errors
- Build: successful

For full workflow with commit, use `/ship`.
