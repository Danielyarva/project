import { Resend } from "resend"
import { env } from "../config/env.js"

const resend = env.email.resendApiKey ? new Resend(env.email.resendApiKey) : null

export async function sendContactNotification(params: {
  name: string
  email: string
  message: string
}): Promise<void> {
  if (!resend || !env.email.contactNotifyTo) {
    throw new Error("Email is not configured (RESEND_API_KEY / CONTACT_NOTIFY_EMAIL missing)")
  }

  await resend.emails.send({
    from: env.email.from,
    to: env.email.contactNotifyTo,
    replyTo: params.email,
    subject: `New contact message from ${params.name}`,
    text: `From: ${params.name} <${params.email}>\n\n${params.message}`,
  })
}

export async function sendOrderReceipt(params: {
  to: string
  orderId: string
  items: { productName: string; size: string; quantity: number; price: number }[]
  total: number
}): Promise<void> {
  if (!resend) {
    throw new Error("Email is not configured (RESEND_API_KEY missing)")
  }

  const lines = params.items
    .map((item) => `  ${item.quantity} x ${item.productName} (${item.size}) - ₹${item.price.toFixed(2)}`)
    .join("\n")

  await resend.emails.send({
    from: env.email.from,
    to: params.to,
    subject: `Order confirmed - #${params.orderId.slice(-8)}`,
    text: `Thanks for your order!\n\n${lines}\n\nTotal: ₹${params.total.toFixed(2)}\n\nOrder #${params.orderId}`,
  })
}
