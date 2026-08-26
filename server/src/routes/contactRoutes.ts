import { Router } from "express"
import { createContactMessage } from "../controllers/contactController.js"
import { contactLimiter } from "../middleware/rateLimit.js"
import { validateBody } from "../middleware/validate.js"
import { createContactMessageSchema } from "../schemas/contactSchemas.js"

export const contactRoutes = Router()

contactRoutes.post("/", contactLimiter, validateBody(createContactMessageSchema), createContactMessage)
