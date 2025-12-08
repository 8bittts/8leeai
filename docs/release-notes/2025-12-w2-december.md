# December 2025 - Week 2 (Dec 8-14)

## December 8, 2025

### Claude Code Slash Commands Expansion

Added two new slash commands to streamline development workflows:

**`/push` Command:**
- Fixes lint and type issues aggressively (only files touched in current session)
- Updates release notes following the 1800-word split threshold protocol
- Pushes to main branch with no Claude attribution (per CLAUDE.md rules)
- Combines quality checks with release note management in a single workflow

**`/design` Command:**
- Comprehensive design implementation review using ultrathink mode
- 11-point checklist covering:
  1. Pure shadcn (unmodified components)
  2. Pure Tailwind v4 (no v3 logic)
  3. Zero inline styles
  4. Zero custom components
  5. Zero custom classes
  6. Zero hardcoded values
  7. Zero duplicate design styles
  8. Zero style conflicts
  9. Zero unused/orphaned styles (careful knip for production)
  10. Full WCAG/ARIA coverage
  11. Normalized typography, sizing, spacing, grid patterns
- Asks before proceeding when uncertain

**Documentation Updates:**
- CLAUDE.md: Added Slash Commands section with command reference table
- README.md: Added `.claude/commands/` directory to project structure
- `.claude/commands/README.md`: Updated with `/push` and `/design` command documentation

**Files Created:**
- `.claude/commands/push.md`
- `.claude/commands/design.md`

---

### Context7 MCP Integration

Installed Context7 MCP globally for real-time documentation validation across all projects.

**Configuration:**
- MCP Server: `context7` via HTTP transport
- Endpoint: `https://mcp.context7.com/mcp`
- Scope: User-level (global, available to all projects)

**Purpose:**
- Validate current documentation about software libraries
- Access up-to-date API references and examples
- Reduce reliance on potentially outdated training data

**CLAUDE.md Updated:**
- Added documentation validation rule: "Use Context7 MCP to validate current documentation about software libraries"
