import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IEmailOtpStore } from "@application/interfaces/IEmailOtpStore";
import { Email } from "@domain/value-objects/Email.vo";
import { AppError } from "@application/errors/AppError";
import { env } from "@config/env";

interface VerifyEmailInput {
  email: string;
  otp: string;
}

@injectable()
export class VerifyEmailUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IEmailOtpStore)
    private readonly otpStore: IEmailOtpStore,
  ) {}

  public async execute(input: VerifyEmailInput) {
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

    if (user.getIsEmailVerified()) {
      throw new AppError("Email is already verified", 400, "EMAIL_ALREADY_VERIFIED");
    }

    const savedOtpData = await this.otpStore.get(email.getValue());

    if (!savedOtpData) {
      throw new AppError("Verification code has expired or is invalid", 400, "OTP_EXPIRED");
    }

    // Verify OTP code matches
    if (savedOtpData.otp.trim() !== otp) {
      throw new AppError("Invalid verification code", 400, "INVALID_OTP");
    }

    // Verify OTP code is still valid via generation timestamp
    const secondsRemaining = (Date.now() - savedOtpData.createdAt) / 1000;
    if (secondsRemaining > env.EMAIL_OTP_EXPIRES_SECONDS) {
      await this.otpStore.delete(email.getValue());
      throw new AppError("Verification code has expired", 400, "OTP_EXPIRED");
    }

    // Mutate domain entity
    user.verifyEmail();

    // Save changes
    const saveResult = await this.userRepository.save(user);
    if (saveResult.isFailure) {
      throw new AppError("Failed to verify email", 500, "DB_ERROR");
    }

    // Clear verification OTP
    await this.otpStore.delete(email.getValue());

    return {
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail().getValue(),
        role: user.getRole(),
        isEmailVerified: true,
      },
    };
  }
}
