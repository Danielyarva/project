import { NavLink } from "react-router-dom"
import { ReviewForm } from "./ReviewForm"
import { ReviewList } from "./ReviewList"
import { useAuth } from "../../context/AuthContext"
import { useReviews } from "../../hooks/useReviews"

export function ReviewsSection({ slug }: { slug: string }) {
  const { user, loading: authLoading } = useAuth()
  const { reviews, loading, error, refetch } = useReviews(slug)

  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold">Reviews</h2>

      <div className="mt-6">
        {loading && <p className="text-sm text-text-secondary">Loading reviews...</p>}
        {error && <p className="text-sm text-danger">Couldn't load reviews right now.</p>}
        {!loading && !error && <ReviewList reviews={reviews} />}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h3 className="mb-3 text-sm font-bold">Write a review</h3>
        {!authLoading && user && <ReviewForm slug={slug} onSubmitted={refetch} />}
        {!authLoading && !user && (
          <p className="text-sm text-text-secondary">
            <NavLink to="/account" className="font-semibold text-text-primary underline">
              Log in
            </NavLink>{" "}
            to leave a review.
          </p>
        )}
      </div>
    </section>
  )
}
