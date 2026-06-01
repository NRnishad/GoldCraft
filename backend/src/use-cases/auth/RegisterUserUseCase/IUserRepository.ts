import { User } from "@entities/User";

export interface IRegisterUserRepository {
  findByEmail(email: string): Promise<User | null>;

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: "jeweller";
  }): Promise<User>;
}