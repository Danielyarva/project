import { beforeEach, describe, expect, it, jest } from "@jest/globals"

const { app } = await import("../src/app.js")
const { ProductModel } = await import("../src/models/Product.js")
const { UserModel } = await import("../src/models/User.js")
const { signToken } = await import("../src/utils/token.js")
const { mockQueryChain } = await import("./helpers.js")
const request = (await import("supertest")).default

const userToken = signToken({ userId: "user1", role: "user" })

function fakeUser(wishlist: string[] = []) {
  return {
    id: "user1",
    _id: "user1",
    role: "user",
    email: "user@example.com",
    wishlist,
    save: jest.fn(async function (this: { wishlist: string[] }) {
      return this
    }),
  }
}

describe("GET /api/wishlist", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("rejects unauthenticated requests with 401", async () => {
    const res = await request(app).get("/api/wishlist")
    expect(res.status).toBe(401)
  })

  it("returns the current user's wishlisted products", async () => {
    const user = fakeUser(["p1", "p2"])
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(user) as never)

    const res = await request(app).get("/api/wishlist").set("Cookie", `token=${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.products).toEqual(["p1", "p2"])
  })
})

describe("POST /api/wishlist/:productId", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("rejects unauthenticated requests with 401", async () => {
    const res = await request(app).post("/api/wishlist/507f1f77bcf86cd799439011")
    expect(res.status).toBe(401)
  })

  it("rejects a malformed product id with 400", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(fakeUser()) as never)

    const res = await request(app)
      .post("/api/wishlist/not-a-valid-id")
      .set("Cookie", `token=${userToken}`)

    expect(res.status).toBe(400)
  })

  it("404s when the product doesn't exist", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(fakeUser()) as never)
    jest.spyOn(ProductModel, "findById").mockResolvedValue(null as never)

    const res = await request(app)
      .post("/api/wishlist/507f1f77bcf86cd799439011")
      .set("Cookie", `token=${userToken}`)

    expect(res.status).toBe(404)
  })

  it("adds the product to the wishlist when not already present", async () => {
    const user = fakeUser([])
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(user) as never)
    jest.spyOn(ProductModel, "findById").mockResolvedValue({ _id: "507f1f77bcf86cd799439011" } as never)

    const res = await request(app)
      .post("/api/wishlist/507f1f77bcf86cd799439011")
      .set("Cookie", `token=${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.wishlist).toEqual(["507f1f77bcf86cd799439011"])
    expect(user.save).toHaveBeenCalled()
  })

  it("removes the product from the wishlist when already present", async () => {
    const user = fakeUser(["507f1f77bcf86cd799439011"])
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain(user) as never)
    jest.spyOn(ProductModel, "findById").mockResolvedValue({ _id: "507f1f77bcf86cd799439011" } as never)

    const res = await request(app)
      .post("/api/wishlist/507f1f77bcf86cd799439011")
      .set("Cookie", `token=${userToken}`)

    expect(res.status).toBe(200)
    expect(res.body.wishlist).toEqual([])
  })
})
