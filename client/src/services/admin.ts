import { api } from "./api"
import type { AdminOrder } from "../types/order"
import type { ContactMessage } from "../types/contactMessage"
import type { Product } from "../types/product"

export interface ProductFormFields {
  name: string
  description?: string
  material?: string
  category?: string
  size: string
  price: number
  stock: number
}

export function adminCreateProduct(fields: ProductFormFields, images: File[]) {
  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== "") form.append(key, String(value))
  })
  images.forEach((file) => form.append("images", file))
  return api.post<{ product: Product }>("/admin/products", form)
}

export function adminUpdateProduct(id: string, fields: Partial<ProductFormFields>) {
  return api.put<{ product: Product }>(`/admin/products/${id}`, fields)
}

export function adminDeleteProduct(id: string) {
  return api.delete<void>(`/admin/products/${id}`)
}

export function adminAddProductImages(id: string, images: File[]) {
  const form = new FormData()
  images.forEach((file) => form.append("images", file))
  return api.post<{ product: Product }>(`/admin/products/${id}/images`, form)
}

export function adminListOrders() {
  return api.get<{ orders: AdminOrder[] }>("/admin/orders")
}

export function adminListContactMessages() {
  return api.get<{ contactMessages: ContactMessage[] }>("/admin/contact-messages")
}

export function adminMarkContactMessageRead(id: string, read: boolean) {
  return api.patch<{ contactMessage: ContactMessage }>(`/admin/contact-messages/${id}`, { read })
}
