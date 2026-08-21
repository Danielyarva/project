import { useState } from "react"
import { NavLink } from "react-router-dom"
import { CartItemRow } from "../components/cart/CartItemRow"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { useCart } from "../context/CartContext"
import { useSeo } from "../hooks/useSeo"
import { ApiError } from "../services/api"
import { createOrder } from "../services/orders"
import { formatPrice } from "../utils/formatPrice"

export function Cart() {
  useSeo({ title: "Cart", description: "Review your cart and checkout.", noIndex: true })

  const { items, subtotal } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    setSubmitting(true)
    setError(null)
    try {
      const { url } = await createOrder(items.map(({ slug, quantity }) => ({ slug, quantity })))
      window.location.href = url
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to start checkout")
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Cart</h1>
        <p className="mt-2 text-text-secondary">Your cart is empty.</p>
        <NavLink to="/shop" className="mt-6 inline-block">
          <Button>Browse the Shop</Button>
        </NavLink>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Cart</h1>

      <div className="mt-6 divide-y divide-border">
        {items.map((item) => (
          <CartItemRow key={item.slug} item={item} />
        ))}
      </div>

      <Card className="mt-8 p-6">
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>Subtotal</span>
          <span className="font-semibold text-text-primary">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-text-secondary">Shipping and taxes calculated at checkout.</p>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <Button fullWidth disabled={submitting} onClick={handleCheckout} className="mt-6">
          {submitting ? "Redirecting to checkout..." : "Checkout"}
        </Button>
      </Card>
    </section>
  )
}
