import rateLimit from "express-rate-limit"

function createRateLimiter(limit: number) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { message: "Too many attempts, please try again later." } },
  })
}

export const authLimiter = createRateLimiter(20)
export const contactLimiter = createRateLimiter(5)
