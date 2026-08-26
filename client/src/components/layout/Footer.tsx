import { NavLink } from "react-router-dom"
import { Logo } from "./Logo"
import { primaryNavLinks, secondaryNavLinks } from "./navLinks"

const footerLinks = [...primaryNavLinks.filter((link) => link.to !== "/"), ...secondaryNavLinks]

export function Footer() {
  return (
    <footer className="mb-16 border-t border-border bg-surface md:mb-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 sm:flex-row sm:justify-between">
        <div className="max-w-sm">
          <Logo showTagline iconClassName="h-5 w-5" wordmarkClassName="text-base" />
          <p className="mt-3 text-sm text-text-secondary">
            Bringing tradition, health, and authenticity to your kitchen with handcrafted
            stoneware.
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {footerLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className="text-text-secondary hover:text-text-primary">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-6xl border-t border-border px-6 py-4 text-xs text-text-secondary">
        <p>&copy; {new Date().getFullYear()} StoneCraft. Handmade, made to last.</p>
      </div>
    </footer>
  )
}
