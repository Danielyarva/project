import { api } from "./api"
import type { Product } from "../types/product"

export function getWishlist() {
  return api.get<{ products: Product[] }>("/wishlist")
}

export function toggleWishlistItem(productId: string) {
  return api.post<{ wishlist: string[] }>(`/wishlist/${productId}`)
}
