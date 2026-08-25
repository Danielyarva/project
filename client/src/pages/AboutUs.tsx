import { Hand, Leaf, ShieldCheck, Sparkles } from "lucide-react"
import { TrustBadgeRow } from "../components/home/TrustBadgeRow"
import { useSeo } from "../hooks/useSeo"

const badges = [
  { icon: Hand, label: "Handmade Products" },
  { icon: Leaf, label: "Natural Materials" },
  { icon: ShieldCheck, label: "Food Safe" },
  { icon: Sparkles, label: "Sustainable & Durable" },
]

export function AboutUs() {
  useSeo({
    title: "About Us",
    description: "StoneCraft celebrates the beauty of tradition and craftsmanship in every handmade piece.",
  })

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-bold">About Us</h1>
      <p className="mt-4 text-text-secondary">
        At StoneCraft, we celebrate the beauty of tradition and craftsmanship. Our handmade
        mortars and pestles are crafted by skilled artisans using natural stone, designed to
        bring authenticity and goodness to your kitchen.
      </p>
      <p className="mt-4 text-text-secondary">
        Every piece is shaped by hand, not machine — so no two are ever quite the same. We
        believe the tools you cook with should last generations, not seasons.
      </p>

      <div className="mt-12">
        <TrustBadgeRow items={badges} />
      </div>
    </section>
  )
}
