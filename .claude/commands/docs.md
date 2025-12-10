# Documentation Audit

Comprehensive audit of all project documentation using ultrathink mode.

## Documentation Hierarchy

| Document | Role |
|----------|------|
| **CLAUDE.md** | Technical canonical for Claude Code (concise, references other docs) |
| **README.md** | Architecture, design system, tech stack (source of truth) |
| **docs/00-ROADMAP.md** | Active TODOs and future work (ONLY place for plans) |
| **docs/release-notes/** | Weekly development logs |

## Audit Checklist

### 1. Duplication Check
- Compare CLAUDE.md and README.md for repeated content
- Tech stack versions should only be detailed in README.md
- Design system details should only be in README.md
- CLAUDE.md should reference, not duplicate

### 2. Separation of Concerns
- CLAUDE.md: Commands, workflow, coding rules, references
- README.md: Executive summary, architecture, design system, tech stack
- ROADMAP.md: Active TODOs, future ideas (no other doc should have TODOs)
- Release notes: Only completed work, no future plans

### 3. Content Rules
- **No emojis** in any markdown files
- **No TODOs** outside of docs/00-ROADMAP.md
- **No dates** in docs except release notes and ROADMAP.md
- **No future work** in release notes
- **No fluff** or aspirational language

### 4. Stale Content Check
- Review ROADMAP.md for completed items that should be removed
- Check release notes for outdated references
- Verify version numbers match package.json

### 5. Consolidation Opportunities
- Look for repeated content across files
- Identify docs that could be merged or deleted
- Ensure cross-references are working

## Process

1. **Read** all documentation files listed in the hierarchy
2. **Identify** duplication, stale content, and policy violations
3. **Report** findings with specific file locations
4. **Ask** before making changes
5. **Fix** all identified issues
6. **Update** release notes with audit results

## Files to Audit

- `/CLAUDE.md`
- `/README.md`
- `/docs/00-ROADMAP.md`
- `/docs/release-notes/00-RN-README.md`
- `/.claude/commands/README.md`
- `/app/experiments/_docs/00-EXPERIMENTS-PROTOCOL.md`
- `/_docs/README.md`
