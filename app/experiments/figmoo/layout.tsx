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
 * Umso-inspired design using their exact color palette
 * Background: #faf7f4 (cream), Text: #2c2c2c (charcoal)
 */
export default function FigmooLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-[#faf7f4] text-[#2c2c2c] font-sans antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-[#2c2c2c] focus:px-4 focus:py-2 focus:border focus:border-[#2c2c2c] focus:rounded-lg"
      >
        Skip to main content
      </a>
      {children}
    </div>
  )
}
