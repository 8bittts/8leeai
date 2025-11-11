"use client"

import { LiveChatWidget } from "@/components/live-chat-widget"
import { TerminalContainer } from "@/components/terminal-container"

export default function Home() {
  // biome-ignore lint/suspicious/noExplicitAny: TypeScript strict mode requires any type for process.env access in client components
  // biome-ignore lint/complexity/useLiteralKeys: Next.js environment variable inlining requires bracket notation
  // biome-ignore lint/complexity/useOptionalChain: Optional chaining breaks Next.js build-time substitution
  const zendeskAppId = ((process.env as any) || {})["NEXT_PUBLIC_ZENDESK_APP_ID"] || ""
  const showZendeskWidget = !!zendeskAppId

  return (
    <main className="h-full w-full bg-black overflow-hidden">
      <TerminalContainer />
      {showZendeskWidget && <LiveChatWidget appId={zendeskAppId} />}
    </main>
  )
}
