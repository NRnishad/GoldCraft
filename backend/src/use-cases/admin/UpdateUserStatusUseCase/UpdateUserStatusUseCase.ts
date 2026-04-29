import { User, UserRole } from "@entities/User";
import { IUpdateUserStatusRepository } from "./IUserRepository";

export interface UpdateUserStatusInput {
  adminUserId: string;
  targetUserId: string;
  isActive: boolean;
}

export interface UpdateUserStatusOutput {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export class UpdateUserStatusUseCase {
  constructor(private readonly userRepository: IUpdateUserStatusRepository) {}

  async execute(
    input: UpdateUserStatusInput,
  ): Promise<UpdateUserStatusOutput> {
    const existingUser = await this.userRepository.findById(input.targetUserId);

    if (!existingUser) {
      throw new Error("USER_NOT_FOUND");
    }

    if (input.adminUserId === input.targetUserId && !input.isActive) {
      throw new Error("CANNOT_DEACTIVATE_SELF");
    }

    if (
      existingUser.role === "admin" &&
      existingUser.isActive &&
      !input.isActive
    ) {
      const activeAdminCount = await this.userRepository.countActiveAdmins();

      if (activeAdminCount <= 1) {
        throw new Error("CANNOT_DEACTIVATE_LAST_ADMIN");
      }
    }

    const updatedUser = await this.userRepository.updateActiveStatus(
      input.targetUserId,
      input.isActive,
    );

    if (!updatedUser) {
      throw new Error("USER_UPDATE_FAILED");
    }

    return {
      user: this.toOutputUser(updatedUser),
    };
  }

  private toOutputUser(user: User) {
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