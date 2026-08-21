import type { Response } from "express"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"

const COOKIE_NAME = "token"
const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export interface JwtPayload {
  userId: string
  role: "user" | "admin"
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "30d" })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: COOKIE_MAX_AGE_MS,
  })
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
  })
}

export function getAuthCookieName(): string {
  return COOKIE_NAME
}
