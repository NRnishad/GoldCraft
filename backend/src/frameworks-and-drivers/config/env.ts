import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(5001),
  MONGODB_URI: z
    .string()
    .min(1)
    .default("mongodb://localhost:27017/goldcraft"),
  JWT_SECRET: z.string().min(10).default("change-this-secret"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);


