"use client"

import { useRef, useState } from "react"

interface ContactFormProps {
  onClose: () => void
}

export function ContactForm({ onClose }: ContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!(name.trim() && email.trim() && message.trim())) {
      setStatusMessage({
        type: "error",
        message: "All fields are required",
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatusMessage({
        type: "error",
        message: "Invalid email address",
      })
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const response = await fetch("/intercom/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `Support Request from ${name}`,
          description: message,
          requesterEmail: email,
          requesterName: name,
          category: "support",
          priority: "normal",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create ticket")
      }

      setStatusMessage({
        type: "success",
        message: `Ticket created successfully! (ID: ${data.ticketId})`,
      })

      // Reset form after delay
      setTimeout(() => {
        setName("")
        setEmail("")
        setMessage("")
        onClose()
      }, 1500)
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to send email",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mb-8 p-4 border border-theme-primary rounded" aria-label="Contact Form">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Contact Support</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-theme-primary hover:text-theme-accent text-sm font-bold focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm"
          aria-label="Close contact form"
        >
          [close]
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="contact-name" className="text-sm block mb-1">
            Name: *
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-theme-bg border border-theme-primary text-theme-primary px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="text-sm block mb-1">
            Email: *
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-theme-bg border border-theme-primary text-theme-primary px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="text-sm block mb-1">
            Message: *
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-theme-bg border border-theme-primary text-theme-primary px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Your message here..."
            rows={5}
            disabled={isSubmitting}
            required={true}
          />
        </div>

        {statusMessage && (
          <div
            className={`text-sm p-2 border rounded ${
              statusMessage.type === "success"
                ? "border-theme-primary text-theme-primary bg-theme-bg"
                : "border-destructive text-destructive bg-theme-bg"
            }`}
            role="status"
          >
            {statusMessage.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-theme-primary text-theme-bg px-3 py-1 text-sm font-bold hover:bg-theme-accent disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-theme-fg focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm"
        >
          {isSubmitting ? "Creating Ticket..." : "Create Ticket"}
        </button>
      </form>
    </section>
  )
}
