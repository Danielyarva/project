import { api } from "./api"
import type { User } from "../types/user"

export function getMe() {
  return api.get<{ user: User }>("/auth/me")
}
