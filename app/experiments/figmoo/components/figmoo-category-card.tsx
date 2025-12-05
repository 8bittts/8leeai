import type { CategoryCardProps } from "../lib/figmoo-types"

/**
 * Category Card Component
 * Selectable card for main category selection
 */
export function FigmooCategoryCard({ category, selected, onSelect }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
        selected
          ? "border-purple-600 bg-purple-50"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
      aria-pressed={selected}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
          selected ? "bg-purple-100" : "bg-gray-100"
        }`}
      >
        <CategoryIcon icon={category.icon} selected={selected} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900">{category.title}</h3>
        <p className="text-sm text-gray-500 truncate">{category.description}</p>
      </div>

      {/* Checkmark */}
      {selected && (
        <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  )
}

/**
 * Category Icon Component
 * Renders the appropriate icon based on category type
 */
function CategoryIcon({
  icon,
  selected,
}: {
  icon: "briefcase" | "user" | "calendar" | "sparkles"
  selected: boolean
}) {
  const colorClass = selected ? "text-purple-600" : "text-gray-600"

  switch (icon) {
    case "briefcase":
      return (
        <svg
          className={`w-6 h-6 ${colorClass}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
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
        <svg
          className={`w-6 h-6 ${colorClass}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
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
        <svg
          className={`w-6 h-6 ${colorClass}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
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
        <svg
          className={`w-6 h-6 ${colorClass}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
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
