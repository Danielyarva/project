import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import { env } from "./config/env.js"
import { isAdmin, protect } from "./middleware/auth.js"
import { errorHandler, notFound } from "./middleware/errorHandler.js"
import { adminContactRoutes } from "./routes/adminContactRoutes.js"
import { adminOrderRoutes } from "./routes/adminOrderRoutes.js"
import { adminProductRoutes } from "./routes/adminProductRoutes.js"
import { authRoutes } from "./routes/authRoutes.js"
import { cartRoutes } from "./routes/cartRoutes.js"
import { contactRoutes } from "./routes/contactRoutes.js"
import { orderRoutes } from "./routes/orderRoutes.js"
import { productRoutes } from "./routes/productRoutes.js"
import { wishlistRoutes } from "./routes/wishlistRoutes.js"
import { handleStripeWebhook } from "./controllers/webhookController.js"

export const app = express()

// Render (and most PaaS hosts) terminate TLS at a reverse proxy in front of
// the app. Without this, express-rate-limit keys every request off the
// proxy's IP instead of the real client's, and secure-cookie/HTTPS checks
// misbehave. Harmless in local dev, where there's no proxy to trust.
app.set("trust proxy", 1)

app.use(helmet())
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)

// Stripe needs the raw request body to verify the webhook signature, so this
// is registered before the global express.json() parser below.
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), handleStripeWebhook)

app.use(express.json())
app.use(cookieParser())

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/admin/products", protect, isAdmin, adminProductRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/admin/orders", protect, isAdmin, adminOrderRoutes)
app.use("/api/admin/contact-messages", protect, isAdmin, adminContactRoutes)

app.use(notFound)
app.use(errorHandler)
