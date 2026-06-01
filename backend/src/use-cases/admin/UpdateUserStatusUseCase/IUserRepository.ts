import { User } from "@entities/User";

export interface IUpdateUserStatusRepository {
  findById(id: string): Promise<User | null>;
  updateActiveStatus(userId: string, isActive: boolean): Promise<User | null>;
  countActiveAdmins(): Promise<number>;
}