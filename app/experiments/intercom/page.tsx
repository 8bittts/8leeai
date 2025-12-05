"use client"

import { PasswordGate } from "../_shared/password-gate"
import { IntercomChatContainer } from "./components/intercom-chat-container"

/**
 * Intercom Intelligence Portal
 * Terminal-styled chat interface for querying Intercom APIs
 */
export default function IntercomPage() {
  return (
    <PasswordGate title="Intercom Intelligence Portal" sessionKey="intercom_auth">
      <IntercomChatContainer />
    </PasswordGate>
  )
}
