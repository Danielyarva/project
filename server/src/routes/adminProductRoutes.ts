import { Router } from "express"
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js"
import { validateBody, validateParams } from "../middleware/validate.js"
import {
  createProductSchema,
  productIdParamSchema,
  updateProductSchema,
} from "../schemas/productSchemas.js"

export const adminProductRoutes = Router()

adminProductRoutes.post("/", validateBody(createProductSchema), createProduct)
adminProductRoutes.put(
  "/:id",
  validateParams(productIdParamSchema),
  validateBody(updateProductSchema),
  updateProduct,
)
adminProductRoutes.delete("/:id", validateParams(productIdParamSchema), deleteProduct)
