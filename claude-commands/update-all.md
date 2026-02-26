<!-- Backup: claude-commands/ in yenchat, deathnote, 8leeai. Sync all 3 on any change. -->
# Update All Projects

Run the `/update` workflow for each project sequentially.

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

## Process

For each project in order, `cd` into the project path and run the **exact** `/update` workflow (steps 0-7). Every command in `/update` that doesn't specify a path should be run from the project's directory.

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

After all 7 projects complete, compile:

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

- This command runs `/update` verbatim for each project — all logic lives in `/update`
- If `/update` is changed, this command inherits those changes automatically
- Sequential execution ensures one project's issues don't affect others
- Breaking change gates pause on the specific project, not the entire batch
