import { Card } from "../components/ui/Card"
import { ThemeToggle } from "../components/ui/ThemeToggle"

export function Account() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-2xl font-bold">Account</h1>
      <p className="mt-2 text-text-secondary">
        Login, registration, profile, and order history aren't scheduled in a segment yet —
        worth confirming where they fit.
      </p>

      <Card className="mt-8 max-w-sm p-6">
        <h2 className="text-sm font-bold">Appearance</h2>
        <p className="mt-1 mb-4 text-sm text-text-secondary">
          Choose how the store looks on this device.
        </p>
        <ThemeToggle />
      </Card>
    </section>
  )
}
