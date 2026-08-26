import { act, render, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { CartProvider, useCart } from "./CartContext"

const product = { slug: "granite-large", name: "Granite Mortar", size: "Large", price: 68, image: "img.jpg", stock: 3 }

beforeEach(() => {
  localStorage.clear()
})

describe("useCart", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    expect(result.current.items).toEqual([])
    expect(result.current.itemCount).toBe(0)
    expect(result.current.subtotal).toBe(0)
  })

  it("adds an item and computes itemCount/subtotal", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })

    act(() => result.current.addItem(product, 2))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.itemCount).toBe(2)
    expect(result.current.subtotal).toBe(136)
  })

  it("merges a second add of the same product by summing quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })

    act(() => result.current.addItem(product, 1))
    act(() => result.current.addItem(product, 1))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it("never lets quantity exceed the product's stock, even across multiple adds", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })

    act(() => result.current.addItem(product, 2))
    act(() => result.current.addItem(product, 5)) // would be 7, but stock is 3

    expect(result.current.items[0].quantity).toBe(3)
  })

  it("updateQuantity clamps between 1 and stock", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addItem(product, 1))

    act(() => result.current.updateQuantity(product.slug, 0))
    expect(result.current.items[0].quantity).toBe(1)

    act(() => result.current.updateQuantity(product.slug, 99))
    expect(result.current.items[0].quantity).toBe(3)
  })

  it("removeItem removes only the matching item", () => {
    const other = { ...product, slug: "marble-medium", name: "Marble Mortar" }
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })

    act(() => result.current.addItem(product, 1))
    act(() => result.current.addItem(other, 1))
    act(() => result.current.removeItem(product.slug))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].slug).toBe("marble-medium")
  })

  it("clearCart empties the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addItem(product, 1))
    act(() => result.current.clearCart())
    expect(result.current.items).toEqual([])
  })

  it("persists to localStorage and rehydrates a fresh provider", () => {
    const { result, unmount } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.addItem(product, 2))
    unmount()

    const { result: fresh } = renderHook(() => useCart(), { wrapper: CartProvider })
    expect(fresh.current.items).toHaveLength(1)
    expect(fresh.current.items[0].quantity).toBe(2)
  })

  it("throws when used outside a CartProvider", () => {
    function Bare() {
      useCart()
      return null
    }
    expect(() => render(<Bare />)).toThrow(/CartProvider/)
  })
})
