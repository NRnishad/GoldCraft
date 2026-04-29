import { User } from "@entities/User";

export interface IResetPasswordUserRepository {
  findByEmail(email: string): Promise<User | null>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
}