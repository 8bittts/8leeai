import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { IBM_Plex_Mono, IBM_Plex_Sans, Press_Start_2P } from "next/font/google"
import { ThemeProvider } from "@/contexts/theme-context"
import "./globals.css"

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
})

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-8bit",
  display: "swap",
})

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "8LEE",
  metadataBase: new URL("https://8lee.ai"),
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
      nocache: true,
      "max-video-preview": 0,
      "max-image-preview": "none",
      "max-snippet": 0,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`h-full ${ibmPlexMono.variable} ${pressStart2P.variable} ${ibmPlexSans.variable}`}
    >
      <body className="h-full bg-theme-bg text-theme-fg font-[family-name:var(--theme-font-primary)] antialiased transition-colors duration-0">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-theme-bg focus:text-theme-fg focus:px-4 focus:py-2 focus:border focus:border-theme-border"
          >
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
