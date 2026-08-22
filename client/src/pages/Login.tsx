import { useState } from "react"
import { Navigate, NavLink, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { useAuth } from "../context/AuthContext"
import { useSeo } from "../hooks/useSeo"
import { ApiError } from "../services/api"

export function Login() {
  useSeo({ title: "Log In", description: "Log in to your account.", noIndex: true })

  const { user, loading: authLoading, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await login({ email, password })
      navigate("/account")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to log in")
      setSubmitting(false)
    }
  }

  if (!authLoading && user) {
    return <Navigate to="/account" replace />
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold">Log In</h1>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" disabled={submitting} fullWidth>
            {submitting ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don't have an account?{" "}
        <NavLink to="/register" className="font-semibold text-text-primary underline">
          Create one
        </NavLink>
      </p>
    </section>
  )
}
