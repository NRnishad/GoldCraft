import type { Response, NextFunction } from "express";
import { verifyAccessToken } from "../../frameworks-and-drivers/security/JwtService";
import type { AuthRequest } from "../types/AuthRequest";
import { AppError } from "../utils/AppError";

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
  }

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    next(new AppError("Invalid access token", 401, "INVALID_ACCESS_TOKEN"));
  }
}

