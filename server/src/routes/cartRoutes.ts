import { Router } from "express"
import { mergeCart, replaceCart } from "../controllers/cartController.js"
import { protect } from "../middleware/auth.js"
import { validateBody } from "../middleware/validate.js"
import { cartItemsSchema } from "../schemas/cartSchemas.js"

export const cartRoutes = Router()

cartRoutes.put("/", protect, validateBody(cartItemsSchema), replaceCart)
cartRoutes.post("/merge", protect, validateBody(cartItemsSchema), mergeCart)
