import { api } from "./api"
import type { CartItem } from "../types/cart"

interface CartSyncResult {
  items: CartItem[]
  removed: string[]
}

function toPayload(items: { slug: string; quantity: number }[]) {
  return { items: items.map(({ slug, quantity }) => ({ slug, quantity })) }
}

export function replaceServerCart(items: { slug: string; quantity: number }[]) {
  return api.put<CartSyncResult>("/cart", toPayload(items))
}

export function mergeServerCart(items: { slug: string; quantity: number }[]) {
  return api.post<CartSyncResult>("/cart/merge", toPayload(items))
}
