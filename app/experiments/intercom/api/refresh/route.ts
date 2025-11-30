/**
 * Intercom Cache Refresh Endpoint
 * POST /api/intercom/refresh
 *
 * Triggers a refresh of the local conversation cache from Intercom API
 * Returns status of the refresh operation
 */

import { type NextRequest, NextResponse } from "next/server"
import {
  loadConversationCache,
  refreshConversationCache,
} from "@/app/experiments/intercom/lib/intercom-conversation-cache"

export async function POST(_request: NextRequest): Promise<NextResponse> {
  try {
    console.log("[RefreshEndpoint] Cache refresh requested")

    // Perform refresh
    const result = await refreshConversationCache()

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: result.message,
        },
        { status: 500 }
      )
    }

    // Get updated cache info
    const cache = await loadConversationCache()

    return NextResponse.json({
      success: true,
      message: result.message,
      conversationCount: result.conversationCount,
      ticketCount: result.ticketCount,
      lastUpdated: cache?.lastUpdated,
      stats: cache?.stats,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("[RefreshEndpoint] Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        message: "Failed to refresh cache",
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint - returns current cache status without refreshing
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const cache = await loadConversationCache()

    if (!cache) {
      return NextResponse.json({
        success: false,
        message: "No cache found. POST to this endpoint to create one.",
        cached: false,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Cache status retrieved",
      cached: true,
      conversationCount: cache.conversationCount,
      ticketCount: cache.ticketCount,
      lastUpdated: cache.lastUpdated,
      stats: cache.stats,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("[RefreshEndpoint] Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    )
  }
}
