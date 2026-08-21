import { Schema, model, type InferSchemaType } from "mongoose"

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
)

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
)

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    // Backfilled from the Stripe session on webhook confirmation - guest
    // checkouts have no User document to look an email up from otherwise.
    customerEmail: { type: String },
    items: { type: [orderItemSchema], required: true },
    // Not required at creation: Stripe hosted Checkout collects the address,
    // and the webhook backfills this once payment completes.
    shippingAddress: { type: shippingAddressSchema },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending",
    },
    stripeSessionId: { type: String },
  },
  { timestamps: true },
)

export type Order = InferSchemaType<typeof orderSchema>
export const OrderModel = model("Order", orderSchema)
