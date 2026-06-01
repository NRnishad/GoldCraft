import { User } from "@entities/User";

export interface IVerifyEmailUserRepository {
  findByEmail(email: string): Promise<User | null>;
  markEmailAsVerified(userId: string): Promise<void>;
}