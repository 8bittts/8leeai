<!-- Backup: claude-commands/ in yenchat, deathnote, 8leeai. Sync all 3 on any change. -->
# Fix Issues

Automatically fix common issues in the codebase.

---

## Process

### 1. Lint Auto-Fix

```bash
bun run lint --fix
```

Or with Biome:
```bash
bunx biome check --fix .
```

### 2. Format Code

```bash
bunx biome format --write .
```

Or with Prettier:
```bash
bunx prettier --write .
```

### 3. Type Errors

```bash
bunx tsc --noEmit
```

Fix errors shown. Common fixes:
- Add missing types
- Fix null checks
- Update imports

### 4. Build Errors

```bash
bun run build
```

Fix any build errors before committing.

### 5. Dead Code

```bash
bunx knip
```

Remove unused:
- Exports
- Dependencies
- Files

---

## Quality Gates

After fixing, verify:
```bash
bun run lint && bunx tsc --noEmit && bun run build
```

All must pass with 0 errors.
