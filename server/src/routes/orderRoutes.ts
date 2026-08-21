import { Router } from "express"
import { createOrder, getOrderBySession } from "../controllers/orderController.js"
import { optionalAuth } from "../middleware/auth.js"
import { validateBody } from "../middleware/validate.js"
import { createOrderSchema } from "../schemas/orderSchemas.js"

export const orderRoutes = Router()

orderRoutes.post("/", optionalAuth, validateBody(createOrderSchema), createOrder)
orderRoutes.get("/session/:sessionId", getOrderBySession)
