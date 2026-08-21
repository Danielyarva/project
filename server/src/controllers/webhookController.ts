import type { Request, Response } from "express"
import type Stripe from "stripe"
import { env } from "../config/env.js"
import { stripe } from "../config/stripe.js"
import { ApiError } from "../middleware/errorHandler.js"
import { OrderModel } from "../models/Order.js"
import { ProductModel } from "../models/Product.js"
import { sendOrderReceipt } from "../services/emailService.js"

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId
  if (!orderId) return

  const order = await OrderModel.findById(orderId)
  if (!order || order.status === "paid") return // not found, or already processed (idempotent)

  const shippingDetails = session.collected_information?.shipping_details
  const address = shippingDetails?.address ?? session.customer_details?.address
  const name = shippingDetails?.name ?? session.customer_details?.name

  order.status = "paid"
  order.customerEmail = session.customer_details?.email ?? undefined
  if (address) {
    order.shippingAddress = {
      fullName: name ?? "",
      line1: address.line1 ?? "",
      line2: address.line2 ?? undefined,
      city: address.city ?? "",
      state: address.state ?? "",
      postalCode: address.postal_code ?? "",
      country: address.country ?? "",
    }
  }
  await order.save()

  for (const item of order.items) {
    await ProductModel.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
  }

  if (order.customerEmail) {
    const populated = await order.populate<{ items: { product: { name: string } }[] }>(
      "items.product",
      "name",
    )
    await sendOrderReceipt({
      to: order.customerEmail,
      orderId: order.id,
      items: populated.items.map((item, i) => ({
        productName: item.product.name,
        size: order.items[i].size,
        quantity: order.items[i].quantity,
        price: order.items[i].price,
      })),
      total: order.total,
    }).catch((err) => console.error("Failed to send order receipt email:", err))
  }
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"]
  if (!signature || typeof signature !== "string") {
    throw new ApiError(400, "Missing Stripe signature")
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.stripe.webhookSecret)
  } catch (err) {
    throw new ApiError(400, `Webhook signature verification failed: ${(err as Error).message}`)
  }

  if (event.type === "checkout.session.completed") {
    await handleCheckoutCompleted(event.data.object)
  }

  res.json({ received: true })
}
