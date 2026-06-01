import { IForgotPasswordUserRepository } from "./IUserRepository";
import { IForgotPasswordResetOtpStore } from "./IPasswordResetOtpStore";
import { IForgotPasswordEmailService } from "./IEmailService";
import { IForgotPasswordOtpGenerator } from "./IOtpGenerator";

export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordOutput {
  message: string;
}

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IForgotPasswordUserRepository,
    private readonly passwordResetOtpStore: IForgotPasswordResetOtpStore,
    private readonly emailService: IForgotPasswordEmailService,
    private readonly otpGenerator: IForgotPasswordOtpGenerator,
  ) {}

  async execute(input: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
    const email = input.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(email);

if (!user) {
  return {
    message: "Check your inbox",
  };
}

if (!user.isActive) {
  return {
    message: "Check your inbox",
  };
}

const otp = this.otpGenerator.generate();

if (process.env.NODE_ENV !== "production") {
  console.log("Password reset OTP:", {
    email,
    otp,
  });
}

await this.passwordResetOtpStore.save(email, otp);

await this.emailService.sendPasswordResetOtp({
  to: user.email,
  name: user.name,
  otp,
});

return {
  message: "Check your inbox",
};
  }
}