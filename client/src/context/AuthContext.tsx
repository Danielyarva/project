import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getMe, login as loginRequest, logout as logoutRequest, register as registerRequest } from "../services/auth"
import type { User } from "../types/user"

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (body: { email: string; password: string }) => Promise<void>
  register: (body: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(body: { email: string; password: string }) {
    const { user } = await loginRequest(body)
    setUser(user)
  }

  async function register(body: { name: string; email: string; password: string }) {
    const { user } = await registerRequest(body)
    setUser(user)
  }

  async function logout() {
    await logoutRequest()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
