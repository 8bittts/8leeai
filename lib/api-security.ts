/**
 * Centralized security configuration for API routes and middleware
 * Provides CSP generation, CORS configuration, and security headers
 */

/**
 * Generates Content Security Policy header value
 * Restricts resource loading, allows Vercel analytics/live and third-party APIs
 */
export function generateCSP(): string {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
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

/**
 * Allowed origins for CORS requests
 */
export const ALLOWED_ORIGINS = [
  "https://8lee.ai",
  "https://www.8lee.ai",
  "https://8bit.io",
  "https://www.8bit.io",
  "https://john.do",
  "https://www.john.do",
  "https://btc.jobs",
  "https://www.btc.jobs",
  "https://yen.chat",
  "https://www.yen.chat",
  "https://btc.email",
  "https://www.btc.email",
  "https://eightlee.com",
  "https://www.eightlee.com",
  "https://particular.ly",
  "https://www.particular.ly",
  "https://johnsaddington.com",
  "https://www.johnsaddington.com",
  "https://deathnote.ai",
  "https://www.deathnote.ai",
  "https://8leeai.vercel.app",
  "https://8leeai-death-note.vercel.app",
  "https://8leeai-git-main-death-note.vercel.app",
  // Development and localhost
  "http://localhost:1333",
  "http://127.0.0.1:1333",
] as const

/**
 * Checks if an origin is allowed for CORS requests
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false
  return ALLOWED_ORIGINS.includes(origin as (typeof ALLOWED_ORIGINS)[number])
}

/**
 * Generates CORS headers for a given origin
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
