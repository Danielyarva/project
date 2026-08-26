export interface OrderItem {
  product: { _id: string; name: string; slug: string } | string
  size: string
  quantity: number
  price: number
}

export interface ShippingAddress {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  _id: string
  user: string | null
  customerEmail?: string
  items: OrderItem[]
  shippingAddress?: ShippingAddress
  total: number
  status: "pending" | "paid" | "shipped" | "delivered"
  stripeSessionId?: string
  createdAt: string
}

export interface AdminOrder extends Omit<Order, "user"> {
  user: { _id: string; name: string; email: string } | null
}
