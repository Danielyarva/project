import { api } from "./api"
import type { Product } from "../types/product"

export function listProducts(params?: { category?: string }) {
  const query = new URLSearchParams()
  if (params?.category) query.set("category", params.category)
  const qs = query.toString()

  return api.get<{ products: Product[] }>(`/products${qs ? `?${qs}` : ""}`)
}
