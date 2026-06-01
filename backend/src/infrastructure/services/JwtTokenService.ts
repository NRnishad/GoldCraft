import jwt from "jsonwebtoken";
import { injectable } from "inversify";
import { ITokenService } from "@application/interfaces/ITokenService";
import { UserRole } from "@domain/entities/User.entity";
import { env } from "@config/env";

@injectable()
export class JwtTokenService implements ITokenService {
  public signAccessToken(payload: { userId: string; role: UserRole }): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    });
  }

  public signRefreshToken(payload: {
    userId: string;
    role: UserRole;
    sessionId: string;
  }): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });
  }

  public verifyAccessToken(token: string): { userId: string; role: UserRole } {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      userId: string;
      role: UserRole;
    };
  }

  public verifyRefreshToken(token: string): {
    userId: string;
    role: UserRole;
    sessionId: string;
  } {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as {
      userId: string;
      role: UserRole;
      sessionId: string;
    };
  }
}
