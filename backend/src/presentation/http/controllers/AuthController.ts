import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { RegisterUserUseCase } from "@application/usecases/auth/RegisterUserUseCase";
import { LoginUserUseCase } from "@application/usecases/auth/LoginUserUseCase";
import { GoogleLoginUseCase } from "@application/usecases/auth/GoogleLoginUseCase";
import { LogoutUseCase } from "@application/usecases/auth/LogoutUseCase";
import { ResendEmailVerificationUseCase } from "@application/usecases/auth/ResendEmailVerificationUseCase";
import { VerifyEmailUseCase } from "@application/usecases/auth/VerifyEmailUseCase";
import { ForgotPasswordUseCase } from "@application/usecases/auth/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "@application/usecases/auth/ResetPasswordUseCase";
import { RefreshTokenUseCase } from "@application/usecases/auth/RefreshTokenUseCase";
import { ChangePasswordUseCase } from "@application/usecases/auth/ChangePasswordUseCase";
import { GetCurrentUserUseCase } from "@application/usecases/auth/GetCurrentUserUseCase";

import {
  loginSchema,
  registerSchema,
  resendEmailVerificationSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from "../validators/auth.validator";
import { sendSuccess } from "../helpers/response";
import { AppError } from "@application/errors/AppError";
import { AuthRequest } from "../middlewares/AuthenticateMiddleware";
import { env } from "@config/env";
import { ILogger } from "@application/interfaces/ILogger";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.RegisterUserUseCase)
    private readonly registerUserUseCase: RegisterUserUseCase,
    @inject(TYPES.LoginUserUseCase)
    private readonly loginUserUseCase: LoginUserUseCase,
    @inject(TYPES.GoogleLoginUseCase)
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    @inject(TYPES.LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase,
    @inject(TYPES.ResendEmailVerificationUseCase)
    private readonly resendEmailVerificationUseCase: ResendEmailVerificationUseCase,
    @inject(TYPES.VerifyEmailUseCase)
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    @inject(TYPES.ForgotPasswordUseCase)
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    @inject(TYPES.ResetPasswordUseCase)
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    @inject(TYPES.RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    @inject(TYPES.ChangePasswordUseCase)
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    @inject(TYPES.GetCurrentUserUseCase)
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {}

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = registerSchema.parse(req.body);
      const result = await this.registerUserUseCase.execute(input);
      sendSuccess(
        res,
        "User registered successfully. Please verify your email.",
        result,
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = loginSchema.parse(req.body);
      const result = await this.loginUserUseCase.execute(input);
      this.logger.info("Login attempt initiated", { email: req.body.email });
      sendSuccess(res, "Logged in successfully", result);
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = verifyEmailSchema.parse(req.body);
      const result = await this.verifyEmailUseCase.execute(input);
      sendSuccess(res, "Email verified successfully", result);
    } catch (error) {
      next(error);
    }
  };

  public resendEmailVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = resendEmailVerificationSchema.parse(req.body);
      const result = await this.resendEmailVerificationUseCase.execute(input);
      sendSuccess(res, "Verification OTP resent successfully", result);
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = forgotPasswordSchema.parse(req.body);
      const result = await this.forgotPasswordUseCase.execute(input);
      sendSuccess(res, "Check your inbox", result);
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = resetPasswordSchema.parse(req.body);
      const result = await this.resetPasswordUseCase.execute(input);
      sendSuccess(res, "Password reset successfully", result);
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
      }

      const input = changePasswordSchema.parse(req.body);
      const result = await this.changePasswordUseCase.execute({
        userId: req.user.userId,
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      });

      sendSuccess(res, result.message, null);
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = refreshTokenSchema.parse(req.body);
      const result = await this.refreshTokenUseCase.execute(input);
      sendSuccess(res, "Access token refreshed successfully", result);
    } catch (error) {
      next(error);
    }
  };

  public googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = this.googleLoginUseCase.getLoginUrl();
      res.redirect(result.url);
    } catch (error) {
      next(error);
    }
  };

  public googleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const code = req.query.code as string;
    
    if (!code) {
      return res.redirect(`${env.FRONTEND_URL}/login?error=Google login failed`);
    }

    try {
      const result = await this.googleLoginUseCase.completeLogin({ code });
      
      const redirectUrl = new URL(`${env.FRONTEND_URL}/google-callback`);
      redirectUrl.searchParams.set("accessToken", result.accessToken);
      redirectUrl.searchParams.set("refreshToken", result.refreshToken);
      redirectUrl.searchParams.set("user", JSON.stringify(result.user));
      
      res.redirect(redirectUrl.toString());
    } catch (error: any) {
      if (error instanceof AppError && error.code === "USER_INACTIVE") {
        return res.redirect(`${env.FRONTEND_URL}/login?reason=blocked`);
      }
      return res.redirect(`${env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = refreshTokenSchema.parse(req.body);
      const result = await this.logoutUseCase.execute(input);
      sendSuccess(res, "Logged out successfully", result);
    } catch (error) {
      next(error);
    }
  };

  public me = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
      }

      const result = await this.getCurrentUserUseCase.execute({
        userId: req.user.userId,
      });

      sendSuccess(res, "Current user fetched", result);
    } catch (error) {
      next(error);
    }
  };
}
