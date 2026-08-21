import { X } from "lucide-react"
import { NavLink } from "react-router-dom"
import { ThemeToggle } from "../ui/ThemeToggle"
import { primaryNavLinks } from "./navLinks"

interface HamburgerDrawerProps {
  open: boolean
  onClose: () => void
}

export function HamburgerDrawer({ open, onClose }: HamburgerDrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-y-0 left-0 flex w-72 max-w-[80vw] flex-col bg-surface p-6 shadow-card transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-bold">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-text-primary"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          {primaryNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `text-base font-semibold ${isActive ? "text-text-primary" : "text-text-secondary"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <p className="mb-2 text-xs font-semibold text-text-secondary">Appearance</p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
