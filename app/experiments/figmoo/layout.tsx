import type { Metadata } from "next"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "Figmoo - Build Your Website in Minutes",
  description:
    "The simplest way to build a professional website. No design skills required. Start for free.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  // Additional privacy: no referrer, no Open Graph, no Twitter cards
  referrer: "no-referrer",
  openGraph: null,
  twitter: null,
}

/**
 * Figmoo Layout
 * Clean design with cream background and refined typography
 * Uses CSS variables for theming to work with Tailwind v4
 */
export default function FigmooLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-figmoo-bg text-figmoo-text font-sans antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:border focus:rounded-lg focus:text-figmoo-text focus:border-figmoo-text"
      >
        Skip to main content
      </a>
      {children}
    </div>
  )
}
