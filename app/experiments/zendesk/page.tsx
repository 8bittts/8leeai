"use client"

import { PasswordGate } from "../_shared/password-gate"
import { ZendeskChatContainer } from "./components/zendesk-chat-container"

/**
 * Zendesk Intelligence Portal
 * Terminal-styled chat interface for querying Zendesk APIs
 */
export default function ZendeskPage() {
  return (
    <PasswordGate title="Zendesk Intelligence Portal" sessionKey="zendesk_auth">
      <ZendeskChatContainer />
    </PasswordGate>
  )
}
