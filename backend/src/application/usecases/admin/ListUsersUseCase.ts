import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository, ListUsersFilters } from "@domain/repositories/IUserRepository";
import { AppError } from "@application/errors/AppError";

interface ListUsersInput extends Partial<ListUsersFilters> {}

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(input: ListUsersInput) {
    const page = Math.max(Number(input.page || 1), 1);
    const limit = Math.min(Math.max(Number(input.limit || 10), 1), 100);
    const search = input.search?.trim() || undefined;

    const filters: ListUsersFilters = {
      page,
      limit,
      search,
      role: input.role,
      isActive: input.isActive,
      isEmailVerified: input.isEmailVerified,
    };

    const usersResult = await this.userRepository.findAll(filters);
    const totalResult = await this.userRepository.countUsers(filters);

    if (usersResult.isFailure) {
      throw new AppError(usersResult.getError(), 500, "DB_ERROR");
    }

    if (totalResult.isFailure) {
      throw new AppError(totalResult.getError(), 500, "DB_ERROR");
    }

    const users = usersResult.getValue()!;
    const total = totalResult.getValue()!;

    return {
      users: users.map((user) => ({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail().getValue(),
        role: user.getRole(),
        isActive: user.getIsActive(),
        isEmailVerified: user.getIsEmailVerified(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
