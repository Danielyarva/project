import { useMemo, useState } from "react"
import { Chip } from "../components/ui/Chip"
import { SearchInput } from "../components/ui/SearchInput"
import { ProductGrid } from "../components/product/ProductGrid"
import { useProducts } from "../hooks/useProducts"
import { useSeo } from "../hooks/useSeo"

export function Shop() {
  useSeo({
    title: "Shop",
    description: "Browse handmade mortar and pestle sets in granite, marble, and wood.",
  })

  const { products, loading, error } = useProducts()
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[],
    [products],
  )

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !activeCategory || product.category === activeCategory
      const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, search])

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-4 font-serif text-3xl font-bold">Shop All Products</h1>

      <SearchInput
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search products"
      />

      {categories.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <Chip active={activeCategory === null} onClick={() => setActiveCategory(null)}>
            All
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-6">
        {loading && <p className="text-text-secondary">Loading products...</p>}

        {error && (
          <p className="text-danger">Couldn't load products right now. Please try again.</p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-text-secondary">No products found.</p>
        )}

        {!loading && !error && filtered.length > 0 && <ProductGrid products={filtered} />}
      </div>
    </section>
  )
}
