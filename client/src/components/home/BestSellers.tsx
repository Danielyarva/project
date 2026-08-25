import { NavLink } from "react-router-dom"
import { ProductCard } from "../product/ProductCard"
import { useProducts } from "../../hooks/useProducts"

export function BestSellers() {
  const { products, loading, error } = useProducts({ featured: true })

  if (loading || error || products.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold">Best Sellers</h2>
        <NavLink to="/shop" className="text-sm font-semibold text-text-secondary hover:text-text-primary">
          View All &gt;
        </NavLink>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((product) => (
          <div key={product._id} className="w-40 shrink-0 sm:w-48">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
