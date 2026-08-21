import { useEffect, useState } from "react"
import { listProducts } from "../services/products"
import type { Product } from "../types/product"

interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
}

export function useProducts(category?: string): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    listProducts({ category })
      .then(({ products }) => {
        if (!cancelled) setProducts(products)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load products")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category])

  return { products, loading, error }
}
