import Redis from "ioredis";
import { env } from "../config/env";

const redisClient = new Redis(env.REDIS_URL, {
  lazyConnect: true,
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

const ensureRedisConnection = async (): Promise<void> => {
  if (redisClient.status === "wait") {
    await redisClient.connect();
  }
};


export async function setEx(
  key: string,
  ttlSeconds: number,
  value: string,
): Promise<void> {
  await ensureRedisConnection();
  await redisClient.setex(key, ttlSeconds, value);
}


export async function get(key: string): Promise<string | null> {
  await ensureRedisConnection();
  return redisClient.get(key);
}


export async function del(key: string): Promise<void> {
  await ensureRedisConnection();
  await redisClient.del(key);
}


export async function incr(key: string): Promise<number> {
  await ensureRedisConnection();
  return redisClient.incr(key);
}


export async function expire(key: string, ttlSeconds: number): Promise<void> {
  await ensureRedisConnection();
  await redisClient.expire(key, ttlSeconds);
}


export async function ttl(key: string): Promise<number> {
  await ensureRedisConnection();
  return redisClient.ttl(key);
}


export async function keys(pattern: string): Promise<string[]> {
  await ensureRedisConnection();
  return redisClient.keys(pattern);
}

export default redisClient;
