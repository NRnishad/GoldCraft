import { UserRole } from "@entities/User";

export interface IRefreshTokenService {
  verifyRefreshToken(token: string): {
    userId: string;
    role: UserRole;
    sessionId: string;
  };

  signAccessToken(payload: {
    userId: string;
    role: UserRole;
  }): string;
}