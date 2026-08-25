import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CartSync } from "./CartSync"
import { AuthProvider, useAuth } from "../../context/AuthContext"
import { CartProvider, useCart } from "../../context/CartContext"
import * as authService from "../../services/auth"
import * as cartService from "../../services/cart"
import type { CartItem } from "../../types/cart"

const localItem: CartItem = {
  slug: "granite-large",
  name: "Granite Mortar",
  size: "Large",
  price: 68,
  image: "img.jpg",
  quantity: 2,
  stock: 5,
}

function Harness() {
  const { user, login } = useAuth()
  const { items, itemCount, addItem } = useCart()

  return (
    <div>
      <span data-testid="user">{user ? user.email : "guest"}</span>
      <span data-testid="count">{itemCount}</span>
      <ul>
        {items.map((i) => (
          <li key={i.slug}>
            {i.slug}:{i.quantity}
          </li>
        ))}
      </ul>
      <button onClick={() => login({ email: "a@b.com", password: "secret1" })}>Log In</button>
      <button
        onClick={() =>
          addItem({ slug: "marble-medium", name: "Marble Mortar", size: "Medium", price: 34, image: "m.jpg", stock: 5 }, 1)
        }
      >
        Add Marble
      </button>
    </div>
  )
}

function renderHarness() {
  return render(
    <AuthProvider>
      <CartProvider>
        <CartSync />
        <Harness />
      </CartProvider>
    </AuthProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem("cart", JSON.stringify([localItem]))
  vi.spyOn(authService, "getMe").mockRejectedValue(new Error("not authenticated"))
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("CartSync", () => {
  it("merges the local cart into the server cart on login and adopts the merged result", async () => {
    vi.spyOn(authService, "login").mockResolvedValue({
      user: { id: "u1", name: "Ann", email: "a@b.com", role: "user" },
    })
    const mergeSpy = vi.spyOn(cartService, "mergeServerCart").mockResolvedValue({
      items: [{ ...localItem, quantity: 4 }], // e.g. summed with something already on the server
      removed: [],
    })
    vi.spyOn(cartService, "replaceServerCart").mockResolvedValue({ items: [], removed: [] })

    const user = userEvent.setup()
    renderHarness()

    await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("guest"))
    expect(screen.getByTestId("count").textContent).toBe("2")

    await user.click(screen.getByText("Log In"))

    await waitFor(() => expect(mergeSpy).toHaveBeenCalledWith([localItem]))
    await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("4"))
    expect(screen.getByText("granite-large:4")).toBeInTheDocument()
  })

  it("syncs subsequent cart changes to the server once merged", async () => {
    vi.spyOn(authService, "login").mockResolvedValue({
      user: { id: "u1", name: "Ann", email: "a@b.com", role: "user" },
    })
    vi.spyOn(cartService, "mergeServerCart").mockResolvedValue({ items: [localItem], removed: [] })
    const replaceSpy = vi.spyOn(cartService, "replaceServerCart").mockResolvedValue({ items: [], removed: [] })

    const user = userEvent.setup()
    renderHarness()

    await user.click(screen.getByText("Log In"))
    await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("2"))

    replaceSpy.mockClear()
    await user.click(screen.getByText("Add Marble"))

    await waitFor(() =>
      expect(replaceSpy).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ slug: "marble-medium", quantity: 1 })]),
      ),
    )
  })

  it("does not sync to the server while logged out", async () => {
    const replaceSpy = vi.spyOn(cartService, "replaceServerCart")
    const mergeSpy = vi.spyOn(cartService, "mergeServerCart")

    const user = userEvent.setup()
    renderHarness()

    await act(async () => {
      await user.click(screen.getByText("Add Marble"))
    })

    expect(replaceSpy).not.toHaveBeenCalled()
    expect(mergeSpy).not.toHaveBeenCalled()
  })
})
