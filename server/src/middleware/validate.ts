import type { NextFunction, Request, Response } from "express"
import type { ZodType } from "zod"
import { ApiError } from "./errorHandler.js"

function formatIssues(error: { issues: { path: PropertyKey[]; message: string }[] }): string {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")
}

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      throw new ApiError(400, formatIssues(result.error))
    }
    req.body = result.data
    next()
  }
}

export function validateParams(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params)
    if (!result.success) {
      throw new ApiError(400, formatIssues(result.error))
    }
    next()
  }
}
