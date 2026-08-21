export interface Product {
  _id: string
  name: string
  slug: string
  description?: string
  material?: "granite" | "marble" | "wood"
  category?: string
  size: string
  price: number
  stock: number
  images: string[]
  groupSlug: string
  avgRating: number
  numReviews: number
  createdAt: string
  updatedAt: string
}
