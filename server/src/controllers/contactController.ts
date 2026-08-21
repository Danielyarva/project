import type { Request, Response } from "express"
import { ContactMessageModel } from "../models/ContactMessage.js"
import { sendContactNotification } from "../services/emailService.js"

export async function createContactMessage(req: Request, res: Response) {
  const { name, email, message } = req.body

  const contactMessage = await ContactMessageModel.create({ name, email, message })

  try {
    await sendContactNotification({ name, email, message })
  } catch (err) {
    console.error("Failed to send contact notification email:", err)
  }

  res.status(201).json({ contactMessage })
}
