import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"
import { getWishlist, toggleWishlistItem } from "../services/wishlist"

interface WishlistContextValue {
  productIds: Set<string>
  isWishlisted: (productId: string) => boolean
  toggle: (productId: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [productIds, setProductIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) {
      setProductIds(new Set())
      return
    }
    getWishlist()
      .then(({ products }) => setProductIds(new Set(products.map((p) => p._id))))
      .catch(() => setProductIds(new Set()))
  }, [user])

  async function toggle(productId: string) {
    if (!user) return
    const { wishlist } = await toggleWishlistItem(productId)
    setProductIds(new Set(wishlist))
  }

  return (
    <WishlistContext.Provider
      value={{ productIds, isWishlisted: (id) => productIds.has(id), toggle }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider")
  return ctx
}
