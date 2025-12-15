# 8lee.ai Release Notes Archive

This directory contains organized release notes with weekly files starting November 2025 for optimal management and readability.

## CRITICAL RELEASE NOTES MANAGEMENT RULES

**NEVER CREATE INDEPENDENT RELEASE NOTES** - Always add updates to the appropriate weekly file.

**RELEASE NOTE CONTENT RULES**:

1. Each file is a **log of high-level and important updates** with references to other documentation
2. All updates reflect the **present/last version listed** unless otherwise specified
3. **NO DUPLICATE CONTENT** across files - consolidate without losing critical information
4. Each file contains **historical archived information** for that specific time period
5. Include comprehensive references to detailed technical documentation in other files
6. Focus on strategic value delivered, breaking changes, and architectural improvements
7. **ZERO EMOJI POLICY**: No emojis in release notes. All emojis must be removed to ensure professional, accessible documentation
8. **DATE STAMPING**: All updates must include explicit dates (e.g., "December 9, 2025") for each section/feature
9. **REVERSE CHRONOLOGICAL ORDER**: Within each weekly file, updates for the same day must be in reverse chronological order (newest first)
10. **NO FUTURE WORK**: Release notes capture only completed work. Remove all references to planned features, future improvements, or "Looking Forward" sections
11. **NO FLUFF**: Remove vague statements, aspirational language, or speculative content. Only document actual implementations and results
12. **MULTI-PART RULE**: If a weekly file exceeds 1,800 words, split it into parts using the naming convention `YYYY-MM-wN-month-P.md` where P is the part number (1, 2, 3, etc.). Each part must include clear cross-references to other parts at the top of the file.

**VERSION NUMBERING**: Do not add version numbers unless directly specified and requested.

## Structure

**WEEKLY ORGANIZATION SYSTEM**:

**WEEKLY NAMING CONVENTION**: `YYYY-MM-wN-month.md` where N is the week number (1-5)

Examples:
- `2025-11-w1-november.md` - November 2025 Week 1
- `2025-12-w1-december.md` - December 2025 Week 1
- `2025-12-w2-december.md` - December 2025 Week 2

**RATIONALE FOR WEEKLY SYSTEM**:
- Better file management for ongoing development
- Prevents any single file from becoming unwieldy
- Easier navigation to specific timeframes
- Improved git history and merge conflict reduction
- Better historical reference and archival management

## Usage Guidelines

**DO NOT INDEX** these files unless specifically requested. These are maintained only when called upon for release note updates.

**CONTENT CONSOLIDATION POLICY**:
- Remove duplicate technical details that appear in multiple files
- Preserve unique historical context and decision rationale
- Cross-reference detailed technical documentation in core files (CLAUDE.md, README.md, etc.)
- Focus each file on what was unique and important during that specific timeframe

## File Management

### **Weekly File Management**

**Week Assignment Guidelines**:

- **Week 1**: Days 1-7 of the month
- **Week 2**: Days 8-14 of the month  
- **Week 3**: Days 15-21 of the month
- **Week 4**: Days 22-28 of the month
- **Week 5**: Days 29-31 of the month (if applicable)

**Weekly File Naming Pattern**: `YYYY-MM-wN-month.md`

Examples:
- `2025-11-w1-november.md` (November 1-7)
- `2025-12-w2-december.md` (December 8-14)  
- `2025-12-w3-december.md` (December 15-21)

### **Content Guidelines**

Each weekly file contains:
- Comprehensive release documentation for that week
- Technical implementation details
- Breaking changes and migration notes
- Performance improvements
- Strategic value delivered during that 7-day period

All content follows detailed format with explicit date stamps and status indicators.

### **Archive Management**

**Starting a New Week**:

1. Create new `YYYY-MM-wN-month.md` file following the naming convention
2. Begin adding releases to the new weekly file
3. Previous files remain unchanged as historical archives

**Week Transition Rules**:
- Week boundaries are calendar-based (1-7, 8-14, 15-21, 22-28, 29-31)
- If a release spans multiple days, place it in the week where the majority of work occurred
- Major releases should be documented in the week they were completed/deployed

**File Size Benefits**:
- Weekly organization prevents any single file from becoming unwieldy
- Easier navigation to specific timeframes
- Improved git history and merge conflict reduction
- Better historical reference and archival management

### **Multi-Part Weekly Files**

**CRITICAL RULE**: When a weekly file exceeds 1,800 words, it MUST be split into multiple parts to maintain readability and performance.

**Multi-Part Naming Convention**: `YYYY-MM-wN-month-P.md` where:
- `N` = week number (1-5)
- `P` = part number (1, 2, 3, etc.)

**Examples**:
- `2025-12-w2-december-1.md` (Part 1 of Week 2, December 2025)
- `2025-12-w2-december-2.md` (Part 2 of Week 2, December 2025)
- `2025-12-w2-december-3.md` (Part 3 of Week 2, December 2025)

**Part File Requirements**:

1. **Cross-References**: Each part file MUST include a clear reference section at the top:
   ```markdown
   # 8lee.ai Release Notes - December 2025 (Week 2, Part 2 of 3)
   
   **Other Parts**:
   - [Part 1](2025-12-w2-december-1.md) - December 8-10
   - [Part 2](2025-12-w2-december-2.md) - December 10-11 (this file)
   - [Part 3](2025-12-w2-december-3.md) - December 12-14
   ```

2. **Date Ranges**: Each part should cover a logical date range within the week

3. **Content Split**: Split by date boundaries, keeping related work together

4. **Navigation**: Add "See Part N for [topic]" references where relevant

**When to Split**:
- File exceeds 1,800 words
- File becomes difficult to navigate or edit
- During active development week before it gets too large

**How to Split**:

1. Identify logical date boundaries within the week
2. Create new part files with sequential numbering
3. Move content to appropriate parts
4. Add cross-reference section to ALL parts
5. Update any internal references between parts
6. Test that all markdown links work correctly

## Entry Format

Each release note entry should follow this structure:

```markdown
## Feature/Update Name - Month Day, Year

**Status**: COMPLETE

**Overview**:
Brief description of what was accomplished.

**Changes**:
- Specific change 1
- Specific change 2

**Quality Validation**:
- TypeScript: Zero errors
- Biome: Zero warnings
- Tests: All passing
- Build: Successful
```

**Status Values**:
- `COMPLETE` - Feature fully implemented and deployed
- `IN PROGRESS` - Work started but not yet complete (use sparingly)
- `BLOCKED` - Work blocked by external dependency (use sparingly)

## Historical Files

- **November 2025+**: Weekly format in this directory
- **September-October 2025**: Migrated from monthly format in `/_docs/` to weekly format:
  - September 2025: `2025-09-w5-september.md` (Week 5 only)
  - October 2025: `2025-10-w2-october.md` through `2025-10-w5-october.md` (Weeks 2-5)
- **Pre-September 2025**: Original monthly files preserved in `/_docs/` archive
