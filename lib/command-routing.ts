import type { DataOffsets, PortfolioItem } from "@/lib/data"
import { isNumberInRange } from "@/lib/data"

export type NumericCommandSection = "projects" | "education" | "volunteer"

export interface NumericCommandMatch {
  number: number
  section: NumericCommandSection
  index: number
}

export interface ParsedTextCommand {
  key: string
  args: string
}

export function normalizeCommand(rawCommand: string): string {
  return rawCommand.trim().replace(/^\//, "")
}

export function isNumericCommand(command: string): boolean {
  return /^\d+$/.test(command)
}

export function parseTextCommand(rawCommand: string): ParsedTextCommand {
  const head = rawCommand.split(/\s+/)[0] ?? ""
  const key = head.toLowerCase()
  const args = rawCommand.slice(head.length).trim()

  return { key, args }
}

export function resolveNumericCommand(
  number: number,
  offsets: DataOffsets
): NumericCommandMatch | null {
  if (isNumberInRange(number, offsets.projects)) {
    return {
      number,
      section: "projects",
      index: number - offsets.projects.start,
    }
  }

  if (isNumberInRange(number, offsets.education)) {
    return {
      number,
      section: "education",
      index: number - offsets.education.start,
    }
  }

  if (isNumberInRange(number, offsets.volunteer)) {
    return {
      number,
      section: "volunteer",
      index: number - offsets.volunteer.start,
    }
  }

  return null
}

export function pickRandomProjectNumber(
  projectsWithUrls: ReadonlyArray<PortfolioItem>,
  allProjects: ReadonlyArray<PortfolioItem>,
  random: () => number = Math.random,
  projectNumberById?: ReadonlyMap<string, number>
): number | null {
  if (projectsWithUrls.length === 0) {
    return null
  }

  const randomIndex = Math.floor(random() * projectsWithUrls.length)
  const randomProject = projectsWithUrls[randomIndex]
  if (!randomProject) {
    return null
  }

  if (projectNumberById) {
    return projectNumberById.get(randomProject.id) ?? null
  }

  const projectIndex = allProjects.findIndex((project) => project.id === randomProject.id)
  if (projectIndex < 0) {
    return null
  }

  return projectIndex + 1
}
