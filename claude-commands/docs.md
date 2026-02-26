<!-- Backup: claude-commands/ in yenchat, deathnote, 8leeai. Sync all 3 on any change. -->
# Documentation Audit

Comprehensive documentation review with ultrathink depth.

---

## Files to Audit

**Root docs:**
- `README.md`
- `CLAUDE.md`

**Documentation folder:**
- `docs/*.md` or `_docs/*.md`

---

## Audit Checklist

### 1. Separation of Concerns

| Document | Purpose |
|----------|---------|
| README.md | Executive overview, quick start |
| CLAUDE.md | Developer reference, commands |
| docs/ | Detailed implementation |

### 2. Duplication Check

Search for and remove:
- Architecture tables duplicated across files
- Tech stack versions in multiple files
- Command examples repeated
- Philosophy statements repeated

### 3. Stale Content

Check for:
- Incorrect version numbers
- References to non-existent files
- Outdated status information
- Deprecated patterns

### 4. Emoji Policy

NO emojis in documentation (unless project explicitly allows):
- Search all .md files
- Replace with text descriptions

### 5. TODO Location

If project uses a todos file:
- Move scattered TODOs to canonical location
- Verification checklists `[ ]` in build docs are OK

### 6. Consistency

- Version numbers match package.json
- File paths are correct
- Links resolve properly

---

## Execution

1. Read all documentation files
2. Create findings table
3. Make fixes (aggressive cleanup)
4. Report summary of changes
