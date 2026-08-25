import { Hand, Heart, Leaf, ShieldCheck } from "lucide-react"
import type { ComponentType } from "react"

const badges: { icon: ComponentType<{ size?: number; className?: string }>; label: string }[] = [
  { icon: Hand, label: "Handmade" },
  { icon: Leaf, label: "Natural Materials" },
  { icon: ShieldCheck, label: "Food Safe" },
  { icon: Heart, label: "Made with Love" },
]

export function TrustBadgeRow() {
  return (
    <div className="flex justify-center gap-6 overflow-x-auto px-4 py-2 sm:gap-10">
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex shrink-0 flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/12 text-accent">
            <Icon size={22} />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap text-text-primary">{label}</span>
        </div>
      ))}
    </div>
  )
}
