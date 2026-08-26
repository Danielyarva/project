import { Link } from "react-router-dom"
import { Chip } from "../ui/Chip"
import type { Product } from "../../types/product"

interface SizeChipsProps {
  current: Product
  siblings: Product[]
}

export function SizeChips({ current, siblings }: SizeChipsProps) {
  const options = [current, ...siblings].sort((a, b) => a.price - b.price)

  if (options.length <= 1) return null

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-text-secondary">
        Size: <span className="text-text-primary">{current.size}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) =>
          option.slug === current.slug ? (
            <Chip key={option.slug} active>
              {option.size}
            </Chip>
          ) : (
            <Link
              key={option.slug}
              to={`/products/${option.slug}`}
              className="shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-semibold whitespace-nowrap text-text-secondary transition-colors hover:text-text-primary"
            >
              {option.size}
            </Link>
          ),
        )}
      </div>
    </div>
  )
}
