import { Router } from "express"
import { getMe, login, logout, register } from "../controllers/authController.js"
import { protect } from "../middleware/auth.js"
import { authLimiter } from "../middleware/rateLimit.js"
import { validateBody } from "../middleware/validate.js"
import { loginSchema, registerSchema } from "../schemas/authSchemas.js"

export const authRoutes = Router()

authRoutes.post("/register", authLimiter, validateBody(registerSchema), register)
authRoutes.post("/login", authLimiter, validateBody(loginSchema), login)
authRoutes.post("/logout", logout)
authRoutes.get("/me", protect, getMe)
