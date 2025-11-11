"use client"

import { useCallback, useEffect, useState } from "react"

interface Conversation {
  id: string
  participantCount?: number
  createdAt?: string
}

interface LiveChatWidgetProps {
  appId: string
}

export function LiveChatWidget({ appId }: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/zendesk/conversations?appId=${appId}`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      } else {
        setError("Failed to load conversations")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [appId])

  // Fetch conversations when widget opens
  useEffect(() => {
    if (isOpen) {
      fetchConversations()
        .then(() => {
          // Conversations loaded successfully
        })
        .catch((err) => {
          console.error("Error fetching conversations:", err)
        })
    }
  }, [isOpen, fetchConversations])

  return (
    <>
      {/* Widget Button (Fixed Bottom Right) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-green-500 text-black px-4 py-2 font-bold rounded hover:bg-green-400 transition-colors text-sm"
        aria-label="Toggle live chat widget"
        aria-expanded={isOpen}
      >
        💬 Chat
      </button>

      {/* Chat Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 w-80 bg-black border-2 border-green-500 rounded shadow-lg">
          {/* Header */}
          <div className="bg-green-500 text-black px-4 py-2 font-bold flex justify-between items-center">
            <span>Live Chat</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-black hover:opacity-75 font-bold text-lg"
              aria-label="Close chat widget"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {isLoading && <div className="text-green-500 text-sm">Loading conversations...</div>}

            {error && (
              <div className="text-red-500 text-sm">
                <p>Error: {error}</p>
                <button
                  type="button"
                  onClick={fetchConversations}
                  className="text-green-500 underline hover:text-green-400 text-xs mt-2"
                >
                  Retry
                </button>
              </div>
            )}

            {!(isLoading || error) && conversations.length === 0 && (
              <div className="text-green-500 text-sm">
                No conversations yet. Use the &quot;contact&quot; command to start one!
              </div>
            )}

            {!isLoading && conversations.length > 0 && (
              <div className="space-y-2">
                <p className="text-green-500 text-xs font-bold mb-3">
                  Recent Conversations ({conversations.length})
                </p>
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="bg-black border border-green-500 rounded p-2 text-xs"
                  >
                    <p className="text-green-500 font-bold break-all">ID: {conv.id}</p>
                    {conv.createdAt && (
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(conv.createdAt).toLocaleString()}
                      </p>
                    )}
                    {conv.participantCount && (
                      <p className="text-gray-400 text-xs mt-1">
                        Participants: {conv.participantCount}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Refresh Button */}
          <div className="border-t border-green-500 px-4 py-2">
            <button
              type="button"
              onClick={fetchConversations}
              disabled={isLoading}
              className="w-full bg-green-500 text-black px-2 py-1 text-xs font-bold hover:bg-green-400 disabled:opacity-50"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
