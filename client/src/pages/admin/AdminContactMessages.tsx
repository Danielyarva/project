import { useEffect, useState } from "react"
import { Card } from "../../components/ui/Card"
import { adminListContactMessages, adminMarkContactMessageRead } from "../../services/admin"
import { formatRelativeTime } from "../../utils/formatRelativeTime"
import type { ContactMessage } from "../../types/contactMessage"

export function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminListContactMessages()
      .then(({ contactMessages }) => setMessages(contactMessages))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load messages"))
      .finally(() => setLoading(false))
  }, [])

  async function toggleRead(message: ContactMessage) {
    const { contactMessage } = await adminMarkContactMessageRead(message._id, !message.read)
    setMessages((prev) => prev.map((m) => (m._id === contactMessage._id ? contactMessage : m)))
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Contact Messages</h1>

      {loading && <p className="mt-6 text-text-secondary">Loading...</p>}
      {error && <p className="mt-6 text-danger">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 flex flex-col gap-3">
          {messages.map((message) => (
            <Card key={message._id} className={`p-4 ${message.read ? "" : "border-accent"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">
                    {message.name} <span className="font-normal text-text-secondary">{message.email}</span>
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {formatRelativeTime(message.createdAt)}
                    {!message.read && <span className="ml-2 font-semibold text-text-primary">New</span>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRead(message)}
                  className="shrink-0 text-xs font-semibold text-text-secondary hover:text-text-primary"
                >
                  {message.read ? "Mark unread" : "Mark read"}
                </button>
              </div>
              <p className="mt-3 text-sm text-text-secondary">{message.message}</p>
            </Card>
          ))}
          {messages.length === 0 && <p className="text-text-secondary">No messages yet.</p>}
        </div>
      )}
    </div>
  )
}
