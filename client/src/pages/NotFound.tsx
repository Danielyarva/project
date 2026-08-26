import { NavLink } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { useSeo } from "../hooks/useSeo"

export function NotFound() {
  useSeo({ title: "Page Not Found", description: "This page doesn't exist.", noIndex: true })

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="font-serif text-4xl font-bold">Page not found</h1>
      <p className="text-text-secondary">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <NavLink to="/">
        <Button>Back to Home</Button>
      </NavLink>
    </section>
  )
}
