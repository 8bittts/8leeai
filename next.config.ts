import type { NextConfig } from "next"
import { generateCSP, ROBOTS_DIRECTIVES } from "./lib/api-security"

const nextConfig: NextConfig = {
  // Enable Turbopack for faster dev builds
  turbopack: {
    root: __dirname,
  },

  // Disable ISR disk flushing for faster builds
  experimental: {
    isrFlushToDisk: false,
  },

  cleanDistDir: true,

  reactStrictMode: true,
  poweredByHeader: false,

  // Let the static app shell edge-cache (Vercel purges the CDN on each deploy); only the
  // CSP + robots headers are pinned here. Dropping the no-store/Pragma/Expires override and
  // the eager <cj.m4a> audio preload lets the HTML serve from cache and keeps the critical
  // path from competing with a 108KB sound that is only created on boot-complete anyway.
  // biome-ignore lint/suspicious/useAwait: Next.js requires async signature
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Content-Security-Policy",
            value: generateCSP(),
          },
          {
            key: "X-Robots-Tag",
            value: ROBOTS_DIRECTIVES,
          },
        ],
      },
    ]
  },
}

export default nextConfig
