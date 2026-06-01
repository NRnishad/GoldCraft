import { User, UserRole } from "@domain/entities/User.entity";
import { Email } from "@domain/value-objects/Email.vo";
import { Result } from "@domain/shared/Result";
import { IRead, IWrite } from "./base/base.Repo";

export interface ListUsersFilters {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface CountUsersFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface IUserRepository extends IRead<User, ListUsersFilters>, IWrite<User> {
  findByEmail(email: Email): Promise<Result<User | null>>;
  countActiveAdmins(): Promise<Result<number>>;
  countUsers(filters: CountUsersFilters): Promise<Result<number>>;
  save(user: User): Promise<Result<User>>;
}
