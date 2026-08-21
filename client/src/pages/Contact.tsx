import { useState } from "react"
import { Button } from "../components/ui/Button"
import { useSeo } from "../hooks/useSeo"
import { ApiError } from "../services/api"
import { sendContactMessage } from "../services/contact"

export function Contact() {
  useSeo({
    title: "Contact Us",
    description: "Questions about an order or a custom piece? Get in touch with Mortar & Pestle Co.",
  })

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await sendContactMessage({ name, email, message })
      setSubmitted(true)
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Too many messages sent. Please try again later.")
      } else {
        setError(err instanceof ApiError ? err.message : "Failed to send message")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Message sent</h1>
        <p className="mt-2 text-text-secondary">
          Thanks for reaching out — we'll get back to you soon.
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold">Contact Us</h1>
      <p className="mt-2 text-text-secondary">
        Questions about an order, a custom piece, or anything else — send us a message.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-semibold">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-border bg-surface p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-border bg-surface p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-semibold">
            Message
          </label>
          <textarea
            id="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-2xl border border-border bg-surface p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </section>
  )
}
