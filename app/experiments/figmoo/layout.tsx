import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Figmoo - Build Your Website in Minutes",
  description:
    "The simplest way to build a professional website. No design skills required. Start for free.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

/**
 * Figmoo Layout
 * Overrides root terminal styling with Figmoo's purple/white brand
 */
export default function FigmooLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-purple-600 focus:px-4 focus:py-2 focus:border focus:border-purple-600 focus:rounded-lg"
      >
        Skip to main content
      </a>
      {children}
    </div>
  )
}
