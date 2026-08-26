import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import bcrypt from "bcryptjs"
import request from "supertest"
import { app } from "../src/app.js"
import { UserModel } from "../src/models/User.js"
import { mockQueryChain } from "./helpers.js"

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("creates a user and sets an auth cookie", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue(null as never)
    jest.spyOn(UserModel, "create").mockResolvedValue({
      id: "u1",
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "user",
    } as never)

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Ada Lovelace", email: "ada@example.com", password: "hunter22" })

    expect(res.status).toBe(201)
    expect(res.body.user).toEqual({
      id: "u1",
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "user",
    })
    expect(res.headers["set-cookie"]?.[0]).toMatch(/^token=/)
  })

  it("rejects a duplicate email with 409", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue({ id: "existing" } as never)

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Ada", email: "ada@example.com", password: "hunter22" })

    expect(res.status).toBe(409)
  })

  it("rejects an invalid body with 400 before touching the database", async () => {
    const findOneSpy = jest.spyOn(UserModel, "findOne")

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "", email: "not-an-email", password: "123" })

    expect(res.status).toBe(400)
    expect(findOneSpy).not.toHaveBeenCalled()
  })
})

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("logs in with correct credentials", async () => {
    const hashed = await bcrypt.hash("hunter22", 4)
    jest.spyOn(UserModel, "findOne").mockResolvedValue({
      id: "u1",
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "user",
      password: hashed,
    } as never)

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ada@example.com", password: "hunter22" })

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe("ada@example.com")
    expect(res.headers["set-cookie"]?.[0]).toMatch(/^token=/)
  })

  it("rejects a wrong password with 401", async () => {
    const hashed = await bcrypt.hash("hunter22", 4)
    jest.spyOn(UserModel, "findOne").mockResolvedValue({
      id: "u1",
      email: "ada@example.com",
      role: "user",
      password: hashed,
    } as never)

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ada@example.com", password: "wrong-password" })

    expect(res.status).toBe(401)
  })

  it("rejects an unknown email with 401 (not a 404 that would leak account existence)", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue(null as never)

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "hunter22" })

    expect(res.status).toBe(401)
  })
})

describe("GET /api/auth/me (protect middleware)", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("returns 401 with no cookie", async () => {
    const res = await request(app).get("/api/auth/me")
    expect(res.status).toBe(401)
  })

  it("returns the user when the cookie is valid", async () => {
    jest
      .spyOn(UserModel, "findById")
      .mockReturnValueOnce(mockQueryChain({ id: "u1", role: "user" }) as never)
      .mockResolvedValueOnce({
        id: "u1",
        name: "Ada Lovelace",
        email: "ada@example.com",
        role: "user",
      } as never)

    const { signToken } = await import("../src/utils/token.js")
    const token = signToken({ userId: "u1", role: "user" })

    const res = await request(app).get("/api/auth/me").set("Cookie", `token=${token}`)

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe("ada@example.com")
  })
})
