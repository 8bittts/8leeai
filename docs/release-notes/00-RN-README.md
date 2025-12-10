# Release Notes Guide

Weekly release notes for 8lee.ai development.

## File Naming

**Weekly:** `YYYY-MM-wN-month.md` (e.g., `2025-12-w1-december.md`)

**Multi-part weeks:** `YYYY-MM-wN-P-month.md` (e.g., `2025-12-w1-1-december.md`)

**Week boundaries:**
- Week 1: Days 1-7
- Week 2: Days 8-14
- Week 3: Days 15-21
- Week 4: Days 22-28
- Week 5: Days 29-31

## Content Rules

1. **No independent files** - Always add to the appropriate weekly file
2. **No emojis** - Professional, accessible documentation
3. **Date stamp everything** - Include explicit dates for each section
4. **Reverse chronological** - Newest entries first within each file
5. **No future work** - Only document completed implementations
6. **No fluff** - Remove vague statements and aspirational language
7. **No duplicates** - Cross-reference detailed docs, don't repeat content

## Splitting Weeks

Split when file exceeds **1800 words**:

1. Use pattern `YYYY-MM-wN-P-month.md`
2. Add cross-reference header to ALL parts:
   ```markdown
   **Note**: This week is split into multiple parts:
   - Part 1: [2025-12-w1-1-december.md](./2025-12-w1-1-december.md)
   - Part 2: [2025-12-w1-2-december.md](./2025-12-w1-2-december.md)
   ```
3. Split at logical date boundaries
4. Delete the original single-part file

## Entry Format

```markdown
## Feature/Update Name - Month Day, Year

**Status**: COMPLETED

**Changes**:
- Specific change 1
- Specific change 2

**Quality Validation**:
- TypeScript: Zero errors
- Biome: Zero warnings
- Tests: All passing
- Build: Successful
```

## Historical Files

- **November 2025+**: Weekly format in this directory
- **Pre-November 2025**: Monthly format in `/_docs/`
