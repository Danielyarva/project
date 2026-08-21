import { useEffect, useState } from "react"
import { getProductBySlug } from "../services/products"
import type { Product } from "../types/product"

interface UseProductResult {
  product: Product | null
  siblings: Product[]
  loading: boolean
  error: string | null
}

export function useProduct(slug: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null)
  const [siblings, setSiblings] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    setLoading(true)
    setError(null)

    getProductBySlug(slug)
      .then(({ product, siblings }) => {
        if (cancelled) return
        setProduct(product)
        setSiblings(siblings)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load product")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { product, siblings, loading, error }
}
