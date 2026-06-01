import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IEncryptionService } from "@application/interfaces/IEncryptionService";
import { AppError } from "@application/errors/AppError";

interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IEncryptionService)
    private readonly encryptionService: IEncryptionService,
  ) {}

  public async execute(input: ChangePasswordInput) {
    const userResult = await this.userRepository.findById(input.userId);
    if (userResult.isFailure || !userResult.getValue()) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const user = userResult.getValue()!;

    if (!user.getIsActive()) {
      throw new AppError("Account is inactive or blocked", 403, "USER_INACTIVE");
    }

    if (!user.getPasswordHash()) {
      throw new AppError("Password login is not available for this account", 400, "PASSWORD_LOGIN_NOT_AVAILABLE");
    }

    const isCurrentPasswordCorrect = await this.encryptionService.compare(
      input.currentPassword,
      user.getPasswordHash()!,
    );

    if (!isCurrentPasswordCorrect) {
      throw new AppError("Invalid current password", 400, "INVALID_CURRENT_PASSWORD");
    }

    const newPasswordHash = await this.encryptionService.hash(input.newPassword);

    const updateResult = user.updatePassword(newPasswordHash);
    if (updateResult.isFailure) {
      throw new AppError(updateResult.getError(), 400, "INVALID_INPUT");
    }

    const saveResult = await this.userRepository.save(user);
    if (saveResult.isFailure) {
      throw new AppError("Failed to update password", 500, "DB_ERROR");
    }

    return {
      message: "Password changed successfully",
    };
  }
}
