/**
 * Query History Cache
 * Stores user queries and responses for historical context in AI queries
 * Provides conversation continuity across multiple interactions
 */

interface ConversationEntry {
  timestamp: string
  query: string
  response: string
  source: "cache" | "live" | "ai"
  confidence: number
}

interface ConversationCache {
  entries: ConversationEntry[]
  maxEntries: number
  lastUpdated: string
}

const CACHE_FILE = "app/intercom/cache/conversation-cache.json"
const MAX_ENTRIES = 50 // Keep last 50 interactions
const MAX_CONTEXT_ENTRIES = 10 // Send last 10 to OpenAI

/**
 * Load conversation cache from disk
 */
export function loadQueryHistory(): ConversationCache {
  try {
    const fs = require("node:fs")
    const path = require("node:path")
    const cacheFilePath = path.join(process.cwd(), CACHE_FILE)

    if (!fs.existsSync(cacheFilePath)) {
      return {
        entries: [],
        maxEntries: MAX_ENTRIES,
        lastUpdated: new Date().toISOString(),
      }
    }

    const data = fs.readFileSync(cacheFilePath, "utf-8")
    return JSON.parse(data) as ConversationCache
  } catch (error) {
    console.error("[QueryHistory] Error loading cache:", error)
    return {
      entries: [],
      maxEntries: MAX_ENTRIES,
      lastUpdated: new Date().toISOString(),
    }
  }
}

/**
 * Save conversation cache to disk
 */
export function saveQueryHistory(cache: ConversationCache): void {
  try {
    const fs = require("node:fs")
    const path = require("node:path")
    const cacheFilePath = path.join(process.cwd(), CACHE_FILE)
    const cacheDir = path.dirname(cacheFilePath)

    // Ensure cache directory exists
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }

    cache.lastUpdated = new Date().toISOString()
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), "utf-8")
  } catch (error) {
    console.error("[QueryHistory] Error saving cache:", error)
  }
}

/**
 * Add entry to conversation cache
 */
export function addConversationEntry(
  query: string,
  response: string,
  source: "cache" | "live" | "ai",
  confidence: number
): void {
  const cache = loadQueryHistory()

  const entry: ConversationEntry = {
    timestamp: new Date().toISOString(),
    query,
    response: response.substring(0, 500), // Truncate long responses
    source,
    confidence,
  }

  cache.entries.push(entry)

  // Keep only last MAX_ENTRIES
  if (cache.entries.length > MAX_ENTRIES) {
    cache.entries = cache.entries.slice(-MAX_ENTRIES)
  }

  saveQueryHistory(cache)
}

/**
 * Get recent conversation history for OpenAI context
 */
export function getRecentConversationContext(): string {
  const cache = loadQueryHistory()

  if (cache.entries.length === 0) {
    return ""
  }

  const recentEntries = cache.entries.slice(-MAX_CONTEXT_ENTRIES)

  const context = recentEntries
    .map((entry, index) => {
      const timeAgo = getTimeAgo(entry.timestamp)
      return `[${index + 1}] ${timeAgo}
User: ${entry.query}
Assistant (${entry.source}, ${(entry.confidence * 100).toFixed(0)}%): ${entry.response.substring(0, 200)}...`
    })
    .join("\n\n")

  return `RECENT CONVERSATION HISTORY (Last ${recentEntries.length} interactions):\n\n${context}`
}

/**
 * Get human-readable time ago
 */
function getTimeAgo(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins === 1) return "1 minute ago"
  if (diffMins < 60) return `${diffMins} minutes ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours === 1) return "1 hour ago"
  if (diffHours < 24) return `${diffHours} hours ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "1 day ago"
  return `${diffDays} days ago`
}

/**
 * Clear conversation cache
 */
export function clearQueryHistory(): void {
  const cache: ConversationCache = {
    entries: [],
    maxEntries: MAX_ENTRIES,
    lastUpdated: new Date().toISOString(),
  }
  saveQueryHistory(cache)
  console.log("[QueryHistory] Cache cleared")
}

/**
 * Get conversation cache stats
 */
export function getQueryHistoryStats(): {
  totalEntries: number
  oldestEntry: string | null
  newestEntry: string | null
} {
  const cache = loadQueryHistory()

  return {
    totalEntries: cache.entries.length,
    oldestEntry: cache.entries.length > 0 ? cache.entries[0]?.timestamp || null : null,
    newestEntry:
      cache.entries.length > 0 ? cache.entries[cache.entries.length - 1]?.timestamp || null : null,
  }
}
