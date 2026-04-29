import { Redis } from "@upstash/redis";
import { env } from "@drivers/config/env";

export interface PasswordResetOtpStore {
  save(email: string, otp: string): Promise<void>;
  get(email: string): Promise<string | null>;
  delete(email: string): Promise<void>;
}

export class UpstashPasswordResetOtpStore implements PasswordResetOtpStore {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async save(email: string, otp: string): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);

    await this.redis.set(this.key(normalizedEmail), String(otp), {
      ex: env.EMAIL_OTP_EXPIRES_SECONDS,
    });
  }

  async get(email: string): Promise<string | null> {
    const normalizedEmail = this.normalizeEmail(email);

    const otp = await this.redis.get<string | number>(
      this.key(normalizedEmail),
    );

    if (otp === null || otp === undefined) {
      return null;
    }

    return String(otp);
  }

  async delete(email: string): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);

    await this.redis.del(this.key(normalizedEmail));
  }

  private key(email: string): string {
    return `password-reset:${email}`;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}