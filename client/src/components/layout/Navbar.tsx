import { ShoppingBag, User } from "lucide-react"
import { NavLink } from "react-router-dom"
import { primaryNavLinks } from "./navLinks"

export function Navbar() {
  return (
    <header className="hidden border-b border-border bg-surface md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-lg font-bold tracking-tight">
          Mortar &amp; Pestle Co.
        </NavLink>

        <nav className="flex items-center gap-8">
          {primaryNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <NavLink
            to="/cart"
            aria-label="Cart"
            className="text-text-primary transition-opacity hover:opacity-70"
          >
            <ShoppingBag size={20} />
          </NavLink>
          <NavLink
            to="/account"
            aria-label="Account"
            className="text-text-primary transition-opacity hover:opacity-70"
          >
            <User size={20} />
          </NavLink>
        </div>
      </div>
    </header>
  )
}
