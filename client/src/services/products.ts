import { api } from "./api"
import type { Product } from "../types/product"

export function listProducts(params?: { category?: string; featured?: boolean }) {
  const query = new URLSearchParams()
  if (params?.category) query.set("category", params.category)
  if (params?.featured) query.set("featured", "true")
  const qs = query.toString()

  return api.get<{ products: Product[] }>(`/products${qs ? `?${qs}` : ""}`)
}

export function getProductBySlug(slug: string) {
  return api.get<{ product: Product; siblings: Product[] }>(`/products/${slug}`)
}
