import { Hand, Heart, Leaf, ShieldCheck } from "lucide-react"
import type { ComponentType } from "react"

export interface BadgeItem {
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
}

const defaultBadges: BadgeItem[] = [
  { icon: Hand, label: "Handmade" },
  { icon: Leaf, label: "Natural Materials" },
  { icon: ShieldCheck, label: "Food Safe" },
  { icon: Heart, label: "Made with Love" },
]

export function TrustBadgeRow({ items = defaultBadges }: { items?: BadgeItem[] }) {
  return (
    <div className="flex justify-start gap-6 overflow-x-auto px-4 py-2 sm:justify-center sm:gap-10">
      {items.map(({ icon: Icon, label }) => (
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
