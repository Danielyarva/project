import { api } from "./api"
import type { User } from "../types/user"

export function getMe() {
  return api.get<{ user: User }>("/auth/me")
}

export function login(body: { email: string; password: string }) {
  return api.post<{ user: User }>("/auth/login", body)
}

export function register(body: { name: string; email: string; password: string }) {
  return api.post<{ user: User }>("/auth/register", body)
}

export function logout() {
  return api.post<void>("/auth/logout")
}
