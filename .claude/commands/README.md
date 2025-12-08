# Claude Code Slash Commands

Custom commands for the 8lee.ai project.

## Available Commands

### /check
Runs all quality checks (TypeScript, Biome, tests) and fixes issues aggressively.

**Usage:**
```
/check
```

### /ship
Complete quality check + git commit + push to main. Only commits if all checks pass.

**Usage:**
```
/ship
```

### /push
Fix lint/type issues (touched files only), update release notes with size splitting (1800 word threshold), and push to main. No Claude attribution.

**Usage:**
```
/push
```

### /design
Comprehensive design implementation review (ultrathink mode). Checks for pure shadcn, Tailwind v4, zero inline styles/custom components/hardcoded values, WCAG/ARIA coverage, and normalized patterns. Asks before making changes.

**Usage:**
```
/design
```

## How It Works

Slash commands are markdown files in `.claude/commands/`. When you type `/commandname`, Claude reads that file and follows the instructions inside.

## Creating New Commands

1. Create a new `.md` file in this directory
2. Write clear instructions for what Claude should do
3. Use the command with `/filename` (without .md extension)

**Example:**
```markdown
# My Custom Command

Do these things:
1. First step
2. Second step
3. Report results
```

Save as `custom.md`, then use with `/custom`

## Tips

- Keep instructions clear and specific
- List steps in order
- Specify expected outputs
- Include error handling instructions
