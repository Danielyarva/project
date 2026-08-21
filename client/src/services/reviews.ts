import { api } from "./api"
import type { Review } from "../types/review"

export function listReviews(slug: string) {
  return api.get<{ reviews: Review[] }>(`/products/${slug}/reviews`)
}

export function createReview(slug: string, body: { rating: number; comment: string }) {
  return api.post<{ review: Review }>(`/products/${slug}/reviews`, body)
}
