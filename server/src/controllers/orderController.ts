import type { Request, Response } from "express"
import { stripe } from "../config/stripe.js"
import { env } from "../config/env.js"
import { ApiError } from "../middleware/errorHandler.js"
import { OrderModel } from "../models/Order.js"
import { ProductModel } from "../models/Product.js"

export async function createOrder(req: Request, res: Response) {
  if (!stripe) {
    throw new ApiError(503, "Checkout is not configured yet")
  }

  const { items } = req.body as { items: { slug: string; quantity: number }[] }

  const products = await ProductModel.find({ slug: { $in: items.map((i) => i.slug) } })
  const productBySlug = new Map(products.map((p) => [p.slug, p]))

  const orderItems = items.map(({ slug, quantity }) => {
    const product = productBySlug.get(slug)
    if (!product) {
      throw new ApiError(400, `Product not found: ${slug}`)
    }
    if (product.stock < quantity) {
      throw new ApiError(400, `Not enough stock for ${product.name}`)
    }
    return {
      product: product._id,
      size: product.size,
      quantity,
      price: product.price,
      name: product.name,
    }
  })

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const order = await OrderModel.create({
    user: req.user?.id ?? null,
    items: orderItems.map(({ name, ...item }) => item),
    total,
    status: "pending",
  })

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: orderItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "inr",
        unit_amount: Math.round(item.price * 100),
        product_data: { name: `${item.name} (${item.size})` },
      },
    })),
    shipping_address_collection: { allowed_countries: ["IN"] },
    customer_email: req.user?.email,
    success_url: `${env.clientUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.clientUrl}/cart`,
    metadata: { orderId: order.id },
  })

  order.stripeSessionId = session.id
  await order.save()

  res.status(201).json({ url: session.url })
}

export async function listOrders(req: Request, res: Response) {
  const orders = await OrderModel.find()
    .populate("items.product", "name slug")
    .populate("user", "name email")
    .sort({ createdAt: -1 })
  res.json({ orders })
}

export async function getOrderBySession(req: Request, res: Response) {
  const order = await OrderModel.findOne({ stripeSessionId: req.params.sessionId }).populate(
    "items.product",
    "name slug",
  )
  if (!order) {
    throw new ApiError(404, "Order not found")
  }
  res.json({ order })
}
