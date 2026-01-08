export type CommandPanel = "help" | "email" | "education" | "volunteer" | "themes"

export type CommandKind =
  | "panel"
  | "link"
  | "clear"
  | "random"
  | "system"
  | "theme"
  | "echo"
  | "info"

export interface CommandDefinition {
  id: string
  aliases?: string[]
  label: string
  help: string
  display?: string
  kind: CommandKind
  panel?: CommandPanel
  url?: string
  status?: string
  includeInCommands?: boolean
  showInHelp?: boolean
}

const COMMAND_DEFINITIONS: CommandDefinition[] = [
  {
    id: "enter",
    label: "enter",
    help: "Load more projects (15 per page)",
    display: "enter",
    kind: "info",
    includeInCommands: false,
  },
  {
    id: "email",
    aliases: ["contact", "hello", "reach"],
    label: "email",
    help: "Email address",
    kind: "panel",
    panel: "email",
    status: "Contact email displayed",
  },
  {
    id: "help",
    label: "help",
    help: "Show this help screen",
    kind: "panel",
    panel: "help",
    status: "Available commands displayed",
  },
  {
    id: "education",
    aliases: ["ed", "resume", "cv", "about", "bio"],
    label: "Education",
    help: "Education background",
    kind: "panel",
    panel: "education",
    status: "Education section displayed",
  },
  {
    id: "volunteer",
    aliases: ["vol"],
    label: "Volunteer",
    help: "Volunteer experience",
    kind: "panel",
    panel: "volunteer",
    status: "Volunteer experience section displayed",
  },
  {
    id: "github",
    label: "GitHub",
    help: "Link to this project",
    kind: "link",
    url: "https://github.com/8bittts/8leeai",
  },
  {
    id: "wellfound",
    label: "Wellfound",
    help: "Wellfound profile",
    kind: "link",
    url: "https://wellfound.com/u/eightlee",
  },
  {
    id: "linkedin",
    aliases: ["li"],
    label: "LinkedIn",
    help: "LinkedIn profile",
    kind: "link",
    url: "https://www.linkedin.com/in/8lee/",
  },
  {
    id: "twitter",
    aliases: ["x"],
    label: "X/Twitter",
    help: "X/Twitter profile",
    display: "twitter/x",
    kind: "link",
    url: "https://twitter.com/8bit",
  },
  {
    id: "social",
    label: "social links",
    help: "Show all social links",
    kind: "panel",
    panel: "help",
    status: "Social and professional links displayed",
  },
  {
    id: "random",
    label: "random project",
    help: "Open a random project",
    kind: "random",
  },
  {
    id: "clear",
    aliases: ["reset"],
    label: "clear",
    help: "Reset terminal",
    kind: "clear",
    status: "Terminal cleared",
  },
  {
    id: "whoami",
    label: "user info",
    help: "User info",
    kind: "system",
  },
  {
    id: "uname",
    label: "system info",
    help: "System info",
    kind: "system",
  },
  {
    id: "date",
    label: "current date/time",
    help: "Current date/time",
    kind: "system",
  },
  {
    id: "echo",
    label: "echo",
    help: "Echo text back",
    display: "echo [text]",
    kind: "echo",
  },
  {
    id: "stats",
    label: "portfolio statistics",
    help: "Portfolio statistics",
    kind: "system",
  },
  {
    id: "theme",
    aliases: ["themes"],
    label: "theme switcher",
    help: "Browse and switch visual themes",
    display: "theme",
    kind: "theme",
  },
]

const commandKeys = (command: CommandDefinition) => [command.id, ...(command.aliases ?? [])]

const formatHelpLabel = (command: CommandDefinition) => {
  if (command.display) return command.display
  const aliases = command.aliases ?? []
  if (aliases.length === 0) return command.id
  return `${command.id} (${aliases.join(", ")})`
}

export const COMMAND_HELP_LINES = COMMAND_DEFINITIONS.filter(
  (command) => command.showInHelp !== false
).map((command) => `• ${formatHelpLabel(command)} · ${command.help}`)

export const VALID_COMMANDS = COMMAND_DEFINITIONS.filter(
  (command) => command.includeInCommands !== false
).flatMap((command) => commandKeys(command))

export const COMMAND_ALIASES = Object.fromEntries(
  COMMAND_DEFINITIONS.flatMap((command) => commandKeys(command).map((key) => [key, command.label]))
)

const COMMAND_LOOKUP = new Map(
  COMMAND_DEFINITIONS.filter((command) => command.includeInCommands !== false).flatMap((command) =>
    commandKeys(command).map((key) => [key, command])
  )
)

export function resolveCommand(key: string): CommandDefinition | undefined {
  return COMMAND_LOOKUP.get(key)
}

export function isValidCommand(cmd: string): boolean {
  return COMMAND_LOOKUP.has(cmd)
}
