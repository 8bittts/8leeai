"use client"

import type { SuggestionButton } from "@/app/experiments/intercom/lib/intercom-types"

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
    <div className="px-4 sm:px-6 lg:px-8 py-3 border-t border-green-500/30 bg-black/50">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="text-xs font-semibold text-green-400 opacity-80 tracking-wide">
          ⚡ Quick queries:
        </div>
        {suggestions.map((suggestion) => (
          <button
            type="button"
            key={suggestion.label}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="group px-3 py-1.5 text-xs border border-green-500/50 rounded-md text-green-500 hover:bg-green-500/10 hover:border-green-500/80 hover:shadow-sm hover:shadow-green-500/20 transition-all duration-200 flex items-center gap-1.5"
            title={suggestion.description}
            aria-label={suggestion.description}
          >
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">
              {suggestion.icon}
            </span>
            <span className="font-medium">{suggestion.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
