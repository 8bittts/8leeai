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
  title: "8LEE • Build Great Products",
  description:
    "20+ year engineering veteran and award-winning product designer. Lover of systems, speed, and all my 3 kids and (sub)agents equally. And CJ, I love you more than God. And JP.",
  keywords: [
    "8LEE",
    "product design",
    "engineering",
    "software development",
    "startup",
    "technology",
  ],
  authors: [{ name: "8LEE" }],
  creator: "8LEE",
  publisher: "8LEE",
  metadataBase: new URL("https://8lee.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://8lee.ai",
    title: "8LEE • Build Great Products",
    description:
      "20+ year engineering veteran and award-winning product designer. Lover of systems, speed, and all my 3 kids and (sub)agents equally.",
    siteName: "8LEE",
    images: [
      {
        url: "/8-social.jpeg",
        width: 1200,
        height: 630,
        alt: "8LEE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "8LEE • Build Great Products",
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
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
          <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "8LEE",
                url: "https://8lee.ai",
                jobTitle: "Engineering Veteran & Product Designer",
                description: "20+ year engineering veteran and award-winning product designer.",
                sameAs: ["https://x.com/8BIT"],
                image: "https://8lee.ai/8-social.jpeg",
              }),
            }}
          />
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
