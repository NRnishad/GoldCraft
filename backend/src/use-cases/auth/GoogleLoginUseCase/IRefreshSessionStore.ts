import { UserRole } from "@entities/User";

export interface IGoogleLoginRefreshSessionStore {
  save(session: {
    sessionId: string;
    userId: string;
    role: UserRole;
  }): Promise<void>;
}