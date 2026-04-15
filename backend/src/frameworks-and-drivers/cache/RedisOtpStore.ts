import { env } from "../config/env";
import { del, expire, get, incr, setEx, ttl } from "./redisClient";

const OTP_RESEND_WINDOW_SECONDS = 60 * 60;

const normaliseEmail = (email: string): string => email.trim().toLowerCase();
const otpKey = (email: string): string => `otp:${normaliseEmail(email)}`;
const attemptsKey = (email: string): string =>
  `otp_attempts:${normaliseEmail(email)}`;
const resendKey = (email: string): string => `otp_resend:${normaliseEmail(email)}`;

/**
 * Receives auth identifiers such as email addresses and OTP codes.
 * Returns Redis-backed reads, writes, counters, and ttl values for verification state.
 * Register, verify-email, and resend-verification flows depend on this store.
 */
export class RedisOtpStore {
  async setOtp(email: string, code: string): Promise<void> {
    await setEx(otpKey(email), env.OTP_TTL_SECONDS, code);
  }

  async getOtp(email: string): Promise<string | null> {
    return get(otpKey(email));
  }

  async deleteOtp(email: string): Promise<void> {
    await del(otpKey(email));
  }

  async incrementAttempts(email: string): Promise<number> {
    const key = attemptsKey(email);
    const nextAttempts = await incr(key);

    if (nextAttempts === 1) {
      await expire(key, env.OTP_TTL_SECONDS);
    }

    return nextAttempts;
  }

  async getAttempts(email: string): Promise<number> {
    const storedAttempts = await get(attemptsKey(email));
    return storedAttempts ? Number(storedAttempts) : 0;
  }

  async resetAttempts(email: string): Promise<void> {
    await del(attemptsKey(email));
  }

  async incrementResendCount(email: string): Promise<number> {
    const key = resendKey(email);
    const nextCount = await incr(key);

    if (nextCount === 1) {
      await expire(key, OTP_RESEND_WINDOW_SECONDS);
    }

    return nextCount;
  }

  async getResendCount(email: string): Promise<number> {
    const storedCount = await get(resendKey(email));
    return storedCount ? Number(storedCount) : 0;
  }

  async getTtl(email: string): Promise<number> {
    return ttl(otpKey(email));
  }
}

export default RedisOtpStore;
