import { UserRole } from "@domain/entities/User.entity";

export interface RefreshSession {
  sessionId: string;
  userId: string;
  role: UserRole;
}

export interface IRefreshSessionStore {
  save(session: RefreshSession): Promise<void>;
  get(sessionId: string): Promise<RefreshSession | null>;
  delete(sessionId: string): Promise<void>;
}
