/**
 * Animated Showcase Component
 * Floating website preview screenshots with continuous scroll animation
 * Uses global animation classes from globals.css (animate-figmoo-scroll-*)
 */
export function FigmooAnimatedShowcase() {
  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Gradient overlays for smooth fade */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />

      {/* Three columns of animated cards */}
      <div className="flex gap-4 h-full">
        {/* Column 1 - Scrolls Up */}
        <div className="flex-1 animate-figmoo-scroll-up">
          <ShowcaseColumn cards={SHOWCASE_CARDS_1} />
          <ShowcaseColumn cards={SHOWCASE_CARDS_1} aria-hidden={true} />
        </div>

        {/* Column 2 - Scrolls Down */}
        <div className="flex-1 animate-figmoo-scroll-down">
          <ShowcaseColumn cards={SHOWCASE_CARDS_2} />
          <ShowcaseColumn cards={SHOWCASE_CARDS_2} aria-hidden={true} />
        </div>

        {/* Column 3 - Scrolls Up (slower) */}
        <div className="flex-1 animate-figmoo-scroll-up-slow">
          <ShowcaseColumn cards={SHOWCASE_CARDS_3} />
          <ShowcaseColumn cards={SHOWCASE_CARDS_3} aria-hidden={true} />
        </div>
      </div>
    </div>
  )
}

/**
 * Showcase Column - renders a column of preview cards
 */
function ShowcaseColumn({
  cards,
  "aria-hidden": ariaHidden,
}: {
  cards: ShowcaseCard[]
  "aria-hidden"?: boolean
}) {
  return (
    <div className="space-y-4 p-2" aria-hidden={ariaHidden}>
      {cards.map((card, index) => (
        <PreviewCard key={`${card.title}-${index}`} card={card} />
      ))}
    </div>
  )
}

/**
 * Preview Card - individual website preview mockup
 */
function PreviewCard({ card }: { card: ShowcaseCard }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-center">
          {card.url}
        </div>
      </div>

      {/* Content preview */}
      <div className="p-4" style={{ backgroundColor: card.bgColor }}>
        <div className="text-xs text-gray-500 mb-1">{card.label}</div>
        <h3 className="text-lg font-bold mb-2" style={{ color: card.textColor }}>
          {card.title}
        </h3>
        {card.subtitle && (
          <p className="text-sm" style={{ color: card.accentColor }}>
            {card.subtitle}
          </p>
        )}

        {/* Placeholder image area */}
        {card.hasImage && (
          <div
            className="mt-3 rounded-lg h-24 bg-cover bg-center"
            style={{
              backgroundColor: card.imageBgColor || "#E5E7EB",
              backgroundImage: `linear-gradient(135deg, ${card.imageBgColor || "#E5E7EB"} 0%, ${card.accentColor} 100%)`,
            }}
          />
        )}

        {/* Action buttons placeholder */}
        {card.hasButtons && (
          <div className="mt-3 flex gap-2">
            <div
              className="px-3 py-1.5 rounded-md text-xs text-white"
              style={{ backgroundColor: card.accentColor }}
            >
              Learn More
            </div>
            <div
              className="px-3 py-1.5 rounded-md text-xs border"
              style={{
                borderColor: card.accentColor,
                color: card.accentColor,
              }}
            >
              Get Started
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ShowcaseCard {
  title: string
  subtitle?: string
  label: string
  url: string
  bgColor: string
  textColor: string
  accentColor: string
  hasImage?: boolean
  hasButtons?: boolean
  imageBgColor?: string
}

const SHOWCASE_CARDS_1: ShowcaseCard[] = [
  {
    title: "The Product For Amazing Customers",
    subtitle: "",
    label: "My Site",
    url: "example.com",
    bgColor: "#FFFFFF",
    textColor: "#1A1A1A",
    accentColor: "#7C3AED",
    hasButtons: true,
  },
  {
    title: "Welcome to Your Beautiful new Website",
    subtitle: "",
    label: "My Site",
    url: "example.com",
    bgColor: "#FEFCE8",
    textColor: "#1A1A1A",
    accentColor: "#F59E0B",
    hasImage: true,
    imageBgColor: "#FDE68A",
  },
  {
    title: "See it for Yourself!",
    subtitle: "",
    label: "",
    url: "portfolio.com",
    bgColor: "#1A1A1A",
    textColor: "#FFFFFF",
    accentColor: "#22D3EE",
    hasImage: true,
    imageBgColor: "#164E63",
  },
]

const SHOWCASE_CARDS_2: ShowcaseCard[] = [
  {
    title: "Welcome to Your Beautiful new Website",
    subtitle: "",
    label: "My Site",
    url: "startup.io",
    bgColor: "#FFFFFF",
    textColor: "#1A1A1A",
    accentColor: "#EC4899",
    hasImage: true,
    imageBgColor: "#FCE7F3",
    hasButtons: true,
  },
  {
    title: "Grid",
    subtitle: "Great for displaying multiple features and things like that.",
    label: "",
    url: "features.dev",
    bgColor: "#F0FDF4",
    textColor: "#166534",
    accentColor: "#22C55E",
  },
  {
    title: "The Product For Amazing Customers",
    subtitle: "",
    label: "My Site",
    url: "business.co",
    bgColor: "#F8FAFC",
    textColor: "#1E293B",
    accentColor: "#3B82F6",
    hasButtons: true,
  },
]

const SHOWCASE_CARDS_3: ShowcaseCard[] = [
  {
    title: "Welcome to Your Beautiful new Website",
    subtitle: "",
    label: "My Site",
    url: "agency.design",
    bgColor: "#1F2937",
    textColor: "#FFFFFF",
    accentColor: "#F97316",
    hasImage: true,
    imageBgColor: "#374151",
    hasButtons: true,
  },
  {
    title: "$99",
    subtitle: "Professional Plan",
    label: "Pricing",
    url: "pricing.app",
    bgColor: "#FFFFFF",
    textColor: "#1A1A1A",
    accentColor: "#8B5CF6",
  },
  {
    title: "The Product For Amazing Customers",
    subtitle: "",
    label: "My Site",
    url: "product.io",
    bgColor: "#FFFBEB",
    textColor: "#92400E",
    accentColor: "#D97706",
    hasImage: true,
    imageBgColor: "#FEF3C7",
  },
]
