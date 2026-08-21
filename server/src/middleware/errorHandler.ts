import type { NextFunction, Request, Response } from "express"
import { Error as MongooseError } from "mongoose"

export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err

  if (err instanceof MongooseError.ValidationError) {
    return new ApiError(400, err.message)
  }

  if (err instanceof MongooseError.CastError) {
    return new ApiError(400, `Invalid ${err.path}: ${err.value}`)
  }

  if (err && typeof err === "object" && "code" in err && err.code === 11000) {
    const fields = Object.keys((err as { keyPattern?: object }).keyPattern ?? {})
    return new ApiError(409, `Duplicate value for: ${fields.join(", ") || "unique field"}`)
  }

  return new ApiError(500, err instanceof Error ? err.message : "Internal server error")
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  const apiError = toApiError(err)

  if (apiError.statusCode === 500) {
    console.error(err)
  }

  res.status(apiError.statusCode).json({
    error: {
      message: apiError.message,
    },
  })
}
