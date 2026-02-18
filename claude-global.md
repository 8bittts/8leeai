# Claude Code Global Configuration Backup

This file contains a backup of global Claude Code configuration stored in `~/.claude/`. Use this to restore settings on a new computer.

---

## Parity Rule — 1:1:1 Sync

This file exists in 3 repos and MUST be identical across all of them:

| Repo | Path | GitHub |
|------|------|--------|
| deathnote | `claude-global.md` | [8bittts/deathnote](https://github.com/8bittts/deathnote) |
| yenchat | `claude-global.md` | [8bittts/yenchat](https://github.com/8bittts/yenchat) |
| 8leeai | `claude-global.md` | [8bittts/8leeai](https://github.com/8bittts/8leeai) |

When updating this file, update ALL 3 copies and commit/push each repo. If any copy drifts, the others are authoritative — diff and reconcile.

---

## Global CLAUDE.md

Location: `~/.claude/CLAUDE.md`

```markdown
# Global Claude Code Rules

Universal rules applied to ALL projects. Project-specific rules in each project's CLAUDE.md.

---

## Verification & Checking

**CLI-First Rule:** When asked to verify, check, or audit anything, ALWAYS use CLI tools/commands first before reporting findings. Never rely solely on file reading or previous context for verification tasks.

```bash
# CORRECT: Run fresh commands
grep -r "pattern" --include="*.ts"
git status

# WRONG: Report from memory or cached context
"Based on what I read earlier..."
```

---

## Task Completion

**Complete Fully:** For maintenance tasks (package updates, dependency management, cleanup, refactoring), run through to completion. If a task has multiple steps, complete ALL steps before stopping.

- Do not leave tasks partially done
- If blocked, report the blocker clearly before stopping
- Commit completed work before moving to next task

**Phased Work:** For large tasks, break into explicit phases. Complete each phase fully before proceeding:
```
Phase 1: [task] → complete → commit
Phase 2: [task] → complete → commit
```

---

## Quality Gates

**Sequence:** After code changes, run quality gates in this order:
1. Lint (`bun run lint` or `bun run check`)
2. Typecheck (`bunx tsc --noEmit`)
3. Build (`bun run build`)

**Pre-commit:** Always run quality gates before committing. Fix failures before proceeding.

---

## Package Manager

**Bun Exclusively:** Use `bun` for all package operations. Never use npm, yarn, or pnpm.

```bash
bun install          # Install deps
bun add <pkg>        # Add package
bun remove <pkg>     # Remove package
bun run <script>     # Run script
bunx <cmd>           # Run binary
```

---

## Git & Commits

**No AI Attribution:** Never include AI/Claude mentions in commits:
- No "Generated with Claude"
- No "Co-Authored-By: Claude" or similar
- No "AI-assisted" references

**Commit Style:** Concise, descriptive messages summarizing changes.

**Pre-push Checklist:**
1. Quality gates passed
2. No sensitive files (.env, credentials, keys)
3. All intended files staged (check `git status`)

---

## Documentation

**Global Backup Sync:** `claude-global.md` is maintained in 3 repos with 1:1:1 parity: `deathnote`, `yenchat`, and `8leeai`. When updating, sync all 3 copies and `/ship` each repo.

**No Emojis:** Use text markers in documentation:
- `[YES]` / `[NO]` instead of checkmarks
- `[WARNING]` / `[CRITICAL]` / `[NOTE]` for callouts
- `(DONE)` / `(COMPLETE)` for status

**No Dates in CLAUDE.md:** Use git history for temporal tracking.

**Library Documentation:** Use Context7 MCP to validate current documentation about software libraries before implementing.

---

## CLI Preference

Prefer CLI tools over web dashboards:
- `gh` for GitHub (issues, PRs, API)
- `vercel` for Vercel operations
- `supabase` for Supabase operations
- `sentry-cli` for Sentry operations

---

## Problem Solving

**Plan First:** For non-trivial tasks (3+ steps or architectural decisions):
1. Write the plan to `todos.md` if one exists in the project, otherwise use Claude native plan mode
2. Run `/ship` to capture the plan in GitHub before starting implementation
3. If implementation goes sideways, STOP and re-plan immediately

**Use Subagents:** When there are 2+ clearly defined tasks, use subagents for parallel execution. Default to subagents over sequential work. One focused task per subagent. Keep main context window clean by offloading research, exploration, and analysis.

**Be Autonomous:** When given a bug or error, fix it. Don't ask for hand-holding. Point at logs, errors, or failing tests - then resolve them. Zero context switching required from the user.

**Prove It Works:** Never consider a task complete without demonstrating correctness. Run the code, check the output, verify the behavior. "Would a staff engineer approve this?"

---

## Communication Style

- Be concise - terminal output should be scannable
- Report what was done, not what will be done
- When blocked, state the blocker clearly
- No filler phrases or excessive explanation

---

## Global Commands

Available via `~/.claude/commands/`:

| Command | Purpose |
|---------|---------|
| `/check` | Quick quality check (lint + types) |
| `/ship` | Commit + push changes |
| `/update` | Package update workflow (single project) |
| `/update-all` | Update all 7 projects sequentially |
| `/vercel` | Vercel deployment audit |
| `/docs` | Documentation audit |
| `/design` | Exhaustive UI/UX design audit (Opus agent) |
| `/fix` | Auto-fix lint/format issues |
| `/tag-team` | Dual-persona code review (architect + staff engineer) |
| `/team` | 8-member agent team review (UI, arch, security, simplification, docs, marketing, devil's advocate, macOS/iOS) |
| `/team-mac` | 8-member macOS engineering squad (architect, 20yr engineer, designer, docs, Ghostty specialist, pipeline, GTM, devil's advocate) |
| `/react-YOLO` | Vercel's React/Next.js performance best practices (40+ rules, 8 categories) |
| `/substack` | Draft newsletter post in 8Lee's voice (Building DeathNote / Digital Onigiri) |
| `/today` | Daily summary of Claude Code usage (token counts, work themes, artefacts) |

---

## Shell Aliases

User's custom zsh aliases (defined in `~/.zshrc`) for quick reference:

**AI Tools:**

| Alias | Expands To | Purpose |
|-------|-----------|---------|
| `cj` | `claude --dangerously-skip-permissions` | Claude Code (no permission prompts) |
| `jp` | `codex --yolo` | OpenAI Codex (auto-approve mode) |

**System:**

| Alias | Expands To | Purpose |
|-------|-----------|---------|
| `unlock` | `security unlock-keychain ~/Library/Keychains/login.keychain-db` | Unlock macOS keychain |

**Navigation & Files:**

| Alias | Expands To |
|-------|-----------|
| `..` | `cd ..` |
| `...` | `cd ../..` |
| `c` | `clear` |
| `h` | `history` |
| `p` | `pwd` |
| `ls` | `eza --icons=auto` |
| `ll` | `eza -l --icons=auto --git` |
| `la` | `eza -la --icons=auto --git` |
| `lt` | `eza --tree --level=2 --icons=auto` |
| `tree` | `eza --tree --icons=auto` |

**Modern CLI Replacements:**

| Alias | Replaces | Tool |
|-------|----------|------|
| `cat` | cat | `bat --paging=never` |
| `less` | less | `bat` |
| `grep` | grep | `rg` (ripgrep) |
| `find` | find | `fd` |
| `diff` | diff | `delta` |
| `sed` | sed | `sd` |
| `du` | du | `dust` |
| `df` | df | `duf` |
| `dig` | dig | `doggo` |
| `top` | top | `btop` |
| `ps` | ps | `procs` |
| `rm` | rm | `trash` |

**Git & Dev:**

| Alias | Expands To |
|-------|-----------|
| `lg` | `lazygit` |

**YEN App:**

| Alias | Expands To |
|-------|-----------|
| `email` | `yen email` |
| `g` | `yen g` |
| `weather` | `yen weather` |

---

*Global rules v1.2 - Applies to all projects automatically*
```

---

## Global Commands

Location: `~/.claude/commands/`

### check.md

```markdown
# Quick Quality Check

Run quality checks without committing.

## Process

```bash
# Type check
bunx tsc --noEmit

# Lint check
bun run lint

# Build verification (optional but recommended)
bun run build
```

**Quality gates (all must pass):**
- TypeScript: 0 errors
- Lint: 0 errors
- Build: successful

For full workflow with commit, use `/ship`.
```

### ship.md

```markdown
# Ship Changes

Commit all local changes to main branch.

## Git Rules

- NO Claude/AI attribution (no "Generated with Claude", no "Co-Authored-By")
- Concise messages summarizing all changes

---

## Process

### 1. Fetch Latest

```bash
git fetch origin main
```

Check if behind remote — consider pulling first if diverged.

### 2. Quality Checks

```bash
bun run lint && bunx tsc --noEmit && bun run build
```

### 3. Review ALL Changes

```bash
git status
git diff --stat
```

Review everything. Ensure no sensitive files (.env, credentials).

### 4. Stage Everything

```bash
git add .
```

### 5. Verify Staged

```bash
git diff --cached --stat
```

### 6. Commit

```bash
git commit -m "Comprehensive update: [summary]"
```

### 7. Push

```bash
git push origin main
```

---

## Safety Checks

Before pushing, verify:
- No sensitive files (.env, secrets, keys)
- Quality checks passed
- All changes reviewed and intentional
```

### update.md

```markdown
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
git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'
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
```

### docs.md

```markdown
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
```

### fix.md

```markdown
# Fix Issues

Automatically fix common issues in the codebase.

---

## Process

### 1. Lint Auto-Fix

```bash
bun run lint --fix
```

Or with Biome:
```bash
bunx biome check --fix .
```

### 2. Format Code

```bash
bunx biome format --write .
```

Or with Prettier:
```bash
bunx prettier --write .
```

### 3. Type Errors

```bash
bunx tsc --noEmit
```

Fix errors shown. Common fixes:
- Add missing types
- Fix null checks
- Update imports

### 4. Build Errors

```bash
bun run build
```

Fix any build errors before committing.

### 5. Dead Code

```bash
bunx knip
```

Remove unused:
- Exports
- Dependencies
- Files

---

## Quality Gates

After fixing, verify:
```bash
bun run lint && bunx tsc --noEmit && bun run build
```

All must pass with 0 errors.
```

### design.md

```markdown
# Design Review

Exhaustive UI/UX audit via a dedicated Opus agent. Covers design token compliance,
WCAG 2.1 AA accessibility, interaction quality (loading/error/empty states),
responsive behavior, visual consistency, dark mode, and component consolidation.
Produces line-by-line annotations with file:line references.
```

### vercel.md

```markdown
# Vercel Build Audit

Comprehensive Vercel build validation. Fixes all issues aggressively - no deploy.

---

## Process

### 1. Environment Variable Newline Check

Check for literal `\n` in Vercel credentials/keys (common copy-paste issue):

```bash
# Pull env vars and check for literal \n in values
vercel env pull --environment=production .env.vercel-check 2>/dev/null
grep -E '\\n' .env.vercel-check 2>/dev/null
rm -f .env.vercel-check
```

### 2. Environment Variables

Check for missing production keys:

```bash
# List Vercel env vars
vercel env ls

# Compare with .env.local
cat .env.local | grep -v "^#" | cut -d= -f1
```

### 3. Configuration Check

**package.json vs vercel.json:**
- Build scripts match
- Node.js version consistent
- All `@vercel/*` packages same version

### 4. Dependencies

```bash
bun outdated
```

Check for:
- Missing packages
- Conflicting versions
- Unmet peer dependencies

### 5. Code Quality (Aggressive Fix)

```bash
# Fix all BiomeJS issues
bun run lint:fix
bun run format

# Run type check
bun run type-check
```

### 6. Build Log Analysis

```bash
# Pull Vercel project settings
vercel pull --yes

# Run full Vercel build locally
vercel build 2>&1
```

Fix ALL warnings and errors aggressively.

---

## Quality Gates

All must pass:
- No literal `\n` in credential values
- All production keys present
- package.json and vercel.json consistent
- No missing dependencies
- No lint or type errors
- Build completes with ZERO warnings or errors
```

### update-all.md

```markdown
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
```

### tag-team.md

```markdown
# Tag-Team Code Review

Two senior engineering personas perform an exhaustive, line-by-line review of the most recent work. No shortcuts, no token limits, no mercy.

Spawns two parallel Opus agents:
1. **Senior Architect** — correctness, completeness, edge cases, race conditions, API contracts, state consistency, boundary violations, backwards compatibility, performance, security
2. **Senior Staff Engineer** — readability, error handling, testing gaps, operational concerns, defensive coding, consistency, simplification, copy-paste bugs, resource management, concurrency, platform edge cases

Both read every changed file in full (not just diff hunks), perform line-by-line annotations, and report with no abbreviation. Findings are deduplicated, cross-referenced, and synthesized into a prioritized action list.
```

### team.md

```markdown
# Agent Team Review

Launch an 8-member agent team for comprehensive YEN project review. Read `docs/reviews/99-team-temp.md` for the team specification.

**Before starting:** Reset `docs/reviews/99-team-review.md` by deleting it and copying `docs/reviews/99-team-temp.md` to `docs/reviews/99-team-review.md`. This ensures a clean slate.

---

## Instructions

Create an agent team for a comprehensive YEN project review. Use delegate mode — you coordinate only, teammates do all the work. Require plan approval for all teammates before they begin.

Spawn 8 teammates with these exact roles and prompts:

1. **UI/UX Reviewer** (Sonnet) — "You are a UI/UX expert reviewing the YEN project. Read docs/01-gtm.md for the design system (colors, typography, layout utilities, component patterns, accessibility). Then audit ALL user-facing code: app/ pages, components, public assets, and overlays/macos/Sources/Features/Settings/. Look for: (a) brand inconsistencies — wrong colors, missing semantic tokens, hardcoded hex values, (b) duplicate or near-duplicate components that should be consolidated, (c) styles that exist in globals.css but aren't being used where they should be, (d) accessibility gaps (missing alt text, focus rings, semantic HTML, WCAG AA contrast), (e) layout utility misuse (hardcoded padding/margins instead of section-padding/container-page). Record ALL findings with file paths and line numbers in docs/reviews/99-team-review.md under the UI/UX section."

2. **Senior Architect** (Sonnet) — "You are a senior software architect reviewing the YEN project for completeness and edge cases. Read docs/02-architecture.md, docs/03-build-desktop.md, and README.md for the 7-component architecture. Then audit: (a) error handling gaps — uncaught promises, missing try/catch, silent failures, (b) edge cases in the chat system (docs/06-chat-cal.md) — race conditions, reconnection logic, message ordering, (c) build pipeline gaps — missing validation steps, fragile assumptions in shell scripts, (d) config handling — what happens when config.yen is malformed, missing, or has unknown keys, (e) state management — are there any shared mutable states that could cause bugs. Focus on the boundaries between components. Record ALL findings with file paths and line numbers in docs/reviews/99-team-review.md under the Architecture section."

3. **Devil's Advocate** (Sonnet) — "You are the devil's advocate on a review team. Your ONLY job is to challenge the other teammates' findings and assumptions. Wait for other teammates to post their findings, then: (a) challenge any finding that assumes behavior without verifying it — did they actually read the code or are they guessing? (b) question severity ratings — is a 'critical' finding actually critical, or is it unlikely to occur in practice? (c) identify false positives — findings that look like issues but are actually intentional design decisions, (d) push back on any recommendation that adds complexity without clear benefit, (e) defend the current implementation where it's actually correct. Message each teammate directly with your challenges. Record your challenges and their resolutions in docs/reviews/99-team-review.md under the Devil's Advocate section."

4. **Security Engineer** (Sonnet) — "You are a security engineer reviewing recent YEN work for vulnerabilities. Focus on: (a) the chat system (docs/06-chat-cal.md, yen-chat/) — authentication, handle validation, message injection, Supabase RLS policies, (b) the web app — XSS vectors in user-facing pages, CSRF protection, Content-Security-Policy headers, (c) desktop app — code signing chain, entitlements, IPC between Swift and terminal, (d) shell scripts — command injection in any script that takes user input, PATH manipulation, (e) dependencies — check package.json for known vulnerable packages, audit any new additions. Use OWASP Top 10 as your framework. Record ALL findings with severity (Critical/High/Medium/Low) in docs/reviews/99-team-review.md under the Security section."

5. **Principal Engineer** (Sonnet) — "You are a 20-year principal/staff engineer reviewing YEN for simplification opportunities. Read CLAUDE.md for project rules (especially 'avoid over-engineering'). Then audit: (a) code duplication — find any repeated patterns across files that could be extracted into shared utilities, (b) dead code — unused exports, unreachable branches, commented-out code, stale imports, (c) unnecessary complexity — over-abstracted patterns, premature optimization, wrapper functions that add no value, (d) dependency bloat — packages in package.json that duplicate built-in functionality or that could be replaced with simpler alternatives, (e) script consolidation — shell scripts with overlapping responsibilities. Record ALL findings with specific refactoring suggestions in docs/reviews/99-team-review.md under the Simplification section."

6. **Documentation Specialist** (Sonnet) — "You are a documentation expert reviewing YEN's docs for accuracy. Read every file in docs/ (00-todos.md through 09-qol.md), README.md, and CLAUDE.md. Cross-reference against the actual codebase. Look for: (a) stale information — documented features that no longer exist or work differently, (b) missing documentation — features in the code that aren't documented anywhere, (c) inconsistencies between docs — does 05-commands.md match what the code actually implements? (d) broken references — file paths, URLs, or cross-doc links that are wrong, (e) version/tooling drift — do documented tool versions match package.json and build configs? Record ALL findings in docs/reviews/99-team-review.md under the Documentation section."

7. **Marketing & Content Reviewer** (Sonnet) — "You are a marketing and branding expert reviewing YEN's public-facing content. Read docs/01-gtm.md for brand voice and content guidelines. Then review: (a) the public docs page (app/docs/) — is it current with all shipped features? Check against docs/05-commands.md for gaps, (b) llms.txt (public/llms.txt) — does it reflect the current product accurately? (c) any public pages (app/) — do they follow the content voice guidelines? Any corporate-speak that slipped in? (d) SEO elements — meta descriptions, OpenGraph tags, JSON-LD, sitemap.xml — are they current? (e) blog post opportunity — based on recent git history (last 10-15 commits), is there material worth a new blog post in docs/blog-posts/? If yes, draft it following the existing blog post format (see docs/blog-posts/ for examples — YAML frontmatter, personal technical voice, '-- 8' signature). Record ALL findings in docs/reviews/99-team-review.md under the Marketing section. If drafting a blog post, create it as a new numbered file in docs/blog-posts/."

8. **Staff macOS/iOS Engineer** (Sonnet) — "You are a staff-level macOS/iOS engineer with 20 years of Apple platform experience — deep expertise in Swift, Objective-C, AppKit, SwiftUI, Cocoa, Foundation, UserNotifications, Speech framework, Zig (including Zig-C interop and Zig build system), Metal shaders, CoreText, CoreGraphics, IOSurface, Grand Central Dispatch, and code signing/notarization. You also understand Go-to-macOS IPC patterns (DistributedNotificationCenter via JXA/osascript) and bash scripting for macOS build pipelines (bash 3.x compatibility). Read docs/03-build-desktop.md, docs/02-architecture.md, and CLAUDE.md (especially vendor philosophy and desktop rules). Then audit the entire native stack: (a) Swift overlays (yen-terminal/overlays/macos/Sources/) — AppKit lifecycle correctness, SwiftUI hosting patterns, NSWindow/NSViewController management, memory management (retain cycles, delegate weak references), thread safety (main actor isolation, DispatchQueue usage), (b) Zig build system and overlays (yen-terminal/overlays/src/, yen-terminal/overlays/build.zig) — build correctness, Zig-C bridging in pkg/macos/, platform conditional compilation, (c) Metal shaders — rendering correctness, GPU resource management, (d) code signing chain — entitlements, nested framework signing order, Sparkle integration, notarization flow, (e) Go companion processes (yen-chat/, yen-mail/, yen-calendar/) — DistributedNotification payload handling, process lifecycle, osascript IPC injection safety, (f) bash build scripts (yen-terminal/apply-overlays.sh and related) — bash 3.x compatibility, PATH assumptions, error handling, (g) macOS platform patterns — Sparkle auto-update, UserNotifications authorization flow, NSWorkspace integration, accessibility APIs. Flag any Apple platform anti-patterns, deprecation risks (especially for upcoming macOS/iOS versions), or areas where the code diverges from Apple's recommended patterns. Record ALL findings with file paths and line numbers in docs/reviews/99-team-review.md under the macOS/iOS Engineering section."

After all teammates finish, synthesize their findings (incorporating the devil's advocate challenges) into an Action Items section at the bottom of docs/reviews/99-team-review.md, organized by priority: Critical, High, Medium, Low.
```

### team-mac.md

```markdown
# macOS Engineering Team Review

Launch an 8-member macOS engineering team for deep native stack review. Read `docs/reviews/99-mac.md` for the team specification.

**Before starting:** Reset `docs/reviews/99-mac-review.md` by deleting it and copying `docs/reviews/99-mac.md` to `docs/reviews/99-mac-review.md`. This ensures a clean slate.

---

## Team Roster (8 members)

| # | Role | Focus |
|---|------|-------|
| 1 | Senior Apple Architect | System architecture, API design, IPC patterns, entitlements, memory ownership, module boundaries |
| 2 | Senior macOS Engineer (20yr) | Implementation quality, AppKit/SwiftUI, @MainActor, retain cycles, force-unwraps, deprecated APIs |
| 3 | Senior macOS Designer | HIG compliance, vibrancy/materials, dark mode, 8pt grid, typography, animation curves, accessibility |
| 4 | Documentation Specialist | Cross-reference docs against code, staleness, completeness, CLAUDE.md/memory sync |
| 5 | Ghostty Core Specialist | Upstream compatibility, overlay fragility, config parser, rendering pipeline, terminal state machine |
| 6 | Vendor/Zip Pipeline Engineer | Build pipeline integrity, script ordering, CWD safety, path quoting, bash 3.x, verification gaps |
| 7 | GTM Marketing Specialist | Public content currency, feature gaps, banned terminology, SEO/metadata, version.json, blog posts |
| 8 | Devil's Advocate (Staff macOS) | Challenge all findings, verify claims against code, deflate severity, catch false positives |

[NOTE] Full teammate prompts are in ~/.claude/commands/team-mac.md. Each teammate writes findings to docs/reviews/99-mac-review.md under their designated section. The devil's advocate waits for other findings before challenging them. Team lead synthesizes into prioritized Action Items at the bottom.
```

### react-YOLO.md

```markdown
# React Best Practices

**Version 1.0.0**
Vercel Engineering
January 2026

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring React and Next.js codebases at Vercel. Humans
> may also find it useful, but guidance here is optimized for automation
> and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for React and Next.js applications, designed for AI agents and LLMs. Contains 40+ rules across 8 categories, prioritized by impact from critical (eliminating waterfalls, reducing bundle size) to incremental (advanced patterns). Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and specific impact metrics to guide automated refactoring and code generation.

---

## Categories (8 sections, 40+ rules)

1. **Eliminating Waterfalls** (CRITICAL) — Defer await, dependency-based parallelization, Promise.all(), Suspense boundaries
2. **Bundle Size Optimization** (CRITICAL) — Avoid barrel imports, conditional loading, dynamic imports, preload on intent
3. **Server-Side Performance** (HIGH) — LRU caching, RSC serialization, parallel data fetching, React.cache(), after()
4. **Client-Side Data Fetching** (MEDIUM-HIGH) — Deduplicate listeners, passive events, SWR, localStorage versioning
5. **Re-render Optimization** (MEDIUM) — Defer state reads, memoized components, narrow dependencies, functional setState, lazy init, transitions
6. **Rendering Performance** (MEDIUM) — SVG animation wrappers, content-visibility, hoist static JSX, Activity component
7. **JavaScript Performance** (LOW-MEDIUM) — Batch DOM changes, index maps, cache property access, Set/Map lookups, toSorted()
8. **Advanced Patterns** (LOW) — Event handlers in refs, useLatest for stable callbacks

[NOTE] Full document is ~2,400 lines. Source: Vercel Engineering React Best Practices guide. The complete content is in ~/.claude/commands/react-YOLO.md.
```

### substack.md

```markdown
# Substack Newsletter Draft

Draft a newsletter post in 8Lee's distinctive voice by reviewing recent updates and crafting a cohesive narrative.

---

## Publications

| Newsletter | Archive | Focus |
|------------|---------|-------|
| Building DeathNote | https://www.ded.ai/archive | Digital legacy platform updates |
| Digital Onigiri | https://yenchat.substack.com | YEN terminal app development |

---

## Voice Characteristics

**Tone**: Casual, conversational, self-aware. Blend technical candor with philosophical reflection. Dry humor without being forced.

**Opening**: Always start with "Hey folks," or "Hey friends," — never formal greetings.

**Sentences**: Short and punchy, alternating with longer explanations. Accessible without being condescending.

**Perspective**: Treats readers as intelligent peers. Admits mistakes openly. Connects small technical work to bigger themes.

**Humor**: Self-deprecating, dry. Reference "really bad dad jokes" energy. Keep mood light even with serious topics.

**Closing**: Always end with "Talk soon," followed by "— Eight" on a new line. Sometimes add a P.S. with a casual afterthought.

**Philosophy**: The best software aims to become "hardware" — technology that doesn't have to change. Small improvements compound. Quality is table stakes.

---

## Structure Template

**Title:** [Thematic statement about the work]
**Subtitle:** Or: [Alternate framing / philosophical hook]

Hey folks,

[Opening paragraph: Set context. What's been happening? Why does it matter?]

## [Category 1-4: Features, Under the Hood, UX, Looking Ahead]

## By the Numbers (optional)

[Closing reflection connecting work to broader theme]

Talk soon,

— Eight

---

## Process

1. Fetch the archive (WebFetch archive URL)
2. Gather updates (git log since last post)
3. Categorize (Features, Under the Hood, UX, Security, Cleanup, Looking Ahead)
4. Draft following voice checklist
5. Review: Opens "Hey folks,", no corporate language, dry humor, admits mistakes, closes "Talk soon, — Eight"

---

## Anti-Patterns

- Don't use corporate buzzwords (leverage, synergy, ecosystem)
- Don't oversell or hype features
- Don't promise timelines
- Don't use emojis
- Don't skip the human story behind technical changes
```

### today.md

```markdown
# Today in Claude Code

Generate a comprehensive daily summary of Claude Code usage.

## Process

### 1. Get Token Usage
Run `npx ccusage --today` to get authoritative token counts and cost.

### 2. Get Full Prompt History
Extract all user prompts from today grouped by project:

start_ts=$(date -j -f "%Y-%m-%d %H:%M:%S" "$(date +%Y-%m-%d) 00:00:00" +%s)000
end_ts=$((start_ts + 86400000))

jq -r --argjson start "$start_ts" --argjson end "$end_ts" '
  select(.timestamp >= $start and .timestamp < $end and .display != null and .display != "") |
  (.project | split("/") | .[-1]) + ": " + (.display | gsub("\n"; " ") | .[0:150])
' ~/.claude/history.jsonl

### 3. Analyse and Group by Theme

Focus on substantial work (10-15+ minutes of effort). Minor tasks go under "Other".

### 4. Output Format

## Claude Code Activity

### Token Usage
- Output/Input/Cache/Cost

### Day Summary
2-3 sentences on overall shape of the day.

### [Theme 1-N]
- 2-4 bullets per theme

### Other
- Brief summary of smaller tasks

## Key Rules

1. Summarise, don't itemise (10-15+ min threshold)
2. Day Summary is essential
3. 2-4 bullets per theme
4. Group by theme not project
5. Time of day hints from timestamps
6. "Other" catches the rest
```

---

## Statusline

Location: `~/.claude/statusline-command.sh`
Configured in: `~/.claude/settings.json` → `statusLine.command`

Single-line status bar showing project context and session metrics. Renders after every assistant message.

### Format

```
project [branch] flags x⸑x [Model] ████░░░░░░ 42% | $1.23 | 5m 32s | +156/-23
```

| Element | Color | Source |
|---------|-------|--------|
| Project name | Blue | `workspace.current_dir` (basename of git root) |
| Git branch | Purple | `git symbolic-ref` |
| Dirty flags (+*?) | Red | `git status --porcelain` (+staged, *modified, ?untracked) |
| Ahead/behind | Red | `git rev-list --count` |
| `x⸑x` | Dim | Static bypass permissions indicator |
| Model name | Cyan | `model.display_name` |
| Context bar (10 chars) | Green/Yellow/Red | `context_window.used_percentage` (thresholds: 70%, 90%) |
| Cost | Yellow | `cost.total_cost_usd` |
| Duration | Default | `cost.total_duration_ms` |
| Lines added | Green | `cost.total_lines_added` |
| Lines removed | Red | `cost.total_lines_removed` |

### Features

- Git results cached to `/tmp/claude-statusline-git-cache` with 5-second TTL
- Graceful degradation: missing fields are simply omitted
- Non-git directories show only project name + `x⸑x`
- `-- INSERT -- bypass permissions on` is a built-in Claude Code UI element (not configurable)

### settings.json Entry

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash /Users/eight/.claude/statusline-command.sh"
  }
}
```

### statusline-command.sh

```bash
#!/bin/bash

# Single-line statusline for Claude Code
# project [branch] flags x⸑x [Model] ████░░░░ 42% | $1.23 | 5m 32s | +156/-23

# --- Colors ---
RST='\033[0m'
BLUE='\033[34m'
PURPLE='\033[35m'
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
CYAN='\033[36m'
DIM='\033[2m'

# --- Read JSON from stdin, extract all fields ---
input=$(cat)
cwd=$(echo "$input" | jq -r '.workspace.current_dir // empty')
model=$(echo "$input" | jq -r '.model.display_name // empty')
ctx_pct=$(echo "$input" | jq -r '.context_window.used_percentage // empty')
cost=$(echo "$input" | jq -r '.cost.total_cost_usd // empty')
duration_ms=$(echo "$input" | jq -r '.cost.total_duration_ms // empty')
lines_add=$(echo "$input" | jq -r '.cost.total_lines_added // empty')
lines_rm=$(echo "$input" | jq -r '.cost.total_lines_removed // empty')

[[ -z "$cwd" ]] && cwd="$HOME"
cd "$cwd" 2>/dev/null || cd "$HOME"

# --- Project name ---
project_name=$(basename "$cwd")
if git rev-parse --git-dir >/dev/null 2>&1; then
  repo_root=$(git rev-parse --show-toplevel 2>/dev/null)
  [[ -n "$repo_root" ]] && project_name=$(basename "$repo_root")
fi

# --- Git info with 5s cache ---
CACHE_FILE="/tmp/claude-statusline-git-cache"
CACHE_TTL=5
git_branch=""
git_flags=""
git_ahead_behind=""

if git rev-parse --git-dir >/dev/null 2>&1; then
  now=$(date +%s)
  cache_valid=0

  if [[ -f "$CACHE_FILE" ]]; then
    cache_time=$(head -1 "$CACHE_FILE" 2>/dev/null || echo 0)
    cache_dir=$(sed -n '2p' "$CACHE_FILE" 2>/dev/null)
    if [[ $((now - cache_time)) -lt $CACHE_TTL && "$cache_dir" == "$cwd" ]]; then
      cache_valid=1
    fi
  fi

  if [[ $cache_valid -eq 1 ]]; then
    git_branch=$(sed -n '3p' "$CACHE_FILE")
    git_flags=$(sed -n '4p' "$CACHE_FILE")
    git_ahead_behind=$(sed -n '5p' "$CACHE_FILE")
  else
    git_branch=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)

    if [[ -n "$git_branch" ]]; then
      git_status=$(git status --porcelain 2>/dev/null)
      staged=0; modified=0; untracked=0

      while IFS= read -r line; do
        [[ -z "$line" ]] && continue
        x="${line:0:1}"; y="${line:1:1}"
        case "$x" in M|A|D|R|C) staged=1 ;; \?) untracked=1 ;; esac
        case "$y" in M|D) modified=1 ;; esac
      done <<< "$git_status"

      [[ $staged -eq 1 ]] && git_flags+="+"
      [[ $modified -eq 1 ]] && git_flags+="*"
      [[ $untracked -eq 1 ]] && git_flags+="?"

      if git rev-parse --abbrev-ref @{upstream} >/dev/null 2>&1; then
        ahead=$(git rev-list --count @{upstream}..HEAD 2>/dev/null || echo 0)
        behind=$(git rev-list --count HEAD..@{upstream} 2>/dev/null || echo 0)
        if [[ "$ahead" -gt 0 && "$behind" -gt 0 ]]; then
          git_ahead_behind=" +${ahead}/-${behind}"
        elif [[ "$ahead" -gt 0 ]]; then
          git_ahead_behind=" +${ahead}"
        elif [[ "$behind" -gt 0 ]]; then
          git_ahead_behind=" -${behind}"
        fi
      fi
    fi

    printf '%s\n%s\n%s\n%s\n%s\n' "$now" "$cwd" "$git_branch" "$git_flags" "$git_ahead_behind" > "$CACHE_FILE"
  fi
fi

# --- Build single line ---
out="${BLUE}${project_name}${RST}"

# Git
if [[ -n "$git_branch" ]]; then
  out+=" ${PURPLE}[${git_branch}]${RST}"
  if [[ -n "$git_flags" || -n "$git_ahead_behind" ]]; then
    out+=" ${RED}${git_flags}${git_ahead_behind}${RST}"
  fi
fi

# Bypass indicator
out+=" ${DIM}x⸑x${RST}"

# Model
if [[ -n "$model" ]]; then
  out+=" ${CYAN}[${model}]${RST}"
fi

# Context bar (10 chars)
if [[ -n "$ctx_pct" ]]; then
  pct=${ctx_pct%.*}
  filled=$(( pct * 10 / 100 ))
  [[ $filled -gt 10 ]] && filled=10
  empty=$(( 10 - filled ))

  if [[ $pct -ge 90 ]]; then
    bar_color="$RED"
  elif [[ $pct -ge 70 ]]; then
    bar_color="$YELLOW"
  else
    bar_color="$GREEN"
  fi

  bar="${bar_color}"
  for ((i=0; i<filled; i++)); do bar+="█"; done
  for ((i=0; i<empty; i++)); do bar+="░"; done
  bar+="${RST}"

  out+=" ${bar} ${bar_color}${pct}%${RST}"
fi

# Cost
if [[ -n "$cost" && "$cost" != "0" ]]; then
  formatted_cost=$(printf '%.2f' "$cost")
  out+=" | ${YELLOW}\$${formatted_cost}${RST}"
fi

# Duration
if [[ -n "$duration_ms" && "$duration_ms" != "0" ]]; then
  total_secs=$(( ${duration_ms%.*} / 1000 ))
  mins=$(( total_secs / 60 ))
  secs=$(( total_secs % 60 ))
  out+=" | ${mins}m $(printf '%02d' $secs)s"
fi

# Lines changed
if [[ -n "$lines_add" || -n "$lines_rm" ]]; then
  lines_display=""
  [[ -n "$lines_add" && "$lines_add" != "0" ]] && lines_display+="${GREEN}+${lines_add}${RST}"
  if [[ -n "$lines_rm" && "$lines_rm" != "0" ]]; then
    [[ -n "$lines_display" ]] && lines_display+="/"
    lines_display+="${RED}-${lines_rm}${RST}"
  fi
  if [[ -n "$lines_display" ]]; then
    out+=" | ${lines_display}"
  fi
fi

printf '%b' "$out"
```

---

## Hooks

Location: Per-project `.claude/hooks/` directory
Configured in: Per-project `.claude/settings.json` → `hooks`

### YEN Project (.claude/settings.json)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/block-rm.sh" },
          { "type": "command", "command": ".claude/hooks/guard-force-push.sh" },
          { "type": "command", "command": ".claude/hooks/guard-codesign-deep.sh" }
        ]
      },
      {
        "matcher": "Edit",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/guard-vendor.sh" },
          { "type": "command", "command": ".claude/hooks/guard-sensitive-file.sh" }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/guard-vendor.sh" },
          { "type": "command", "command": ".claude/hooks/guard-sensitive-file.sh" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/guard-dmg-staging.sh" },
          { "type": "command", "command": ".claude/hooks/notify-complete.sh" }
        ]
      }
    ]
  }
}
```

### Hook Scripts

**PreToolUse (Bash) — block before execution:**

| Script | Pattern | Deny Message |
|--------|---------|-------------|
| `block-rm.sh` | `rm -rf` | "WTF ARE YOU DOING BRUH?! Nooooo rm -rf kek." |
| `guard-force-push.sh` | `git push --force` / `-f` | "Force push is blocked. Use regular push only." |
| `guard-codesign-deep.sh` | `codesign --deep` | "codesign --deep is forbidden. Sign nested frameworks bottom-up instead." |

**PreToolUse (Edit + Write) — block file modifications:**

| Script | Pattern | Deny Message |
|--------|---------|-------------|
| `guard-vendor.sh` | Paths containing `ghostty/` or `customizations/vendor/` | "Vendor directories are read-only. Use overlays/ for customizations." |
| `guard-sensitive-file.sh` | `.env`, `credentials.json`, `.ssh/`, `keychain`, `.pem`, `.key` | "Blocked: cannot modify sensitive file (secrets, keys, credentials, SSH)." |

**PostToolUse (Bash) — audit after execution:**

| Script | Trigger | Action |
|--------|---------|--------|
| `guard-dmg-staging.sh` | `git add` commands | Warns if `.dmg` files are staged (belong on Supabase Storage, not git) |
| `notify-complete.sh` | Build/compile/test/install keywords | Sends DistributedNotification to YEN.app (shows YEN icon) |

### Hook Source Code

**.claude/hooks/block-rm.sh:**
```bash
#!/bin/bash
COMMAND=$(jq -r '.tool_input.command')
if echo "$COMMAND" | grep -q 'rm -rf'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "WTF ARE YOU DOING BRUH?! Nooooo rm -rf kek."
    }
  }'
else
  exit 0
fi
```

**.claude/hooks/guard-force-push.sh:**
```bash
#!/bin/bash
COMMAND=$(jq -r '.tool_input.command // empty')
if echo "$COMMAND" | grep -qE 'git push.*( -f| --force)'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Force push is blocked. Use regular push only."
    }
  }'
else
  exit 0
fi
```

**.claude/hooks/guard-codesign-deep.sh:**
```bash
#!/bin/bash
COMMAND=$(jq -r '.tool_input.command // empty')
if echo "$COMMAND" | grep -q 'codesign --deep'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "codesign --deep is forbidden. Sign nested frameworks bottom-up instead."
    }
  }'
else
  exit 0
fi
```

**.claude/hooks/guard-vendor.sh:**
```bash
#!/bin/bash
FILE_PATH=$(jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0
if echo "$FILE_PATH" | grep -qE 'ghostty/|customizations/vendor/'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Vendor directories are read-only. Use overlays/ for customizations."
    }
  }'
else
  exit 0
fi
```

**.claude/hooks/guard-sensitive-file.sh:**
```bash
#!/bin/bash
FILE_PATH=$(jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0
if echo "$FILE_PATH" | grep -qE '\.env($|\.)|credentials\.json|\.ssh/|keychain|secrets?\.|\.pem$|\.key$'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Blocked: cannot modify sensitive file (secrets, keys, credentials, SSH)."
    }
  }'
else
  exit 0
fi
```

**.claude/hooks/guard-dmg-staging.sh:**
```bash
#!/bin/bash
COMMAND=$(jq -r '.tool_input.command // empty')
if echo "$COMMAND" | grep -q 'git add'; then
  STAGED_DMGS=$(git diff --cached --name-only 2>/dev/null | grep '\.dmg$')
  if [ -n "$STAGED_DMGS" ]; then
    echo "WARNING: .dmg files staged for commit. DMGs belong on Supabase Storage, not git."
    echo "Staged: $STAGED_DMGS"
    echo "Run: git reset HEAD <file> to unstage."
  fi
fi
exit 0
```

**.claude/hooks/notify-complete.sh:**
```bash
#!/bin/bash
# Sends DistributedNotification that YEN.app observes → UNUserNotificationCenter
# Shows YEN app icon. Name must match AppDelegate+Build.swift.
COMMAND=$(jq -r '.tool_input.command // empty')
if echo "$COMMAND" | grep -qEi '\b(build|compile|zip|zig|notarize|vendor|install|test|lint|check|tsc)\b'; then
  export YEN_BUILD_PAYLOAD="YEN Terminal
Task complete"
  osascript -l JavaScript -e '
    ObjC.import("Foundation"); ObjC.import("stdlib");
    var payload = $.NSProcessInfo.processInfo.environment.objectForKey("YEN_BUILD_PAYLOAD").js;
    $.NSDistributedNotificationCenter.defaultCenter.postNotificationNameObjectUserInfoDeliverImmediately(
      "com.yenchat.yen.buildNotification", payload, $(), true
    );
  ' 2>/dev/null
fi
exit 0
```

**Known quirk:** PreToolUse hooks grep the full command string, so commit messages or echoed text containing blocked patterns will also trigger the deny. This is aggressive by design.

---

## Development Environment

**Platform:** macOS (Darwin, Apple Silicon arm64)

### CLI Tool Versions

Primary development tools — update with `brew upgrade`, `bun upgrade`, etc.

| Tool | Version | Install Method | Purpose |
|------|---------|----------------|---------|
| Bun | 1.3.9 | `bun upgrade` | Package manager, runtime |
| Node.js | 25.6.1 | `brew upgrade node` | JS runtime (fallback) |
| TypeScript | 5.9.3 | Per-project via `bunx tsc` | Type checking |
| Biome | 2.3.15 | Per-project devDep | Linting, formatting |
| Git | 2.50.1 | Apple Git | Version control |
| gh | 2.86.0 | `brew upgrade gh` | GitHub CLI |
| Vercel CLI | 50.15.1 | `bun add -g vercel@latest` | Vercel deployments |
| Supabase CLI | 2.75.0 | `brew upgrade supabase` | Supabase operations |
| Sentry CLI | 2.58.2 | Global bun package | Error tracking |
| Docker | 29.1.5 | Docker Desktop | Containers |
| Deno | 2.6.5 | `brew upgrade deno` | Alt JS runtime |
| Go | 1.25.5 | `brew upgrade go` | Go development |
| Python | 3.14.2 | `brew` / `pyenv` | Python development |
| uv | 0.9.18 | `brew upgrade uv` | Fast Python package manager |
| pyenv | 2.6.17 | `brew upgrade pyenv` | Python version management |
| FFmpeg | 8.0.1 | `brew upgrade ffmpeg` | Media processing |
| Lua | 5.4.8 | `brew upgrade lua` | Lua compiler/interpreter (luac -p for syntax checking) |
| Zig | via brew | `brew upgrade zig` | Zig development |

### Global Bun Packages

Location: `~/.bun/install/global`

| Package | Version | Binary | Purpose |
|---------|---------|--------|---------|
| `vercel` | 50.15.1 | `vercel`, `vc` | Vercel CLI |
| `@sentry/cli` | 2.58.2 | `sentry-cli` | Sentry operations |
| `@openai/codex` | 0.98.0 | `codex` | OpenAI Codex CLI |
| `@google/gemini-cli` | 0.7.0 | `gemini` | Google Gemini CLI |
| `@btcemail/cli` | 0.5.0 | `btcemail` | BTC Email CLI |
| `supabase` | 2.67.1 | — | Supabase (bun global copy) |

### Modern CLI Replacements (Homebrew)

All installed via `brew`. These replace standard Unix tools via aliases in `~/.zshrc`.

| Tool | Replaces | Homebrew Formula |
|------|----------|-----------------|
| `bat` | cat, less | `bat` |
| `eza` | ls, tree | `eza` |
| `ripgrep` | grep | `ripgrep` |
| `fd` | find | `fd` |
| `git-delta` | diff (git pager) | `git-delta` |
| `sd` | sed | `sd` |
| `dust` | du | `dust` |
| `duf` | df | `duf` |
| `btop` | top | `btop` |
| `procs` | ps | `procs` |
| `doggo` | dig | `doggo` |
| `trash` | rm | (trash-cli) |
| `zoxide` | cd | `zoxide` |
| `fzf` | — | `fzf` |
| `starship` | prompt | `starship` |
| `atuin` | history | `atuin` |
| `lazygit` | git TUI | `lazygit` |
| `glow` | markdown viewer | `glow` |
| `tlrc` | man pages | `tlrc` |
| `tokei` | code stats | `tokei` |
| `hyperfine` | benchmarking | `hyperfine` |
| `gping` | ping | `gping` |

### Homebrew Casks

| Cask | Purpose |
|------|---------|
| `010-editor` | Hex/binary editor |
| `miniconda` | Conda (Python envs) |

---

## Shell Environment

### ~/.zshrc Structure

The zsh config is organized into labeled sections:

1. **shopt suppression** — `shopt() { : ; }` silences Claude Code's bash-only shopt calls
2. **PATH configuration** — Homebrew, PostgreSQL 14, 010 Editor, local bins, Bun, Google Cloud SDK, YEN CLI
3. **Completions** — Docker completions, cached compinit, case-insensitive matching
4. **Modern CLI init** — `starship`, `zoxide`, `fzf`, `atuin` (in that order; atuin after fzf to override ctrl-r)
5. **Aliases** — All modern CLI replacements (see Shell Aliases in CLAUDE.md section above)
6. **Environment variables** — PAGER=bat, MANPAGER with bat, EDITOR=vim, FZF defaults using fd
7. **Functions** — `command_not_found_handler` (YEN suggest), `mkcd`, `extract`, `fzp`, `gs`
8. **API keys** — [WARNING] OPENAI_API_KEY is hardcoded — should move to keychain
9. **AI tool aliases** — `cj` (claude), `jp` (codex)
10. **Conda init** — Miniconda via Homebrew cask
11. **Utility aliases** — `unlock` (keychain)

### ~/.zshenv

```bash
. "$HOME/.cargo/env"
```

Rust/Cargo is available via the standard Cargo environment.

### Key Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `PAGER` | `bat` | Default pager |
| `MANPAGER` | `sh -c 'col -bx \| bat -l man -p'` | Man page viewer |
| `EDITOR` | `vim` | Default editor |
| `FZF_DEFAULT_COMMAND` | `fd --type f --hidden --follow --exclude .git` | fzf file finder |
| `BUN_INSTALL` | `$HOME/.bun` | Bun installation path |

### Custom Functions

| Function | Purpose |
|----------|---------|
| `mkcd <dir>` | Create directory and cd into it |
| `extract <file>` | Extract any archive (tar, zip, gz, 7z, xz) |
| `fzp` | fzf file preview and open in editor |
| `gs` | Short for `git status -sb` |
| `command_not_found_handler` | YEN suggest for unknown commands |

---

## Git Configuration

Location: `~/.gitconfig`

```ini
[user]
    name = 8BIT
    email = 1309181+8bittts@users.noreply.github.com

[credential "https://github.com"]
    helper = !/opt/homebrew/bin/gh auth git-credential

[core]
    pager = delta

[interactive]
    diffFilter = delta --color-only

[delta]
    navigate = true
    side-by-side = true
    line-numbers = true

[merge]
    conflictstyle = diff3

[diff]
    colorMoved = default

[filter "lfs"]
    process = git-lfs filter-process
    required = true
    clean = git-lfs clean -- %f
    smudge = git-lfs smudge -- %f
```

**Key points:**
- GitHub auth via `gh auth git-credential` (no SSH keys for GitHub)
- Git LFS enabled
- Delta as diff pager (side-by-side, line numbers)
- diff3 merge conflict style

---

## Starship Prompt

Location: `~/.config/starship.toml`

Minimal config: directory (truncated to 3), git branch (purple), git status (red), and a `>` character prompt (green on success, red on error).

---

## SSH Configuration

- Google Compute Engine SSH key at `~/.ssh/google_compute_engine`
- No GitHub SSH keys (uses `gh auth` credential helper instead)
- GCE hosts auto-configured via `gcloud compute config-ssh`

---

## Claude Code Memory Backup

Per-project memory files stored at `~/.claude/projects/{project-path}/memory/MEMORY.md`.

### 8leeai Memory

```markdown
# Auto Memory

## Bun CLI

- `bun pm audit` does NOT exist. Bun has no built-in security audit command.
- `bun pm scan` exists but requires a third-party security scanner configured in `bunfig.toml` — not usable out of the box.
- Removed all `bun pm audit` references from global CLAUDE.md and command files.

## Global Command Sync

- `/update` is the canonical single-project workflow. `/update-all` is a thin wrapper that runs `/update` for each of 7 projects.
- All update logic lives in `/update` — `/update-all` just lists projects and references it.
- When updating commands, sync to 3 places: the command file, global CLAUDE.md, and `~/Documents/deathnote/claude-global.md`.

## Biome Updates

- When `@biomejs/biome` is updated, always run `bunx biome migrate --write` to sync `biome.json` schema version.
- Stage `biome.json` alongside `package.json` and `bun.lock` in update commits.

## packageManager Field

- The `"packageManager"` field in `package.json` can drift behind the installed bun version.
- ncu `--reject bun` prevents ncu from touching it, but it may still be stale from previous state.
- Always verify it matches `bun --version` after updates.

## Shell Aliases

- User aliases are in `~/.zshrc` — `cj` (claude), `jp` (codex), `unlock` (keychain), plus modern CLI replacements (bat, rg, fd, eza, etc.)
- Full alias reference now in global CLAUDE.md v1.2 Shell Aliases section.
```

### yenchat Memory

```markdown
# YEN Project Memory

## Content Rules Reminder
- version.json `notes` field is USER-FACING — never mention "Ghostty", use "terminal engine" instead
- Same rule applies to all public content: Ghostty → "YEN Terminal" or "terminal engine"

## Swift Concurrency — Overlay @MainActor Pattern
- Ghostty vendor updates can introduce stricter Swift concurrency checking (Xcode 26+)
- All YEN overlay classes doing UI work must be `@MainActor`: DictationController, LayoutShortcutController, SettingsController, PermissionRefreshing protocol
- **Free functions too:** Private/module-level functions that call `@MainActor` methods need `@MainActor` annotation (e.g. `openSystemKeyboardSettings()` calling `SystemSettingsOpener.open()` — hit in v0.873 build)
- Watch for "call to main actor-isolated instance method in a synchronous nonisolated context" errors after `/vendor`
- Fix: add `@MainActor` to the class/protocol/function in the overlay source, not the build tree
- Swizzled `@objc dynamic` methods (e.g. `yen_userNotificationCenter`) run nonisolated — cannot access `@MainActor` singleton properties. Use `UserDefaults.standard` directly (thread-safe) with `static let` keys exposed from the manager class.
- **SourceKit false positives:** Overlay Swift files show "Cannot find type" errors in IDE (SettingsController, KeybindEntry, etc.) because they're outside the Xcode project context. These are NOT real build errors — ignore them.

## Ghostty Cursor Style Reload Bug
- `stream_handler.zig:changeConfig()` has an `if (self.default_cursor)` guard that skips cursor style updates when any DECSCUSR has been received
- User shell configs (zsh, oh-my-zsh) commonly send DECSCUSR, setting `default_cursor=false`
- Fix: `apply-overlays.sh` patches out the guard so config reload always applies cursor style
- This is a fragile coupling — monitor during `/vendor` updates

## Settings Experimental Tab
- Settings panel has 6 tabs: General, Sounds, Layouts, Themes, Keyboard, Experimental
- Experimental tab is a permanent staging area for opt-in features under active development
- Features graduate to their proper tab when production-ready
- Currently contains: Hands-Free Pointer (Head + Blink)
- Hands-free is default OFF, opt-in only (UserDefaults, not config.yen)
- AssistivePointerController has state monitoring (3s timer) that fires alert/notification on active → blocked transitions

## Settings Save Flow
1. `SettingsController.saveConfig()` writes to `~/Library/Application Support/com.yenchat.yen/config.yen`
2. `reloadTerminalConfig()` calls `appDelegate.yen.reloadConfig()` + posts notification
3. Ghostty's `Surface.updateConfig()` → `Termio.changeConfig()` → `stream_handler.changeConfig()`
4. Stream handler updates defaults, then conditionally applies cursor style

## /zip Workflow — CWD After Build
- Step 5 (`build-release.sh`) runs from `yen-terminal/`, which changes the shell's working directory
- **MUST `cd /Users/eight/Documents/yenchat`** before Step 6 and all subsequent steps
- Forgetting this causes "No such file or directory" on relative paths like `scripts/05-detect-failures.sh`
- Always use absolute paths for post-build steps, or explicitly cd back to repo root first

## /vendor Workflow — Don't Thrash
- Ghostty is vendored as a **source download with no .git** — commit SHAs in `.ghostty-baseline` are not in our repo's git history. Never `git log` or `git diff` on ghostty commit hashes.
- After `14-vendor.sh` succeeds, trust its output (overlay status, branding checks). Go straight to the summary.
- When running `git diff` on file paths that start with `.` or contain `-`, always use `--` separator: `git diff -- path/to/file`
- The only post-vendor verification needed: `git diff --stat` and `git diff -- yen-terminal/.ghostty-baseline yen-terminal/VENDOR_INFO.txt`
- **Branding checks (31) don't catch Swift compilation errors.** After Ghostty vendor updates, Swift concurrency issues may only surface at build time (`/zip` Step 5). Be ready to fix `@MainActor` annotations in overlay files and rebuild.

## CLI Registration — MANDATORY for New Commands
- Every app binary in `Resources/bin/` MUST be registered in the `yen` CLI
- An unregistered binary is invisible to users — `yen help` is the primary discovery mechanism
- Checklist for new commands (all in `yen-cli/bin/yen` unless noted):
  1. `route_command()` — add to the `chat|mail|calendar|browse` whitelist
  2. `show_usage()` — add to the help output under "Apps"
  3. `suggest_command()` — add to the built-in commands list
  4. `yen-cli/commands/core/help` — add to the detailed help output
  5. `docs/05-commands.md` — add command and shortcuts
- This was a major miss: chat/mail/calendar/browse binaries existed but were never registered, so `yen calendar` etc. returned "Unknown command"

## Key Files
- Settings UI: `yen-terminal/overlays/macos/Sources/Features/Settings/SettingsPanel.swift`
- Settings logic: `yen-terminal/overlays/macos/Sources/Features/Settings/SettingsController.swift`
- Layout templates: `yen-terminal/overlays/macos/Sources/Features/Settings/LayoutTemplate.swift`
- Layout shortcuts: `yen-terminal/overlays/macos/Sources/Features/Settings/LayoutShortcutController.swift`
- Tab sidebar controller: `yen-terminal/overlays/macos/Sources/Features/TabSidebar/TabSidebarController.swift`
- Tab sidebar view: `yen-terminal/overlays/macos/Sources/Features/TabSidebar/TabSidebarView.swift`
- Tab sidebar panel: `yen-terminal/overlays/macos/Sources/Features/TabSidebar/TabSidebarPanel.swift`
- Config path: `~/Library/Application Support/com.yenchat.yen/config.yen`
- Build overlays: `yen-terminal/apply-overlays.sh`
- Ghostty cursor handling: `ghostty/src/termio/stream_handler.zig`
- Chat client: `yen-chat/main.go`
- Chat notifications (Swift): `yen-terminal/overlays/macos/Sources/App/macOS/AppDelegate+Chat.swift`
- Mail notifications (Swift): `yen-terminal/overlays/macos/Sources/App/macOS/AppDelegate+Mail.swift`
- Mail notifications (Go): `yen-mail/notify.go`
- Calendar client: `yen-calendar/main.go`
- Shared Google OAuth: `pkg/googleauth/googleauth.go` (used by mail + calendar)
- Calendar auth config: `yen-calendar/auth.go` (thin wrapper)
- Mail auth config: `yen-mail/auth.go` (thin wrapper)
- Calendar notifications (Swift): `yen-terminal/overlays/macos/Sources/App/macOS/AppDelegate+Calendar.swift`
- Calendar notifications (Go): `yen-calendar/notify.go`
- Onboarding controller: `yen-terminal/overlays/macos/Sources/Features/Onboarding/OnboardingController.swift`
- Onboarding panel: `yen-terminal/overlays/macos/Sources/Features/Onboarding/OnboardingPanel.swift`
- Onboarding AppDelegate: `yen-terminal/overlays/macos/Sources/App/macOS/AppDelegate+Onboarding.swift`
- Shared visual effect: `yen-terminal/overlays/macos/Sources/Helpers/VisualEffectBackground.swift`
- Shared brand color: `yen-terminal/overlays/macos/Sources/Helpers/YENBrandColor.swift`
- Keybind registry: `yen-terminal/overlays/macos/Sources/Features/Settings/KeybindRegistry.swift`
- Conflict detector: `yen-terminal/overlays/macos/Sources/Features/Settings/ConflictDetector.swift`
- Key recorder: `yen-terminal/overlays/macos/Sources/Features/Settings/KeyRecorderView.swift`
- Keyboard settings tab: `yen-terminal/overlays/macos/Sources/Features/Settings/KeyboardSettingsTab.swift`
- Notification sounds: `yen-terminal/overlays/macos/Sources/App/macOS/AppDelegate+NotificationSound.swift`
- Sound manager: `yen-terminal/overlays/macos/Sources/Helpers/NotificationSoundManager.swift`
- CLI entry point: `yen-cli/bin/yen` (help, routing, suggestions)
- CLI detailed help: `yen-cli/commands/core/help`
- Theme generator: `yen-terminal/customizations/bin/generate-yazi-theme.sh`
- Shell integration (y function): `yen-terminal/customizations/shell-integration/zsh/yen-integration.zsh`
- Browse wrapper: `yen-terminal/customizations/bin/browse`
- File browser launcher (Swift): `yen-terminal/overlays/macos/Sources/App/macOS/AppDelegate+FileBrowser.swift`
- Bundled yazi config: `yen-terminal/customizations/yazi-config/`
- Sounds engineering ref: `docs/11-sounds.md`
- IDE feature roadmap: `docs/12-ide.md`
- Command palette (upstream): `yen-terminal/ghostty/macos/Sources/Features/Command Palette/TerminalCommandPalette.swift`
- Command palette (overlay, planned): `yen-terminal/overlays/macos/Sources/Features/Command Palette/TerminalCommandPalette.swift`
- Command palette base view: `yen-terminal/ghostty/macos/Sources/Features/Command Palette/CommandPalette.swift`

## Keybind System — Duplicate Action Gotcha
- Ghostty config format `keybind = trigger=action` allows multiple keybinds with the same action (e.g., "undo" mapped to both Cmd + Z and Cmd + Shift + T)
- These entries CANNOT be independently edited/overridden via config.yen because the format can't distinguish which entry an override belongs to
- Solution: `isEditable = false` for entries with duplicate action names AND layout shortcuts (handled by LayoutShortcutController, not config.yen)
- `stableId` = `defaultTrigger.configString + "=" + action` provides unique identity per entry
- ConflictDetector results are cached per Settings session (`CachedShortcuts`) — invalidated on `loadKeybinds()` and `windowWillClose`
- Shared keycode-to-name mapping lives in `KeybindRegistry.keyName(forKeyCode:event:)` — used by both ConflictDetector and KeyRecorderView

## DMG Hosting — Supabase Storage
- DMGs are hosted on Supabase Storage (`releases` bucket), NOT in git
- `*.dmg` is in `.gitignore` — DMGs exist locally during build but never committed
- `finalize-build.sh` uploads after notarization: `supabase storage cp ... --experimental --workdir $REPO_ROOT`
- Must `supabase storage rm` before `cp` (409 Duplicate on re-upload, no upsert)
- Bucket file_size_limit: 500MB (migration `20260213200001`)
- Global upload limit: increased to 500MB in Supabase Dashboard
- `/download` route redirects to URL from `version.json` (302, not file serve)
- `generate-appcast.sh` uses Supabase URL for Sparkle `enclosure` tag
- SHA256 files still committed to git (tiny, needed for homepage link)
- Supabase project URL pattern: `https://fayxkepwlknlurwmnbpj.supabase.co/storage/v1/object/public/releases/`

## DistributedNotification Pattern
- Go processes send notifications via JXA/osascript with payload in env var (injection-safe)
- Swift AppDelegate extensions observe and forward to UNUserNotificationCenter
- Notification names must stay in sync between Go and Swift:
  - Mail: `com.yenchat.yen.mailNotification`
  - Chat: `com.yenchat.yen.chatNotification`
  - Calendar: `com.yenchat.yen.calendarNotification`
- All observers need `requestAuthorization` (idempotent) for fresh installs
  - Build: `com.yenchat.yen.buildNotification` (Claude Code hooks → YEN.app)
- Build notifications (AppDelegate+Build.swift): `yen-terminal/overlays/macos/Sources/App/macOS/AppDelegate+Build.swift`
```

---

## Restoration Instructions

To restore on a new computer:

1. **Install Homebrew**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install core tools**
   ```bash
   brew install node gh supabase git-lfs git-delta starship zoxide fzf atuin
   brew install bat eza ripgrep fd sd dust duf btop procs doggo lazygit trash
   brew install deno go pyenv uv ffmpeg zig lua tokei hyperfine glow tlrc gping
   ```

3. **Install Bun**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

4. **Install global Bun packages**
   ```bash
   bun add -g vercel @sentry/cli @openai/codex @google/gemini-cli
   ```

5. **Install Claude Code**
   ```bash
   brew install claude-code
   ```

6. **Create Claude Code directories**
   ```bash
   mkdir -p ~/.claude/commands
   ```

7. **Copy CLAUDE.md**
   Copy the content from "Global CLAUDE.md" section above to `~/.claude/CLAUDE.md`

8. **Create command files**
   For each command in "Global Commands" section, create `~/.claude/commands/{name}.md`

9. **Copy shell config**
   Restore `~/.zshrc`, `~/.zshenv`, `~/.gitconfig`, `~/.config/starship.toml`

10. **Verify**
    ```bash
    bun --version && node --version && gh --version && vercel --version
    ls ~/.claude/CLAUDE.md && ls ~/.claude/commands/
    ```
