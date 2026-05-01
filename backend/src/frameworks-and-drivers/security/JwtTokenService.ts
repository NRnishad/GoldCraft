import jwt from "jsonwebtoken";
import { ITokenService } from "@use-cases/auth/LoginUserUseCase/ITokenService";
import { IRefreshTokenService } from "@use-cases/auth/RefreshTokenUseCase/ITokenService";
import { IGoogleLoginTokenService } from "@use-cases/auth/GoogleLoginUseCase/ITokenService";
import { ILogoutTokenService } from "@use-cases/auth/LogoutUseCase/ITokenService";
import { UserRole } from "@entities/User";
import { env } from "@drivers/config/env";

export class JwtTokenService
  implements ITokenService, IRefreshTokenService, ILogoutTokenService,  IGoogleLoginTokenService
{
  signAccessToken(payload: { userId: string; role: UserRole }): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  signRefreshToken(payload: {
    userId: string;
    role: UserRole;
    sessionId: string;
  }): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
  }

  verifyAccessToken(token: string): { userId: string; role: UserRole } {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      userId: string;
      role: UserRole;
    };
  }

  verifyRefreshToken(token: string): {
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