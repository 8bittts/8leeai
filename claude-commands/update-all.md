<!-- Backup: claude-commands/ in yenchat, deathnote, 8leeai. Sync all 3 on any change. -->
# Update All Projects

Update global CLI tools to latest, then run the `/update` workflow for each project sequentially.

---

## Phase 0: Global Tools

Update all CLI tools on the local machine before touching any project. This ensures every project's `/update` run sees the latest bun, biome, etc.

### 0a. Homebrew

```bash
brew update && brew upgrade
brew upgrade --cask
```

Report any updated formulae/casks.

### 0b. Bun Runtime

```bash
bun upgrade
```

Record old and new versions — every project's `packageManager` field will be synced to this in `/update` step 1.

### 0c. npm Global Packages

```bash
npm outdated -g
```

If outdated packages exist:

1. Check for **major version bumps** — research breaking changes (WebFetch changelogs)
2. If major bumps found: **present findings and wait for user approval** before updating
3. If only minor/patch: update automatically

```bash
npm install -g <package>@latest ...
```

**Known quirk:** `npm update -g` can fail on Claude Code's internal package name. Update packages individually by name instead.

### 0d. Bun Global Packages

```bash
bun pm ls -g
```

Check each package for newer versions and update:

```bash
bun install -g <package>@latest ...
```

### 0e. Global Tools Report

```
GLOBAL TOOLS:
  Homebrew: N formulae updated, M casks updated (or "all current")
  Bun: old -> new (or "already latest")
  npm globals: (list with old -> new, or "all current")
  Bun globals: (list with old -> new, or "all current")
```

---

## Projects

| Project | Path |
|---------|------|
| yenchat | `/Users/eight/Documents/yenchat` |
| deathnote | `/Users/eight/Documents/deathnote` |
| altoaxcom | `/Users/eight/Documents/altoaxcom` |
| 8leeai | `/Users/eight/Documents/8leeai` |
| particularly | `/Users/eight/Documents/particularly` |
| btcemail | `/Users/eight/Documents/btcemail` |
| btcjobs | `/Users/eight/Documents/btcjobs` |

**Excluded:** 8bittts

---

## Phase 1: Per-Project Updates

For each project in order, `cd` into the project path and run the **exact** `/update` workflow (steps 0-8). Every command in `/update` that doesn't specify a path should be run from the project's directory.

- Process projects sequentially, one at a time
- Report each project's status immediately after completion before moving to the next
- If a project hits the breaking change gate (major version bumps), STOP on that project and present findings — wait for user approval before continuing
- If a project fails and rolls back, move to the next project

---

## Per-Project Report

After each project, report immediately:

```
PROJECT: {PROJECT}
STATUS: success | no-updates | failed | stopped-for-review
PACKAGES UPDATED: (list with old -> new versions, or "none")
BREAKING CHANGES: (summary of major version changes reviewed, or "none")
QUALITY GATES: passed | failed (with error)
COMMIT: (hash, or "n/a")
```

---

## Final Summary

After all phases complete, compile:

**Global Tools:**

| Category | Updates |
|----------|---------|
| Homebrew | ... |
| Bun | ... |
| npm globals | ... |
| Bun globals | ... |

**Projects:**

| Project | Status | Updates | Breaking Changes | Commit |
|---------|--------|---------|------------------|--------|
| yenchat | ... | ... | ... | ... |
| deathnote | ... | ... | ... | ... |
| altoaxcom | ... | ... | ... | ... |
| 8leeai | ... | ... | ... | ... |
| particularly | ... | ... | ... | ... |
| btcemail | ... | ... | ... | ... |
| btcjobs | ... | ... | ... | ... |

---

## Notes

- Phase 0 runs once globally before any project is touched
- Phase 1 runs `/update` verbatim for each project — all logic lives in `/update`
- If `/update` is changed, this command inherits those changes automatically
- Sequential execution ensures one project's issues don't affect others
- Breaking change gates apply to both global tools (Phase 0) and per-project packages (Phase 1)
- `npm update -g` is unreliable — always update individual packages by name
- Bun globals and npm globals may have overlapping packages at different versions — both are updated
