import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Intercom Intelligence Portal",
  description: "AI-powered support ticket intelligence for Intercom",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

/**
 * Intercom Layout
 * Uses root terminal styling (no override needed)
 */
export default function IntercomLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
