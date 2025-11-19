"use client"

import type { ChatMessage } from "@/app/intercom/lib/intercom-types"

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
        <div className="text-green-500 mb-1">
          {"> "}
          {message.content}
        </div>
      )}

      {!(isUser || isError || isSystem) && (
        <div
          className={`text-green-500 whitespace-pre-wrap break-words ${
            message.metadata?.isStreaming ? "animate-pulse" : ""
          }`}
        >
          {message.content}
          {onCopy && (
            <button
              type="button"
              onClick={onCopy}
              className="ml-2 text-green-400 hover:text-green-300 text-xs opacity-50 hover:opacity-100 transition-opacity"
              title="Copy response"
              aria-label="Copy response"
            >
              [copy]
            </button>
          )}
          {message.metadata?.executionTime && (
            <div className="text-green-400 text-xs opacity-60 mt-1">
              ⟳ {message.metadata.executionTime}ms
            </div>
          )}
          {message.metadata?.recordCount !== undefined && (
            <div className="text-green-400 text-xs opacity-60">
              ◻ {message.metadata.recordCount} results
            </div>
          )}
        </div>
      )}

      {isError && (
        <div className="text-red-500 border border-red-500/50 rounded px-3 py-2 bg-red-900/20">
          ❌ Error: {message.content}
        </div>
      )}

      {isSystem && (
        <div className="text-green-400 border border-green-500/30 rounded px-3 py-2 bg-green-900/10">
          ℹ {message.content}
        </div>
      )}
    </div>
  )
}
