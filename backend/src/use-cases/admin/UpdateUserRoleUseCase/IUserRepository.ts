import { User, UserRole } from "@entities/User";

export interface IUpdateUserRoleRepository {
  findById(id: string): Promise<User | null>;
  updateRole(userId: string, role: UserRole): Promise<User | null>;
  countActiveAdmins(): Promise<number>;
}