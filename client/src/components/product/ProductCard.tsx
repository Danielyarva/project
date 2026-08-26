import { Link } from "react-router-dom"
import { StarRating } from "../ui/StarRating"
import { PriceDisplay } from "./PriceDisplay"
import { WishlistButton } from "./WishlistButton"
import type { Product } from "../../types/product"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-card bg-surface shadow-card">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <WishlistButton productId={product._id} className="absolute top-2 right-2" />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="truncate font-serif text-base font-semibold">{product.name}</h3>
        <StarRating rating={product.avgRating} numReviews={product.numReviews} />
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
      </div>
    </Link>
  )
}
