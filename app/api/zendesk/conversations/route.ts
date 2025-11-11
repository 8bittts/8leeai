import { type NextRequest, NextResponse } from "next/server"
import { env } from "@/lib/env"

const ZENDESK_API_URL = env.ZENDESK_API_URL
const KEY_ID = env.ZENDESK_KEY_ID
const SECRET = env.ZENDESK_SECRET

/**
 * Encodes credentials for Basic Auth (Key ID:Secret)
 */
function getBasicAuthHeader(): string {
  const credentials = `${KEY_ID}:${SECRET}`
  return `Basic ${Buffer.from(credentials).toString("base64")}`
}

export async function GET(request: NextRequest) {
  try {
    // Get appId from query parameters
    const appId = request.nextUrl.searchParams.get("appId")

    if (!appId) {
      return NextResponse.json({ error: "Missing appId parameter" }, { status: 400 })
    }

    // Validate environment variables
    if (!(KEY_ID && SECRET)) {
      return NextResponse.json({ error: "Zendesk credentials not configured" }, { status: 500 })
    }

    // Fetch conversations from Zendesk
    const response = await fetch(`${ZENDESK_API_URL}/apps/${appId}/conversations?limit=10`, {
      method: "GET",
      headers: {
        Authorization: getBasicAuthHeader(),
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Transform Zendesk response to our format
    const conversations = (data.conversations || []).map(
      (conv: { id: string; created_at?: string; participants?: Array<{ role: string }> }) => ({
        id: conv.id,
        createdAt: conv.created_at,
        participantCount: conv.participants?.length || 0,
      })
    )

    return NextResponse.json({ conversations, count: conversations.length }, { status: 200 })
  } catch (error) {
    console.error("Error fetching Zendesk conversations:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
