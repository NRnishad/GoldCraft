import { User } from "@entities/User";

export interface IRefreshTokenUserRepository {
  findById(id: string): Promise<User | null>;
}