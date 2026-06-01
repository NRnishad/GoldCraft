import { Redis } from "@upstash/redis";
import { injectable } from "inversify";
import { IRefreshSessionStore, RefreshSession } from "@application/interfaces/IRefreshSessionStore";
import { env } from "@config/env";

@injectable()
export class RedisRefreshSessionStore implements IRefreshSessionStore {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  public async save(session: RefreshSession): Promise<void> {
    await this.redis.set(this.key(session.sessionId), session, {
      ex: env.REFRESH_SESSION_EXPIRES_SECONDS,
    });
  }

  public async get(sessionId: string): Promise<RefreshSession | null> {
    const session = await this.redis.get<RefreshSession>(this.key(sessionId));

    if (!session) {
      return null;
    }

    return session;
  }

  public async delete(sessionId: string): Promise<void> {
    await this.redis.del(this.key(sessionId));
  }

  private key(sessionId: string): string {
    return `refresh-session:${sessionId}`;
  }
}
