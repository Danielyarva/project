import "dotenv/config"

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required("MONGO_URI"),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  jwtSecret: required("JWT_SECRET"),
  cloudinary: {
    cloudName: required("CLOUDINARY_CLOUD_NAME"),
    apiKey: required("CLOUDINARY_API_KEY"),
    apiSecret: required("CLOUDINARY_API_SECRET"),
  },
  email: {
    resendApiKey: required("RESEND_API_KEY"),
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    contactNotifyTo: required("CONTACT_NOTIFY_EMAIL"),
  },
  stripe: {
    secretKey: required("STRIPE_SECRET_KEY"),
    webhookSecret: required("STRIPE_WEBHOOK_SECRET"),
  },
}
