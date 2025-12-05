# Experiments Protocol

**Last Updated:** December 5, 2025
**Protocol Version:** 1.2

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

**All experiments MUST be password-protected using the shared PasswordGate component.**

- **Password:** `booya` (consistent across all experiments)
- **Storage:** `sessionStorage` with experiment-specific key
- **Session Key Pattern:** `{experiment_name}_auth`
- **Shared Component:** `app/experiments/_shared/password-gate.tsx`

**Password Gate Styling (Standardized):**
All experiments use the same terminal-themed password gate matching the main site brand:

| Property | Value |
|----------|-------|
| Background | `bg-black` |
| Text | `text-green-500` |
| Border | `border-green-500` |
| Button | `bg-green-500 text-black` |
| Font | `font-mono` |

**Implementation (Required):**
```tsx
import { PasswordGate } from "../_shared/password-gate"

export default function ExperimentPage() {
  return (
    <PasswordGate title="Experiment Name" sessionKey="{experiment}_auth">
      <ExperimentContent />
    </PasswordGate>
  )
}
```

**PasswordGate Props:**
- `title` (string): Display name shown on the gate
- `sessionKey` (string): Unique key for sessionStorage (e.g., "figmoo_auth")
- `children` (ReactNode): Content to render after authentication

### 2. Complete Isolation

**Experiments MUST be 100% isolated from the main application.**

**Required:**
- All files within `/app/experiments/{name}/` directory
- All components, hooks, and utilities prefixed with `{experiment}-`
- No imports from main app code (except `globals.css`)
- No cross-imports between experiments (except `_shared/` components)

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

**Two Styling Approaches:**

**A. Terminal-Themed (Inherit from Root)** - Intercom, Zendesk

For experiments that should match the main 8lee.ai terminal aesthetic:

```tsx
// layout.tsx - Minimal wrapper, inherits root styles
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- Inherits `bg-black`, `text-green-500`, `font-mono` from root layout
- Password gate uses terminal theme (automatic via shared component)
- All UI uses green terminal styling
- Zero custom CSS overrides needed

**B. Independent Styling** - Figmoo

For experiments that need completely different branding:

```tsx
// layout.tsx - Override root styles
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#custom] text-[#custom] font-sans">
      {children}
    </div>
  )
}
```

- Wraps content in a div that overrides root terminal styles
- Password gate still uses terminal theme (shared component)
- Post-auth content uses experiment's own color palette
- Document the color scheme in experiment README

**General Guidelines:**

- Import `../../globals.css` for base Tailwind
- Use Tailwind utility classes exclusively (no custom CSS except globals.css)
- Ensure responsive design
- Document styling approach in experiment README

### 7. Design Implementation Standards

**All experiments MUST follow these design standards:**

**DO:**
- Use pure Tailwind v4 utility classes
- Define custom keyframe animations in `globals.css` with `{experiment}-` prefix
- Use Tailwind arbitrary values for dynamic values: `bg-[var(--theme-color)]`
- Define CSS custom properties for runtime theming if needed
- Use consistent typography scale: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`
- Use consistent spacing scale: `gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-6`, `gap-8`

**DON'T:**
- Use inline styles (`style={{ }}`) except for truly dynamic runtime values
- Use styled-jsx or other CSS-in-JS solutions
- Create custom CSS classes outside globals.css
- Hardcode pixel values (use Tailwind spacing scale)
- Mix Tailwind v3 patterns with v4

**Animation Pattern:**
```css
/* In globals.css */
@keyframes {experiment}-animation-name {
  /* keyframes */
}

.animate-{experiment}-animation-name {
  animation: {experiment}-animation-name 1s ease infinite;
}
```

**Dynamic Theming Pattern (if needed):**
```css
/* In globals.css */
:root {
  --{experiment}-primary: #7C3AED;
  --{experiment}-secondary: #EDE9FE;
}
```
```tsx
// In component
<div className="bg-[var(--{experiment}-primary)]">
```

### 8. Git Tracking

**Experiments are added to `.gitignore` as archived once complete:**

```gitignore
# Archived Experimental Projects
/app/experiments/{name}/
```

Note: Adding to .gitignore only affects future changes. Already committed files remain tracked until explicitly removed with `git rm --cached`.

---

## Shared Components

The `_shared/` directory contains components used across all experiments:

```
app/experiments/_shared/
└── password-gate.tsx    # Standardized terminal-themed auth gate
```

These components are the ONLY exception to the "no cross-imports" rule.

---

## Current Experiments

| Experiment | Purpose | Styling | URL |
|------------|---------|---------|-----|
| **Intercom** | AI-powered support ticket intelligence | Terminal (inherited) | `/experiments/intercom` |
| **Zendesk** | AI-powered ticket query interface | Terminal (inherited) | `/experiments/zendesk` |
| **Figmoo** | Frictionless website builder | Independent (Umso) | `/experiments/figmoo` |

**Styling Legend:**
- **Terminal (inherited)**: Uses root `bg-black text-green-500 font-mono` styles
- **Independent**: Has own color palette, overrides root styles via layout wrapper

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
