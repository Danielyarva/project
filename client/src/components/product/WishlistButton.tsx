import { Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useWishlist } from "../../context/WishlistContext"

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const navigate = useNavigate()
  const saved = isWishlisted(productId)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate("/login")
      return
    }
    toggle(productId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow-card transition-transform hover:scale-105 ${className}`}
    >
      <Heart size={16} className={saved ? "fill-danger/70 text-danger/70" : "text-text-secondary"} />
    </button>
  )
}
