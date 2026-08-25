import { Link } from "react-router-dom"
import { StarRating } from "../ui/StarRating"
import { formatPrice } from "../../utils/formatPrice"
import type { Product } from "../../types/product"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-card bg-surface shadow-card">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="truncate font-serif text-base font-semibold">{product.name}</h3>
        <StarRating rating={product.avgRating} numReviews={product.numReviews} />
        <p className="text-sm font-bold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
