import { del, get, keys, setEx } from "./redisClient";

const refreshKey = (userId: string, jti: string): string =>
  `refresh:${userId}:${jti}`;


export class RedisTokenStore {
  async setRefreshTokenMarker(
    userId: string,
    jti: string,
    ttlSeconds: number,
  ): Promise<void> {
    await setEx(refreshKey(userId, jti), ttlSeconds, "1");
  }

  async getRefreshTokenMarker(
    userId: string,
    jti: string,
  ): Promise<string | null> {
    return get(refreshKey(userId, jti));
  }

  async deleteRefreshTokenMarker(userId: string, jti: string): Promise<void> {
    await del(refreshKey(userId, jti));
  }

  async deleteAllRefreshTokenMarkers(userId: string): Promise<void> {
    const matchingKeys = await keys(`refresh:${userId}:*`);

    if (matchingKeys.length === 0) {
      return;
    }

    await Promise.all(matchingKeys.map((key) => del(key)));
  }
}

export default RedisTokenStore;
