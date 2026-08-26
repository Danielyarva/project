import { beforeEach, describe, expect, it, jest } from "@jest/globals"

const { app } = await import("../src/app.js")
const { ProductModel } = await import("../src/models/Product.js")
const { UserModel } = await import("../src/models/User.js")
const { signToken } = await import("../src/utils/token.js")
const { mockQueryChain } = await import("./helpers.js")
const request = (await import("supertest")).default

const userToken = signToken({ userId: "user1", role: "user" })

function product(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    _id: "p1",
    slug: "granite-large",
    name: "Granite Mortar",
    size: "Large",
    price: 68,
    images: ["img.jpg"],
    stock: 5,
    ...overrides,
  }
}

function fakeUser(cart: { product: unknown; quantity: number }[] = []) {
  return {
    id: "user1",
    _id: "user1",
    role: "user",
    email: "user@example.com",
    cart,
    save: jest.fn(async function (this: { cart: unknown[] }) {
      return this
    }),
  }
}

describe("PUT /api/cart", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("rejects unauthenticated requests with 401", async () => {
    const res = await request(app).put("/api/cart").send({ items: [] })
    expect(res.status).toBe(401)
  })

  it("saves the given items, capping quantity at stock", async () => {
    const user = fakeUser()
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(user) as never)
    jest.spyOn(ProductModel, "find").mockResolvedValue([product({ stock: 3 })] as never)

    const res = await request(app)
      .put("/api/cart")
      .set("Cookie", `token=${userToken}`)
      .send({ items: [{ slug: "granite-large", quantity: 10 }] })

    expect(res.status).toBe(200)
    expect(res.body.items).toEqual([
      { slug: "granite-large", name: "Granite Mortar", size: "Large", price: 68, image: "img.jpg", stock: 3, quantity: 3 },
    ])
    expect(res.body.removed).toEqual([])
    expect(user.save).toHaveBeenCalled()
    expect(user.cart).toEqual([{ product: "p1", quantity: 3 }])
  })

  it("drops items whose product no longer exists or is out of stock, reporting them as removed", async () => {
    const user = fakeUser()
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(user) as never)
    jest.spyOn(ProductModel, "find").mockResolvedValue([product({ slug: "in-stock", stock: 2 })] as never)

    const res = await request(app)
      .put("/api/cart")
      .set("Cookie", `token=${userToken}`)
      .send({
        items: [
          { slug: "in-stock", quantity: 1 },
          { slug: "deleted-product", quantity: 1 },
        ],
      })

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.removed).toEqual(["deleted-product"])
  })
})

describe("POST /api/cart/merge", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("rejects unauthenticated requests with 401", async () => {
    const res = await request(app).post("/api/cart/merge").send({ items: [] })
    expect(res.status).toBe(401)
  })

  it("sums quantities when the same product is in both the server and guest cart, capped at stock", async () => {
    const existingProduct = product({ stock: 4 })
    const user = fakeUser([{ product: existingProduct, quantity: 2 }])
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(user) as never)
    jest.spyOn(ProductModel, "find").mockResolvedValue([existingProduct] as never)

    const res = await request(app)
      .post("/api/cart/merge")
      .set("Cookie", `token=${userToken}`)
      .send({ items: [{ slug: "granite-large", quantity: 5 }] })

    expect(res.status).toBe(200)
    // 2 (server) + 5 (guest) = 7, capped at stock of 4
    expect(res.body.items).toEqual([
      { slug: "granite-large", name: "Granite Mortar", size: "Large", price: 68, image: "img.jpg", stock: 4, quantity: 4 },
    ])
    expect(res.body.removed).toEqual([])
  })

  it("keeps items only present in one of the two carts", async () => {
    const serverOnly = product({ _id: "p1", slug: "granite-large", stock: 5 })
    const user = fakeUser([{ product: serverOnly, quantity: 1 }])
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(user) as never)
    const guestOnly = product({ _id: "p2", slug: "marble-medium", stock: 5 })
    jest.spyOn(ProductModel, "find").mockResolvedValue([guestOnly] as never)

    const res = await request(app)
      .post("/api/cart/merge")
      .set("Cookie", `token=${userToken}`)
      .send({ items: [{ slug: "marble-medium", quantity: 1 }] })

    expect(res.status).toBe(200)
    expect(res.body.items.map((i: { slug: string }) => i.slug).sort()).toEqual(["granite-large", "marble-medium"])
  })

  it("silently drops guest items with no matching product or zero stock, reporting them as removed", async () => {
    const user = fakeUser([])
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(user) as never)
    jest.spyOn(ProductModel, "find").mockResolvedValue([product({ slug: "out-of-stock", stock: 0 })] as never)

    const res = await request(app)
      .post("/api/cart/merge")
      .set("Cookie", `token=${userToken}`)
      .send({
        items: [
          { slug: "out-of-stock", quantity: 1 },
          { slug: "does-not-exist", quantity: 1 },
        ],
      })

    expect(res.status).toBe(200)
    expect(res.body.items).toEqual([])
    expect(res.body.removed.sort()).toEqual(["does-not-exist", "out-of-stock"])
  })

  it("drops a previously-saved server cart item that is now out of stock", async () => {
    const staleProduct = product({ slug: "granite-large", stock: 0 })
    const user = fakeUser([{ product: staleProduct, quantity: 1 }])
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(user) as never)
    jest.spyOn(ProductModel, "find").mockResolvedValue([] as never)

    const res = await request(app)
      .post("/api/cart/merge")
      .set("Cookie", `token=${userToken}`)
      .send({ items: [] })

    expect(res.status).toBe(200)
    expect(res.body.items).toEqual([])
    expect(res.body.removed).toEqual(["granite-large"])
  })
})
