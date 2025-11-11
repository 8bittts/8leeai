import { type NextRequest, NextResponse } from "next/server"

const INTERCOM_API_URL = "https://api.intercom.io"

/**
 * Fetches recent conversations from Intercom
 * GET /api/intercom/conversations
 */
export async function GET(_request: NextRequest) {
  try {
    // biome-ignore lint/complexity/useLiteralKeys: Next.js environment variable inlining requires bracket notation
    const accessToken = (process.env as Record<string, string | undefined>)["INTERCOM_ACCESS_TOKEN"]
    if (!accessToken) {
      return NextResponse.json({ error: "Intercom credentials not configured" }, { status: 500 })
    }

    // Fetch conversations from Intercom
    const response = await fetch(`${INTERCOM_API_URL}/conversations?limit=10`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Transform Intercom response to our format
    const conversations = (data.conversations || data.data || []).map(
      (conv: {
        id: string
        created_at?: number
        updated_at?: number
        participants?: Array<{ type: string }>
      }) => ({
        id: conv.id,
        createdAt: conv.created_at
          ? new Date(conv.created_at * 1000).toISOString()
          : conv.updated_at
            ? new Date(conv.updated_at * 1000).toISOString()
            : null,
        participantCount: conv.participants?.length || 0,
      })
    )

    return NextResponse.json({ conversations, count: conversations.length }, { status: 200 })
  } catch (error) {
    console.error("Error fetching Intercom conversations:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
