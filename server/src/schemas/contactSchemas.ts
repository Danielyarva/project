import { z } from "zod"

export const createContactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
})

export const updateContactMessageReadSchema = z.object({
  read: z.boolean(),
})

export const contactMessageIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid contact message id"),
})
