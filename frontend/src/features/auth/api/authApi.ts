import { httpClient } from "../../../shared/api/httpClient";

import type {
  AuthResponse,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  MeResponse,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../types/authTypes";

export const authApi = {
  register(input: RegisterInput) {
    return httpClient.post<AuthResponse>("/auth/register", input);
  },

  login(input: LoginInput) {
    return httpClient.post<AuthResponse>("/auth/login", input);
  },

  logout() {
    return httpClient.post("/auth/logout");
  },

  getMe() {
    return httpClient.get<MeResponse>("/auth/me");
  },

  verifyEmail(input: VerifyEmailInput) {
    return httpClient.post("/auth/verify-email", input);
  },

  resendEmailVerification(email: string) {
    return httpClient.post("/auth/resend-email-verification", {
      email,
    });
  },

  forgotPassword(input: ForgotPasswordInput) {
    return httpClient.post("/auth/forgot-password", input);
  },

  resetPassword(input: ResetPasswordInput) {
    return httpClient.post("/auth/reset-password", input);
  },

  changePassword(input: ChangePasswordInput) {
    return httpClient.post("/auth/change-password", input);
  },

  googleLoginUrl() {
    return `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  },
};