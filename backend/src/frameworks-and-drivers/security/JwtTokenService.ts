import jwt from "jsonwebtoken";
import { ITokenService } from "@use-cases/auth/LoginUserUseCase/ITokenService";
import { UserRole } from "@entities/User";
import { env } from "../config/env";

export class JwtTokenService implements ITokenService {
  signAccessToken(payload: { userId: string; role: UserRole }): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  verifyAccessToken(token: string): { userId: string; role: UserRole } {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      userId: string;
      role: UserRole;
    };
  }
}