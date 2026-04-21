import type { Request, Response } from "express";
import { loginSchema } from "../validators/authValidators";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/response";
import { makeLoginUseCase, makeUserRepository } from "../factories/AuthFactory";
import type { AuthRequest } from "../types/AuthRequest";

export const AuthController = {
  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Validation failed", 400, "VALIDATION_ERROR");
    }

    const loginUseCase = makeLoginUseCase();
    const result = await loginUseCase.execute(parsed.data);

    sendSuccess(res, "Login successful", result);
  },

  async me(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const userRepository = makeUserRepository();
    const user = await userRepository.findById(req.user.userId);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    sendSuccess(res, "Current user fetched successfully", { user });
  },
};

