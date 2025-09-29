import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(_request: NextRequest) {
  const response = NextResponse.next()

  // Set the strictest robot headers
  response.headers.set(
    "X-Robots-Tag",
    "noindex, nofollow, noarchive, nosnippet, noimageindex, noodp, notranslate, noimageindex"
  )

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Permissions Policy - Disable unnecessary browser features
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
      "ambient-light-sensor=(), " +
      "autoplay=(), " +
      "encrypted-media=(), " +
      "picture-in-picture=(), " +
      "sync-xhr=(), " +
      "display-capture=(), " +
      "web-share=()"
  )

  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://vercel.live wss://ws.vercel.live https://vitals.vercel-insights.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")

  response.headers.set("Content-Security-Policy", cspDirectives)

  // CORS headers - restrictive for production
  response.headers.set("Access-Control-Allow-Origin", "https://8lee.ai")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Max-Age", "86400")
  response.headers.set("Access-Control-Allow-Credentials", "true")

  // Strict Transport Security (HSTS) - enforce HTTPS
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

  // Additional security headers
  response.headers.set("X-DNS-Prefetch-Control", "off")
  response.headers.set("X-Download-Options", "noopen")
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none")

  return response
}

export const config = {
  matcher: "/:path*",
}
