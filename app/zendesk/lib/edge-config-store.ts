/**
 * Edge Config Store
 * Abstraction layer for Vercel Edge Config
 * Provides persistent JSON storage for ticket cache across serverless requests
 *
 * Falls back to file system in local dev environment
 */

import { get as edgeConfigGet } from "@vercel/edge-config"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

const CACHE_KEY = "zendesk-cache"
const FALLBACK_CACHE_DIR = join(process.cwd(), ".zendesk-cache")
const FALLBACK_CACHE_FILE = join(FALLBACK_CACHE_DIR, "tickets.json")

/**
 * Check if we're running on Vercel (production or preview)
 */
function isVercel(): boolean {
  // Vercel sets multiple environment variables we can check
  return !!(process.env["VERCEL"] || process.env["VERCEL_ENV"])
}

/**
 * Load cache from Edge Config or fallback to filesystem
 */
export async function loadCacheFromStorage<T>(defaultValue: T | null = null): Promise<T | null> {
  try {
    // Construct Edge Config connection string if not already set
    if (!process.env["EDGE_CONFIG"] && process.env["EDGE_CONFIG_ID"] && process.env["VERCEL_TOKEN"]) {
      process.env["EDGE_CONFIG"] = `https://edge-config.vercel.com/${process.env["EDGE_CONFIG_ID"]}?token=${process.env["VERCEL_TOKEN"]}`
    }

    // Try Edge Config first if available and on Vercel
    if (isVercel() && process.env["EDGE_CONFIG"]) {
      try {
        console.log("[EdgeConfig] Attempting to load from Edge Config...")
        const data = await edgeConfigGet(CACHE_KEY)

        if (data) {
          console.log("[EdgeConfig] ✅ Loaded from Edge Config")
          return data as T
        }
      } catch (error) {
        console.error("[EdgeConfig] Error reading from Edge Config:", error)
        // Fall through to try fallback
      }
    }

    // Fall back to filesystem (local dev or Edge Config not available)
    if (existsSync(FALLBACK_CACHE_FILE)) {
      try {
        console.log("[EdgeConfig] Loading from filesystem fallback...")
        const content = readFileSync(FALLBACK_CACHE_FILE, "utf-8")
        const data = JSON.parse(content) as T
        console.log("[EdgeConfig] ✅ Loaded from filesystem fallback")
        return data
      } catch (error) {
        console.error("[EdgeConfig] Error reading from filesystem:", error)
      }
    }

    return defaultValue
  } catch (error) {
    console.error("[EdgeConfig] Unexpected error in loadCacheFromStorage:", error)
    return defaultValue
  }
}

/**
 * Save cache to Edge Config via REST API (server-side only)
 * Note: Uses Vercel REST API since @vercel/edge-config only provides read access
 */
export async function saveCacheToStorage<T>(data: T): Promise<boolean> {
  try {
    // Construct Edge Config connection string if not already set
    if (!process.env["EDGE_CONFIG"] && process.env["EDGE_CONFIG_ID"] && process.env["VERCEL_TOKEN"]) {
      process.env["EDGE_CONFIG"] = `https://edge-config.vercel.com/${process.env["EDGE_CONFIG_ID"]}?token=${process.env["VERCEL_TOKEN"]}`
    }

    // Log environment status for debugging
    console.log("[EdgeConfig] Environment check:", {
      isVercel: isVercel(),
      hasToken: !!process.env["VERCEL_TOKEN"],
      hasConfigId: !!process.env["EDGE_CONFIG_ID"],
      hasEdgeConfig: !!process.env["EDGE_CONFIG"],
      configId: process.env["EDGE_CONFIG_ID"]?.substring(0, 15) + "...",
    })

    // Try Edge Config first if available and on Vercel (via REST API)
    if (isVercel() && process.env["VERCEL_TOKEN"] && process.env["EDGE_CONFIG_ID"]) {
      try {
        console.log("[EdgeConfig] Attempting to save to Edge Config via REST API...")

        const response = await fetch(
          `https://api.vercel.com/v1/edge-config/${process.env["EDGE_CONFIG_ID"]}/items`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${process.env["VERCEL_TOKEN"]}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: [
                {
                  operation: "upsert",
                  key: CACHE_KEY,
                  value: data,
                },
              ],
            }),
          }
        )

        if (!response.ok) {
          const error = await response.text()
          console.error("[EdgeConfig] API Response Error:", {
            status: response.status,
            statusText: response.statusText,
            body: error,
          })
          throw new Error(`API error: ${response.status} - ${error}`)
        }

        console.log("[EdgeConfig] ✅ Saved to Edge Config")
        return true
      } catch (error) {
        console.error("[EdgeConfig] Error saving to Edge Config:", error)
        // Fall through to try filesystem fallback
      }
    } else {
      console.log("[EdgeConfig] Skipping Edge Config (not on Vercel or missing credentials)")
    }

    // Fall back to filesystem (local dev or Edge Config not available)
    try {
      console.log("[EdgeConfig] Saving to filesystem fallback...")

      // Ensure directory exists
      if (!existsSync(FALLBACK_CACHE_DIR)) {
        mkdirSync(FALLBACK_CACHE_DIR, { recursive: true })
      }

      writeFileSync(FALLBACK_CACHE_FILE, JSON.stringify(data, null, 2), "utf-8")
      console.log("[EdgeConfig] ✅ Saved to filesystem fallback")
      return true
    } catch (error) {
      console.error("[EdgeConfig] Error saving to filesystem:", error)
      return false
    }
  } catch (error) {
    console.error("[EdgeConfig] Unexpected error in saveCacheToStorage:", error)
    return false
  }
}

/**
 * Check storage availability
 */
export function isStorageConfigured(): boolean {
  if (isVercel()) {
    return !!(process.env["EDGE_CONFIG"] || process.env["VERCEL_TOKEN"])
  }
  return true // Always available locally (filesystem)
}

/**
 * Get storage info for logging
 */
export function getStorageInfo(): string {
  if (isVercel()) {
    if (process.env["EDGE_CONFIG"]) {
      return "Edge Config (SDK read-only)"
    }
    if (process.env["VERCEL_TOKEN"]) {
      return "Edge Config (REST API)"
    }
    return "Vercel (no storage configured)"
  }
  return "Filesystem (local dev)"
}
