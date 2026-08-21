import { z } from "zod"

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().toLowerCase().regex(slugPattern, "Invalid slug format").optional(),
  description: z.string().trim().optional(),
  material: z.enum(["granite", "marble", "wood"]).optional(),
  category: z.string().trim().optional(),
  size: z.string().trim().min(1, "Size is required"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string().url("Each image must be a valid URL")).min(1, "At least one image is required"),
  groupSlug: z.string().trim().toLowerCase().regex(slugPattern, "Invalid groupSlug format").optional(),
})

export const updateProductSchema = createProductSchema.partial()

// Multipart form bodies arrive as strings; images come from uploaded files,
// not this schema, so it's validated separately (see uploadProductImages).
export const createProductFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().toLowerCase().regex(slugPattern, "Invalid slug format").optional(),
  description: z.string().trim().optional(),
  material: z.enum(["granite", "marble", "wood"]).optional(),
  category: z.string().trim().optional(),
  size: z.string().trim().min(1, "Size is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().nonnegative().default(0),
  groupSlug: z.string().trim().toLowerCase().regex(slugPattern, "Invalid groupSlug format").optional(),
})

export const productIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product id"),
})
