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
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  REFRESH_SESSION_EXPIRES_SECONDS: Number(
  process.env.REFRESH_SESSION_EXPIRES_SECONDS || 604800,
  
),

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  EMAIL_USER: requireEnv("EMAIL_USER"),
  EMAIL_PASS: requireEnv("EMAIL_PASS"),

  UPSTASH_REDIS_REST_URL: requireEnv("UPSTASH_REDIS_REST_URL"),
  UPSTASH_REDIS_REST_TOKEN: requireEnv("UPSTASH_REDIS_REST_TOKEN"),

  EMAIL_OTP_EXPIRES_SECONDS: Number(
    process.env.EMAIL_OTP_EXPIRES_SECONDS || 600,
  ),
  GOOGLE_CLIENT_ID: requireEnv("GOOGLE_CLIENT_ID"),
GOOGLE_CLIENT_SECRET: requireEnv("GOOGLE_CLIENT_SECRET"),
GOOGLE_CALLBACK_URL: requireEnv("GOOGLE_CALLBACK_URL"),

AWS_ACCESS_KEY_ID: requireEnv("AWS_ACCESS_KEY_ID"),
AWS_SECRET_ACCESS_KEY: requireEnv("AWS_SECRET_ACCESS_KEY"),
AWS_S3_REGION: requireEnv("AWS_S3_REGION"),
AWS_S3_BUCKET_NAME: requireEnv("AWS_S3_BUCKET_NAME"),
};