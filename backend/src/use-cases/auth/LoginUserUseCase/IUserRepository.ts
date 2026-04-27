import { User } from "@entities/User";

export interface ILoginUserRepository {
  findByEmail(email: string): Promise<User | null>;
}