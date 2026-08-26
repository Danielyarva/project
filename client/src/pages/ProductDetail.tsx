import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { StarRating } from "../components/ui/StarRating"
import { ImageGallery } from "../components/product/ImageGallery"
import { PriceDisplay } from "../components/product/PriceDisplay"
import { QuantityStepper } from "../components/product/QuantityStepper"
import { SizeChips } from "../components/product/SizeChips"
import { WishlistButton } from "../components/product/WishlistButton"
import { ReviewsSection } from "../components/review/ReviewsSection"
import { useCart } from "../context/CartContext"
import { useProduct } from "../hooks/useProduct"
import { useSeo } from "../hooks/useSeo"
import { ApiError } from "../services/api"
import { createOrder } from "../services/orders"

export function ProductDetail() {
  const { slug } = useParams()
  const { product, siblings, loading, error } = useProduct(slug)
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [buyingNow, setBuyingNow] = useState(false)
  const [buyNowError, setBuyNowError] = useState<string | null>(null)

  const jsonLd = useMemo(() => {
    if (!product) return undefined
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.images,
      sku: product.slug,
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: product.price,
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
      ...(product.numReviews > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.avgRating,
              reviewCount: product.numReviews,
            },
          }
        : {}),
    }
  }, [product])

  useSeo({
    title: product?.name ?? "Product",
    description: product?.description ?? "Handmade mortar and pestle, carved from natural stone or wood.",
    image: product?.images[0],
    jsonLd,
  })

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-text-secondary">Loading product...</p>
      </section>
    )
  }

  if (error || !product) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-danger">
          {error ? "Couldn't load this product right now." : "Product not found."}
        </p>
      </section>
    )
  }

  const outOfStock = product.stock === 0

  function handleAddToCart() {
    if (!product) return
    addItem(
      {
        slug: product.slug,
        name: product.name,
        size: product.size,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
      },
      quantity,
    )
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  async function handleBuyNow() {
    if (!product) return
    setBuyingNow(true)
    setBuyNowError(null)
    try {
      const { url } = await createOrder([{ slug: product.slug, quantity }])
      window.location.href = url
    } catch (err) {
      setBuyNowError(err instanceof ApiError ? err.message : "Failed to start checkout")
      setBuyingNow(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-28 sm:px-6 sm:py-10 md:pb-10">
      <div className="grid gap-8 sm:py-6 md:grid-cols-2 md:gap-12">
        <div className="relative">
          <ImageGallery images={product.images} alt={product.name} />
          <WishlistButton productId={product._id} className="absolute top-3 right-3" />
        </div>

        <div>
          <h1 className="font-serif text-3xl font-bold">{product.name}</h1>
          <div className="mt-2">
            <StarRating rating={product.avgRating} numReviews={product.numReviews} />
          </div>
          <div className="mt-3">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
          </div>

          {product.description && (
            <p className="mt-4 text-sm text-text-secondary">{product.description}</p>
          )}

          <div className="mt-6">
            <SizeChips current={product} siblings={siblings} />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <QuantityStepper quantity={quantity} onChange={setQuantity} max={product.stock} />
            {outOfStock && <span className="text-sm font-semibold text-danger">Out of stock</span>}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button disabled={outOfStock} onClick={handleAddToCart}>
              {justAdded ? "Added!" : "Add to Cart"}
            </Button>
            <Button variant="secondary" disabled={outOfStock || buyingNow} onClick={handleBuyNow}>
              {buyingNow ? "Redirecting..." : "Buy Now"}
            </Button>
          </div>
          {buyNowError && <p className="mt-2 text-sm text-danger">{buyNowError}</p>}
        </div>
      </div>

      <ReviewsSection slug={product.slug} />

      <div className="fixed inset-x-0 bottom-16 z-30 flex items-center justify-between border-t border-border bg-surface px-4 py-3 md:hidden">
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
        <Button disabled={outOfStock} onClick={handleAddToCart}>
          {justAdded ? "Added!" : "Add to Cart"}
        </Button>
      </div>
    </section>
  )
}
