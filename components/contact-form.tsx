"use client"

import { useRef, useState } from "react"
import { env } from "@/lib/env"

interface ContactFormProps {
  onClose: () => void
}

export function ContactForm({ onClose }: ContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!(name && email && message)) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in all fields",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/zendesk/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: `Message sent! ID: ${data.conversationId}`,
        })
        // Reset form
        setName("")
        setEmail("")
        setMessage("")
        // Close form after 2 seconds
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isConfigured = env.isConfiguredClient()

  return (
    <section className="mb-8 p-4 border border-green-500 rounded" aria-label="Contact Form">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Contact Form</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-green-500 hover:text-green-400 text-sm font-bold"
          aria-label="Close contact form"
        >
          [close]
        </button>
      </div>

      {!isConfigured && (
        <div className="text-red-500 text-sm p-2 border border-red-500 rounded mb-4" role="alert">
          Contact form is not available. Zendesk credentials not configured.
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-3"
        style={{ opacity: isConfigured ? 1 : 0.5 }}
      >
        <div>
          <label htmlFor="contact-name" className="text-sm block mb-1">
            Name:
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black border border-green-500 text-green-500 px-2 py-1 text-sm focus:outline-none"
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="text-sm block mb-1">
            Email:
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-green-500 text-green-500 px-2 py-1 text-sm focus:outline-none"
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="text-sm block mb-1">
            Message:
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-black border border-green-500 text-green-500 px-2 py-1 text-sm focus:outline-none resize-none"
            rows={5}
            disabled={isSubmitting}
            required={true}
          />
        </div>

        {submitStatus && (
          <div
            className={`text-sm p-2 border rounded ${
              submitStatus.type === "success"
                ? "border-green-500 text-green-500 bg-black"
                : "border-red-500 text-red-500 bg-black"
            }`}
            role="status"
          >
            {submitStatus.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isConfigured}
          className="w-full bg-green-500 text-black px-3 py-1 text-sm font-bold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  )
}
