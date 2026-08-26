import type { Request, Response } from "express"
import { ApiError } from "../middleware/errorHandler.js"
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

export async function listContactMessages(req: Request, res: Response) {
  const contactMessages = await ContactMessageModel.find().sort({ createdAt: -1 })
  res.json({ contactMessages })
}

export async function markContactMessageRead(req: Request, res: Response) {
  const contactMessage = await ContactMessageModel.findByIdAndUpdate(
    req.params.id,
    { read: req.body.read },
    { new: true, runValidators: true },
  )
  if (!contactMessage) {
    throw new ApiError(404, "Contact message not found")
  }
  res.json({ contactMessage })
}
