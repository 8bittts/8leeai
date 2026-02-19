import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { generateCORSHeaders, generateCSP } from "./lib/api-security"
import { isSemanticUrl } from "./lib/utils"

const PERMISSIONS_POLICY =
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

function applySecurityHeaders(response: NextResponse): void {
  // Ultra-private mode: Block all search engines and web crawlers.
  response.headers.set(
    "X-Robots-Tag",
    "noindex, nofollow, noarchive, nosnippet, noimageindex, noodp, notranslate"
  )

  // Security: Prevent clickjacking, MIME sniffing, XSS attacks.
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Permissions-Policy", PERMISSIONS_POLICY)
  response.headers.set("Content-Security-Policy", generateCSP())

  // HSTS: Force HTTPS for 1 year, include subdomains, enable browser preload.
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

  // Additional hardening: Disable DNS prefetch, download execution, cross-domain policies.
  response.headers.set("X-DNS-Prefetch-Control", "off")
  response.headers.set("X-Download-Options", "noopen")
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none")
}

function applyCorsHeaders(response: NextResponse, request: NextRequest): void {
  const origin = request.headers.get("origin")
  const corsHeaders = generateCORSHeaders(origin)
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value)
  }
}

function shouldRedirectSemanticPath(request: NextRequest, pathname: string): boolean {
  const isHtmlGetRequest =
    request.method === "GET" && (request.headers.get("accept")?.includes("text/html") ?? false)

  if (!isHtmlGetRequest) {
    return false
  }

  const isHomepage = pathname === "/"
  const isNextInternal = pathname.startsWith("/_next") || pathname.startsWith("/__next")
  const isApiRoute = pathname.startsWith("/api")
  const isDemo = pathname.startsWith("/demos")
  const isPublicAsset = pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|m4a|mp3|wav)$/i)

  return (
    !(isHomepage || isNextInternal || isApiRoute || isDemo || isPublicAsset) &&
    isSemanticUrl(pathname)
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldRedirectSemanticPath(request, pathname)) {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url), 301)
    applySecurityHeaders(redirectResponse)
    applyCorsHeaders(redirectResponse, request)
    return redirectResponse
  }

  if (request.method === "OPTIONS") {
    const preflightResponse = new NextResponse(null, { status: 204 })
    applySecurityHeaders(preflightResponse)
    applyCorsHeaders(preflightResponse, request)
    return preflightResponse
  }

  const response = NextResponse.next()
  applySecurityHeaders(response)
  applyCorsHeaders(response, request)

  return response
}

export const config = {
  matcher: "/:path*",
}
