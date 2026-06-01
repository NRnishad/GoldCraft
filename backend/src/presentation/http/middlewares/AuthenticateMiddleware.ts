import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@di/types.di";
import { ITokenService } from "@application/interfaces/ITokenService";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { AppError } from "@application/errors/AppError";
import { UserRole } from "@domain/entities/User.entity";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
    isEmailVerified: boolean;
  };
}

@injectable()
export class AuthenticateMiddleware {
  constructor(
    @inject(TYPES.ITokenService)
    private readonly tokenService: ITokenService,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  public authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      let token: string | undefined;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
      }

      if (!token) {
        throw new AppError("Authentication token is missing", 401, "UNAUTHORIZED");
      }

      const payload = this.tokenService.verifyAccessToken(token);
      
      const userResult = await this.userRepository.findById(payload.userId);
      if (userResult.isFailure || !userResult.getValue()) {
        throw new AppError("User account not found", 401, "UNAUTHORIZED");
      }

      const user = userResult.getValue()!;

      // Inform users blocking while logged in in real-time
      if (!user.getIsActive()) {
        throw new AppError("Your account is blocked. Please contact the administrator.", 403, "USER_BLOCKED");
      }

      req.user = {
        userId: user.getId(),
        role: user.getRole(),
        isEmailVerified: user.getIsEmailVerified(),
      };

      next();
    } catch (err: any) {
      if (err instanceof AppError) {
        return next(err);
      }
      return next(new AppError("Invalid or expired authentication token", 401, "INVALID_TOKEN"));
    }
  };
}
