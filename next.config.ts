import type { NextConfig } from "next"

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

  // Aggressive no-cache headers to prevent stale terminal state
  // biome-ignore lint/suspicious/useAwait: Next.js requires async signature
  async headers() {
    return [
      {
        source: "/:path*",
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
        ],
      },
    ]
  },
}

export default nextConfig
