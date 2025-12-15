# 8lee.ai Release Notes - December 2025 (Week 3)

**Period**: December 15-21, 2025

---

## Cursor Rules Hardcore Cleanup - December 15, 2025

**Status**: COMPLETE

**Overview**:
Completely overhauled cursor rules to eliminate stale content and contradictions. Created minimal reference-based `.cursorrules` file that points to canonical documentation instead of duplicating content.

**Problem**:
- Cursor rules were stale (not updated since September)
- Contained contradictions with existing documentation
- Duplicated content already present in CLAUDE.md, README.md, and other docs
- Violated principle of single source of truth

**Solution**:
- Created minimal 37-line `.cursorrules` file
- Established CLAUDE.md as canonical technical resource
- Removed all duplication - rules now reference existing docs
- Added clear documentation hierarchy section
- Included only essential quick-reference rules

**Files Created:**
- `.cursorrules` - Minimal reference-based cursor rules

**Documentation Hierarchy Established:**
- **CLAUDE.md** - Technical canonical (commands, workflow, coding rules, references)
- **README.md** - Architecture, design system, tech stack (source of truth)
- **docs/00-ROADMAP.md** - Active TODOs and future work (ONLY place for plans)
- **docs/release-notes/** - Weekly development logs
- **app/experiments/_docs/00-EXPERIMENTS-PROTOCOL.md** - Experiment standards

**Key Principles:**
- Prefer simple solutions using existing patterns
- Avoid duplication - check codebase first
- Fix issues without introducing new patterns/technologies
- Keep codebase clean and organized
- Reference documentation instead of recreating it

**Quality Validation:**
- TypeScript: Zero errors
- Biome: Zero warnings
- All rules align with existing documentation
- No contradictions identified

---

