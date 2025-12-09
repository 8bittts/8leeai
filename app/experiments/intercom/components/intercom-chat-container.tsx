"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ChatMessage } from "@/app/experiments/intercom/lib/intercom-types"
import { MatrixBackground } from "@/components/matrix-background"
import { ChatHistory } from "./intercom-chat-history"
import { ChatInput } from "./intercom-chat-input"
import { IntercomHeader } from "./intercom-header"
import { SuggestionBar } from "./intercom-suggestion-bar"

/**
 * Simple UUID v4 generator for message IDs
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Main orchestrator for the Intercom chat interface.
 * Manages state, boot sequence, and message flow.
 */
interface ConversationContext {
  lastTickets?: Array<{
    id: number
    subject: string
    description: string
    status: string
    priority: string
  }>
  lastQuery?: string
}

export function IntercomChatContainer() {
  // Boot screen removed - show interface immediately
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [context, setContext] = useState<ConversationContext>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioPlayedRef = useRef(false)
  const inputRefForFocus = useRef<HTMLInputElement | null>(null)

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
        const queryResponse = await fetch("/intercom/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, context }),
        })

        if (!queryResponse.ok) {
          throw new Error(`Failed to process query: ${queryResponse.statusText}`)
        }

        const { answer, source, confidence, processingTime, tickets } =
          (await queryResponse.json()) as {
            answer: string
            source: "cache" | "live" | "ai"
            confidence: number
            processingTime: number
            tickets?: Array<{
              id: number
              subject: string
              description: string
              status: string
              priority: string
            }>
          }

        console.log(
          `[Chat] Response from ${source} (${(confidence * 100).toFixed(0)}% confidence, ${processingTime}ms)`
        )

        // Update context if tickets were returned
        if (tickets && tickets.length > 0) {
          setContext({ lastTickets: tickets, lastQuery: query })
        }

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
    [isLoading, addUserMessage, addAssistantMessage, addErrorMessage, context]
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

  // Handle clicks anywhere to refocus input
  const handleMainClick = useCallback(() => {
    inputRefForFocus.current?.focus()
  }, [])

  return (
    <main className="min-h-screen w-full bg-black text-green-500 font-mono relative flex items-center justify-center px-8 py-8">
      {/* Matrix background effect */}
      <MatrixBackground />

      {/* Terminal window container - wide with minimal vertical spacing */}
      <div
        className="relative z-10 w-full h-[calc(100vh-64px)] border-2 border-green-500/30 rounded-lg bg-black flex flex-col overflow-hidden shadow-[0_-10px_40px_-5px_rgba(34,197,94,0.3),0_10px_40px_-5px_rgba(34,197,94,0.3),0_0_60px_rgba(34,197,94,0.15)]"
        onClick={handleMainClick}
      >
        {/* Intercom Header with ASCII Art */}
        <IntercomHeader />

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
            inputRef={inputRefForFocus}
          />
        </div>
      </div>
    </main>
  )
}
