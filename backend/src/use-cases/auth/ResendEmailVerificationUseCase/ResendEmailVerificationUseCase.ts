import { IResendEmailVerificationUserRepository } from "./IUserRepository";
import { IResendEmailVerificationOtpStore } from "./IEmailOtpStore";
import { IResendEmailVerificationEmailService } from "./IEmailService";
import { IResendEmailVerificationOtpGenerator } from "./IOtpGenerator";

interface ResendEmailVerificationInput {
  email: string;
}

export class ResendEmailVerificationUseCase {
  constructor(
    private readonly userRepository: IResendEmailVerificationUserRepository,
    private readonly otpStore: IResendEmailVerificationOtpStore,
    private readonly emailService: IResendEmailVerificationEmailService,
    private readonly otpGenerator: IResendEmailVerificationOtpGenerator,
  ) {}

  async execute(input: ResendEmailVerificationInput) {
    const email = input.email.trim().toLowerCase();

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

    const otp = this.otpGenerator.generate();

    await this.otpStore.save(email, otp);

    await this.emailService.sendEmailVerificationOtp({
      to: user.email,
      name: user.name,
      otp,
    });

    return {
      message: "Verification OTP resent to email",
    };
  }
}