"use client"

import { useEffect, useRef } from "react"
import type { ChatMessage } from "@/app/zendesk/lib/zendesk-types"
import { MessageBubble } from "./zendesk-message-bubble"

interface ChatHistoryProps {
  messages: ChatMessage[]
  onCopyMessage?: (content: string) => void
}

/**
 * Displays chat history with auto-scroll to latest messages.
 * Maintains terminal-style formatting and scrolling behavior.
 */
export function ChatHistory({ messages, onCopyMessage }: ChatHistoryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to trigger on message count change for auto-scroll UX
  useEffect(() => {
    if (lastMessageRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
      }, 100)
    }
  }, [messages.length])

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    onCopyMessage?.(content)
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-2 pr-2"
      role="log"
      aria-label="Chat history"
      aria-live="polite"
      aria-atomic="false"
    >
      {messages.map((message, index) => (
        <div key={message.id} ref={index === messages.length - 1 ? lastMessageRef : undefined}>
          <MessageBubble message={message} onCopy={() => handleCopy(message.content)} />
        </div>
      ))}
    </div>
  )
}
