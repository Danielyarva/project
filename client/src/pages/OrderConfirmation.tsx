import { useEffect, useState } from "react"
import { NavLink, useSearchParams } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { useCart } from "../context/CartContext"
import { useSeo } from "../hooks/useSeo"
import { getOrderBySession } from "../services/orders"
import { formatPrice } from "../utils/formatPrice"
import type { Order } from "../types/order"

export function OrderConfirmation() {
  useSeo({ title: "Order Confirmation", description: "Your order confirmation.", noIndex: true })

  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { clearCart } = useCart()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      setError("Missing checkout session.")
      return
    }

    getOrderBySession(sessionId)
      .then(({ order }) => setOrder(order))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load order"))
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-text-secondary">Loading your order...</p>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold">We couldn't find that order</h1>
        <p className="mt-2 text-text-secondary">{error}</p>
        <NavLink to="/shop" className="mt-6 inline-block">
          <Button>Continue Shopping</Button>
        </NavLink>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      {order.status === "pending" ? (
        <>
          <h1 className="text-2xl font-bold">Confirming your payment...</h1>
          <p className="mt-2 text-text-secondary">
            This usually only takes a few seconds. Refresh this page shortly if it doesn't update.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Thank you for your order!</h1>
          <p className="mt-2 text-text-secondary">
            A confirmation email is on its way. Order #{order._id.slice(-8)}
          </p>
        </>
      )}

      <Card className="mt-8 p-6">
        <ul className="divide-y divide-border">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center justify-between py-3 text-sm">
              <span>
                {item.quantity} x {typeof item.product === "object" ? item.product.name : "Item"} (
                {item.size})
              </span>
              <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        {order.shippingAddress && (
          <div className="mt-6 border-t border-border pt-4 text-sm text-text-secondary">
            <p className="mb-1 font-semibold text-text-primary">Shipping to</p>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        )}
      </Card>

      <NavLink to="/shop" className="mt-8 block text-center">
        <Button variant="secondary">Continue Shopping</Button>
      </NavLink>
    </section>
  )
}
