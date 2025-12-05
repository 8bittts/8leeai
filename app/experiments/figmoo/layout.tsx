import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../../globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

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

export default function FigmooLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`${inter.variable} h-full bg-gray-50 text-gray-900 font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-purple-600 focus:px-4 focus:py-2 focus:border focus:border-purple-600 focus:rounded-lg"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
