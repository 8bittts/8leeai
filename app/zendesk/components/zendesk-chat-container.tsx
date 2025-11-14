"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ChatMessage } from "@/app/zendesk/lib/types"
import { MatrixBackground } from "@/components/matrix-background"
import { ChatHistory } from "./chat-history"
import { ChatInput } from "./chat-input"
import { SuggestionBar } from "./suggestion-bar"
import { ZendeskHeader } from "./zendesk-header"

/**
 * Simple UUID v4 generator for message IDs
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Main orchestrator for the Zendesk chat interface.
 * Manages state, boot sequence, and message flow.
 */
export function ZendeskChatContainer() {
  // Boot screen removed - show interface immediately
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioPlayedRef = useRef(false)

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio("/cj.m4a")
    audioRef.current.volume = 0.02
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const initializeInterface = useCallback(() => {
    // Play audio on initialization
    if (!audioPlayedRef.current && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Intentionally empty - audio is optional enhancement
      })
      audioPlayedRef.current = true
    }
  }, [])

  const addMessage = useCallback(
    (type: ChatMessage["type"], content: string, metadata?: ChatMessage["metadata"]) => {
      const message: ChatMessage = {
        id: generateId(),
        type,
        content,
        timestamp: new Date(),
        ...(metadata && { metadata }),
      }
      setMessages((prev) => [...prev, message])
      return message.id
    },
    []
  )

  const addUserMessage = useCallback(
    (content: string) => {
      return addMessage("user", content)
    },
    [addMessage]
  )

  const addAssistantMessage = useCallback(
    (content: string, metadata?: ChatMessage["metadata"]) => {
      return addMessage("assistant", content, metadata)
    },
    [addMessage]
  )

  const addErrorMessage = useCallback(
    (content: string) => {
      return addMessage("error", content)
    },
    [addMessage]
  )

  const handleSubmit = useCallback(
    async (query: string) => {
      if (!query.trim() || isLoading) return

      // Add user message
      addUserMessage(query)

      // Add to command history
      setCommandHistory((prev) => [query, ...prev])
      setHistoryIndex(-1)
      setCurrentInput("")

      // Start loading
      setIsLoading(true)

      try {
        // Use the new unified smart query endpoint
        console.log(`[Chat] Processing query: "${query}"`)
        const queryResponse = await fetch("/api/zendesk/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        })

        if (!queryResponse.ok) {
          throw new Error(`Failed to process query: ${queryResponse.statusText}`)
        }

        const { answer, source, confidence, processingTime } = (await queryResponse.json()) as {
          answer: string
          source: "cache" | "live" | "ai"
          confidence: number
          processingTime: number
        }

        console.log(
          `[Chat] Response from ${source} (${(confidence * 100).toFixed(0)}% confidence, ${processingTime}ms)`
        )

        // Add assistant response with metadata
        addAssistantMessage(answer, {
          executionTime: processingTime,
          source,
          confidence,
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        addErrorMessage(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, addUserMessage, addAssistantMessage, addErrorMessage]
  )

  const handleSuggestionClick = useCallback(
    (query: string) => {
      setCurrentInput(query)
      // Auto-submit suggestion after brief delay
      setTimeout(() => handleSubmit(query), 0)
    },
    [handleSubmit]
  )

  const handleCopyMessage = useCallback((content: string) => {
    // Optional: Add visual feedback
    console.log("Copied:", content)
  }, [])

  const clearToStart = useCallback(() => {
    setMessages([])
    setCurrentInput("")
    setCommandHistory([])
    setHistoryIndex(-1)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+L (clear terminal) or Cmd+K (macOS clear)
      if ((e.ctrlKey || e.metaKey) && (e.key === "l" || e.key === "k")) {
        e.preventDefault()
        clearToStart()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [clearToStart])

  // Initialize on mount
  useEffect(() => {
    initializeInterface()
  }, [initializeInterface])

  return (
    <main className="h-full w-full bg-black text-green-500 font-mono relative flex flex-col overflow-hidden">
      {/* Matrix background effect */}
      <MatrixBackground />

      {/* Main content area */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Zendesk Header with ASCII Art */}
        <ZendeskHeader />

        {/* Chat history */}
        <ChatHistory messages={messages} onCopyMessage={handleCopyMessage} />

        {/* Suggestion bar */}
        <SuggestionBar onSuggestionClick={handleSuggestionClick} />

        {/* Input area */}
        <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          <ChatInput
            value={currentInput}
            onChange={setCurrentInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            commandHistory={commandHistory}
            historyIndex={historyIndex}
            onHistoryNavigate={setHistoryIndex}
          />
        </div>
      </div>
    </main>
  )
}
