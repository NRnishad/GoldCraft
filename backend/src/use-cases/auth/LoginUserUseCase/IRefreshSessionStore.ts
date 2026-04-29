import { UserRole } from "@entities/User";

export interface ILoginRefreshSessionStore {
  save(session: {
    sessionId: string;
    userId: string;
    role: UserRole;
  }): Promise<void>;
}