import { useState } from "react"
import { Navigate, NavLink, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { useAuth } from "../context/AuthContext"
import { useSeo } from "../hooks/useSeo"
import { ApiError } from "../services/api"

export function Register() {
  useSeo({ title: "Create Account", description: "Create an account.", noIndex: true })

  const { user, loading: authLoading, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await register({ name, email, password })
      navigate("/account")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create account")
      setSubmitting(false)
    }
  }

  if (!authLoading && user) {
    return <Navigate to="/account" replace />
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold">Create Account</h1>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-semibold">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>

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
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            <p className="mt-1 text-xs text-text-secondary">At least 6 characters.</p>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" disabled={submitting} fullWidth>
            {submitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <NavLink to="/login" className="font-semibold text-text-primary underline">
          Log in
        </NavLink>
      </p>
    </section>
  )
}
