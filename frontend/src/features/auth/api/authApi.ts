import { httpClient } from "../../../shared/api/httpClient";
import type {
  BasicSuccessResponse,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  LoginResponse,
  MeResponse,
  RegisterInput,
  RegisterResponse,
  ResetPasswordInput,
  VerifyEmailInput,
  VerifyEmailResponse,
} from "../types/authTypes";

export const authApi = {
  register(input: RegisterInput) {
    return httpClient.post<RegisterResponse>("/auth/register", input);
  },

  login(input: LoginInput) {
    return httpClient.post<LoginResponse>("/auth/login", input);
  },

  logout(refreshToken: string) {
    return httpClient.post<BasicSuccessResponse>("/auth/logout", {
      refreshToken,
    });
  },

  getMe() {
    return httpClient.get<MeResponse>("/auth/me");
  },

  verifyEmail(input: VerifyEmailInput) {
    return httpClient.post<VerifyEmailResponse>("/auth/verify-email", input);
  },

  resendEmailVerification(email: string) {
    return httpClient.post<BasicSuccessResponse>(
      "/auth/resend-email-verification",
      {
        email,
      }
    );
  },

  forgotPassword(input: ForgotPasswordInput) {
    return httpClient.post<BasicSuccessResponse>("/auth/forgot-password", input);
  },

  resetPassword(input: ResetPasswordInput) {
    return httpClient.post<BasicSuccessResponse>("/auth/reset-password", input);
  },

  changePassword(input: ChangePasswordInput) {
    return httpClient.post<BasicSuccessResponse>(
      "/auth/change-password",
      input
    );
  },

  googleLoginUrl() {
    return `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  },
};