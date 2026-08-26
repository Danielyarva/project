import { Router } from "express"
import {
  addProductImages,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js"
import { uploadProductImages } from "../middleware/upload.js"
import { validateBody, validateParams } from "../middleware/validate.js"
import {
  createProductFormSchema,
  productIdParamSchema,
  updateProductSchema,
} from "../schemas/productSchemas.js"

export const adminProductRoutes = Router()

adminProductRoutes.post(
  "/",
  uploadProductImages,
  validateBody(createProductFormSchema),
  createProduct,
)
adminProductRoutes.post(
  "/:id/images",
  validateParams(productIdParamSchema),
  uploadProductImages,
  addProductImages,
)
adminProductRoutes.put(
  "/:id",
  validateParams(productIdParamSchema),
  validateBody(updateProductSchema),
  updateProduct,
)
adminProductRoutes.delete("/:id", validateParams(productIdParamSchema), deleteProduct)
