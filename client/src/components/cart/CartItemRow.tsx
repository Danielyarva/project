import { Trash2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ConfirmDialog } from "../ui/ConfirmDialog"
import { QuantityStepper } from "../product/QuantityStepper"
import { useCart } from "../../context/CartContext"
import { formatPrice } from "../../utils/formatPrice"
import type { CartItem } from "../../types/cart"

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart()
  const [confirmingRemove, setConfirmingRemove] = useState(false)

  return (
    <div className="flex gap-4 py-4">
      <Link to={`/products/${item.slug}`} className="shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="h-20 w-20 rounded-2xl object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link to={`/products/${item.slug}`} className="text-sm font-semibold hover:underline">
            {item.name}
          </Link>
          <p className="text-xs text-text-secondary">Size: {item.size}</p>
        </div>

        <div className="flex items-center justify-between">
          <QuantityStepper
            quantity={item.quantity}
            onChange={(q) => updateQuantity(item.slug, q)}
            max={item.stock}
          />
          <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>

      <button
        type="button"
        aria-label={`Remove ${item.name} from cart`}
        onClick={() => setConfirmingRemove(true)}
        className="self-start text-text-secondary hover:text-danger"
      >
        <Trash2 size={18} />
      </button>

      <ConfirmDialog
        open={confirmingRemove}
        title="Remove item?"
        description={`Remove "${item.name}" from your cart.`}
        confirmLabel="Remove"
        onConfirm={() => {
          removeItem(item.slug)
          setConfirmingRemove(false)
        }}
        onCancel={() => setConfirmingRemove(false)}
      />
    </div>
  )
}
