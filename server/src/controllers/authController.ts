import bcrypt from "bcryptjs"
import type { Request, Response } from "express"
import { UserModel } from "../models/User.js"
import { clearAuthCookie, setAuthCookie, signToken } from "../utils/token.js"
import { ApiError } from "../middleware/errorHandler.js"

const SALT_ROUNDS = 12

function toPublicUser(user: { id: string; name: string; email: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body

  const existing = await UserModel.findOne({ email })
  if (existing) {
    throw new ApiError(409, "An account with this email already exists")
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await UserModel.create({ name, email, password: hashedPassword })

  const token = signToken({ userId: user.id, role: user.role as "user" | "admin" })
  setAuthCookie(res, token)

  res.status(201).json({ user: toPublicUser(user) })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  const user = await UserModel.findOne({ email })
  if (!user) {
    throw new ApiError(401, "Invalid email or password")
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password")
  }

  const token = signToken({ userId: user.id, role: user.role as "user" | "admin" })
  setAuthCookie(res, token)

  res.json({ user: toPublicUser(user) })
}

export async function logout(req: Request, res: Response) {
  clearAuthCookie(res)
  res.status(204).send()
}

export async function getMe(req: Request, res: Response) {
  const user = await UserModel.findById(req.user!.id)
  if (!user) {
    throw new ApiError(401, "User no longer exists")
  }
  res.json({ user: toPublicUser(user) })
}
