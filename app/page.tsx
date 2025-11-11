"use client"

import { IntercomWidget } from "@/components/intercom-widget"
import { TerminalContainer } from "@/components/terminal-container"

export default function Home() {
  return (
    <main className="h-full w-full bg-black overflow-hidden">
      <TerminalContainer />
      <IntercomWidget />
    </main>
  )
}
