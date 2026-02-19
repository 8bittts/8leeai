/**
 * Centralized security configuration for API routes and middleware.
 * Provides CSP generation, CORS configuration, and security headers.
 */

/**
 * Generates Content Security Policy header value.
 * Restricts resource loading, allows Vercel analytics/live, Google Fonts, and third-party APIs.
 */
export function generateCSP(): string {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://vercel.live wss://ws.vercel.live https://vitals.vercel-insights.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ]

  return cspDirectives.join("; ")
}

const ALLOWED_HOSTS = new Set([
  "8lee.ai",
  "8bit.io",
  "john.do",
  "btc.jobs",
  "yen.chat",
  "btc.email",
  "eightlee.com",
  "particular.ly",
  "johnsaddington.com",
  "deathnote.ai",
  "8leeai.vercel.app",
  "8leeai-death-note.vercel.app",
  "8leeai-git-main-death-note.vercel.app",
])

const ALLOWED_DEV_ORIGINS = new Set(["http://localhost:1333", "http://127.0.0.1:1333"])

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "")
}

/**
 * Checks if an origin is allowed for CORS requests.
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false

  if (ALLOWED_DEV_ORIGINS.has(origin)) {
    return true
  }

  let parsedOrigin: URL
  try {
    parsedOrigin = new URL(origin)
  } catch {
    return false
  }

  if (parsedOrigin.protocol !== "https:") {
    return false
  }

  // Only allow default HTTPS port if an explicit port is present.
  if (parsedOrigin.port !== "" && parsedOrigin.port !== "443") {
    return false
  }

  return ALLOWED_HOSTS.has(normalizeHostname(parsedOrigin.hostname))
}

/**
 * Generates CORS headers for a given origin.
 */
export function generateCORSHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {}

  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    headers["Access-Control-Max-Age"] = "86400"
    headers["Access-Control-Allow-Credentials"] = "true"
  }

  return headers
}
