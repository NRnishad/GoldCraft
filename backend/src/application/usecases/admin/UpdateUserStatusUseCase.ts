import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserRole } from "@domain/entities/User.entity";
import { AppError } from "@application/errors/AppError";

interface UpdateUserStatusInput {
  adminUserId: string;
  targetUserId: string;
  isActive: boolean;
}

@injectable()
export class UpdateUserStatusUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(input: UpdateUserStatusInput) {
    const userResult = await this.userRepository.findById(input.targetUserId);
    if (userResult.isFailure || !userResult.getValue()) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const user = userResult.getValue()!;

    if (input.adminUserId === input.targetUserId && !input.isActive) {
      throw new AppError("Cannot deactivate yourself", 400, "CANNOT_DEACTIVATE_SELF");
    }

    if (user.getRole() === UserRole.ADMIN && user.getIsActive() && !input.isActive) {
      const activeAdminCountResult = await this.userRepository.countActiveAdmins();
      if (activeAdminCountResult.isFailure) {
        throw new AppError("Database error", 500, "DB_ERROR");
      }

      if (activeAdminCountResult.getValue() <= 1) {
        throw new AppError("Cannot deactivate the last active admin", 400, "CANNOT_DEACTIVATE_LAST_ADMIN");
      }
    }

    if (input.isActive) {
      user.activate();
    } else {
      user.block();
    }

    const saveResult = await this.userRepository.save(user);
    if (saveResult.isFailure) {
      throw new AppError("Failed to update user status", 500, "DB_ERROR");
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
