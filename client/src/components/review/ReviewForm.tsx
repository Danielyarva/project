import { Star } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/Button"
import { createReview } from "../../services/reviews"
import { ApiError } from "../../services/api"

interface ReviewFormProps {
  slug: string
  onSubmitted: () => void
}

export function ReviewForm({ slug, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) {
      setError("Please select a star rating")
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await createReview(slug, { rating, comment })
      setRating(0)
      setComment("")
      onSubmitted()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
        {Array.from({ length: 5 }, (_, i) => {
          const value = i + 1
          return (
            <button
              key={value}
              type="button"
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
            >
              <Star
                size={24}
                className={
                  value <= (hoverRating || rating)
                    ? "fill-text-primary text-text-primary"
                    : "text-border"
                }
              />
            </button>
          )
        })}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        minLength={1}
        rows={3}
        placeholder="Share your thoughts on this product..."
        className="w-full rounded-2xl border border-border bg-surface p-3 text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
