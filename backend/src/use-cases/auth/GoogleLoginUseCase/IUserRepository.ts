import { User } from "@entities/User";

export interface CreateGoogleUserData {
  name: string;
  email: string;
  googleId: string;
}

export interface IGoogleLoginUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createGoogleUser(data: CreateGoogleUserData): Promise<User>;
  attachGoogleAccount(userId: string, googleId: string): Promise<User | null>;
}