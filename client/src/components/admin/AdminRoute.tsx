import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-text-secondary">
        Loading...
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
