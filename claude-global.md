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
| `/codex` | Delegate task to OpenAI Codex CLI headless (`codex exec --model gpt-5.3-codex --yolo`) |
| `/cursor` | Delegate task to Cursor Agent CLI headless (`agent -p --yolo --trust --approve-mcps --model composer-1.5 --output-format stream-json --stream-partial-output`) |

---

## Shell Aliases

User's custom zsh aliases (defined in `~/.zshrc`) for quick reference:

**AI Tools:**

| Alias | Expands To | Purpose |
|-------|-----------|---------|
| `cj` | `claude --dangerously-skip-permissions` | Claude Code (no permission prompts) |
| `jp` | `codex --yolo` | OpenAI Codex (auto-approve mode) |
| `agent` | `agent` (native binary) | Cursor Agent CLI |

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
