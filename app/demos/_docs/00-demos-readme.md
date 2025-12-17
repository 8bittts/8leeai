# Demos

Isolated proof-of-concept projects live in `/app/demos/`. Each demo is 100% isolated from the main application and can be safely deleted without affecting anything else.

## Creating a Demo

1. Create directory: `/app/demos/{name}/`
2. Add required files:
   - `page.tsx` - Entry point
   - `layout.tsx` - Demo-specific layout
   - `not-found.tsx` - Custom 404
3. Prefix all files with `{name}-` (e.g., `demo-types.ts`, `demo-utils.ts`)
4. No imports from main app code (except `globals.css`)

## Directory Structure

```
app/demos/{name}/
├── page.tsx
├── layout.tsx
├── not-found.tsx
├── components/
│   └── {name}-*.tsx
├── lib/
│   └── {name}-*.ts
├── api/                # If needed
│   └── */route.ts
└── scripts/            # If needed
```

## Deletion Checklist

1. Delete directory: `rm -rf app/demos/{name}`
2. Check for references: `grep -r "{name}" . --include="*.ts" --include="*.tsx"`
3. Remove any entries in:
   - `proxy.ts` (CSP allowlists)
   - `package.json` (dependencies)
   - `globals.css` (animations)
4. Run: `bun run check && bun test && bun run build`

## Current Status

No active demos.
