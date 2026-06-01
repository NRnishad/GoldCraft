import { IVerifyEmailUserRepository } from "./IUserRepository";
import { IVerifyEmailOtpStore } from "./IEmailOtpStore";

interface VerifyEmailInput {
  email: string;
  otp: string;
}

export class VerifyEmailUseCase {
  constructor(
    private readonly userRepository: IVerifyEmailUserRepository,
    private readonly otpStore: IVerifyEmailOtpStore,
  ) {}

  async execute(input: VerifyEmailInput) {
    const email = input.email.trim().toLowerCase();
    const otp = input.otp.trim();

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.isActive) {
      throw new Error("USER_INACTIVE");
    }

    if (user.isEmailVerified) {
      throw new Error("EMAIL_ALREADY_VERIFIED");
    }

    const savedOtp = await this.otpStore.get(email);

if (process.env.NODE_ENV !== "production") {
  console.log("Verify email OTP debug:", {
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

    await this.userRepository.markEmailAsVerified(user.id);
    await this.otpStore.delete(email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
      },
    };
  }
}