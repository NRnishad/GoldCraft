import { Request, Response } from "express";
import {
  makeGetCurrentUserUseCase,
  makeLoginUserUseCase,
  makeRegisterUserUseCase,
  makeResendEmailVerificationUseCase,
  makeVerifyEmailUseCase,makeForgotPasswordUseCase,
makeResetPasswordUseCase,
} from "../factories/AuthFactory";
import {
  loginSchema,
  registerSchema,
  resendEmailVerificationSchema,
  verifyEmailSchema,forgotPasswordSchema,
resetPasswordSchema,
} from "../validators/authValidators";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../middlewares/authMiddleware";

export const AuthController = {
  async register(req: Request, res: Response) {
    const input = registerSchema.parse(req.body);

    const useCase = makeRegisterUserUseCase();

    try {
      const result = await useCase.execute(input);

      return sendSuccess(
        res,
        "User registered successfully. Please verify your email.",
        result,
        201,
      );
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
        throw new AppError(
          "Invalid email or password",
          401,
          "INVALID_CREDENTIALS",
        );
      }

      if (error instanceof Error && error.message === "USER_INACTIVE") {
        throw new AppError("User account is inactive", 403, "USER_INACTIVE");
      }

      if (error instanceof Error && error.message === "EMAIL_NOT_VERIFIED") {
        throw new AppError(
          "Please verify your email before logging in",
          403,
          "EMAIL_NOT_VERIFIED",
        );
      }

      throw error;
    }
  },

  async verifyEmail(req: Request, res: Response) {
    const input = verifyEmailSchema.parse(req.body);

    const useCase = makeVerifyEmailUseCase();

    try {
      const result = await useCase.execute(input);

      return sendSuccess(res, "Email verified successfully", result);
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }

      if (error instanceof Error && error.message === "USER_INACTIVE") {
        throw new AppError("User account is inactive", 403, "USER_INACTIVE");
      }

      if (
        error instanceof Error &&
        error.message === "EMAIL_ALREADY_VERIFIED"
      ) {
        throw new AppError(
          "Email is already verified",
          409,
          "EMAIL_ALREADY_VERIFIED",
        );
      }

      if (error instanceof Error && error.message === "OTP_EXPIRED") {
        throw new AppError(
          "OTP expired. Please request a new OTP",
          400,
          "OTP_EXPIRED",
        );
      }

      if (error instanceof Error && error.message === "INVALID_OTP") {
        throw new AppError("Invalid OTP", 400, "INVALID_OTP");
      }

      throw error;
    }
  },

  async resendEmailVerification(req: Request, res: Response) {
    const input = resendEmailVerificationSchema.parse(req.body);

    const useCase = makeResendEmailVerificationUseCase();

    try {
      const result = await useCase.execute(input);

      return sendSuccess(res, "Verification OTP resent successfully", result);
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }

      if (error instanceof Error && error.message === "USER_INACTIVE") {
        throw new AppError("User account is inactive", 403, "USER_INACTIVE");
      }

      if (
        error instanceof Error &&
        error.message === "EMAIL_ALREADY_VERIFIED"
      ) {
        throw new AppError(
          "Email is already verified",
          409,
          "EMAIL_ALREADY_VERIFIED",
        );
      }

      throw error;
    }
  },

  async forgotPassword(req: Request, res: Response) {
  const input = forgotPasswordSchema.parse(req.body);

  const useCase = makeForgotPasswordUseCase();

  try {
    const result = await useCase.execute(input);

    return sendSuccess(res, "Password reset OTP sent successfully", result);
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

async resetPassword(req: Request, res: Response) {
  const input = resetPasswordSchema.parse(req.body);

  const useCase = makeResetPasswordUseCase();

  try {
    const result = await useCase.execute(input);

    return sendSuccess(res, "Password reset successfully", result);
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    if (error instanceof Error && error.message === "USER_INACTIVE") {
      throw new AppError("User account is inactive", 403, "USER_INACTIVE");
    }

    if (error instanceof Error && error.message === "OTP_EXPIRED") {
      throw new AppError(
        "OTP expired. Please request a new OTP",
        400,
        "OTP_EXPIRED",
      );
    }

    if (error instanceof Error && error.message === "INVALID_OTP") {
      throw new AppError("Invalid OTP", 400, "INVALID_OTP");
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