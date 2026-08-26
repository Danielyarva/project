import { z } from "zod"

export const cartItemsSchema = z.object({
  items: z.array(
    z.object({
      slug: z.string().trim().min(1),
      quantity: z.coerce.number().int().positive(),
    }),
  ),
})
