import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import request from "supertest"
import { app } from "../src/app.js"
import { stripe } from "../src/config/stripe.js"
import { OrderModel } from "../src/models/Order.js"
import { ProductModel } from "../src/models/Product.js"

describe("POST /api/orders", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("rejects an empty cart with 400", async () => {
    const res = await request(app).post("/api/orders").send({ items: [] })
    expect(res.status).toBe(400)
  })

  it("recomputes price from the database rather than trusting the client", async () => {
    // Client tries to claim a price of $1 for a product that actually costs $68.
    jest.spyOn(ProductModel, "find").mockResolvedValue([
      { _id: "p1", slug: "granite-large", name: "Granite Mortar", size: "Large", price: 68, stock: 5 },
    ] as never)

    const fakeOrder = { id: "order1", save: jest.fn(), stripeSessionId: undefined as string | undefined }
    jest.spyOn(OrderModel, "create").mockResolvedValue(fakeOrder as never)

    const createSessionSpy = jest
      .spyOn(stripe.checkout.sessions, "create")
      .mockResolvedValue({ id: "cs_test_123", url: "https://checkout.stripe.com/fake" } as never)

    const res = await request(app)
      .post("/api/orders")
      .send({ items: [{ slug: "granite-large", quantity: 1, price: 1 }] })

    expect(res.status).toBe(201)
    expect(res.body.url).toBe("https://checkout.stripe.com/fake")

    // The Stripe line item must reflect the DB price ($68 -> 6800 cents), not the client's $1.
    const call = createSessionSpy.mock.calls[0][0] as { line_items: { price_data: { unit_amount: number } }[] }
    expect(call.line_items[0].price_data.unit_amount).toBe(6800)
    expect(fakeOrder.stripeSessionId).toBe("cs_test_123")
    expect(fakeOrder.save).toHaveBeenCalled()
  })

  it("rejects a quantity that exceeds stock with 400, before creating a Stripe session", async () => {
    jest.spyOn(ProductModel, "find").mockResolvedValue([
      { _id: "p1", slug: "granite-large", name: "Granite Mortar", size: "Large", price: 68, stock: 1 },
    ] as never)
    const createOrderSpy = jest.spyOn(OrderModel, "create")
    const createSessionSpy = jest.spyOn(stripe.checkout.sessions, "create")

    const res = await request(app)
      .post("/api/orders")
      .send({ items: [{ slug: "granite-large", quantity: 5 }] })

    expect(res.status).toBe(400)
    expect(res.body.error.message).toMatch(/not enough stock/i)
    expect(createOrderSpy).not.toHaveBeenCalled()
    expect(createSessionSpy).not.toHaveBeenCalled()
  })

  it("rejects an unknown product slug with 400", async () => {
    jest.spyOn(ProductModel, "find").mockResolvedValue([] as never)

    const res = await request(app)
      .post("/api/orders")
      .send({ items: [{ slug: "does-not-exist", quantity: 1 }] })

    expect(res.status).toBe(400)
    expect(res.body.error.message).toMatch(/not found/i)
  })
})

describe("GET /api/orders/session/:sessionId", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("returns the order for a known session id", async () => {
    jest.spyOn(OrderModel, "findOne").mockReturnValue({
      populate: jest.fn().mockResolvedValue({ _id: "order1", status: "paid", total: 68 } as never),
    } as never)

    const res = await request(app).get("/api/orders/session/cs_test_123")
    expect(res.status).toBe(200)
    expect(res.body.order.status).toBe("paid")
  })

  it("404s for an unknown session id", async () => {
    jest.spyOn(OrderModel, "findOne").mockReturnValue({
      populate: jest.fn().mockResolvedValue(null as never),
    } as never)

    const res = await request(app).get("/api/orders/session/cs_does_not_exist")
    expect(res.status).toBe(404)
  })
})
