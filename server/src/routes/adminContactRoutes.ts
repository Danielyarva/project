import { Router } from "express"
import { listContactMessages, markContactMessageRead } from "../controllers/contactController.js"
import { validateBody, validateParams } from "../middleware/validate.js"
import { contactMessageIdParamSchema, updateContactMessageReadSchema } from "../schemas/contactSchemas.js"

export const adminContactRoutes = Router()

adminContactRoutes.get("/", listContactMessages)
adminContactRoutes.patch(
  "/:id",
  validateParams(contactMessageIdParamSchema),
  validateBody(updateContactMessageReadSchema),
  markContactMessageRead,
)
