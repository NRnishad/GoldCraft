import { User } from "@entities/User";

export interface IChangePasswordUserRepository {
  findById(id: string): Promise<User | null>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
}