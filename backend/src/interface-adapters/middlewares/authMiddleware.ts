import { NextFunction, Request, Response } from "express";
import { JwtTokenService } from "@drivers/security/JwtTokenService";
import { AppError } from "../utils/AppError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "jeweller" | "admin";
  };
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];

  try {
    const tokenService = new JwtTokenService();
    const payload = tokenService.verifyAccessToken(token);

    req.user = payload;

    next();
  } catch {
    throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
  }
}