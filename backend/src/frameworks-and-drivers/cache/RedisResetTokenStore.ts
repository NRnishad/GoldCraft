import { env } from "../config/env";
import { del, expire, get, incr, setEx, ttl } from "./redisClient";

const normaliseEmail = (email: string): string => email.trim().toLowerCase();
const resetTokenKey = (hashedToken: string): string => `reset:${hashedToken}`;
const resetAttemptsKey = (email: string): string =>
  `reset_attempts:${normaliseEmail(email)}`;

/**
 * Receives hashed reset tokens, owner user ids, and requester email addresses.
 * Returns Redis-backed reads, writes, counters, and ttl values for password-reset state.
 * Forgot-password and reset-password flows depend on this store.
 */
export class RedisResetTokenStore {
  async setResetToken(hashedToken: string, userId: string): Promise<void> {
    await setEx(resetTokenKey(hashedToken), env.RESET_TOKEN_TTL_SECONDS, userId);
  }

  async getResetTokenOwner(hashedToken: string): Promise<string | null> {
    return get(resetTokenKey(hashedToken));
  }

  async deleteResetToken(hashedToken: string): Promise<void> {
    await del(resetTokenKey(hashedToken));
  }

  async incrementResetAttempts(email: string): Promise<number> {
    const key = resetAttemptsKey(email);
    const nextAttempts = await incr(key);

    if (nextAttempts === 1) {
      await expire(key, env.RESET_TOKEN_TTL_SECONDS);
    }

    return nextAttempts;
  }

  async getResetAttempts(email: string): Promise<number> {
    const storedAttempts = await get(resetAttemptsKey(email));
    return storedAttempts ? Number(storedAttempts) : 0;
  }

  async getTtl(
    subject: string,
    scope: "token" | "attempts" = "token",
  ): Promise<number> {
    const key =
      scope === "attempts" ? resetAttemptsKey(subject) : resetTokenKey(subject);

    return ttl(key);
  }
}

export default RedisResetTokenStore;
