import { Star } from "lucide-react"
import { Avatar } from "../ui/Avatar"
import { formatRelativeTime } from "../../utils/formatRelativeTime"
import type { Review } from "../../types/review"

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-text-secondary">No reviews yet. Be the first to write one.</p>
  }

  return (
    <ul className="flex flex-col gap-6">
      {reviews.map((review) => (
        <li key={review._id} className="flex gap-3">
          <Avatar name={review.user?.name ?? "Anonymous"} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-semibold">{review.user?.name ?? "Anonymous"}</span>
              <span className="text-xs text-text-secondary">
                {formatRelativeTime(review.createdAt)}
              </span>
            </div>
            <div className="mt-0.5 flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < review.rating
                      ? "fill-star text-star"
                      : "text-border"
                  }
                />
              ))}
            </div>
            <p className="mt-1.5 text-sm text-text-secondary">{review.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
