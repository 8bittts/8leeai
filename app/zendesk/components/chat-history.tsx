"use client"

import { useEffect, useRef } from "react"
import { ChatMessage } from "@/app/zendesk/lib/types"
import { MessageBubble } from "./message-bubble"

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
  useEffect(() => {
    if (lastMessageRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 0)
    }
  }, [messages])

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
      {messages.length === 0 && (
        <div className="text-green-400 opacity-60 text-sm font-mono">
          <div>$ Zendesk Intelligence Terminal v1.0</div>
          <div className="mt-2 text-green-500">
            Welcome to the Zendesk API Chat Interface
          </div>
          <div className="mt-2 text-xs opacity-50">
            Try: "show open tickets" or "what's our average response time?"
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <div key={message.id} ref={index === messages.length - 1 ? lastMessageRef : undefined}>
          <MessageBubble
            message={message}
            onCopy={() => handleCopy(message.content)}
          />
        </div>
      ))}
    </div>
  )
}
