# Slash Commands

Custom commands for Cursor. Type `/commandname` to execute.

| Command | Purpose |
|---------|---------|
| `/check` | Quality checks (TypeScript, Biome, tests) |
| `/ship` | Quality check + commit + push |
| `/push` | Fix issues and push to main |
| `/design` | Design system audit (9-point checklist) |
| `/theme` | Global theme switcher |
| `/update` | Package update workflow |
| `/docs` | Documentation audit and consolidation |
| `/vercel` | Comprehensive Vercel review via CLI |

Each command is defined in its own `.md` file in this directory.

## Creating Commands

1. Create `commandname.md` in this directory
2. Write clear step-by-step instructions
3. Use with `/commandname`

