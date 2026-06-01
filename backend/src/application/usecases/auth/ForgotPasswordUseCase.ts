import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IPasswordResetOtpStore } from "@application/interfaces/IPasswordResetOtpStore";
import { IEmailService } from "@application/interfaces/IEmailService";
import { IOtpGenerator } from "@application/interfaces/IOtpGenerator";
import { Email } from "@domain/value-objects/Email.vo";
import { AppError } from "@application/errors/AppError";

interface ForgotPasswordInput {
  email: string;
}

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IPasswordResetOtpStore)
    private readonly passwordResetOtpStore: IPasswordResetOtpStore,
    @inject(TYPES.IEmailService)
    private readonly emailService: IEmailService,
    @inject(TYPES.IOtpGenerator)
    private readonly otpGenerator: IOtpGenerator,
  ) {}

  public async execute(input: ForgotPasswordInput) {
    const emailResult = Email.create(input.email);
    if (emailResult.isFailure) {
      // Return standard response even for invalid email format to prevent username enumeration
      return { message: "Check your inbox" };
    }

    const email = emailResult.getValue();
    const userResult = await this.userRepository.findByEmail(email);

    if (userResult.isFailure || !userResult.getValue()) {
      return { message: "Check your inbox" };
    }

    const user = userResult.getValue()!;

    if (!user.getIsActive()) {
      return { message: "Check your inbox" };
    }

    // Cooldown check
    const existingOtp = await this.passwordResetOtpStore.get(email.getValue());
    if (existingOtp) {
      const secondsSinceLastGeneration = (Date.now() - existingOtp.createdAt) / 1000;
      if (secondsSinceLastGeneration < 60) {
        const secondsRemaining = Math.ceil(60 - secondsSinceLastGeneration);
        throw new AppError(
          `Please wait ${secondsRemaining} seconds before requesting another reset code.`,
          429,
          "OTP_RESEND_COOLDOWN",
        );
      }
    }

    const otp = this.otpGenerator.generate();
    await this.passwordResetOtpStore.save(email.getValue(), otp);

    await this.emailService.sendPasswordResetOtp({
      to: user.getEmail().getValue(),
      name: user.getName(),
      otp,
    });

    return {
      message: "Check your inbox",
    };
  }
}
