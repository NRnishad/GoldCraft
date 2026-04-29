import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";
import { AppError } from "../utils/AppError";

export function adminMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (req.user.role !== "admin") {
    throw new AppError("Admin access required", 403, "ADMIN_ACCESS_REQUIRED");
  }

  next();
}