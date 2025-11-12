import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { isSemanticUrl } from "./lib/utils"

const ALLOWED_ORIGINS = [
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
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Legacy URL redirect strategy: Redirect semantic-looking 404s to homepage
  // Skip redirect for homepage, Next.js internals, API routes, and demo sites (zendesk/intercom)
  const isHomepage = pathname === "/"
  const isNextInternal = pathname.startsWith("/_next") || pathname.startsWith("/__next")
  const isApiRoute = pathname.startsWith("/api")
  const isDemoSite = pathname.startsWith("/zendesk") || pathname.startsWith("/intercom")
  const isPublicAsset = pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|m4a|mp3|wav)$/i)

  // If path looks semantic (legitimate URL slug) and isn't a known valid route, redirect to homepage
  if (
    !(isHomepage || isNextInternal || isApiRoute || isDemoSite || isPublicAsset) &&
    isSemanticUrl(pathname)
  ) {
    return NextResponse.redirect(new URL("/", request.url), 301)
  }

  const response = NextResponse.next()

  // Ultra-private mode: Block all search engines and web crawlers
  response.headers.set(
    "X-Robots-Tag",
    "noindex, nofollow, noarchive, nosnippet, noimageindex, noodp, notranslate, noimageindex"
  )

  // Security: Prevent clickjacking, MIME sniffing, XSS attacks
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Permissions Policy: Disable all browser features not needed for terminal UI
  response.headers.set(
    "Permissions-Policy",
    "camera=(), " +
      "microphone=(), " +
      "geolocation=(), " +
      "payment=(), " +
      "usb=(), " +
      "magnetometer=(), " +
      "gyroscope=(), " +
      "accelerometer=(), " +
      "autoplay=(), " +
      "encrypted-media=(), " +
      "picture-in-picture=(), " +
      "display-capture=(), " +
      "web-share=()"
  )

  // CSP: Restrict resource loading, allow Vercel analytics/live and third-party APIs
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://vercel.live wss://ws.vercel.live https://vitals.vercel-insights.com https://api.zendesk.com https://api.intercom.io",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")

  response.headers.set("Content-Security-Policy", cspDirectives)

  // CORS: Allow requests from approved domains only
  const origin = request.headers.get("origin")
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Max-Age", "86400")
    response.headers.set("Access-Control-Allow-Credentials", "true")
  }

  // HSTS: Force HTTPS for 1 year, include subdomains, enable browser preload
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

  // Additional hardening: Disable DNS prefetch, download execution, cross-domain policies
  response.headers.set("X-DNS-Prefetch-Control", "off")
  response.headers.set("X-Download-Options", "noopen")
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none")

  return response
}

export const config = {
  matcher: "/:path*",
}
