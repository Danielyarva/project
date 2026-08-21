import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import {
  adminAddProductImages,
  adminCreateProduct,
  adminUpdateProduct,
  type ProductFormFields,
} from "../../services/admin"
import { ApiError } from "../../services/api"
import { listProducts } from "../../services/products"

const emptyFields: ProductFormFields = {
  name: "",
  description: "",
  material: "",
  category: "",
  size: "",
  price: 0,
  stock: 0,
}

export function AdminProductForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [fields, setFields] = useState<ProductFormFields>(emptyFields)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEdit) return
    listProducts()
      .then(({ products }) => {
        const product = products.find((p) => p._id === id)
        if (!product) {
          setError("Product not found")
          return
        }
        setFields({
          name: product.name,
          description: product.description ?? "",
          material: product.material ?? "",
          category: product.category ?? "",
          size: product.size,
          price: product.price,
          stock: product.stock,
        })
        setExistingImages(product.images)
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function updateField<K extends keyof ProductFormFields>(key: K, value: ProductFormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (isEdit && id) {
        await adminUpdateProduct(id, fields)
        if (newImages.length > 0) {
          await adminAddProductImages(id, newImages)
        }
      } else {
        if (newImages.length === 0) {
          setError("At least one product image is required")
          setSubmitting(false)
          return
        }
        await adminCreateProduct(fields, newImages)
      }
      navigate("/admin/products")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save product")
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-text-secondary">Loading...</p>

  return (
    <div>
      <h1 className="text-xl font-bold">{isEdit ? "Edit Product" : "Add Product"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex max-w-lg flex-col gap-4">
        <Field label="Name">
          <input
            required
            value={fields.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Size">
            <input
              required
              value={fields.size}
              onChange={(e) => updateField("size", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Category">
            <input
              value={fields.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price ($)">
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={fields.price}
              onChange={(e) => updateField("price", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Stock">
            <input
              type="number"
              min="0"
              step="1"
              required
              value={fields.stock}
              onChange={(e) => updateField("stock", Number(e.target.value))}
              className="input"
            />
          </Field>
        </div>

        <Field label="Material">
          <select
            value={fields.material}
            onChange={(e) => updateField("material", e.target.value)}
            className="input"
          >
            <option value="">None</option>
            <option value="granite">Granite</option>
            <option value="marble">Marble</option>
            <option value="wood">Wood</option>
          </select>
        </Field>

        <Field label="Description">
          <textarea
            rows={4}
            value={fields.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="input"
          />
        </Field>

        {existingImages.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold">Current images</p>
            <div className="flex gap-2">
              {existingImages.map((img) => (
                <img key={img} src={img} alt="" className="h-16 w-16 rounded-xl object-cover" />
              ))}
            </div>
          </div>
        )}

        <Field label={isEdit ? "Add more images" : "Images"}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewImages(Array.from(e.target.files ?? []))}
          />
        </Field>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  )
}
