import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { generateCORSHeaders, generateCSP } from "./lib/api-security"
import { isSemanticUrl } from "./lib/utils"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Legacy URL redirect strategy: Redirect semantic-looking 404s to homepage
  // Skip redirect for homepage, Next.js internals, API routes, and experiments
  const isHomepage = pathname === "/"
  const isNextInternal = pathname.startsWith("/_next") || pathname.startsWith("/__next")
  const isApiRoute = pathname.startsWith("/api")
  const isExperiment = pathname.startsWith("/experiments")
  const isPublicAsset = pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|m4a|mp3|wav)$/i)

  // If path looks semantic (legitimate URL slug) and isn't a known valid route, redirect to homepage
  if (
    !(isHomepage || isNextInternal || isApiRoute || isExperiment || isPublicAsset) &&
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
  response.headers.set("Content-Security-Policy", generateCSP())

  // CORS: Allow requests from approved domains only
  const origin = request.headers.get("origin")
  const corsHeaders = generateCORSHeaders(origin)
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value)
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
