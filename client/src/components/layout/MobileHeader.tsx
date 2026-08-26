import { Menu } from "lucide-react"
import { NavLink } from "react-router-dom"
import { CartIcon } from "../ui/CartIcon"
import { Logo } from "./Logo"

interface MobileHeaderProps {
  onOpenMenu: () => void
}

export function MobileHeader({ onOpenMenu }: MobileHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
      <button type="button" onClick={onOpenMenu} aria-label="Open menu" className="text-text-primary">
        <Menu size={22} />
      </button>

      <NavLink to="/" aria-label="StoneCraft home">
        <Logo iconClassName="h-5 w-5" wordmarkClassName="text-base" />
      </NavLink>

      <NavLink to="/cart" aria-label="Cart" className="text-text-primary">
        <CartIcon />
      </NavLink>
    </header>
  )
}
