import { Search } from "lucide-react"
import type { InputHTMLAttributes } from "react"

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary"
      />
      <input
        type="search"
        className="w-full rounded-full border border-border bg-surface py-3 pr-4 pl-11 text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
        {...props}
      />
    </div>
  )
}
