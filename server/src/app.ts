import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import { env } from "./config/env.js"
import { errorHandler, notFound } from "./middleware/errorHandler.js"
import { authRoutes } from "./routes/authRoutes.js"

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

app.use(notFound)
app.use(errorHandler)
