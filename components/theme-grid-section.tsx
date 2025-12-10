import { useTheme } from "@/hooks/use-theme"

/**
 * Theme Grid Section
 *
 * Displays available themes in a grid format like education/volunteer sections.
 * Shows theme name with description, highlighting the active theme.
 */
export function ThemeGridSection() {
  const { currentTheme, availableThemes, setTheme } = useTheme()

  return (
    <section className="mb-8 animate-fadeIn" aria-label="Available Themes">
      <h2 className="text-xl font-bold mb-4">Available Themes</h2>
      <p className="text-sm text-theme-muted mb-4">
        Type a theme name to switch (e.g., &quot;terminal&quot;, &quot;gameboy&quot;)
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
        {availableThemes.map((theme) => {
          const isActive = theme.id === currentTheme
          return (
            <div key={theme.id} className="flex items-start">
              <button
                type="button"
                onClick={() => setTheme(theme.id)}
                className={`text-left hover:text-theme-accent transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm ${
                  isActive ? "text-theme-accent" : ""
                }`}
                aria-pressed={isActive}
                aria-label={`${theme.name} theme${isActive ? " (active)" : ""}`}
              >
                <span className="font-medium">{theme.id}</span>
                {isActive && (
                  <span className="ml-2 text-theme-muted" aria-hidden="true">
                    (active)
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
