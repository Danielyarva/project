import { NavLink } from "react-router-dom"

export function Footer() {
  return (
    <footer className="mb-16 border-t border-border bg-surface md:mb-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Mortar &amp; Pestle Co. Handmade, made to last.</p>
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
