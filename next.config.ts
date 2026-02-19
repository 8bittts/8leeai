import type { NextConfig } from "next"
import { generateCSP } from "./lib/api-security"

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

  // Keep the app shell uncached, but allow static assets to use framework defaults.
  // biome-ignore lint/suspicious/useAwait: Next.js requires async signature
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
          {
            key: "Link",
            value: "</cj.m4a>; rel=preload; as=audio",
          },
          {
            key: "Content-Security-Policy",
            value: generateCSP(),
          },
        ],
      },
    ]
  },
}

export default nextConfig
