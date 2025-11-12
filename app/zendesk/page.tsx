"use client"

import { useEffect, useState } from "react"
import { TerminalContainer } from "@/components/terminal-container"
import { AIResponseViewer } from "./components/ai-response-viewer"
import { ZendeskTicketForm } from "./components/zendesk-ticket-form"

export default function ZendeskDemo() {
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<{
    id: string
    subject: string
    description: string
  } | null>(null)

  // Load Zendesk Web Widget
  useEffect(() => {
    const script = document.createElement("script")
    script.id = "ze-snippet"
    script.src =
      "https://static.zdassets.com/ekr/snippet.js?key=af64a072-5f19-47f4-9f3e-b6108435e64b"
    script.async = true
    document.body.appendChild(script)

    return () => {
      const existingScript = document.getElementById("ze-snippet")
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return (
    <main className="h-full w-full bg-black overflow-auto">
      <TerminalContainer />

      {/* Floating Controls Section */}
      <section className="mt-8 mx-4 mb-8 p-4 border border-green-500 rounded max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Support Options</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              Get help via Web Widget (bottom-right), email, or create a ticket:
            </p>
            <p className="text-sm">
              📧 Email:{" "}
              <a href="mailto:support@8lee.zendesk.com" className="text-green-400 hover:underline">
                support@8lee.zendesk.com
              </a>
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowTicketForm(!showTicketForm)}
              className="bg-green-500 text-black px-3 py-1 text-sm font-bold hover:bg-green-400"
            >
              {showTicketForm ? "[Hide]" : "[Create Ticket]"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTicket({
                  id: "123456",
                  subject: "Login not working",
                  description:
                    "I cannot log into my account. The system says my password is incorrect, but I am sure it is right. I have tried resetting it but still no luck.",
                })
                setShowAISuggestions(!showAISuggestions)
              }}
              className="bg-green-500 text-black px-3 py-1 text-sm font-bold hover:bg-green-400"
            >
              {showAISuggestions ? "[Hide]" : "[AI Suggestions]"}
            </button>
          </div>
        </div>
      </section>

      {/* Ticket Form */}
      {showTicketForm && (
        <div className="mx-4 mb-8 max-w-2xl">
          <ZendeskTicketForm onClose={() => setShowTicketForm(false)} />
        </div>
      )}

      {/* AI Suggestions Viewer */}
      {showAISuggestions && selectedTicket && (
        <div className="mx-4 mb-8 max-w-2xl">
          <AIResponseViewer
            ticketId={selectedTicket.id}
            subject={selectedTicket.subject}
            description={selectedTicket.description}
            onClose={() => setShowAISuggestions(false)}
          />
        </div>
      )}
    </main>
  )
}
