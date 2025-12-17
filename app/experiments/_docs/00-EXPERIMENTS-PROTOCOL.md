# Experiments Protocol

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

### 1. Complete Isolation

**Experiments MUST be 100% isolated from the main application.**

**Required:**
- All files within `/app/experiments/{name}/` directory
- All components, hooks, and utilities prefixed with `{experiment}-`
- No imports from main app code (except `globals.css` and shadcn components)
- No cross-imports between experiments

**File Naming Convention:**
```
{experiment}-{component-name}.tsx    # Components
{experiment}-{feature}.ts            # Library files
{experiment}-use-{hook-name}.ts      # Hooks
{experiment}-types.ts                # Type definitions
```

### 2. Directory Structure

Every experiment MUST follow this structure:

```
app/experiments/{name}/
├── page.tsx                    # Entry point
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

### 3. Documentation

Every experiment MUST have documentation in `/app/experiments/_docs/`:

**Required Files:**
1. `{name}-00-readme.md` - Comprehensive documentation (MASTER doc)
2. `{name}-01-deletion-guide.md` - Safe removal instructions

**Documentation Contents:**
- Executive summary and purpose
- Technical architecture
- File structure
- Environment variables (if any)
- Access instructions (URL)
- Deletion checklist

### 4. Deletion Workflow

**All experiments MUST be safely deletable without affecting the main application.**

**Deletion Checklist:**
1. Delete experiment directory: `rm -rf app/experiments/{name}`
2. Delete documentation: `rm app/experiments/_docs/{name}-*.md`
3. Verify no main app imports: `grep -r "{name}" app/ --include="*.ts" --include="*.tsx" | grep -v "experiments/{name}"`
4. Check `proxy.ts` for API allowlists (remove if present)
5. Check `package.json` for experiment-specific dependencies (remove if present)
6. Check `globals.css` for experiment-specific animations (remove if present)
7. Run build: `bun run build`
8. Run tests: `bun test`

### 5. Styling Guidelines

**Available Tools:**
- **Tailwind CSS v4** - Standard utility classes
- **shadcn/ui** - Pre-built accessible components (Button, Card, Input, etc.)
- **CSS Variables** - For theming via `globals.css`

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
- All UI uses green terminal styling
- Zero custom CSS overrides needed

**B. Independent Styling** - Figmoo

For experiments that need completely different branding:

```tsx
// layout.tsx - Override root styles
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {children}
    </div>
  )
}
```

- Wraps content in a div that overrides root terminal styles
- Uses experiment's own color palette
- Document the color scheme in experiment README

**General Guidelines:**

- Use Tailwind utility classes exclusively
- Use shadcn/ui components for common UI patterns
- Define custom keyframe animations in `globals.css` with `{experiment}-` prefix
- Ensure responsive design
- Document styling approach in experiment README

### 6. Using shadcn/ui Components

shadcn/ui is installed globally. Import components from `@/components/ui`:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

**Available Components:**
- `Button` - Various button styles
- `Card` - Container with header/content/footer sections
- `Input` - Form input field

**Adding New Components:**
```bash
bunx shadcn@latest add [component-name]
```

### 7. Design Implementation Standards

**DO:**
- Use pure Tailwind v4 utility classes
- Use shadcn/ui components for common patterns
- Define custom keyframe animations in `globals.css` with `{experiment}-` prefix
- Use consistent typography scale: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`
- Use consistent spacing scale: `gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-6`, `gap-8`

**DON'T:**
- Use inline styles (`style={{ }}`) except for truly dynamic runtime values
- Use styled-jsx or other CSS-in-JS solutions
- Create custom CSS classes outside globals.css
- Hardcode pixel values (use Tailwind spacing scale)
- Hardcode colors (use CSS variables or Tailwind tokens)
- Duplicate focus ring patterns (use `focusRing()` utility from `@/lib/utils`)

**Focus Ring Utility:**

Use the standardized `focusRing()` utility for consistent focus states:

```tsx
import { focusRing } from "@/lib/utils"

// Single class string
<button className={focusRing("hover:bg-accent")} />

// Multiple classes
<a className={focusRing("hover:text-accent", className)} />
```

This ensures WCAG-compliant focus indicators across all interactive elements.

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

### 8. Git Tracking

**Experiments are added to `.gitignore` as archived once complete:**

```gitignore
# Archived Experimental Projects
/app/experiments/{name}/
```

Note: Adding to .gitignore only affects future changes. Already committed files remain tracked until explicitly removed with `git rm --cached`.

---

## Current Experiments

No active experiments. This directory contains only the protocol documentation.

| Experiment | Purpose | Styling | URL |
|------------|---------|---------|-----|
| (none) | - | - | - |

**Styling Legend:**
- **Terminal (inherited)**: Uses root `bg-black text-green-500 font-mono` styles
- **Independent**: Has own color palette, overrides root styles via layout wrapper

---

## Creating a New Experiment

1. **Create directory structure** following the template above
2. **Choose styling approach** (terminal-themed or independent)
3. **Implement experiment** with proper isolation
4. **Create documentation** in `_docs/` directory
5. **Test deletion workflow** to verify isolation
6. **Update this protocol** if adding new patterns

---

## Main App References

The only places the main app may reference experiments:

1. **`proxy.ts`** - CSP allowlist for external APIs (if experiment needs external services)
2. **`package.json`** - Experiment-specific dependencies (avoid if possible)
3. **`globals.css`** - Experiment-specific animations (prefixed with `{experiment}-`)

All should be clearly documented in the experiment's deletion guide.

---

## Quality Standards

All experiments must pass:
- `bunx tsc --noEmit` - Zero TypeScript errors
- `bunx biome check` - Zero lint/format issues (experiments may be excluded)
- `bun run build` - Successful build

---

**Protocol Maintained By:** Development Team
