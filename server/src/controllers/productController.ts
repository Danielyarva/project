import type { Request, Response } from "express"
import { ApiError } from "../middleware/errorHandler.js"
import { ProductModel } from "../models/Product.js"
import { slugify } from "../utils/slugify.js"

export async function listProducts(req: Request, res: Response) {
  const { groupSlug, category } = req.query

  const filter: Record<string, unknown> = {}
  if (typeof groupSlug === "string") filter.groupSlug = groupSlug
  if (typeof category === "string") filter.category = category

  const products = await ProductModel.find(filter).sort({ createdAt: -1 })
  res.json({ products })
}

export async function getProductBySlug(req: Request, res: Response) {
  const product = await ProductModel.findOne({ slug: req.params.slug })
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  const siblings = await ProductModel.find({
    groupSlug: product.groupSlug,
    _id: { $ne: product._id },
  }).sort({ price: 1 })

  res.json({ product, siblings })
}

async function generateUniqueSlug(base: string): Promise<string> {
  let candidate = base
  let suffix = 2
  while (await ProductModel.exists({ slug: candidate })) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }
  return candidate
}

export async function createProduct(req: Request, res: Response) {
  const body = req.body

  const groupSlug = body.groupSlug ?? slugify(body.name)
  const baseSlug = body.slug ?? slugify(`${body.name}-${body.size}`)
  const slug = await generateUniqueSlug(baseSlug)

  const product = await ProductModel.create({ ...body, groupSlug, slug })
  res.status(201).json({ product })
}

export async function updateProduct(req: Request, res: Response) {
  const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) {
    throw new ApiError(404, "Product not found")
  }
  res.json({ product })
}

export async function deleteProduct(req: Request, res: Response) {
  const product = await ProductModel.findByIdAndDelete(req.params.id)
  if (!product) {
    throw new ApiError(404, "Product not found")
  }
  res.status(204).send()
}
