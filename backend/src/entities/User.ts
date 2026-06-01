export type UserRole = "jeweller" | "admin";
export type AuthProvider = "local" | "google";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  authProvider: AuthProvider;
  googleId?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}