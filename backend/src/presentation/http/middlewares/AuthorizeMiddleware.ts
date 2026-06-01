import { Response, NextFunction } from "express";
import { injectable } from "inversify";
import { AuthRequest } from "./AuthenticateMiddleware";
import { UserRole } from "@domain/entities/User.entity";
import { AppError } from "@application/errors/AppError";

@injectable()
export class AuthorizeMiddleware {
  public authorize = (allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
      }

      if (!allowedRoles.includes(req.user.role)) {
        return next(new AppError("You do not have permission to access this resource", 403, "FORBIDDEN"));
      }

      next();
    };
  };
}
