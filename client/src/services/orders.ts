import { api } from "./api"
import type { Order } from "../types/order"

export function createOrder(items: { slug: string; quantity: number }[]) {
  return api.post<{ url: string }>("/orders", { items })
}

export function getOrderBySession(sessionId: string) {
  return api.get<{ order: Order }>(`/orders/session/${sessionId}`)
}
