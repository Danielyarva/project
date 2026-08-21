import { ShoppingBag } from "lucide-react"
import { useCart } from "../../context/CartContext"

export function CartIcon({ size = 20 }: { size?: number }) {
  const { itemCount } = useCart()

  return (
    <span className="relative inline-flex">
      <ShoppingBag size={size} />
      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-text">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </span>
  )
}
