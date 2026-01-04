# Demos

Isolated proof-of-concept projects live in `/app/demos/`. Each demo is 100% isolated from the main app and can be safely deleted.

## Creating a Demo

1. Create `/app/demos/{name}/` with `page.tsx`, `layout.tsx`, `not-found.tsx`
2. Prefix all files with `{name}-` (e.g., `demo-utils.ts`)
3. No imports from main app code (except `globals.css`)

## Deleting a Demo

1. `rm -rf app/demos/{name}`
2. Check `proxy.ts`, `package.json`, `globals.css` for references
3. `bun run check && bun test && bun run build`

## Status

No active demos.
