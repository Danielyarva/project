import { NavLink } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { ThemeToggle } from "../components/ui/ThemeToggle"
import { useAuth } from "../context/AuthContext"
import { useSeo } from "../hooks/useSeo"

export function Account() {
  useSeo({ title: "Account", description: "Manage your account and preferences.", noIndex: true })

  const { user, loading, logout } = useAuth()

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-3xl font-bold">Account</h1>

      {!loading && !user && (
        <Card className="mt-6 max-w-sm p-6">
          <p className="text-sm text-text-secondary">
            Log in to leave reviews and view your order history.
          </p>
          <div className="mt-4 flex gap-3">
            <NavLink to="/login" className="flex-1">
              <Button fullWidth>Log In</Button>
            </NavLink>
            <NavLink to="/register" className="flex-1">
              <Button variant="secondary" fullWidth>
                Create Account
              </Button>
            </NavLink>
          </div>
        </Card>
      )}

      {!loading && user && (
        <Card className="mt-6 max-w-sm p-6">
          <p className="text-sm font-bold">{user.name}</p>
          <p className="text-sm text-text-secondary">{user.email}</p>
          <Button variant="secondary" onClick={() => logout()} className="mt-4">
            Log Out
          </Button>
        </Card>
      )}

      <Card className="mt-4 max-w-sm p-6">
        <h2 className="text-sm font-bold">Appearance</h2>
        <p className="mt-1 mb-4 text-sm text-text-secondary">
          Choose how the store looks on this device.
        </p>
        <ThemeToggle />
      </Card>

      {user?.role === "admin" && (
        <Card className="mt-4 max-w-sm p-6">
          <h2 className="text-sm font-bold">Admin</h2>
          <p className="mt-1 mb-4 text-sm text-text-secondary">
            Manage products, orders, and contact messages.
          </p>
          <NavLink to="/admin" className="text-sm font-semibold underline">
            Open Admin Dashboard
          </NavLink>
        </Card>
      )}
    </section>
  )
}
