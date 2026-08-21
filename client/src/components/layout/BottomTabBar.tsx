import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react"
import { NavLink } from "react-router-dom"
import { bottomTabLinks } from "./navLinks"

const icons = {
  Home: Home,
  Shop: ShoppingBag,
  Cart: ShoppingCart,
  Account: User,
}

export function BottomTabBar() {
  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {bottomTabLinks.map((link) => {
        const Icon = icons[link.label as keyof typeof icons]
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                isActive ? "text-text-primary" : "text-text-secondary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {link.label}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
