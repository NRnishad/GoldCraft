import { User, UserRole } from "@entities/User";

export interface ListUsersFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
  page: number;
  limit: number;
}

export interface CountUsersFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface IListUsersRepository {
  listUsers(filters: ListUsersFilters): Promise<User[]>;
  countUsers(filters: CountUsersFilters): Promise<number>;
}