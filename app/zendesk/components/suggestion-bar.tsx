"use client"

import { SuggestionButton } from "@/app/zendesk/lib/types"

interface SuggestionBarProps {
  onSuggestionClick: (query: string) => void
}

/**
 * Quick-access suggestion buttons for common queries.
 * Helps users discover available functionality.
 */
export function SuggestionBar({ onSuggestionClick }: SuggestionBarProps) {
  const suggestions: SuggestionButton[] = [
    {
      label: "Tickets",
      query: "show open tickets",
      icon: "📋",
      description: "View all open support tickets",
    },
    {
      label: "Analytics",
      query: "show ticket statistics",
      icon: "📊",
      description: "Display key support metrics",
    },
    {
      label: "Customers",
      query: "list customers",
      icon: "👥",
      description: "View all customers and organizations",
    },
    {
      label: "Help",
      query: "show available commands",
      icon: "❓",
      description: "List all available queries",
    },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-2 border-t border-green-500/20">
      <div className="text-xs text-green-400 opacity-60 mb-2">Quick queries:</div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="px-2 py-1 text-xs border border-green-500/40 rounded text-green-500 hover:bg-green-900/20 hover:border-green-500/60 transition-colors"
            title={suggestion.description}
            aria-label={suggestion.description}
          >
            {suggestion.icon} {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  )
}
