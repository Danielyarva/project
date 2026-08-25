import { NavLink } from "react-router-dom"
import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="mb-16 border-t border-border bg-surface md:mb-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo iconClassName="h-5 w-5" wordmarkClassName="text-base" />
          <p className="mt-2">&copy; {new Date().getFullYear()} StoneCraft. Handmade, made to last.</p>
        </div>
        <nav className="flex gap-5">
          <NavLink to="/shop" className="hover:text-text-primary">
            Shop
          </NavLink>
          <NavLink to="/contact" className="hover:text-text-primary">
            Contact
          </NavLink>
        </nav>
      </div>
    </footer>
  )
}
