import { NavLink } from "react-router-dom"
import { CartItemRow } from "../components/cart/CartItemRow"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { useCart } from "../context/CartContext"
import { formatPrice } from "../utils/formatPrice"

export function Cart() {
  const { items, subtotal } = useCart()

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

        <Button fullWidth disabled className="mt-6">
          Checkout
        </Button>
        <p className="mt-2 text-center text-xs text-text-secondary">
          Checkout lands in Segment 11.
        </p>
      </Card>
    </section>
  )
}
