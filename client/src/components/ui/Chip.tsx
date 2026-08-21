import type { ButtonHTMLAttributes } from "react"

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Chip({ active = false, className = "", ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
        active
          ? "border-accent bg-accent text-accent-text"
          : "border-border text-text-secondary hover:text-text-primary"
      } ${className}`}
      {...props}
    />
  )
}
