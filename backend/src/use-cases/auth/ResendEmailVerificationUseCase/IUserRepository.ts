import { User } from "@entities/User";

export interface IResendEmailVerificationUserRepository {
  findByEmail(email: string): Promise<User | null>;
}