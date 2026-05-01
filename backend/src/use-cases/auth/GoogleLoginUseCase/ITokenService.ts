import { UserRole } from "@entities/User";

export interface IGoogleLoginTokenService {
  signAccessToken(payload: {
    userId: string;
    role: UserRole;
  }): string;

  signRefreshToken(payload: {
    userId: string;
    role: UserRole;
    sessionId: string;
  }): string;
}