import { Redis } from "@upstash/redis";
import { env } from "@config/env";

export async function checkRedisConnection(): Promise<void> {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  await redis.ping();
}
