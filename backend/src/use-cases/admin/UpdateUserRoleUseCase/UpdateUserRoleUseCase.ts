import { User, UserRole } from "@entities/User";
import { IUpdateUserRoleRepository } from "./IUserRepository";

export interface UpdateUserRoleInput {
  adminUserId: string;
  targetUserId: string;
  role: UserRole;
}

export interface UpdateUserRoleOutput {
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

export class UpdateUserRoleUseCase {
  constructor(private readonly userRepository: IUpdateUserRoleRepository) {}

  async execute(input: UpdateUserRoleInput): Promise<UpdateUserRoleOutput> {
    const existingUser = await this.userRepository.findById(input.targetUserId);

    if (!existingUser) {
      throw new Error("USER_NOT_FOUND");
    }

    if (input.adminUserId === input.targetUserId) {
      throw new Error("CANNOT_CHANGE_OWN_ROLE");
    }

    if (
      existingUser.role === "admin" &&
      existingUser.isActive &&
      input.role !== "admin"
    ) {
      const activeAdminCount = await this.userRepository.countActiveAdmins();

      if (activeAdminCount <= 1) {
        throw new Error("CANNOT_DEMOTE_LAST_ADMIN");
      }
    }

    const updatedUser = await this.userRepository.updateRole(
      input.targetUserId,
      input.role,
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