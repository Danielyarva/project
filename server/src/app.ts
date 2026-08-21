import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import { env } from "./config/env.js"
import { isAdmin, protect } from "./middleware/auth.js"
import { errorHandler, notFound } from "./middleware/errorHandler.js"
import { adminProductRoutes } from "./routes/adminProductRoutes.js"
import { authRoutes } from "./routes/authRoutes.js"
import { productRoutes } from "./routes/productRoutes.js"

export const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/admin/products", protect, isAdmin, adminProductRoutes)

app.use(notFound)
app.use(errorHandler)
