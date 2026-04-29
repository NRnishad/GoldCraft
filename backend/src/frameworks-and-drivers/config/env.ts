import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: requireEnv("MONGO_URI"),

  JWT_ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET"),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  EMAIL_USER: requireEnv("EMAIL_USER"),
  EMAIL_PASS: requireEnv("EMAIL_PASS"),

  UPSTASH_REDIS_REST_URL: requireEnv("UPSTASH_REDIS_REST_URL"),
  UPSTASH_REDIS_REST_TOKEN: requireEnv("UPSTASH_REDIS_REST_TOKEN"),

  EMAIL_OTP_EXPIRES_SECONDS: Number(
    process.env.EMAIL_OTP_EXPIRES_SECONDS || 600,
  ),
};