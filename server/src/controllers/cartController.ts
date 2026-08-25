import type { Request, Response } from "express"
import { ApiError } from "../middleware/errorHandler.js"
import { ProductModel } from "../models/Product.js"
import { UserModel } from "../models/User.js"

interface IncomingItem {
  slug: string
  quantity: number
}

interface ProductLike {
  _id: unknown
  slug: string
  name: string
  size: string
  price: number
  images: string[]
  stock: number
}

function toCartItemDTO(product: ProductLike, quantity: number) {
  return {
    slug: product.slug,
    name: product.name,
    size: product.size,
    price: product.price,
    image: product.images[0],
    stock: product.stock,
    quantity,
  }
}

export async function replaceCart(req: Request, res: Response) {
  const { items } = req.body as { items: IncomingItem[] }

  const user = await UserModel.findById(req.user!.id)
  if (!user) {
    throw new ApiError(401, "User no longer exists")
  }

  const products = await ProductModel.find({ slug: { $in: items.map((i) => i.slug) } })
  const productBySlug = new Map(products.map((p) => [p.slug, p]))

  const removed: string[] = []
  const kept: { product: ProductLike; quantity: number }[] = []

  for (const item of items) {
    const product = productBySlug.get(item.slug)
    if (!product || product.stock === 0) {
      removed.push(item.slug)
      continue
    }
    kept.push({ product, quantity: Math.min(product.stock, item.quantity) })
  }

  user.cart = kept.map(({ product, quantity }) => ({ product: product._id, quantity })) as never
  await user.save()

  res.json({
    items: kept.map(({ product, quantity }) => toCartItemDTO(product, quantity)),
    removed,
  })
}

export async function mergeCart(req: Request, res: Response) {
  const { items } = req.body as { items: IncomingItem[] }

  const user = await UserModel.findById(req.user!.id).populate<{
    cart: { product: ProductLike | null; quantity: number }[]
  }>("cart.product")
  if (!user) {
    throw new ApiError(401, "User no longer exists")
  }

  const removed: string[] = []
  const merged = new Map<string, { product: ProductLike; quantity: number }>()

  // Start from what's already saved server-side, re-validated against current stock.
  for (const entry of user.cart) {
    const product = entry.product
    if (!product || product.stock === 0) {
      if (product) removed.push(product.slug)
      continue
    }
    merged.set(String(product._id), { product, quantity: Math.min(product.stock, entry.quantity) })
  }

  // Fold the guest (localStorage) cart on top.
  const products = await ProductModel.find({ slug: { $in: items.map((i) => i.slug) } })
  const productBySlug = new Map(products.map((p) => [p.slug, p]))

  for (const item of items) {
    const product = productBySlug.get(item.slug)
    if (!product || product.stock === 0) {
      removed.push(item.slug)
      continue
    }
    const key = String(product._id)
    const prior = merged.get(key)?.quantity ?? 0
    merged.set(key, { product, quantity: Math.min(product.stock, prior + item.quantity) })
  }

  const mergedEntries = Array.from(merged.values())
  user.cart = mergedEntries.map(({ product, quantity }) => ({ product: product._id, quantity })) as never
  await user.save()

  res.json({
    items: mergedEntries.map(({ product, quantity }) => toCartItemDTO(product, quantity)),
    removed: Array.from(new Set(removed)),
  })
}
