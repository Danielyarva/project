import { useParams } from "react-router-dom"

export function ProductDetail() {
  const { slug } = useParams()
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-2xl font-bold">{slug}</h1>
      <p className="mt-2 text-text-secondary">The product detail page lands in Segment 9.</p>
    </section>
  )
}
