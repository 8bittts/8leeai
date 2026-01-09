import { calculateAge } from "@/lib/age"
import { VALID_COMMANDS } from "@/lib/commands"
import { education, projects, volunteer } from "@/lib/data"

export interface CommandOutput {
  content: string
  status: string
}

export function handleWhoami(): CommandOutput {
  return {
    content: "You're exploring Eight Lee's portfolio terminal.\nType 'help' to see what I can do!",
    status: "User info displayed",
  }
}

export function handleUname(): CommandOutput {
  const age = calculateAge(new Date())
  return {
    content: `8leeOS v${age} (Terminal Edition)\nBuilt with Next.js 16.1 + React 19.2`,
    status: "System info displayed",
  }
}

export function handleDate(): CommandOutput {
  return {
    content: new Date().toString(),
    status: "Current date/time displayed",
  }
}

export function handleStats(): CommandOutput {
  const totalCommands = VALID_COMMANDS.length
  const content = `Portfolio Statistics
${"═".repeat(50)}
Total Projects:        ${projects.length}
Education Entries:     ${education.length}
Volunteer Roles:       ${volunteer.length}
Available Commands:    ${totalCommands}
Technologies:          React, Next.js, TypeScript, AI/ML,
                      Tailwind CSS, Bun, Node.js, Python
Years Active:          20+ years
Latest Project:        ${projects[0]?.name || "N/A"}
Focus Areas:           AI/ML, Full-Stack Web, Systems`

  return {
    content,
    status: "Portfolio statistics displayed",
  }
}

export function getSystemCommandOutput(id: string): CommandOutput | null {
  switch (id) {
    case "whoami":
      return handleWhoami()
    case "uname":
      return handleUname()
    case "date":
      return handleDate()
    case "stats":
      return handleStats()
    default:
      return null
  }
}
