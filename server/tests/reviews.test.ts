import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import request from "supertest"
import { app } from "../src/app.js"
import { ProductModel } from "../src/models/Product.js"
import { ReviewModel } from "../src/models/Review.js"
import { UserModel } from "../src/models/User.js"
import { signToken } from "../src/utils/token.js"
import { mockQueryChain } from "./helpers.js"

const userToken = signToken({ userId: "user1", role: "user" })

describe("GET /api/products/:slug/reviews", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("lists reviews for a product", async () => {
    jest.spyOn(ProductModel, "findOne").mockReturnValue(mockQueryChain({ _id: "p1" }) as never)
    jest.spyOn(ReviewModel, "find").mockReturnValue(
      mockQueryChain([{ _id: "r1", rating: 5, comment: "Great!" }]) as never,
    )

    const res = await request(app).get("/api/products/granite-large/reviews")
    expect(res.status).toBe(200)
    expect(res.body.reviews).toHaveLength(1)
  })

  it("404s for an unknown product slug", async () => {
    jest.spyOn(ProductModel, "findOne").mockReturnValue(mockQueryChain(null) as never)

    const res = await request(app).get("/api/products/nope/reviews")
    expect(res.status).toBe(404)
  })
})

describe("POST /api/products/:slug/reviews", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("rejects unauthenticated requests with 401", async () => {
    const res = await request(app)
      .post("/api/products/granite-large/reviews")
      .send({ rating: 5, comment: "Great" })

    expect(res.status).toBe(401)
  })

  it("rejects an invalid rating with 400", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain({ id: "user1", role: "user" }) as never)

    const res = await request(app)
      .post("/api/products/granite-large/reviews")
      .set("Cookie", `token=${userToken}`)
      .send({ rating: 9, comment: "Great" })

    expect(res.status).toBe(400)
  })

  it("creates a review and recomputes the product's rating", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain({ id: "user1", role: "user" }) as never)
    jest.spyOn(ProductModel, "findOne").mockReturnValue(mockQueryChain({ _id: "p1" }) as never)
    jest.spyOn(ReviewModel, "findOne").mockResolvedValue(null as never)
    jest.spyOn(ReviewModel, "aggregate").mockResolvedValue([{ avgRating: 4.5, numReviews: 2 }] as never)
    const updateSpy = jest.spyOn(ProductModel, "findByIdAndUpdate").mockResolvedValue(null as never)
    jest.spyOn(ReviewModel, "create").mockResolvedValue({
      _id: "r1",
      rating: 5,
      comment: "Great!",
      populate: jest.fn().mockResolvedValue({ _id: "r1", rating: 5, comment: "Great!", user: { name: "Dan" } } as never),
    } as never)

    const res = await request(app)
      .post("/api/products/granite-large/reviews")
      .set("Cookie", `token=${userToken}`)
      .send({ rating: 5, comment: "Great!" })

    expect(res.status).toBe(201)
    expect(res.body.review.user.name).toBe("Dan")
    expect(updateSpy).toHaveBeenCalledWith("p1", { avgRating: 4.5, numReviews: 2 })
  })

  it("rejects a second review from the same user with 409", async () => {
    jest.spyOn(UserModel, "findById").mockReturnValue(mockQueryChain({ id: "user1", role: "user" }) as never)
    jest.spyOn(ProductModel, "findOne").mockReturnValue(mockQueryChain({ _id: "p1" }) as never)
    jest.spyOn(ReviewModel, "findOne").mockResolvedValue({ _id: "existing-review" } as never)

    const res = await request(app)
      .post("/api/products/granite-large/reviews")
      .set("Cookie", `token=${userToken}`)
      .send({ rating: 4, comment: "Another try" })

    expect(res.status).toBe(409)
  })
})
