import { UserRole } from "@entities/User";

export interface ILogoutTokenService {
  verifyRefreshToken(token: string): {
    userId: string;
    role: UserRole;
    sessionId: string;
  };
}