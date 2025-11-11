"use client"

import { LiveChatWidget } from "@/components/live-chat-widget"
import { TerminalContainer } from "@/components/terminal-container"
import { env } from "@/lib/env"

export default function Home() {
  const zendeskAppId = env.NEXT_PUBLIC_ZENDESK_APP_ID || ""

  return (
    <main className="h-full w-full bg-black overflow-hidden">
      <TerminalContainer />
      {zendeskAppId && <LiveChatWidget appId={zendeskAppId} />}
    </main>
  )
}
