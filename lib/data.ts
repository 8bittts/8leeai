import rawPortfolioData from "@/lib/data/portfolio.json"

export interface PortfolioItem {
  id: string
  name: string
  url?: string
  linkWord?: string
}

interface PortfolioDataset {
  projects: ReadonlyArray<PortfolioItem>
  education: ReadonlyArray<PortfolioItem>
  volunteer: ReadonlyArray<PortfolioItem>
}

interface DataSectionLengths {
  projects: number
  education: number
  volunteer: number
}

export interface NumberRange {
  start: number
  end: number
}

export interface DataOffsets {
  projects: NumberRange
  education: NumberRange
  volunteer: NumberRange
}

type SectionName = keyof PortfolioDataset

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function validatePortfolioItem(value: unknown, section: SectionName, index: number): PortfolioItem {
  if (!isRecord(value)) {
    throw new Error(`Invalid ${section}[${index}]: expected object`)
  }

  const id = value["id"]
  const name = value["name"]
  const url = value["url"]
  const linkWord = value["linkWord"]

  if (typeof id !== "string" || id.trim() === "") {
    throw new Error(`Invalid ${section}[${index}].id: expected non-empty string`)
  }

  if (typeof name !== "string" || name.trim() === "") {
    throw new Error(`Invalid ${section}[${index}].name: expected non-empty string`)
  }

  if (url !== undefined && (typeof url !== "string" || url.trim() === "")) {
    throw new Error(`Invalid ${section}[${index}].url: expected non-empty string when provided`)
  }

  if (linkWord !== undefined && (typeof linkWord !== "string" || linkWord.trim() === "")) {
    throw new Error(
      `Invalid ${section}[${index}].linkWord: expected non-empty string when provided`
    )
  }

  return {
    id,
    name,
    ...(url ? { url } : {}),
    ...(linkWord ? { linkWord } : {}),
  }
}

function validateSection(value: unknown, section: SectionName): ReadonlyArray<PortfolioItem> {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid ${section}: expected array`)
  }

  const items = value.map((item, index) => validatePortfolioItem(item, section, index))
  const ids = new Set<string>()

  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`Duplicate id in ${section}: ${item.id}`)
    }
    ids.add(item.id)
  }

  return Object.freeze(items)
}

function validatePortfolioDataset(value: unknown): PortfolioDataset {
  if (!isRecord(value)) {
    throw new Error("Invalid portfolio dataset: expected object")
  }

  return {
    projects: validateSection(value["projects"], "projects"),
    education: validateSection(value["education"], "education"),
    volunteer: validateSection(value["volunteer"], "volunteer"),
  }
}

function createRange(start: number, length: number): NumberRange {
  return {
    start,
    end: start + length - 1,
  }
}

export function createDataOffsets(lengths: DataSectionLengths): DataOffsets {
  const projectRange = createRange(1, lengths.projects)
  const educationStart = projectRange.end + 1
  const educationRange = createRange(educationStart, lengths.education)
  const volunteerStart = educationRange.end + 1
  const volunteerRange = createRange(volunteerStart, lengths.volunteer)

  return {
    projects: projectRange,
    education: educationRange,
    volunteer: volunteerRange,
  }
}

export function isNumberInRange(value: number, range: NumberRange): boolean {
  return range.end >= range.start && value >= range.start && value <= range.end
}

const data = validatePortfolioDataset(rawPortfolioData)

export const projects = data.projects
export const education = data.education
export const volunteer = data.volunteer

/** Pre-filtered projects with URLs (computed once at module load) */
export const projectsWithUrls: ReadonlyArray<PortfolioItem> = Object.freeze(
  projects.filter((project) => Boolean(project.url?.trim()))
)

export const DATA_OFFSETS: DataOffsets = createDataOffsets({
  projects: projects.length,
  education: education.length,
  volunteer: volunteer.length,
})
