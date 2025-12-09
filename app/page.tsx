"use client"

import { TerminalContainer } from "@/components/terminal-container"

export default function Home() {
  return (
    <main id="main-content" className="h-full w-full bg-theme-bg overflow-hidden">
      <TerminalContainer />
      {/* ThemeSwitcher removed - theme switching via terminal 'theme' command only */}
      {/* To re-enable: import { ThemeSwitcher } from "@/components/theme-switcher" */}
      {/* Then add <ThemeSwitcher /> here */}
    </main>
  )
}
