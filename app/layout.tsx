import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { IBM_Plex_Mono } from "next/font/google"
import "./globals.css"

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Eight Lee • Build Great Products",
  description:
    "20+ year engineering veteran and award-winning product designer. Lover of systems, speed, and all my 3 kids and (sub)agents equally. And CJ, I love you more than God. And JP.",
  keywords: [
    "Eight Lee",
    "product design",
    "engineering",
    "software development",
    "startup",
    "technology",
  ],
  authors: [{ name: "Eight Lee" }],
  creator: "Eight Lee",
  publisher: "Eight Lee",
  metadataBase: new URL("https://8lee.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://8lee.ai",
    title: "Eight Lee • Build Great Products",
    description:
      "20+ year engineering veteran and award-winning product designer. Lover of systems, speed, and all my 3 kids and (sub)agents equally.",
    siteName: "Eight Lee",
    images: [
      {
        url: "/8-social.jpeg",
        width: 1200,
        height: 630,
        alt: "Eight Lee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eight Lee • Build Great Products",
    description: "20+ year engineering veteran and award-winning product designer.",
    creator: "@8BIT",
    images: ["/8-social.jpeg"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  other: {
    "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex, noodp",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full bg-black">
      <body
        className={`${ibmPlexMono.variable} h-full bg-black text-green-500 font-mono antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-green-500 focus:px-4 focus:py-2 focus:border focus:border-green-500"
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
