import { UserRole } from "@entities/User";

export interface ITokenService {
  signAccessToken(payload: {
    userId: string;
    role: UserRole;
  }): string;
}