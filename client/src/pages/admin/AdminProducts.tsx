import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { ConfirmDialog } from "../../components/ui/ConfirmDialog"
import { adminDeleteProduct } from "../../services/admin"
import { listProducts } from "../../services/products"
import { formatPrice } from "../../utils/formatPrice"
import type { Product } from "../../types/product"

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  function refetch() {
    setLoading(true)
    listProducts()
      .then(({ products }) => setProducts(products))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load products"))
      .finally(() => setLoading(false))
  }

  useEffect(refetch, [])

  async function handleDelete() {
    if (!deleteTarget) return
    await adminDeleteProduct(deleteTarget._id)
    setDeleteTarget(null)
    refetch()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Products</h1>
        <Link to="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      {loading && <p className="mt-6 text-text-secondary">Loading...</p>}
      {error && <p className="mt-6 text-danger">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 pr-4 font-semibold">Size</th>
                <th className="py-2 pr-4 font-semibold">Price</th>
                <th className="py-2 pr-4 font-semibold">Stock</th>
                <th className="py-2 pr-4 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-border">
                  <td className="py-3 pr-4 font-medium">{product.name}</td>
                  <td className="py-3 pr-4">{product.size}</td>
                  <td className="py-3 pr-4">{formatPrice(product.price)}</td>
                  <td className="py-3 pr-4">{product.stock}</td>
                  <td className="py-3 pr-4 text-right">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="mr-4 font-semibold hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(product)}
                      className="font-semibold text-danger hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="mt-6 text-text-secondary">No products yet.</p>}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        description={deleteTarget ? `Permanently delete "${deleteTarget.name}".` : undefined}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
