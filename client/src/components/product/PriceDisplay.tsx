import { formatDiscountPercent, formatPrice } from "../../utils/formatPrice"

interface PriceDisplayProps {
  price: number
  compareAtPrice?: number
  size?: "sm" | "lg"
}

export function PriceDisplay({ price, compareAtPrice, size = "sm" }: PriceDisplayProps) {
  const discounted = !!compareAtPrice && compareAtPrice > price
  const priceClass = size === "lg" ? "text-xl font-bold" : "text-sm font-bold"

  if (!discounted) {
    return <p className={priceClass}>{formatPrice(price)}</p>
  }

  const percentOff = formatDiscountPercent(price, compareAtPrice)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className={priceClass}>{formatPrice(price)}</p>
      <p className="text-sm text-text-secondary line-through">{formatPrice(compareAtPrice)}</p>
      <span className="rounded-full bg-discount/15 px-2 py-0.5 text-xs font-bold text-discount">
        −{percentOff}% off
      </span>
    </div>
  )
}
