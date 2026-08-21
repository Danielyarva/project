import { Schema, model, type InferSchemaType } from "mongoose"

const reviewSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
)

reviewSchema.index({ product: 1 })

export type Review = InferSchemaType<typeof reviewSchema>
export const ReviewModel = model("Review", reviewSchema)
