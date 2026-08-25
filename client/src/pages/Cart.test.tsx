import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Cart } from "./Cart"
import { CartProvider } from "../context/CartContext"
import * as ordersService from "../services/orders"
import { ApiError } from "../services/api"
import type { CartItem } from "../types/cart"

const item: CartItem = {
  slug: "granite-large",
  name: "Granite Mortar",
  size: "Large",
  price: 68,
  image: "img.jpg",
  quantity: 2,
  stock: 5,
}

function seedCart(items: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(items))
}

function renderCart() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <Cart />
      </CartProvider>
    </MemoryRouter>,
  )
}

const originalLocation = window.location

beforeEach(() => {
  localStorage.clear()
  // jsdom doesn't implement real navigation; stub location so we can assert on it.
  Object.defineProperty(window, "location", { value: { href: "" }, writable: true })
})

afterEach(() => {
  Object.defineProperty(window, "location", { value: originalLocation, writable: true })
  vi.restoreAllMocks()
})

describe("Cart page", () => {
  it("shows an empty state with no checkout button when the cart is empty", () => {
    renderCart()
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Checkout" })).not.toBeInTheDocument()
  })

  it("shows items and sums the subtotal across multiple items", () => {
    const secondItem: CartItem = { ...item, slug: "marble-medium", name: "Marble Mortar", price: 34, quantity: 1 }
    seedCart([item, secondItem])
    renderCart()

    expect(screen.getByText("Granite Mortar")).toBeInTheDocument()
    expect(screen.getByText("Marble Mortar")).toBeInTheDocument()
    // Subtotal (68*2 + 34*1 = 170) is distinct from either line total, so this is unambiguous.
    expect(screen.getByText("₹170")).toBeInTheDocument()
  })

  it("clicking Checkout sends the cart contents and redirects to the returned URL", async () => {
    seedCart([item])
    const createOrderSpy = vi
      .spyOn(ordersService, "createOrder")
      .mockResolvedValue({ url: "https://checkout.stripe.com/fake-session" })

    const user = userEvent.setup()
    renderCart()

    await user.click(screen.getByRole("button", { name: "Checkout" }))

    expect(createOrderSpy).toHaveBeenCalledWith([{ slug: "granite-large", quantity: 2 }])
    await waitFor(() => expect(window.location.href).toBe("https://checkout.stripe.com/fake-session"))
  })

  it("shows an error and re-enables Checkout when order creation fails", async () => {
    seedCart([item])
    vi.spyOn(ordersService, "createOrder").mockRejectedValue(new ApiError(400, "Not enough stock for Granite Mortar"))

    const user = userEvent.setup()
    renderCart()

    await user.click(screen.getByRole("button", { name: "Checkout" }))

    expect(await screen.findByText("Not enough stock for Granite Mortar")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Checkout" })).not.toBeDisabled()
    // Cart is untouched - the user can still see their item and retry
    expect(screen.getByText("Granite Mortar")).toBeInTheDocument()
  })
})
