<!-- Backup: claude-commands/ in yenchat, deathnote, 8leeai. Sync all 3 on any change. -->
# Package Update Workflow

Update all packages to latest versions with breaking change review gate.

---

## Process

### 0. Pre-Flight Check

Check for uncommitted changes before starting:

```bash
git status --porcelain
```

- If dirty: stash with `git stash push -m "pre-update stash"`
- Note the stash so it can be popped after the update

Detect the default branch name:

```bash
basename "$(git symbolic-ref refs/remotes/origin/HEAD)"
```

Use the detected branch name for push (fallback to `main` if detection fails).

### 1. Detect Available Updates

```bash
bunx npm-check-updates
```

**IMPORTANT:** Ignore the `bun` entry in ncu output — this is the `packageManager` field, not a real dependency.

- If no real dependency updates: report "no-updates" (restore stash if applicable) and stop
- If updates exist: proceed to breaking change review

### 2. Breaking Change Review

For every package with a **major version bump** (e.g., 2.x.x -> 3.x.x):

1. List each major bump clearly: `package@current -> package@new`
2. Check for known breaking changes by running: `bunx npm-check-updates --format group` to see updates grouped by semver level
3. Research breaking changes for each major bump — check the package's changelog or release notes (use WebFetch on the package's GitHub releases page or changelog)
4. Present a summary of breaking changes found

**Decision gate:**
- If ANY major version bumps exist: **STOP and present findings to the user**. List each major bump with its breaking changes. Wait for explicit approval before proceeding.
- If only minor/patch updates: proceed automatically to step 3.

### 3. Apply Updates

Force ALL updates (major + minor + patch) to latest versions:

```bash
bunx npm-check-updates -u --reject bun
bun install
```

The `--reject bun` flag skips the packageManager field.

**Verify `packageManager` field is current:** Check `package.json` for the `"packageManager"` field. If its version is behind the locally installed bun version (`bun --version`), update it to match. ncu sometimes reverts this field to an older version from a cached state.

**Biome config migration:** If `@biomejs/biome` was updated, run `bunx biome migrate --write` to update the `biome.json` schema version. Stage `biome.json` alongside other changes.

**Verify changes exist** before proceeding:

```bash
git diff --stat
```

If no files changed, report "no-updates" and stop (restore stash if applicable).

### 4. Quality Gates

All must pass:

```bash
bunx tsc --noEmit
bun run check || bun run lint
bun run build
```

If the project has knip configured (check for `knip.json` or `knip` in package.json scripts):

```bash
bunx knip
```

### 5. On Failure: Auto-Fix Then Retry

If quality gates fail, try Biome auto-fix:

```bash
bunx biome check --fix .
bunx biome format --write .
```

Retry quality gates. If still failing, rollback ALL changes:

```bash
git checkout -- .
```

Restore stash if applicable: `git stash pop`

Report the specific error and stop.

### 6. Version Consistency

Read CLAUDE.md and README.md in the project (if they exist). If they contain tech stack version numbers that changed due to updates, edit them to match package.json.

### 7. Commit and Push

Only stage files actually changed by the update process:

```bash
git add package.json bun.lock
git add biome.json 2>/dev/null || true
git add CLAUDE.md README.md 2>/dev/null || true
git commit -m "chore: update packages"
git push origin {BRANCH}
```

After commit, restore stash if applicable: `git stash pop`

---

## Report

After completion, report:

```
STATUS: success | no-updates | failed | stopped-for-review
PACKAGES UPDATED: (list with old -> new versions, or "none")
BREAKING CHANGES: (summary of major version changes reviewed, or "none")
QUALITY GATES: passed | failed (with error)
COMMIT: (hash, or "n/a")
```

---

## Notes

- Pre-flight stash prevents mixing uncommitted work into update commits
- `bunx npm-check-updates` detects ALL updates including major versions
- The `bun` entry in ncu output is the packageManager field — always reject it
- Major version bumps require explicit user approval before applying
- `git diff --stat` after install prevents empty commits
- Failed updates rollback ALL changes including Biome auto-fix modifications
- Biome auto-fix is used directly (not `bun run lint --fix`)
- knip runs when configured to catch dead code after updates
- Version docs (CLAUDE.md, README.md) are updated when package versions change
- Branch name is auto-detected (fallback to main)
- The `packageManager` field in package.json can drift behind the installed bun version — always verify and update it
- When Biome is updated, `biome.json` schema version must be migrated with `bunx biome migrate --write`
- Stage `biome.json` alongside `package.json` and `bun.lock` when it changes
