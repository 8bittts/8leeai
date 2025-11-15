# Vercel Environment Variables - Quick Reference

**Status:** All variables are already configured in Vercel Production and Preview environments ✅

---

## Variables Currently in Vercel

### Zendesk Integration (NEW - Added Nov 14, 2025)
| Variable | Scope | Status |
|----------|-------|--------|
| `ZENDESK_SUBDOMAIN` | Production, Preview | ✅ Configured |
| `ZENDESK_EMAIL` | Production, Preview | ✅ Configured |
| `ZENDESK_API_TOKEN` | Production, Preview | ✅ Configured |

### OpenAI Integration (NEW - Added Nov 14, 2025)
| Variable | Scope | Status |
|----------|-------|--------|
| `OPENAI_API_KEY` | Production, Preview | ✅ Configured |

### Existing Integrations
| Variable | Scope | Status |
|----------|-------|--------|
| `INTERCOM_ACCESS_TOKEN` | Production | ✅ Configured |
| `RESEND_API_KEY` | Production | ✅ Configured |
| `NEXT_PUBLIC_INTERCOM_APP_ID` | Production | ✅ Configured |

---

## If Manual Addition Needed via Vercel Admin

**Use these exact variable names:**

```
ZENDESK_SUBDOMAIN
ZENDESK_EMAIL
ZENDESK_API_TOKEN
OPENAI_API_KEY
```

**Command to verify (via CLI):**
```bash
vercel env ls
```

**Command to add (if needed):**
```bash
vercel env add VARIABLE_NAME production preview
```

---

## Release Notes Location

Documented in: `/docs/2025-november.md`

Entry: "November 14, 2025 - Zendesk Smart Query System Performance Optimization (EXPERIMENTAL)"

---

## To Revert All Experimental Work

```bash
git checkout 00e3ea7
```

This removes all Zendesk/Intercom experimental code and returns to the pre-experiment state.
