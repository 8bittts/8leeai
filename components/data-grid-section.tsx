import { SecureExternalLink } from "@/components/secure-external-link"
import { formatIndexWithOffset } from "@/lib/utils"

/**
 * Reusable grid section component for displaying Education and Volunteer data
 * Displays items in a 3-column grid with numbered indices
 */
interface DataGridSectionProps {
  title: string
  items: ReadonlyArray<{
    readonly id: string
    readonly name: string
    readonly url: string
    readonly linkWord?: string
  }>
  startOffset: number
  ariaLabel: string
}

export function DataGridSection({ title, items, startOffset, ariaLabel }: DataGridSectionProps) {
  return (
    <section className="mb-8 animate-fadeIn" aria-label={ariaLabel}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
        {items.map((item, index) => (
          <div key={item.id} className="flex">
            <span className="mr-3 text-green-700">
              {formatIndexWithOffset(index, startOffset)}.
            </span>
            {item.url ? (
              <SecureExternalLink url={item.url} name={item.name} linkWord={item.linkWord} />
            ) : (
              <span>{item.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
