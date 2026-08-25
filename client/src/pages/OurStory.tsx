import { Award, BookOpen, HeartHandshake, Image as ImageIcon, Users } from "lucide-react"
import { TrustBadgeRow } from "../components/home/TrustBadgeRow"
import { useSeo } from "../hooks/useSeo"

const badges = [
  { icon: Award, label: "Generations of Expertise" },
  { icon: HeartHandshake, label: "Handcrafted with Passion" },
  { icon: Users, label: "Supporting Artisans" },
  { icon: BookOpen, label: "Preserving Tradition" },
]

export function OurStory() {
  useSeo({
    title: "Our Story",
    description: "How StoneCraft began — hand-carved stoneware, made by artisans who have perfected their craft over generations.",
  })

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-bold">Our Story</h1>

      <div className="mt-6 flex aspect-video flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border bg-surface text-text-secondary">
        <ImageIcon size={28} />
        <span className="text-xs font-semibold">Photo coming soon</span>
      </div>

      <p className="mt-6 text-text-secondary">
        StoneCraft began with a simple belief — that traditional tools make everyday cooking
        healthier and more meaningful.
      </p>
      <p className="mt-4 text-text-secondary">
        Each piece is hand-carved by artisans who have perfected their craft over generations.
        We bring their work from their homes to yours, one mortar and pestle at a time.
      </p>

      <div className="mt-12">
        <TrustBadgeRow items={badges} />
      </div>
    </section>
  )
}
