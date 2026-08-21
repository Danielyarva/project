import { Router } from "express"
import { listOrders } from "../controllers/orderController.js"

export const adminOrderRoutes = Router()

adminOrderRoutes.get("/", listOrders)
