import { Redis } from "@upstash/redis";
import { injectable } from "inversify";
import { IPasswordResetOtpStore } from "@application/interfaces/IPasswordResetOtpStore";
import { OtpData } from "@application/interfaces/IEmailOtpStore";
import { env } from "@config/env";

@injectable()
export class UpstashPasswordResetOtpStore implements IPasswordResetOtpStore {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  public async save(email: string, otp: string): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);
    const data: OtpData = {
      otp,
      createdAt: Date.now(),
    };

    await this.redis.set(this.key(normalizedEmail), JSON.stringify(data), {
      ex: env.EMAIL_OTP_EXPIRES_SECONDS,
    });
  }

  public async get(email: string): Promise<OtpData | null> {
    const normalizedEmail = this.normalizeEmail(email);
    const value = await this.redis.get<string | object>(this.key(normalizedEmail));

    if (!value) {
      return null;
    }

    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      if (parsed && typeof parsed === "object" && "otp" in parsed && "createdAt" in parsed) {
        return parsed as OtpData;
      }
    } catch {
      // Fallback in case of raw string format migration
      if (typeof value === "string") {
        return { otp: value, createdAt: Date.now() };
      }
    }

    return null;
  }

  public async delete(email: string): Promise<void> {
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
