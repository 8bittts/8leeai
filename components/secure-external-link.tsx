import { openExternalLink, renderTextWithUnderlinedWord } from "@/lib/utils"

/**
 * Secure external link component with window.opener protection
 * Highlights specific word based on linkWord parameter
 * Used across Projects, Education, and Volunteer sections
 */
interface SecureExternalLinkProps {
  url: string
  name: string
  linkWord?: string | undefined
  className?: string
}

export function SecureExternalLink({
  url,
  name,
  linkWord,
  className = "",
}: SecureExternalLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault()
        openExternalLink(url)
      }}
      className={`hover:text-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black ${className}`}
      aria-label={`${name} (opens in new tab)`}
    >
      {renderTextWithUnderlinedWord(name, linkWord)}
    </a>
  )
}
