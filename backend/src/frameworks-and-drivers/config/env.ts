import "dotenv/config";
import { z } from "zod";

const requiredString = (key: string) =>
  z.preprocess(
    (value) => (value == null ? "" : value),
    z.string().trim().min(1, `${key} is required.`),
  );

const requiredPositiveInt = (key: string) =>
  requiredString(key)
    .refine((value) => !Number.isNaN(Number(value)), `${key} must be a number.`)
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value), `${key} must be an integer.`)
    .refine((value) => value > 0, `${key} must be greater than 0.`);

const envSchema = z.object({
  MONGODB_URI: requiredString("MONGODB_URI"),
  REDIS_URL: requiredString("REDIS_URL"),
  AWS_ACCESS_KEY_ID: requiredString("AWS_ACCESS_KEY_ID"),
  AWS_SECRET_ACCESS_KEY: requiredString("AWS_SECRET_ACCESS_KEY"),
  AWS_BUCKET_NAME: requiredString("AWS_BUCKET_NAME"),
  AWS_REGION: requiredString("AWS_REGION"),
  STRIPE_SECRET_KEY: requiredString("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: requiredString("STRIPE_WEBHOOK_SECRET"),
  STRIPE_REFERRAL_COUPON_ID: requiredString("STRIPE_REFERRAL_COUPON_ID"),
  FIREBASE_SERVICE_ACCOUNT_JSON: requiredString("FIREBASE_SERVICE_ACCOUNT_JSON"),
  SMTP_HOST: requiredString("SMTP_HOST"),
  SMTP_PORT: requiredPositiveInt("SMTP_PORT"),
  SMTP_USER: requiredString("SMTP_USER"),
  SMTP_PASS: requiredString("SMTP_PASS"),
  SMTP_FROM: requiredString("SMTP_FROM"),
  GROQ_API_KEY: requiredString("GROQ_API_KEY"),
  GEMINI_API_KEY: requiredString("GEMINI_API_KEY"),
  REPLICATE_API_TOKEN: requiredString("REPLICATE_API_TOKEN"),
  WHATSAPP_APP_SECRET: requiredString("WHATSAPP_APP_SECRET"),
  INSTAGRAM_APP_SECRET: requiredString("INSTAGRAM_APP_SECRET"),
  JWT_ACCESS_SECRET: requiredString("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: requiredString("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRY: requiredString("JWT_ACCESS_EXPIRY"),
  JWT_REFRESH_EXPIRY: requiredString("JWT_REFRESH_EXPIRY"),
  CORS_ORIGIN: requiredString("CORS_ORIGIN"),
  PORT: requiredPositiveInt("PORT"),
  NODE_ENV: z
    .preprocess(
      (value) => (value == null ? "" : value),
      z.string().trim().min(1, "NODE_ENV is required."),
    )
    .refine(
      (value) =>
        value === "development" || value === "test" || value === "production",
      "NODE_ENV must be development, test, or production.",
    ),
  OTP_TTL_SECONDS: requiredPositiveInt("OTP_TTL_SECONDS"),
  OTP_MAX_ATTEMPTS: requiredPositiveInt("OTP_MAX_ATTEMPTS"),
  RESET_TOKEN_TTL_SECONDS: requiredPositiveInt("RESET_TOKEN_TTL_SECONDS"),
  RESET_MAX_ATTEMPTS: requiredPositiveInt("RESET_MAX_ATTEMPTS"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedIssues = parsedEnv.error.issues
    .map((issue) => {
      const key = issue.path.join(".") || "process.env";
      return `- ${key}: ${issue.message}`;
    })
    .join("\n");

  throw new Error(`Environment validation failed.\n${formattedIssues}`);
}

export const env = parsedEnv.data;

export type Env = typeof env;
