import { User, UserRole } from "@entities/User";
import { IListUsersRepository } from "./IUserRepository";

export interface ListUsersInput {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListUsersOutput {
  users: AdminUserListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: IListUsersRepository) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    const page = Math.max(Number(input.page || 1), 1);
    const limit = Math.min(Math.max(Number(input.limit || 10), 1), 100);

    const search = input.search?.trim() || undefined;

    const [users, total] = await Promise.all([
      this.userRepository.listUsers({
        search,
        role: input.role,
        isActive: input.isActive,
        isEmailVerified: input.isEmailVerified,
        page,
        limit,
      }),
      this.userRepository.countUsers({
        search,
        role: input.role,
        isActive: input.isActive,
        isEmailVerified: input.isEmailVerified,
      }),
    ]);

    return {
      users: users.map((user) => this.toAdminUserListItem(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private toAdminUserListItem(user: User): AdminUserListItem {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}