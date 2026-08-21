import type { NextFunction, Request, Response } from "express"
import { UserModel } from "../models/User.js"
import { getAuthCookieName, verifyToken } from "../utils/token.js"
import { ApiError } from "./errorHandler.js"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: "user" | "admin"
      }
    }
  }
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[getAuthCookieName()]
  if (!token) {
    throw new ApiError(401, "Not authenticated")
  }

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    throw new ApiError(401, "Invalid or expired session")
  }

  const user = await UserModel.findById(payload.userId).select("_id role")
  if (!user) {
    throw new ApiError(401, "User no longer exists")
  }

  req.user = { id: user.id, role: user.role as "user" | "admin" }
  next()
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Admin access required")
  }
  next()
}
