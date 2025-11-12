"use client"

import { useState } from "react"

interface Message {
  author: string
  message: string
}

interface AISuggestion {
  message: string
  confidence: number
  reasoning: string
}

interface AIMessageSuggesterProps {
  conversationId: string
  conversationHistory: Message[]
  onClose: () => void
}

export function AIMessageSuggester({
  conversationId,
  conversationHistory,
  onClose,
}: AIMessageSuggesterProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messageType, setMessageType] = useState("response")
  const [suggestionCount, setSuggestionCount] = useState(2)

  const generateSuggestions = async () => {
    if (conversationHistory.length === 0) {
      setError("No conversation history to analyze")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuggestions([])

    try {
      const response = await fetch("/api/intercom/suggest-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          conversationHistory,
          messageType,
          suggestionCount,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuggestions(data.suggestions || [])
      } else {
        setError(data.error || "Failed to generate suggestions")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      className="mb-8 p-4 border border-green-500 rounded"
      aria-label="AI Message Suggestions"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">AI Message Suggestions</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-green-500 hover:text-green-400 text-sm font-bold"
          aria-label="Close AI suggestions"
        >
          [close]
        </button>
      </div>

      <div className="bg-black border border-green-500 rounded p-3 mb-4">
        <p className="text-xs text-gray-400 mb-2">Conversation #{conversationId}</p>
        <p className="text-sm font-bold">History: {conversationHistory.length} messages</p>
        {conversationHistory.length > 0 && (
          <div className="text-xs text-gray-400 mt-2 max-h-32 overflow-y-auto">
            {conversationHistory.slice(-3).map((msg, idx) => (
              <p key={idx} className="mb-1">
                <span className="text-green-500 font-bold">{msg.author}:</span>{" "}
                {msg.message.substring(0, 50)}
                {msg.message.length > 50 ? "..." : ""}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="msg-type" className="text-sm block mb-1">
              Message Type:
            </label>
            <select
              id="msg-type"
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full bg-black border border-green-500 text-green-500 px-2 py-1 text-sm focus:outline-none"
              disabled={isLoading}
            >
              <option value="greeting">Greeting</option>
              <option value="response">Response</option>
              <option value="suggestion">Suggestion</option>
            </select>
          </div>

          <div>
            <label htmlFor="msg-count" className="text-sm block mb-1">
              Suggestions:
            </label>
            <select
              id="msg-count"
              value={suggestionCount}
              onChange={(e) => setSuggestionCount(parseInt(e.target.value))}
              className="w-full bg-black border border-green-500 text-green-500 px-2 py-1 text-sm focus:outline-none"
              disabled={isLoading}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={generateSuggestions}
          disabled={isLoading}
          className="w-full bg-green-500 text-black px-3 py-1 text-sm font-bold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Generate Suggestions"}
        </button>
      </div>

      {error && (
        <div className="text-sm p-2 border border-red-500 text-red-500 bg-black rounded mb-4">
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-black border border-green-500 rounded p-3 text-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-green-500">Option {index + 1}</p>
                <span className="text-xs text-gray-400">
                  Confidence: {Math.round(suggestion.confidence * 100)}%
                </span>
              </div>

              <p className="mb-2 text-green-400">{suggestion.message}</p>

              <p className="text-xs text-gray-400 italic">
                Why: {suggestion.reasoning}
              </p>

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(suggestion.message)
                  }}
                  className="text-xs px-2 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black rounded"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      "Send to conversation functionality would be implemented here with actual message posting API"
                    )
                  }}
                  className="text-xs px-2 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black rounded"
                >
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && suggestions.length === 0 && !error && (
        <p className="text-green-500 text-sm text-center py-4">
          Click "Generate Suggestions" to see AI-powered message options
        </p>
      )}
    </section>
  )
}
