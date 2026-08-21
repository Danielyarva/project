import { Menu } from "lucide-react"
import { NavLink } from "react-router-dom"
import { CartIcon } from "../ui/CartIcon"

interface MobileHeaderProps {
  onOpenMenu: () => void
}

export function MobileHeader({ onOpenMenu }: MobileHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
      <button type="button" onClick={onOpenMenu} aria-label="Open menu" className="text-text-primary">
        <Menu size={22} />
      </button>

      <NavLink to="/" className="text-base font-bold tracking-tight">
        Mortar &amp; Pestle Co.
      </NavLink>

      <NavLink to="/cart" aria-label="Cart" className="text-text-primary">
        <CartIcon />
      </NavLink>
    </header>
  )
}
