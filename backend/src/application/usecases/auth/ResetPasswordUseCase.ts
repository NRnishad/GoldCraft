import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IPasswordResetOtpStore } from "@application/interfaces/IPasswordResetOtpStore";
import { IEncryptionService } from "@application/interfaces/IEncryptionService";
import { Email } from "@domain/value-objects/Email.vo";
import { AppError } from "@application/errors/AppError";
import { env } from "@config/env";

interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IPasswordResetOtpStore)
    private readonly passwordResetOtpStore: IPasswordResetOtpStore,
    @inject(TYPES.IEncryptionService)
    private readonly encryptionService: IEncryptionService,
  ) {}

  public async execute(input: ResetPasswordInput) {
    const emailResult = Email.create(input.email);
    if (emailResult.isFailure) {
      throw new AppError(emailResult.getError(), 400, "INVALID_INPUT");
    }

    const email = emailResult.getValue();
    const otp = input.otp.trim();

    const userResult = await this.userRepository.findByEmail(email);
    if (userResult.isFailure || !userResult.getValue()) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const user = userResult.getValue()!;

    if (!user.getIsActive()) {
      throw new AppError("Account is inactive or blocked", 403, "USER_INACTIVE");
    }

    const savedOtpData = await this.passwordResetOtpStore.get(email.getValue());

    if (!savedOtpData) {
      throw new AppError("Reset code has expired or is invalid", 400, "OTP_EXPIRED");
    }

    // Verify OTP code matches
    if (savedOtpData.otp.trim() !== otp) {
      throw new AppError("Invalid reset code", 400, "INVALID_OTP");
    }

    // Verify OTP code is still valid via generation timestamp
    const secondsRemaining = (Date.now() - savedOtpData.createdAt) / 1000;
    if (secondsRemaining > env.EMAIL_OTP_EXPIRES_SECONDS) {
      await this.passwordResetOtpStore.delete(email.getValue());
      throw new AppError("Reset code has expired", 400, "OTP_EXPIRED");
    }

    // Hash new password
    const newPasswordHash = await this.encryptionService.hash(input.newPassword);

    // Mutate domain entity
    const updateResult = user.updatePassword(newPasswordHash);
    if (updateResult.isFailure) {
      throw new AppError(updateResult.getError(), 400, "INVALID_INPUT");
    }

    // Save changes
    const saveResult = await this.userRepository.save(user);
    if (saveResult.isFailure) {
      throw new AppError("Failed to update password", 500, "DB_ERROR");
    }

    // Clear reset OTP
    await this.passwordResetOtpStore.delete(email.getValue());

    return {
      message: "Password reset successfully",
    };
  }
}
