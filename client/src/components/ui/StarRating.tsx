import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  numReviews?: number
  size?: number
}

export function StarRating({ rating, numReviews, size = 14 }: StarRatingProps) {
  if (!rating && !numReviews) {
    return <span className="text-xs text-text-secondary">No reviews yet</span>
  }

  return (
    <div className="flex items-center gap-1 text-text-secondary">
      <Star size={size} className="fill-star text-star" />
      <span className="text-xs font-semibold text-text-primary">{rating.toFixed(1)}</span>
      {typeof numReviews === "number" && <span className="text-xs">({numReviews})</span>}
    </div>
  )
}
