import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Zendesk Intelligence Portal",
  description: "AI-powered ticket query interface for Zendesk",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

/**
 * Zendesk Layout
 * Uses root terminal styling (no override needed)
 */
export default function ZendeskLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
