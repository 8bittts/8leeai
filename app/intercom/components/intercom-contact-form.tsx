"use client"

import { useRef, useState } from "react"

interface IntercomContactFormProps {
  onClose: () => void
}

export function IntercomContactForm({ onClose }: IntercomContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [topic, setTopic] = useState("general")
  const [initialMessage, setInitialMessage] = useState("")
  const [pageUrl, setPageUrl] = useState("")
  const [pageTitle, setPageTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!(name && email && initialMessage)) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in all required fields",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/intercom/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitorEmail: email,
          visitorName: name,
          topic,
          initialMessage,
          pageUrl: pageUrl || window.location.href,
          pageTitle: pageTitle || document.title,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Contact registered! Now email amihb4cq@8lee.intercom-mail.com to start a conversation.",
        })
        // Reset form
        setName("")
        setEmail("")
        setTopic("general")
        setInitialMessage("")
        setPageUrl("")
        setPageTitle("")
        // Close form after 2 seconds
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to start conversation",
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

  return (
    <section className="mb-8 p-4 border border-green-500 rounded" aria-label="Contact Form">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Register as Contact</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-green-500 hover:text-green-400 text-sm font-bold"
          aria-label="Close contact form"
        >
          [close]
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-3">
        Register your contact information. After submission, email amihb4cq@8lee.intercom-mail.com
        to start a conversation.
      </p>

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
            className="w-full bg-black border border-green-500 text-green-500 px-2 py-1 text-sm focus:outline-none"
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
            className="w-full bg-black border border-green-500 text-green-500 px-2 py-1 text-sm focus:outline-none"
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div>
          <label htmlFor="contact-topic" className="text-sm block mb-1">
            Topic:
          </label>
          <select
            id="contact-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-black border border-green-500 text-green-500 px-2 py-1 text-sm focus:outline-none"
            disabled={isSubmitting}
          >
            <option value="general">General</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="text-sm block mb-1">
            Initial Message: *
          </label>
          <textarea
            id="contact-message"
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            className="w-full bg-black border border-green-500 text-green-500 px-2 py-1 text-sm focus:outline-none resize-none"
            placeholder="Describe your inquiry (5-1000 chars)"
            rows={5}
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div className="text-xs text-gray-400 p-2 border border-gray-600 rounded">
          <p className="mb-2">Optional: Current page context</p>
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Page URL (auto-filled)"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              className="w-full bg-black border border-gray-600 text-gray-400 px-2 py-1 text-xs focus:outline-none"
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Page Title (auto-filled)"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="w-full bg-black border border-gray-600 text-gray-400 px-2 py-1 text-xs focus:outline-none"
              disabled={isSubmitting}
            />
          </div>
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
          disabled={isSubmitting}
          className="w-full bg-green-500 text-black px-3 py-1 text-sm font-bold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Registering..." : "Register Contact"}
        </button>
      </form>
    </section>
  )
}
