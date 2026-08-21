import { NavLink } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { useSeo } from "../hooks/useSeo"

export function Home() {
  useSeo({
    title: "Handmade Mortar & Pestle Sets",
    description: "Handmade mortar and pestle sets carved from granite, marble, and wood. Built to last a lifetime.",
  })

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Handmade Mortar &amp; Pestle
      </h1>
      <p className="max-w-md text-text-secondary">
        Carved from granite, marble, and wood. Made by hand, built to last a lifetime.
      </p>
      <NavLink to="/shop">
        <Button>Shop Now</Button>
      </NavLink>
    </section>
  )
}
