import { User } from "@entities/User";

export interface IForgotPasswordUserRepository {
  findByEmail(email: string): Promise<User | null>;
}