import { api } from "./api"

export function sendContactMessage(body: { name: string; email: string; message: string }) {
  return api.post<{ contactMessage: unknown }>("/contact", body)
}
