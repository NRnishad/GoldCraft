import { User } from "@entities/User";

export interface IGetCurrentUserRepository {
  findById(id: string): Promise<User | null>;
}