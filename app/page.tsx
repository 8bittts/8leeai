"use client"

import { TerminalContainer } from "@/components/terminal-container"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function Home() {
  return (
    <main id="main-content" className="h-full w-full bg-theme-bg overflow-hidden">
      <TerminalContainer />
      <ThemeSwitcher />
    </main>
  )
}
