import { GridList } from "@/components/grid-list"
import { Section } from "@/components/section"
import { useTheme } from "@/hooks/use-theme"
import { interactive } from "@/lib/utils"

/**
 * Theme Grid Section
 *
 * Displays available themes in a grid format like education/volunteer sections.
 * Shows theme name with description, highlighting the active theme.
 */
export function ThemeGridSection() {
  const { currentTheme, availableThemes, setTheme } = useTheme()

  return (
    <Section title="Available Themes" ariaLabel="Available Themes" animate={true}>
      <p className="text-sm text-theme-muted mb-4">
        Type a theme name to switch (e.g., &quot;terminal&quot;, &quot;gameboy&quot;)
      </p>
      <GridList>
        {availableThemes.map((theme) => {
          const isActive = theme.id === currentTheme
          return (
            <div key={theme.id} className="flex items-start">
              <button
                type="button"
                onClick={() => setTheme(theme.id)}
                className={interactive(
                  `text-left hover:text-theme-accent ${isActive ? "text-theme-accent" : ""}`
                )}
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
      </GridList>
    </Section>
  )
}
