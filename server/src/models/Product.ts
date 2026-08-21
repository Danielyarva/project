import { Schema, model, type InferSchemaType } from "mongoose"

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    material: { type: String, enum: ["granite", "marble", "wood"] },
    category: { type: String },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0, required: true },
    images: { type: [String], required: true },
    groupSlug: { type: String, required: true },
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
)

productSchema.index({ groupSlug: 1 })

export type Product = InferSchemaType<typeof productSchema>
export const ProductModel = model("Product", productSchema)
