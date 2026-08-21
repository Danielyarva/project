import { Resend } from "resend"
import { env } from "../config/env.js"

const resend = new Resend(env.email.resendApiKey)

export async function sendContactNotification(params: {
  name: string
  email: string
  message: string
}): Promise<void> {
  await resend.emails.send({
    from: env.email.from,
    to: env.email.contactNotifyTo,
    replyTo: params.email,
    subject: `New contact message from ${params.name}`,
    text: `From: ${params.name} <${params.email}>\n\n${params.message}`,
  })
}
