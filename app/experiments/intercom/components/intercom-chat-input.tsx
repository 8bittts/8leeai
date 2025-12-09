"use client"

import { useCallback, useEffect, useRef } from "react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (query: string) => void
  isLoading: boolean
  commandHistory: string[]
  historyIndex: number
  onHistoryNavigate: (index: number) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
}

/**
 * Terminal-style chat input with command history navigation.
 * Features: auto-focus, command history (up/down arrows), Enter to submit.
 */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  commandHistory,
  historyIndex,
  onHistoryNavigate,
  inputRef: externalInputRef,
}: ChatInputProps) {
  const localInputRef = useRef<HTMLInputElement>(null)

  // Use callback ref to sync both refs
  const setInputRef = useCallback(
    (el: HTMLInputElement | null) => {
      localInputRef.current = el
      if (externalInputRef) {
        // biome-ignore lint/suspicious/noExplicitAny: Need to assign to mutable ref
        ;(externalInputRef as any).current = el
      }
    },
    [externalInputRef]
  )

  // Auto-focus on mount
  useEffect(() => {
    localInputRef.current?.focus()
  }, [])

  // Maintain focus after loading completes (after responses)
  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure DOM updates are complete
      setTimeout(() => {
        localInputRef.current?.focus()
      }, 50)
    }
  }, [isLoading])

  const handleEnter = useCallback(() => {
    if (value.trim()) {
      onSubmit(value.trim())
    }
  }, [value, onSubmit])

  const handleArrowUp = useCallback(() => {
    if (historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1
      const historyItem = commandHistory[newIndex]
      if (historyItem !== undefined) {
        onHistoryNavigate(newIndex)
        onChange(historyItem)
      }
    }
  }, [historyIndex, commandHistory, onHistoryNavigate, onChange])

  const handleArrowDown = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const historyItem = commandHistory[newIndex]
      if (historyItem !== undefined) {
        onHistoryNavigate(newIndex)
        onChange(historyItem)
      }
    } else if (historyIndex === 0) {
      onHistoryNavigate(-1)
      onChange("")
    }
  }, [historyIndex, commandHistory, onHistoryNavigate, onChange])

  const handleClear = useCallback(() => {
    onChange("")
    onHistoryNavigate(-1)
  }, [onChange, onHistoryNavigate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isLoading) {
        e.preventDefault()
        handleEnter()
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        handleArrowUp()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        handleArrowDown()
      } else if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        handleClear()
      }
    },
    [isLoading, handleEnter, handleArrowUp, handleArrowDown, handleClear]
  )

  return (
    <div className="border-t border-green-500/30 pt-4">
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="text-green-500">$</span>
        <input
          ref={setInputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            onHistoryNavigate(-1)
          }}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Enter a query..."
          className="flex-1 bg-black text-green-500 outline-none caret-green-500 placeholder-green-700 disabled:opacity-50 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm"
          autoComplete="off"
          spellCheck="false"
          aria-label="Chat input"
        />
        {isLoading && <span className="text-green-400 text-xs animate-pulse">processing...</span>}
      </div>
      <div className="mt-2 text-xs text-green-400 opacity-50">
        Press Enter to submit • ↑↓ for history • Ctrl+C to clear
      </div>
    </div>
  )
}
