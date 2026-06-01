import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserRole } from "@domain/entities/User.entity";
import { AppError } from "@application/errors/AppError";

interface UpdateUserRoleInput {
  adminUserId: string;
  targetUserId: string;
  role: UserRole;
}

@injectable()
export class UpdateUserRoleUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(input: UpdateUserRoleInput) {
    const userResult = await this.userRepository.findById(input.targetUserId);
    if (userResult.isFailure || !userResult.getValue()) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const user = userResult.getValue()!;

    if (input.adminUserId === input.targetUserId && user.getRole() !== input.role) {
      throw new AppError("Cannot change your own role", 400, "CANNOT_CHANGE_SELF_ROLE");
    }

    if (user.getRole() === UserRole.ADMIN && input.role === UserRole.JEWELLER) {
      const activeAdminCountResult = await this.userRepository.countActiveAdmins();
      if (activeAdminCountResult.isFailure) {
        throw new AppError("Database error", 500, "DB_ERROR");
      }

      if (activeAdminCountResult.getValue() <= 1) {
        throw new AppError("Cannot demote the last active admin", 400, "CANNOT_DEMOTE_LAST_ADMIN");
      }
    }

    user.changeRole(input.role);

    const saveResult = await this.userRepository.save(user);
    if (saveResult.isFailure) {
      throw new AppError("Failed to update user role", 500, "DB_ERROR");
    }

    return {
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail().getValue(),
        role: user.getRole(),
        isActive: user.getIsActive(),
        isEmailVerified: user.getIsEmailVerified(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      },
    };
  }
}
