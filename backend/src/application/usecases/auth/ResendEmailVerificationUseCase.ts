import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IEmailOtpStore } from "@application/interfaces/IEmailOtpStore";
import { IEmailService } from "@application/interfaces/IEmailService";
import { IOtpGenerator } from "@application/interfaces/IOtpGenerator";
import { ILogger } from "@application/interfaces/ILogger";
import { Email } from "@domain/value-objects/Email.vo";
import { AppError } from "@application/errors/AppError";

interface ResendEmailVerificationInput {
  email: string;
}

@injectable()
export class ResendEmailVerificationUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IEmailOtpStore)
    private readonly otpStore: IEmailOtpStore,
    @inject(TYPES.IEmailService)
    private readonly emailService: IEmailService,
    @inject(TYPES.IOtpGenerator)
    private readonly otpGenerator: IOtpGenerator,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {}

  public async execute(input: ResendEmailVerificationInput) {
    const emailResult = Email.create(input.email);
    if (emailResult.isFailure) {
      throw new AppError(emailResult.getError(), 400, "INVALID_INPUT");
    }

    const email = emailResult.getValue();
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

    // Rate-limiting check: block request if last OTP was generated within 60 seconds
    const existingOtp = await this.otpStore.get(email.getValue());
    if (existingOtp) {
      const secondsSinceLastGeneration = (Date.now() - existingOtp.createdAt) / 1000;
      if (secondsSinceLastGeneration < 60) {
        const secondsRemaining = Math.ceil(60 - secondsSinceLastGeneration);
        throw new AppError(
          `Please wait ${secondsRemaining} seconds before requesting another code.`,
          429,
          "OTP_RESEND_COOLDOWN",
        );
      }
    }

    const otp = this.otpGenerator.generate();
    await this.otpStore.save(email.getValue(), otp);

    this.logger.info(`Resending verification OTP to email: ${email.getValue()}`);

    await this.emailService.sendEmailVerificationOtp({
      to: user.getEmail().getValue(),
      name: user.getName(),
      otp,
    });

    return {
      message: "Verification OTP resent to email",
    };
  }
}
