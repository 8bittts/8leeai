import { type NextRequest, NextResponse } from "next/server"
import { env } from "@/lib/env"

const ZENDESK_API_URL = env.ZENDESK_API_URL
const APP_ID = env.NEXT_PUBLIC_ZENDESK_APP_ID
const KEY_ID = env.ZENDESK_KEY_ID
const SECRET = env.ZENDESK_SECRET

/**
 * Encodes credentials for Basic Auth (Key ID:Secret)
 */
function getBasicAuthHeader(): string {
  const credentials = `${KEY_ID}:${SECRET}`
  return `Basic ${Buffer.from(credentials).toString("base64")}`
}

/**
 * Creates a user in Zendesk Conversations
 */
async function createOrGetUser(
  email: string,
  name: string
): Promise<{ userId: string; externalId: string }> {
  // Use email as external ID for idempotency
  const externalId = email

  const userPayload = {
    external_id: externalId,
    given_name: name.split(" ")[0] || "User",
    surname: name.split(" ").slice(1).join(" ") || "",
    email: email,
  }

  const response = await fetch(
    `${ZENDESK_API_URL}/apps/${APP_ID}/users?external_id=${encodeURIComponent(externalId)}`,
    {
      method: "GET",
      headers: {
        Authorization: getBasicAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  )

  let userId: string

  if (response.ok) {
    // User exists, get their ID
    const data = await response.json()
    if (data.user) {
      userId = data.user.id
    } else {
      // User not found by external_id, create new one
      const createResponse = await fetch(`${ZENDESK_API_URL}/apps/${APP_ID}/users`, {
        method: "POST",
        headers: {
          Authorization: getBasicAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userPayload }),
      })

      if (!createResponse.ok) {
        throw new Error(`Failed to create user: ${createResponse.statusText}`)
      }

      const createData = await createResponse.json()
      userId = createData.user.id
    }
  } else {
    // Create new user
    const createResponse = await fetch(`${ZENDESK_API_URL}/apps/${APP_ID}/users`, {
      method: "POST",
      headers: {
        Authorization: getBasicAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: userPayload }),
    })

    if (!createResponse.ok) {
      throw new Error(`Failed to create user: ${createResponse.statusText}`)
    }

    const createData = await createResponse.json()
    userId = createData.user.id
  }

  return { userId, externalId }
}

/**
 * Creates a conversation
 */
async function createConversation(
  userId: string,
  participantRole = "participant"
): Promise<string> {
  const payload = {
    participants: [
      {
        user_id: userId,
        role: participantRole,
      },
    ],
  }

  const response = await fetch(`${ZENDESK_API_URL}/apps/${APP_ID}/conversations`, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`)
  }

  const data = await response.json()
  return data.conversation.id
}

/**
 * Sends a message to a conversation
 */
async function sendMessage(
  conversationId: string,
  userId: string,
  messageText: string
): Promise<void> {
  const payload = {
    message: {
      author: {
        type: "user",
        user_id: userId,
      },
      content: {
        type: "text",
        text: messageText,
      },
    },
  }

  const response = await fetch(
    `${ZENDESK_API_URL}/apps/${APP_ID}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: getBasicAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!(APP_ID && KEY_ID && SECRET)) {
      return NextResponse.json({ error: "Zendesk credentials not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { name, email, message } = body

    // Validate input
    if (!(name && email && message)) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Create or get user
    const { userId } = await createOrGetUser(email, name)

    // Create conversation
    const conversationId = await createConversation(userId)

    // Send message
    await sendMessage(conversationId, userId, message)

    return NextResponse.json(
      {
        success: true,
        conversationId,
        message: `Message sent successfully. Conversation ID: ${conversationId}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating Zendesk conversation:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
