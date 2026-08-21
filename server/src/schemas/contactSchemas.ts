import { z } from "zod"

export const createContactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
})
