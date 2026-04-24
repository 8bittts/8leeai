# 8LEE TODOs

---
## MUST FOLLOW RULES and PROTOCOLS:
1. Never remove, delete, or modify this list unless directed to do so.
2. Active work only. Completed work lives in git history.
3. This is the ONLY TODO/backlog file.
4. Keep clear separation of concerns with phase-based checklists and zero task duplication.
5. Validate, review, and test each phase before moving to the next phase.
6. Stage and commit only files touched for the active phase. Ignore unrelated edits from other agents.
7. Update `docs/01-privacy-indexing.md` whenever crawler, indexing, metadata, or deploy policy changes.
8. Add a docs-alignment phase that updates internal/public documentation and runs the documented validation commands.

---
## BACKLOG

### Work TODOs
Only this section contains active unchecked work. Parked candidates and reminders below are planning context, not active implementation tasks.

(No active implementation phase.)

---
## REMINDERS

- Keep the site public but intentionally non-indexable. Any change to `app/robots.ts`, `app/layout.tsx`, `proxy.ts`, `next.config.ts`, `lib/api-security.ts`, or `vercel.json` must preserve the noindex/noarchive/nosnippet/noimageindex posture.
