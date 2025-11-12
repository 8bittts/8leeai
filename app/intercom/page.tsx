"use client"

import { useState } from "react"
import { TerminalContainer } from "@/components/terminal-container"
import { IntercomContactForm } from "./components/intercom-contact-form"

export default function IntercomDemo() {
  const [showContactForm, setShowContactForm] = useState(false)

  return (
    <main className="h-full w-full bg-black overflow-auto">
      <TerminalContainer />

      {/* Floating Controls Section */}
      <section className="mt-8 mx-4 mb-8 p-4 border border-green-500 rounded max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Support Options</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              Get help via direct email or register as a contact:
            </p>
            <p className="text-sm">
              📧 Email:{" "}
              <a
                href="mailto:amihb4cq@8lee.intercom-mail.com"
                className="text-green-400 hover:underline"
              >
                amihb4cq@8lee.intercom-mail.com
              </a>
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowContactForm(!showContactForm)}
              className="bg-green-500 text-black px-3 py-1 text-sm font-bold hover:bg-green-400"
            >
              {showContactForm ? "[Hide]" : "[Register Contact]"}
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
    </main>
  )
}
