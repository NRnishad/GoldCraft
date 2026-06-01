import { User } from "@entities/User";

export interface IGetUserDetailsRepository {
  findById(id: string): Promise<User | null>;
}