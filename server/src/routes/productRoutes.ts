import { Router } from "express"
import { getProductBySlug, listProducts } from "../controllers/productController.js"

export const productRoutes = Router()

productRoutes.get("/", listProducts)
productRoutes.get("/:slug", getProductBySlug)
