import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { CartItem } from "../types/cart"

const STORAGE_KEY = "cart"

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void
  updateQuantity: (slug: string, quantity: number) => void
  removeItem: (slug: string) => void
  clearCart: () => void
  replaceCart: (items: CartItem[]) => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // localStorage unavailable (private browsing, quota) - cart just won't persist
    }
  }, [items])

  function addItem(item: Omit<CartItem, "quantity">, quantity: number) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug)
      if (existing) {
        const nextQuantity = Math.min(existing.stock, existing.quantity + quantity)
        return prev.map((i) => (i.slug === item.slug ? { ...i, quantity: nextQuantity } : i))
      }
      return [...prev, { ...item, quantity: Math.min(item.stock, quantity) }]
    })
  }

  function updateQuantity(slug: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, quantity: Math.max(1, Math.min(i.stock, quantity)) } : i)),
    )
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug))
  }

  function clearCart() {
    setItems([])
  }

  function replaceCart(next: CartItem[]) {
    setItems(next)
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0)

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart, replaceCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
