import { Router } from "express"
import { getProductBySlug, listProducts } from "../controllers/productController.js"
import { createReview, listReviews } from "../controllers/reviewController.js"
import { protect } from "../middleware/auth.js"
import { validateBody } from "../middleware/validate.js"
import { createReviewSchema } from "../schemas/reviewSchemas.js"

export const productRoutes = Router()

productRoutes.get("/", listProducts)
productRoutes.get("/:slug", getProductBySlug)
productRoutes.get("/:slug/reviews", listReviews)
productRoutes.post("/:slug/reviews", protect, validateBody(createReviewSchema), createReview)
