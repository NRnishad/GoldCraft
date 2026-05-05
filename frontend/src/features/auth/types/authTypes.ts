export type UserRole = "jeweller" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive?: boolean;
  profilePhotoUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    message: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
}

export interface BasicSuccessResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}