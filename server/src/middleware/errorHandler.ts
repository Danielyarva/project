import type { NextFunction, Request, Response } from "express"

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

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500
  const message = err instanceof Error ? err.message : "Internal server error"

  if (statusCode === 500) {
    console.error(err)
  }

  res.status(statusCode).json({
    error: {
      message,
    },
  })
}
