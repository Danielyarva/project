import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useEffect, useRef } from "react"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it } from "vitest"
import { CartItemRow } from "./CartItemRow"
import { CartProvider, useCart } from "../../context/CartContext"

const item = {
  slug: "granite-large",
  name: "Granite Mortar",
  size: "Large",
  price: 68,
  image: "img.jpg",
  quantity: 2,
  stock: 5,
}

function Harness() {
  const { items, itemCount, addItem } = useCart()
  const seededOnce = useRef(false)

  useEffect(() => {
    if (!seededOnce.current) {
      seededOnce.current = true
      addItem(item, item.quantity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <span data-testid="item-count">{itemCount}</span>
      {items.map((i) => (
        <CartItemRow key={i.slug} item={i} />
      ))}
    </div>
  )
}

function renderHarness() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <Harness />
      </CartProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe("CartItemRow", () => {
  it("renders the item's name, size, and line total", () => {
    renderHarness()
    expect(screen.getByText("Granite Mortar")).toBeInTheDocument()
    expect(screen.getByText("Size: Large")).toBeInTheDocument()
    expect(screen.getByText("$136.00")).toBeInTheDocument() // 68 * 2
  })

  it("increasing quantity updates the line total", async () => {
    const user = userEvent.setup()
    renderHarness()

    await user.click(screen.getByLabelText("Increase quantity"))

    expect(screen.getByText("$204.00")).toBeInTheDocument() // 68 * 3
  })

  it("clicking remove opens a confirmation dialog and does not remove until confirmed", async () => {
    const user = userEvent.setup()
    renderHarness()

    await user.click(screen.getByLabelText("Remove Granite Mortar from cart"))

    expect(screen.getByText("Remove item?")).toBeInTheDocument()
    // Cart state is untouched while the dialog is open
    expect(screen.getByTestId("item-count").textContent).toBe("2")

    await user.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByText("Remove item?")).not.toBeInTheDocument()
    expect(screen.getByTestId("item-count").textContent).toBe("2")
  })

  it("confirming removal actually removes the item from the cart", async () => {
    const user = userEvent.setup()
    renderHarness()

    await user.click(screen.getByLabelText("Remove Granite Mortar from cart"))
    await user.click(screen.getByRole("button", { name: "Remove" }))

    expect(screen.queryByText("Granite Mortar")).not.toBeInTheDocument()
    expect(screen.getByTestId("item-count").textContent).toBe("0")
  })
})
