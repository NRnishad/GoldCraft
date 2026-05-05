import { IResetPasswordUserRepository } from "./IUserRepository";
import { IResetPasswordOtpStore } from "./IPasswordResetOtpStore";
import { IResetPasswordHasher } from "./IPasswordHasher";

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordOutput {
  message: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IResetPasswordUserRepository,
    private readonly passwordResetOtpStore: IResetPasswordOtpStore,
    private readonly passwordHasher: IResetPasswordHasher,
  ) {}

  async execute(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
    const email = input.email.trim().toLowerCase();
    const otp = input.otp.trim();

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.isActive) {
      throw new Error("USER_INACTIVE");
    }

    const savedOtp = await this.passwordResetOtpStore.get(email);

    if (process.env.NODE_ENV !== "production") {
      console.log("Reset password OTP :", {
        email,
        enteredOtp: otp,
        savedOtp,
        enteredOtpType: typeof otp,
        savedOtpType: typeof savedOtp,
        isMatch: String(savedOtp).trim() === String(otp).trim(),
      });
    }

    if (!savedOtp) {
      throw new Error("OTP_EXPIRED");
    }

    if (String(savedOtp).trim() !== String(otp).trim()) {
      throw new Error("INVALID_OTP");
    }

    const passwordHash = await this.passwordHasher.hash(input.newPassword);

    await this.userRepository.updatePassword(user.id, passwordHash);

    await this.passwordResetOtpStore.delete(email);

    return {
      message: "Password reset successfully",
    };
  }
}