import { useCallback, useEffect, useState } from "react"
import { listReviews } from "../services/reviews"
import type { Review } from "../types/review"

export function useReviews(slug: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    if (!slug) return
    setLoading(true)
    setError(null)

    listReviews(slug)
      .then(({ reviews }) => setReviews(reviews))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reviews"))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { reviews, loading, error, refetch }
}
