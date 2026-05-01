import { IChangePasswordUserRepository } from "./IUserRepository";
import { IChangePasswordHasher } from "./IPasswordHasher";

export interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordOutput {
  message: string;
}

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: IChangePasswordUserRepository,
    private readonly passwordHasher: IChangePasswordHasher,
  ) {}

  async execute(input: ChangePasswordInput): Promise<ChangePasswordOutput> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.isActive) {
      throw new Error("USER_INACTIVE");
    }

    if (!user.passwordHash) {
      throw new Error("PASSWORD_LOGIN_NOT_AVAILABLE");
    }

    const isCurrentPasswordCorrect = await this.passwordHasher.compare(
      input.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordCorrect) {
      throw new Error("INVALID_CURRENT_PASSWORD");
    }

    const newPasswordHash = await this.passwordHasher.hash(input.newPassword);

    await this.userRepository.updatePassword(user.id, newPasswordHash);

    return {
      message: "Password changed successfully",
    };
  }
}