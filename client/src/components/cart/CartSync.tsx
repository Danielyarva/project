import { useEffect, useRef } from "react"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { mergeServerCart, replaceServerCart } from "../../services/cart"

/**
 * Bridges auth and cart state without either context depending on the other.
 * On login, merges the local (guest) cart into the user's server-side cart;
 * afterwards, keeps the server cart in sync with local changes. Renders nothing.
 */
export function CartSync() {
  const { user } = useAuth()
  const { items, replaceCart } = useCart()

  const itemsRef = useRef(items)
  itemsRef.current = items

  const mergeStateRef = useRef<{ userId: string | null; completed: boolean }>({
    userId: null,
    completed: false,
  })

  useEffect(() => {
    if (!user) {
      mergeStateRef.current = { userId: null, completed: false }
      return
    }
    if (mergeStateRef.current.userId === user.id) return
    mergeStateRef.current = { userId: user.id, completed: false }

    mergeServerCart(itemsRef.current)
      .then(({ items: merged, removed }) => {
        replaceCart(merged)
        if (removed.length > 0) {
          console.warn("Some cart items were removed while merging your cart (out of stock or no longer available):", removed)
        }
      })
      .catch(() => {
        // Merge request failed (offline, etc.) - keep the local cart as-is and try again next login.
      })
      .finally(() => {
        if (mergeStateRef.current.userId === user.id) {
          mergeStateRef.current.completed = true
        }
      })
  }, [user, replaceCart])

  useEffect(() => {
    if (!user) return
    if (mergeStateRef.current.userId !== user.id || !mergeStateRef.current.completed) return

    replaceServerCart(items).catch(() => {
      // Sync failed - localStorage stays the source of truth until it succeeds.
    })
  }, [items, user])

  return null
}
