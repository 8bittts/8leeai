"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { MatrixBackground } from "@/components/matrix-background"
import { ChatHistory } from "./chat-history"
import { ChatInput } from "./chat-input"
import { SuggestionBar } from "./suggestion-bar"
import { ZendeskHeader } from "./zendesk-header"
import { ChatMessage } from "@/app/zendesk/lib/types"

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
      const startTime = Date.now()

      try {
        // Step 1: Interpret the query using pattern matching + OpenAI fallback
        console.log(`[Chat] Interpreting query: "${query}"`)
        const interpretResponse = await fetch("/api/zendesk/interpret-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        })

        if (!interpretResponse.ok) {
          throw new Error(`Failed to interpret query: ${interpretResponse.statusText}`)
        }

        const { intent, filters, confidence, method } =
          (await interpretResponse.json()) as {
            intent: string
            filters: Record<string, unknown>
            confidence: number
            method: string
          }

        console.log(`[Chat] Interpreted as: ${intent} (${method}, ${(confidence * 100).toFixed(0)}% confidence)`)

        // Step 2: Build response based on intent
        let responseContent = ""
        let recordCount = 0

        switch (intent) {
          case "ticket_list":
          case "ticket_filter": {
            try {
              // Fetch tickets from API
              const ticketsResponse = await fetch("/api/zendesk/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filters }),
              })

              if (ticketsResponse.ok) {
                const { tickets } = (await ticketsResponse.json()) as {
                  tickets: Array<{ id: number; subject: string; status: string; priority: string }>
                }
                recordCount = tickets.length

                if (tickets.length === 0) {
                  responseContent = "No tickets found matching your criteria."
                } else {
                  // Format as ASCII table
                  responseContent = `Found ${tickets.length} ticket(s):\n\n`
                  responseContent += "ID    | Subject                              | Status    | Priority\n"
                  responseContent += "------+--------------------------------------+-----------+----------\n"

                  tickets.slice(0, 10).forEach((ticket) => {
                    const id = String(ticket.id).padEnd(4)
                    const subject = ticket.subject.substring(0, 34).padEnd(34)
                    const status = ticket.status.padEnd(9)
                    const priority = ticket.priority
                    responseContent += `${id}  | ${subject} | ${status} | ${priority}\n`
                  })

                  if (tickets.length > 10) {
                    responseContent += `\n... and ${tickets.length - 10} more tickets`
                  }
                }
              } else {
                responseContent = "Unable to fetch tickets. Please check your Zendesk configuration."
              }
            } catch (error) {
              responseContent = `Error fetching tickets: ${error instanceof Error ? error.message : "Unknown error"}`
            }
            break
          }

          case "analytics": {
            try {
              const statsResponse = await fetch("/api/zendesk/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stats: true }),
              })

              if (statsResponse.ok) {
                const { stats } = (await statsResponse.json()) as {
                  stats: Record<string, number>
                }

                responseContent = "Ticket Statistics:\n\n"
                responseContent += "Status    | Count\n"
                responseContent += "----------+-------\n"

                Object.entries(stats).forEach(([status, count]) => {
                  const statusPad = status.padEnd(9)
                  responseContent += `${statusPad} | ${count}\n`
                })

                const total = Object.values(stats).reduce((a, b) => a + b, 0)
                responseContent += `----------+-------\n`
                responseContent += `Total    | ${total}\n`
              } else {
                responseContent = "Unable to fetch statistics. Please check your Zendesk configuration."
              }
            } catch (error) {
              responseContent = `Error fetching statistics: ${error instanceof Error ? error.message : "Unknown error"}`
            }
            break
          }

          case "user_query": {
            responseContent = `Query intent: ${intent}\nYour question: "${query}"\n\nSupport for user queries coming soon.`
            break
          }

          case "organization_query": {
            responseContent = `Query intent: ${intent}\nYour question: "${query}"\n\nSupport for organization queries coming soon.`
            break
          }

          case "help_article": {
            responseContent = `Query intent: ${intent}\nYour question: "${query}"\n\nSupport for help article search coming soon.`
            break
          }

          default: {
            responseContent = `Query: "${query}"\nIntent: ${intent}\nMethod: ${method} (${(confidence * 100).toFixed(0)}% confidence)\nFilters: ${JSON.stringify(filters)}\n\nQuery interpretation complete. Full query handling coming soon.`
          }
        }

        // Add assistant response
        const executionTime = Date.now() - startTime
        addAssistantMessage(responseContent, {
          executionTime,
          recordCount,
          apiEndpoint: intent,
        })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred"
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
        <ChatHistory
          messages={messages}
          onCopyMessage={handleCopyMessage}
        />

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
