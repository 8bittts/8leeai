# Release Notes Documentation

This directory contains monthly release notes for the 8lee.ai terminal portfolio project.

## Status Documents

- [project-isolation-status.md](project-isolation-status.md) - Zendesk and Intercom project isolation verification (100% isolated, safe to delete)

## Naming Convention

Release note files follow this naming pattern:
```
[year]-[month].md
```

Where:
- `[year]` is the 4-digit year (e.g., `2025`)
- `[month]` is the lowercase full month name (e.g., `october`, `november`)

### Examples:
- `2025-october.md` - October 2025 release notes
- `2025-november.md` - November 2025 release notes
- `2025-september.md` - September 2025 release notes

## File Structure

Each monthly file contains all release notes for that month, organized by date in reverse chronological order (newest first).

### Format Guidelines

Within each monthly file:
- Use **date-based organization** (e.g., `## October 12, 2025`)
- **No timestamps** - all entries for a given day go under the same date heading
- Multiple updates on the same day are added as additional `###` entries under that date
- Format: `### Feature/update title` (no timestamps like "14:30 PST")
- Entries within a date are ordered most recent first (new entries added at top of date section)

## Important Notes

These files are manually curated by the project maintainer. When updating:
1. Find the appropriate monthly file (create if it doesn't exist)
2. Add new entries at the top of the file (after the header)
3. Use consistent formatting as shown in existing entries
4. Include clear descriptions of changes, impacts, and files affected

## Current Release Notes

Active release note files:
- [2025-november.md](2025-november.md) - November 2025
- [2025-october.md](2025-october.md) - October 2025
- [2025-september.md](2025-september.md) - September 2025

## Project Documentation

### Terminal Portfolio
- [portfolio-improvements-master.md](portfolio-improvements-master.md) - Completed improvements master plan (3 features, 11 commands)
- [project-isolation-status.md](project-isolation-status.md) - Archived experimental projects status

### Archived Experimental Projects
**Note:** Zendesk and Intercom Intelligence Portals are archived (November 2025). Documentation remains in their respective `app/` directories but projects are gitignored and no longer under active development.