import { UserRole } from "@entities/User";

export interface IRefreshTokenSessionStore {
  get(sessionId: string): Promise<{
    sessionId: string;
    userId: string;
    role: UserRole;
  } | null>;
}