# Experiments Protocol

**Last Updated:** December 5, 2025

This document defines the standards and protocols for all experiments in the `/app/experiments/` directory. All experiments MUST follow these guidelines to ensure consistency, isolation, and easy removal.

---

## Purpose

Experiments are isolated proof-of-concept implementations designed to:
- **Impress stakeholders** - Demonstrate capabilities to potential clients, employers, or partners
- **Test new ideas** - Validate concepts before committing to full implementation
- **Showcase technical skills** - Provide tangible examples of specific technologies or approaches
- **Explore integrations** - Test third-party API integrations in isolation

---

## Experiment Standards

### 1. Password Protection

**All experiments MUST be password-protected.**

- **Password:** `booya` (consistent across all experiments)
- **Storage:** `sessionStorage` with experiment-specific key
- **Session Key Pattern:** `{experiment_name}_auth`

**Password Gate Styling:**
Each experiment's password gate should match its brand colors:

| Experiment | Theme | Background | Border | Text | Button |
|------------|-------|------------|--------|------|--------|
| **Intercom** | Terminal Green | `bg-black` | `border-green-500` | `text-green-500` | `bg-green-500` |
| **Zendesk** | Terminal Green | `bg-black` | `border-green-500` | `text-green-500` | `bg-green-500` |
| **Figmoo** | Modern Purple | `bg-gray-50` | `border-purple-500` | `text-purple-600` | `bg-purple-600` |

**Implementation Pattern:**
```tsx
const CORRECT_PASSWORD = "booya"
const SESSION_KEY = "{experiment}_auth"

// Check session on mount
useEffect(() => {
  const sessionAuth = sessionStorage.getItem(SESSION_KEY)
  if (sessionAuth === "true") {
    setIsAuthenticated(true)
  }
  setIsLoading(false)
}, [])

// Handle password submission
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (password === CORRECT_PASSWORD) {
    setIsAuthenticated(true)
    sessionStorage.setItem(SESSION_KEY, "true")
  }
}
```

### 2. Complete Isolation

**Experiments MUST be 100% isolated from the main application.**

**Required:**
- All files within `/app/experiments/{name}/` directory
- All components, hooks, and utilities prefixed with `{experiment}-`
- No imports from main app code (except `globals.css`)
- No cross-imports between experiments

**File Naming Convention:**
```
{experiment}-{component-name}.tsx    # Components
{experiment}-{feature}.ts            # Library files
{experiment}-use-{hook-name}.ts      # Hooks
{experiment}-types.ts                # Type definitions
```

### 3. Directory Structure

Every experiment MUST follow this structure:

```
app/experiments/{name}/
├── page.tsx                    # Entry point with password gate
├── layout.tsx                  # Experiment-specific layout
├── not-found.tsx               # Custom 404 page
├── components/                 # React components
│   └── {name}-*.tsx
├── lib/                        # Business logic
│   ├── {name}-types.ts
│   ├── {name}-data.ts
│   └── {name}-utils.ts
├── hooks/                      # Custom hooks (if needed)
│   └── {name}-use-*.ts
├── api/                        # API routes (if needed)
│   └── */route.ts
└── scripts/                    # Test/utility scripts (if needed)
```

### 4. Documentation

Every experiment MUST have documentation in `/app/experiments/_docs/`:

**Required Files:**
1. `{name}-00-readme.md` - Comprehensive documentation (MASTER doc)
2. `{name}-01-deletion-guide.md` - Safe removal instructions

**Documentation Contents:**
- Executive summary and purpose
- Technical architecture
- File structure
- Environment variables (if any)
- Access instructions (URL + password)
- Deletion checklist

### 5. Deletion Workflow

**All experiments MUST be safely deletable without affecting the main application.**

**Deletion Checklist:**
1. Delete experiment directory: `rm -rf app/experiments/{name}`
2. Delete documentation: `rm app/experiments/_docs/{name}-*.md`
3. Verify no main app imports: `grep -r "{name}" app/ --include="*.ts" --include="*.tsx" | grep -v "experiments/{name}"`
4. Check `proxy.ts` for API allowlists (remove if present)
5. Check `package.json` for experiment-specific dependencies (remove if present)
6. Run build: `bun run build`
7. Run tests: `bun test`

### 6. Styling Guidelines

**Use experiment-specific styling that doesn't conflict with main app:**

- Import `../../globals.css` for base Tailwind
- Use Tailwind utility classes exclusively (no custom CSS)
- Match experiment's brand identity in password gate and UI
- Ensure responsive design

---

## Current Experiments

| Experiment | Purpose | Theme | URL |
|------------|---------|-------|-----|
| **Intercom** | AI-powered support ticket intelligence | Terminal Green | `/experiments/intercom` |
| **Zendesk** | AI-powered ticket query interface | Terminal Green | `/experiments/zendesk` |
| **Figmoo** | Frictionless website builder | Modern Purple | `/experiments/figmoo` |

---

## Creating a New Experiment

1. **Create directory structure** following the template above
2. **Add password protection** with `booya` password
3. **Implement experiment** with proper isolation
4. **Create documentation** in `_docs/` directory
5. **Test deletion workflow** to verify isolation
6. **Update this protocol** if adding new patterns

---

## Main App References

The only places the main app may reference experiments:

1. **`proxy.ts`** - CSP allowlist for external APIs (if experiment needs external services)
2. **`package.json`** - Experiment-specific dependencies (avoid if possible)

Both should be clearly documented in the experiment's deletion guide.

---

## Quality Standards

All experiments must pass:
- `bunx tsc --noEmit` - Zero TypeScript errors
- `bunx biome check` - Zero lint/format issues
- `bun run build` - Successful build

---

**Protocol Maintained By:** Development Team
**Protocol Version:** 1.0
