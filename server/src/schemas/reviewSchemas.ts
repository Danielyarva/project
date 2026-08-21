import { z } from "zod"

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Rating must be 1-5").max(5, "Rating must be 1-5"),
  comment: z.string().trim().min(1, "Comment is required").max(2000, "Comment is too long"),
})
