import { Schema, model, type InferSchemaType } from "mongoose"

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export type ContactMessage = InferSchemaType<typeof contactMessageSchema>
export const ContactMessageModel = model("ContactMessage", contactMessageSchema)
