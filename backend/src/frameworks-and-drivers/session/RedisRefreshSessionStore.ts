import { Redis } from "@upstash/redis";
import { UserRole } from "@entities/User";
import { env } from "@drivers/config/env";

export interface RefreshSession {
  sessionId: string;
  userId: string;
  role: UserRole;
}

export class RedisRefreshSessionStore {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async save(session: RefreshSession): Promise<void> {
    await this.redis.set(this.key(session.sessionId), session, {
      ex: env.REFRESH_SESSION_EXPIRES_SECONDS,
    });
  }

  async get(sessionId: string): Promise<RefreshSession | null> {
    const session = await this.redis.get<RefreshSession>(this.key(sessionId));

    if (!session) {
      return null;
    }

    return session;
  }

  async delete(sessionId: string): Promise<void> {
    await this.redis.del(this.key(sessionId));
  }

  private key(sessionId: string): string {
    return `refresh-session:${sessionId}`;
  }
}