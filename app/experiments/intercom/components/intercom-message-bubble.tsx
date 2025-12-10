"use client"

import type { ChatMessage } from "@/app/experiments/intercom/lib/intercom-types"

interface MessageBubbleProps {
  message: ChatMessage
  onCopy?: () => void
}

export function MessageBubble({ message, onCopy }: MessageBubbleProps) {
  const isUser = message.type === "user"
  const isError = message.type === "error"
  const isSystem = message.type === "system"

  return (
    <div className={`mb-3 font-mono text-sm ${isSystem ? "opacity-60" : ""}`}>
      {isUser && (
        <div className="text-theme-primary mb-1">
          {"> "}
          {message.content}
        </div>
      )}

      {!(isUser || isError || isSystem) && (
        <div
          className={`text-theme-primary whitespace-pre-wrap break-words ${
            message.metadata?.isStreaming ? "animate-pulse" : ""
          }`}
        >
          {message.content}
          {onCopy && (
            <button
              type="button"
              onClick={onCopy}
              className="ml-2 text-theme-accent hover:text-theme-fg text-xs opacity-50 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm"
              title="Copy response"
              aria-label="Copy response"
            >
              [copy]
            </button>
          )}
          {message.metadata?.executionTime && (
            <div className="text-theme-accent text-xs opacity-60 mt-1">
              ⟳ {message.metadata.executionTime}ms
            </div>
          )}
          {message.metadata?.recordCount !== undefined && (
            <div className="text-theme-accent text-xs opacity-60">
              ◻ {message.metadata.recordCount} results
            </div>
          )}
        </div>
      )}

      {isError && (
        <div className="text-destructive border border-destructive/50 rounded px-3 py-2 bg-destructive/20">
          ❌ Error: {message.content}
        </div>
      )}

      {isSystem && (
        <div className="text-theme-accent border border-theme-primary/30 rounded px-3 py-2 bg-theme-primary/10">
          ℹ {message.content}
        </div>
      )}
    </div>
  )
}
