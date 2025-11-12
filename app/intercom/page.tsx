"use client"

import { useState } from "react"
import { TerminalContainer } from "@/components/terminal-container"
import { IntercomContactForm } from "./components/intercom-contact-form"
import { AIMessageSuggester } from "./components/ai-message-suggester"
import { LiveChatWidget } from "./components/live-chat-widget"

export default function IntercomDemo() {
  const [showContactForm, setShowContactForm] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [conversationHistory] = useState([
    { author: "Visitor", message: "Hi, I have a question about your pricing plans" },
    {
      author: "Support",
      message:
        "Hello! Thanks for reaching out. I'd be happy to help with any questions about our pricing.",
    },
    {
      author: "Visitor",
      message: "What's included in the pro plan?",
    },
  ])

  return (
    <main className="h-full w-full bg-black overflow-auto">
      <TerminalContainer />

      {/* Floating Controls Section */}
      <section className="mt-8 mx-4 mb-8 p-4 border border-green-500 rounded max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Demo Controls</h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-400 mb-3">
            Try starting a conversation or testing AI message suggestions:
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="bg-green-500 text-black px-3 py-1 text-sm font-bold hover:bg-green-400"
            >
              {showContactForm ? "[Hide]" : "[Start Conversation]"}
            </button>
            <button
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="bg-green-500 text-black px-3 py-1 text-sm font-bold hover:bg-green-400"
            >
              {showAISuggestions ? "[Hide]" : "[AI Message Ideas]"}
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      {showContactForm && (
        <div className="mx-4 mb-8 max-w-2xl">
          <IntercomContactForm onClose={() => setShowContactForm(false)} />
        </div>
      )}

      {/* AI Message Suggester */}
      {showAISuggestions && (
        <div className="mx-4 mb-8 max-w-2xl">
          <AIMessageSuggester
            conversationId="conv-sample-001"
            conversationHistory={conversationHistory}
            onClose={() => setShowAISuggestions(false)}
          />
        </div>
      )}

      {/* Live Chat Widget */}
      <LiveChatWidget />
    </main>
  )
}
