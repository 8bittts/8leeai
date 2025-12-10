"use client"

import { useRef, useState } from "react"

interface IntercomTicketFormProps {
  onClose: () => void
}

export function IntercomTicketForm({ onClose }: IntercomTicketFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("general")
  const [priority, setPriority] = useState("normal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!(name && email && subject && description)) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in all required fields",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/intercom/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requesterName: name,
          requesterEmail: email,
          subject,
          description,
          category,
          priority,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: `Ticket #${data.ticketId} created successfully!`,
        })
        // Reset form
        setName("")
        setEmail("")
        setSubject("")
        setDescription("")
        setCategory("general")
        setPriority("normal")
        // Close form after 2 seconds
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to create ticket",
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
    <section className="mb-8 p-4 border border-theme-primary rounded" aria-label="Support Ticket Form">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Create Support Ticket</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-theme-primary hover:text-theme-accent text-sm font-bold focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm"
          aria-label="Close ticket form"
        >
          [close]
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="ticket-name" className="text-sm block mb-1">
            Name: *
          </label>
          <input
            id="ticket-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-theme-bg border border-theme-primary text-theme-primary px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm"
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div>
          <label htmlFor="ticket-email" className="text-sm block mb-1">
            Email: *
          </label>
          <input
            id="ticket-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-theme-bg border border-theme-primary text-theme-primary px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm"
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div>
          <label htmlFor="ticket-subject" className="text-sm block mb-1">
            Subject: *
          </label>
          <input
            id="ticket-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-theme-bg border border-theme-primary text-theme-primary px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm"
            placeholder="Brief description (5-100 chars)"
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div>
          <label htmlFor="ticket-description" className="text-sm block mb-1">
            Description: *
          </label>
          <textarea
            id="ticket-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-theme-bg border border-theme-primary text-theme-primary px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm resize-none"
            placeholder="Detailed description (10-2000 chars)"
            rows={5}
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ticket-category" className="text-sm block mb-1">
              Category:
            </label>
            <select
              id="ticket-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-theme-bg border border-theme-primary text-theme-primary px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm"
              disabled={isSubmitting}
            >
              <option value="general">General</option>
              <option value="support">Support</option>
              <option value="sales">Sales</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          <div>
            <label htmlFor="ticket-priority" className="text-sm block mb-1">
              Priority:
            </label>
            <select
              id="ticket-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-theme-bg border border-theme-primary text-theme-primary px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-bg rounded-sm"
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {submitStatus && (
          <div
            className={`text-sm p-2 border rounded ${
              submitStatus.type === "success"
                ? "border-theme-primary text-theme-primary bg-theme-bg"
                : "border-destructive text-destructive bg-theme-bg"
            }`}
            role="status"
          >
            {submitStatus.message}
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
