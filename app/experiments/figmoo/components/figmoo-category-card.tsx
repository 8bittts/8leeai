import { cn } from "@/lib/utils"
import type { CategoryCardProps } from "../lib/figmoo-types"

/**
 * Category Card Component
 * Selectable card with icon, title, and description
 */
export function FigmooCategoryCard({ category, selected, onSelect }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
        selected
          ? "border-violet-600 bg-violet-50"
          : "border-gray-200 bg-white hover:border-violet-300"
      )}
      aria-pressed={selected}
      aria-label={`Select ${category.title} category`}
    >
      {/* Icon with colored background */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          getCategoryIconStyle(category.icon)
        )}
      >
        <CategoryIcon icon={category.icon} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-figmoo-text">{category.title}</h3>
        <p className="truncate text-sm text-gray-600">{category.description}</p>
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600">
          <CheckIcon />
        </div>
      )}
    </button>
  )
}

function getCategoryIconStyle(icon: string): string {
  switch (icon) {
    case "briefcase":
      return "bg-violet-100 text-violet-600"
    case "user":
      return "bg-orange-100 text-orange-600"
    case "calendar":
      return "bg-amber-100 text-amber-600"
    case "sparkles":
      return "bg-pink-100 text-pink-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

function CategoryIcon({ icon }: { icon: "briefcase" | "user" | "calendar" | "sparkles" }) {
  const iconClass = "h-5 w-5"

  switch (icon) {
    case "briefcase":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      )
    case "user":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      )
    case "calendar":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )
    case "sparkles":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      )
  }
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  )
}
