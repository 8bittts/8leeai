# Slash Commands

Project-specific commands for Claude Code. Type `/commandname` to execute.

| Command | Purpose |
|---------|---------|
| `/push` | Fix issues and push to main |
| `/theme` | Global theme switcher |

Each command is defined in its own `.md` file in this directory.

Global commands (`/check`, `/ship`, `/design`, `/update`, `/docs`, `/vercel`, etc.) are defined in `~/.claude/commands/`.

## Creating Commands

1. Create `commandname.md` in this directory
2. Write clear step-by-step instructions
3. Use with `/commandname`
