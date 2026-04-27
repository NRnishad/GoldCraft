import { Request, Response } from "express";
import {
  makeGetCurrentUserUseCase,
  makeLoginUserUseCase,
  makeRegisterUserUseCase,
} from "../factories/AuthFactory";
import { registerSchema, loginSchema } from "../validators/authValidators";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middlewares/authMiddleware";

export const AuthController = {
  async register(req: Request, res: Response) {
    const input = registerSchema.parse(req.body);

    const useCase = makeRegisterUserUseCase();

    try {
      const result = await useCase.execute(input);

      return sendSuccess(res, "User registered successfully", result, 201);
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
        throw new AppError("Email already exists", 409, "EMAIL_ALREADY_EXISTS");
      }

      throw error;
    }
  },

  async login(req: Request, res: Response) {
    const input = loginSchema.parse(req.body);

    const useCase = makeLoginUserUseCase();

    try {
      const result = await useCase.execute(input);

      return sendSuccess(res, "Logged in successfully", result);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
        throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
      }

      if (error instanceof Error && error.message === "USER_INACTIVE") {
        throw new AppError("User account is inactive", 403, "USER_INACTIVE");
      }

      throw error;
    }
  },

  async me(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const useCase = makeGetCurrentUserUseCase();

    try {
      const result = await useCase.execute({
        userId: req.user.userId,
      });

      return sendSuccess(res, "Current user fetched", result);
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }

      if (error instanceof Error && error.message === "USER_INACTIVE") {
        throw new AppError("User account is inactive", 403, "USER_INACTIVE");
      }

      throw error;
    }
  },
};