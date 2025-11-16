/**
 * Response Formatter
 * Converts Zendesk API responses into terminal-friendly formatted output.
 */

interface Column {
  key: string
  label: string
  width?: number
}

/**
 * Formats array of objects as an ASCII table
 */
function formatTable(data: Record<string, unknown>[], columns: Column[]): string {
  if (data.length === 0) {
    return "No results found."
  }

  // Calculate column widths
  const widths: Record<string, number> = {}
  for (const col of columns) {
    const cellWidths = data.map((row) => String(row[col.key] || "").substring(0, 50).length)
    widths[col.key] = Math.max(
      col.label.length,
      col.width || 20,
      ...(cellWidths.length > 0 ? cellWidths : [0])
    )
  }

  // Build top border
  const topBorder = columns.map((col) => "─".repeat((widths[col.key] ?? 20) + 2)).join("┬")
  const top = `┌${topBorder}┐`

  // Build header
  const header = columns.map((col) => ` ${col.label.padEnd(widths[col.key] ?? 20)} `).join("│")
  const headerRow = `│${header}│`

  // Build header separator
  const headerSep = columns.map((col) => "─".repeat((widths[col.key] ?? 20) + 2)).join("┼")
  const sepRow = `├${headerSep}┤`

  // Build data rows
  const dataRows = data.map((row) => {
    const cells = columns
      .map((col) => {
        const value = String(row[col.key] || "").substring(0, 50)
        return ` ${value.padEnd(widths[col.key] ?? 20)} `
      })
      .join("│")
    return `│${cells}│`
  })

  // Build bottom border
  const bottomBorder = columns.map((col) => "─".repeat((widths[col.key] ?? 20) + 2)).join("┴")
  const bottom = `└${bottomBorder}┘`

  return [top, headerRow, sepRow, ...dataRows, bottom].join("\n")
}

/**
 * Formats a list of items
 */
function formatList(items: string[]): string {
  return items.map((item, idx) => `${idx + 1}. ${item}`).join("\n")
}

/**
 * Formats metrics/statistics
 */
function formatMetrics(metrics: Record<string, unknown>): string {
  const lines: string[] = []

  // Find longest key for alignment
  const maxKeyLength = Math.max(...Object.keys(metrics).map((k) => k.length))

  const metricsArray = Object.entries(metrics)
  const width = Math.max(40, maxKeyLength + 30)

  // Top border
  lines.push(`╔${"═".repeat(width - 2)}╗`)

  // Content
  for (const [key, value] of metricsArray) {
    const displayKey = key.replace(/_/g, " ").toUpperCase()
    const displayValue = String(value)
    const padding = width - displayKey.length - displayValue.length - 4

    lines.push(`║ ${displayKey}${" ".repeat(padding)}${displayValue} ║`)
  }

  // Bottom border
  lines.push(`╚${"═".repeat(width - 2)}╝`)

  return lines.join("\n")
}

/**
 * Formats a timeline of events
 */
export function formatTimeline(
  events: Array<{
    timestamp: string
    title: string
    description?: string
  }>
): string {
  return events
    .map(
      (event) =>
        `${event.timestamp} • ${event.title}\n${event.description ? `  ${event.description}` : ""}`
    )
    .join("\n\n")
}

/**
 * Formats ticket data as a table
 */
export function formatTickets(tickets: Record<string, unknown>[]): string {
  if (tickets.length === 0) {
    return "No tickets found."
  }

  const columns: Column[] = [
    { key: "id", label: "ID", width: 6 },
    { key: "subject", label: "Subject", width: 30 },
    { key: "priority", label: "Priority", width: 10 },
    { key: "status", label: "Status", width: 10 },
  ]

  return formatTable(tickets, columns)
}

/**
 * Formats user data as a table
 */
export function formatUsers(users: Record<string, unknown>[]): string {
  if (users.length === 0) {
    return "No users found."
  }

  const columns: Column[] = [
    { key: "id", label: "ID", width: 8 },
    { key: "name", label: "Name", width: 20 },
    { key: "email", label: "Email", width: 25 },
    { key: "role", label: "Role", width: 12 },
  ]

  return formatTable(users, columns)
}

/**
 * Formats organization data as a table
 */
export function formatOrganizations(orgs: Record<string, unknown>[]): string {
  if (orgs.length === 0) {
    return "No organizations found."
  }

  const columns: Column[] = [
    { key: "id", label: "ID", width: 8 },
    { key: "name", label: "Name", width: 30 },
    { key: "created_at", label: "Created", width: 12 },
  ]

  return formatTable(orgs, columns)
}

/**
 * Formats article/help content as a list
 */
export function formatArticles(articles: Record<string, unknown>[]): string {
  if (articles.length === 0) {
    return "No articles found."
  }

  const items = articles.map((article) => `${article["title"]} (ID: ${article["id"]})`)
  return formatList(items)
}

/**
 * Formats analytics data as metrics
 */
export function formatAnalytics(data: {
  total_tickets?: number
  open_tickets?: number
  avg_response_time?: number
  avg_resolution_time?: number
  satisfaction_score?: number
}): string {
  const metrics = {
    "Total Tickets": data.total_tickets || 0,
    "Open Tickets": data.open_tickets || 0,
    "Avg Response Time": `${Math.round(data.avg_response_time || 0)}h`,
    "Avg Resolution Time": `${Math.round(data.avg_resolution_time || 0)}h`,
    "Customer Satisfaction": `${(data.satisfaction_score || 0).toFixed(1)}/5.0`,
  }

  return formatMetrics(metrics)
}

/**
 * Formats generic API response based on content type
 */
export function formatResponse(
  data: unknown,
  format: "table" | "metrics" | "list" | "timeline"
): string {
  if (Array.isArray(data)) {
    // For list format, try to format as string list first
    if (format === "list" && data.length > 0 && typeof data[0] === "string") {
      return formatList(data as string[])
    }
    // For all other formats, format as table
    if (data.length === 0) {
      return "No results found."
    }
    return formatTable(
      data as Record<string, unknown>[],
      generateColumns(data[0] as Record<string, unknown>)
    )
  }

  if (typeof data === "object" && data !== null) {
    if (format === "metrics") {
      return formatMetrics(data as Record<string, unknown>)
    }
    return JSON.stringify(data, null, 2)
  }

  return String(data)
}

/**
 * Auto-generates columns from data object
 */
function generateColumns(obj: Record<string, unknown> | undefined): Column[] {
  if (!obj) return []

  return Object.keys(obj)
    .slice(0, 5) // Limit to 5 columns
    .map((key) => ({
      key,
      label: key.replace(/_/g, " ").toUpperCase(),
      width: 20,
    }))
}

/**
 * Formats error messages for display
 */
export function formatError(error: Error | string): string {
  const message = typeof error === "string" ? error : error.message
  return `❌ Error: ${message}`
}

/**
 * Adds summary statistics to formatted output
 */
export function addSummary(
  formattedOutput: string,
  recordCount: number,
  executionTime: number
): string {
  const summary = `\n\n◻ ${recordCount} result(s) | ⟳ ${executionTime}ms`
  return formattedOutput + summary
}

/**
 * Paginates large output for terminal display
 */
export function paginateOutput(output: string, pageSize = 20): string[] {
  const lines = output.split("\n")
  const pages: string[] = []

  for (let i = 0; i < lines.length; i += pageSize) {
    pages.push(lines.slice(i, i + pageSize).join("\n"))
  }

  return pages
}
