import { z } from "zod"

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().trim().min(1),
        quantity: z.coerce.number().int().positive(),
      }),
    )
    .min(1, "Cart is empty"),
})
