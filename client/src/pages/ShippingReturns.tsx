import { Truck } from "lucide-react"
import { NavLink } from "react-router-dom"
import { Card } from "../components/ui/Card"
import { useSeo } from "../hooks/useSeo"

const shipping = [
  "We deliver across India",
  "Orders are shipped within 1-2 business days",
  "Delivery time: 3-7 business days",
]

const returns = [
  "Easy 7-day return policy",
  "Products must be unused and in original condition",
  "Refunds are processed within 5-7 business days",
]

export function ShippingReturns() {
  useSeo({
    title: "Shipping & Returns",
    description: "StoneCraft shipping timelines and our 7-day return policy.",
  })

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-bold">Shipping &amp; Returns</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Placeholder policy details below — to be replaced with our finalized shipping and
        returns terms before launch.
      </p>

      <Card className="mt-6 p-6">
        <h2 className="flex items-center gap-2 font-serif text-xl font-bold">
          <Truck size={20} className="text-accent" />
          Shipping
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
          {shipping.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-serif text-xl font-bold">Returns</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
          {returns.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      </Card>

      <p className="mt-8 text-sm text-text-secondary">
        Need help with an order?{" "}
        <NavLink to="/contact" className="font-semibold text-text-primary underline">
          Get in touch
        </NavLink>
        .
      </p>
    </section>
  )
}
