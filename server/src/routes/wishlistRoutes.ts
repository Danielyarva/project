import { Router } from "express"
import { getWishlist, toggleWishlistItem } from "../controllers/wishlistController.js"
import { protect } from "../middleware/auth.js"
import { validateParams } from "../middleware/validate.js"
import { productIdParamSchema } from "../schemas/wishlistSchemas.js"

export const wishlistRoutes = Router()

wishlistRoutes.get("/", protect, getWishlist)
wishlistRoutes.post("/:productId", protect, validateParams(productIdParamSchema), toggleWishlistItem)
