<!-- Backup: claude-commands/ in yenchat, deathnote, 8leeai. Sync all 3 on any change. -->
# Ship Changes

Commit all local changes to main branch.

## Git Rules

- NO Claude/AI attribution (no "Generated with Claude", no "Co-Authored-By")
- Concise messages summarizing all changes

---

## Process

### 1. Fetch Latest

```bash
git fetch origin main
```

Check if behind remote — consider pulling first if diverged.

### 2. Quality Checks

```bash
bun run lint && bunx tsc --noEmit && bun run build
```

### 3. Review ALL Changes

```bash
git status
git diff --stat
```

Review everything. Ensure no sensitive files (.env, credentials).

### 4. Stage Everything

```bash
git add .
```

### 5. Verify Staged

```bash
git diff --cached --stat
```

### 6. Commit

```bash
git commit -m "Comprehensive update: [summary]"
```

### 7. Push

```bash
git push origin main
```

---

## Safety Checks

Before pushing, verify:
- No sensitive files (.env, secrets, keys)
- Quality checks passed
- All changes reviewed and intentional
