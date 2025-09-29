export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

export function openExternalLink(url: string): void {
  if (!url) return
  const newWindow = window.open(url, "_blank")
  if (newWindow) {
    newWindow.opener = null
  }
}

export const ANIMATION_DELAYS = {
  typewriter: 15,
  showProjects: 500,
  bootPrompt: 500,
} as const

export const DATA_OFFSETS = {
  projects: { start: 1, end: 60 },
  education: { start: 61, end: 65 },
  volunteer: { start: 66, end: 71 },
} as const
