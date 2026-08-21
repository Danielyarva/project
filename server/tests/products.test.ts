import { beforeEach, describe, expect, it, jest } from "@jest/globals"

jest.unstable_mockModule("../src/services/cloudinaryService.js", () => ({
  uploadProductImage: jest.fn(),
  uploadProductImages: jest.fn(async () => ["https://cloudinary.example/img.jpg"]),
}))

const { app } = await import("../src/app.js")
const { ProductModel } = await import("../src/models/Product.js")
const { UserModel } = await import("../src/models/User.js")
const { signToken } = await import("../src/utils/token.js")
const { mockQueryChain } = await import("./helpers.js")
const request = (await import("supertest")).default

const adminToken = signToken({ userId: "admin1", role: "admin" })
const userToken = signToken({ userId: "user1", role: "user" })

describe("GET /api/products", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("returns products, unauthenticated", async () => {
    jest.spyOn(ProductModel, "find").mockReturnValue(mockQueryChain([{ _id: "p1", name: "A" }]) as never)

    const res = await request(app).get("/api/products")
    expect(res.status).toBe(200)
    expect(res.body.products).toHaveLength(1)
  })
})

describe("GET /api/products/:slug", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("returns the product with groupSlug siblings", async () => {
    const product = { _id: "p1", slug: "granite-large", groupSlug: "granite" }
    jest.spyOn(ProductModel, "findOne").mockResolvedValue(product as never)
    jest.spyOn(ProductModel, "find").mockReturnValue(
      mockQueryChain([{ _id: "p2", slug: "granite-small", groupSlug: "granite" }]) as never,
    )

    const res = await request(app).get("/api/products/granite-large")
    expect(res.status).toBe(200)
    expect(res.body.product.slug).toBe("granite-large")
    expect(res.body.siblings).toHaveLength(1)
  })

  it("404s when the product doesn't exist", async () => {
    jest.spyOn(ProductModel, "findOne").mockResolvedValue(null as never)

    const res = await request(app).get("/api/products/does-not-exist")
    expect(res.status).toBe(404)
  })
})

describe("POST /api/admin/products", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("rejects unauthenticated requests with 401", async () => {
    const res = await request(app).post("/api/admin/products")
    expect(res.status).toBe(401)
  })

  it("rejects non-admin users with 403", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain({ id: "user1", role: "user" }) as never)

    const res = await request(app)
      .post("/api/admin/products")
      .set("Cookie", `token=${userToken}`)
      .field("name", "Test")
      .field("size", "Large")
      .field("price", "50")
      .attach("images", Buffer.from("fake-image"), "test.jpg")

    expect(res.status).toBe(403)
  })

  it("rejects a request with no images with 400", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain({ id: "admin1", role: "admin" }) as never)

    const res = await request(app)
      .post("/api/admin/products")
      .set("Cookie", `token=${adminToken}`)
      .field("name", "Test")
      .field("size", "Large")
      .field("price", "50")

    expect(res.status).toBe(400)
  })

  it("creates a product and auto-generates a unique slug", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain({ id: "admin1", role: "admin" }) as never)
    jest.spyOn(ProductModel, "exists").mockResolvedValue(null as never)
    const createSpy = jest
      .spyOn(ProductModel, "create")
      .mockResolvedValue({ _id: "p1", name: "Granite Mortar", slug: "granite-mortar-large" } as never)

    const res = await request(app)
      .post("/api/admin/products")
      .set("Cookie", `token=${adminToken}`)
      .field("name", "Granite Mortar")
      .field("size", "Large")
      .field("price", "68")
      .attach("images", Buffer.from("fake-image"), "test.jpg")

    expect(res.status).toBe(201)
    expect(res.body.product.slug).toBe("granite-mortar-large")
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Granite Mortar",
        groupSlug: "granite-mortar",
        slug: "granite-mortar-large",
        images: ["https://cloudinary.example/img.jpg"],
      }),
    )
  })

  it("appends a numeric suffix when the slug already exists", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain({ id: "admin1", role: "admin" }) as never)
    jest
      .spyOn(ProductModel, "exists")
      .mockResolvedValueOnce({ _id: "existing" } as never)
      .mockResolvedValueOnce(null as never)
    const createSpy = jest.spyOn(ProductModel, "create").mockResolvedValue({ slug: "granite-mortar-large-2" } as never)

    const res = await request(app)
      .post("/api/admin/products")
      .set("Cookie", `token=${adminToken}`)
      .field("name", "Granite Mortar")
      .field("size", "Large")
      .field("price", "68")
      .attach("images", Buffer.from("fake-image"), "test.jpg")

    expect(res.status).toBe(201)
    expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ slug: "granite-mortar-large-2" }))
  })
})

describe("DELETE /api/admin/products/:id", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("deletes a product as admin", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain({ id: "admin1", role: "admin" }) as never)
    jest.spyOn(ProductModel, "findByIdAndDelete").mockResolvedValue({ _id: "p1" } as never)

    const res = await request(app)
      .delete("/api/admin/products/507f1f77bcf86cd799439011")
      .set("Cookie", `token=${adminToken}`)

    expect(res.status).toBe(204)
  })

  it("404s when the product doesn't exist", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain({ id: "admin1", role: "admin" }) as never)
    jest.spyOn(ProductModel, "findByIdAndDelete").mockResolvedValue(null as never)

    const res = await request(app)
      .delete("/api/admin/products/507f1f77bcf86cd799439011")
      .set("Cookie", `token=${adminToken}`)

    expect(res.status).toBe(404)
  })

  it("rejects a malformed id with 400", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain({ id: "admin1", role: "admin" }) as never)

    const res = await request(app)
      .delete("/api/admin/products/not-a-valid-id")
      .set("Cookie", `token=${adminToken}`)

    expect(res.status).toBe(400)
  })
})
