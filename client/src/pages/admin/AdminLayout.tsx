import { NavLink, Outlet } from "react-router-dom"
import { useSeo } from "../../hooks/useSeo"

const tabs = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/contact-messages", label: "Messages" },
]

export function AdminLayout() {
  useSeo({ title: "Admin", description: "Store administration.", noIndex: true })

  return (
    <div className="min-h-svh bg-bg text-text-primary">
      <header className="border-b border-border bg-surface px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <NavLink to="/" className="text-sm font-bold">
            StoneCraft — Admin
          </NavLink>
          <NavLink to="/" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
            Exit Admin
          </NavLink>
        </div>
        <nav className="mx-auto mt-4 flex max-w-5xl gap-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <Outlet />
      </main>
    </div>
  )
}
