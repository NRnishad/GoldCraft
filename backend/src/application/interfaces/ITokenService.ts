import { UserRole } from "@domain/entities/User.entity";

export interface ITokenService {
  signAccessToken(payload: { userId: string; role: UserRole }): string;
  signRefreshToken(payload: { userId: string; role: UserRole; sessionId: string }): string;
  verifyAccessToken(token: string): { userId: string; role: UserRole };
  verifyRefreshToken(token: string): { userId: string; role: UserRole; sessionId: string };
}
