import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IEncryptionService } from "@application/interfaces/IEncryptionService";
import { IEmailOtpStore } from "@application/interfaces/IEmailOtpStore";
import { IEmailService } from "@application/interfaces/IEmailService";
import { IOtpGenerator } from "@application/interfaces/IOtpGenerator";
import { Email } from "@domain/value-objects/Email.vo";
import { User, UserRole, AuthProvider } from "@domain/entities/User.entity";
import { AppError } from "@application/errors/AppError";
import crypto from "crypto";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IEncryptionService)
    private readonly encryptionService: IEncryptionService,
    @inject(TYPES.IEmailOtpStore)
    private readonly otpStore: IEmailOtpStore,
    @inject(TYPES.IEmailService)
    private readonly emailService: IEmailService,
    @inject(TYPES.IOtpGenerator)
    private readonly otpGenerator: IOtpGenerator,
  ) {}

  public async execute(input: RegisterUserInput) {
    const emailResult = Email.create(input.email);
    if (emailResult.isFailure) {
      throw new AppError(emailResult.getError(), 400, "INVALID_INPUT");
    }

    const email = emailResult.getValue();
    const existingResult = await this.userRepository.findByEmail(email);
    if (existingResult.isSuccess && existingResult.getValue() !== null) {
      throw new AppError("Email is already registered", 400, "EMAIL_ALREADY_EXISTS");
    }

    // Hash password
    const passwordHash = await this.encryptionService.hash(input.password);

    // Create User Entity
    const userResult = User.create({
      id: crypto.randomUUID(),
      name: input.name,
      email,
      passwordHash,
      role: UserRole.JEWELLER,
      authProvider: AuthProvider.LOCAL,
      isActive: true,
      isEmailVerified: false,
    });

    if (userResult.isFailure) {
      throw new AppError(userResult.getError(), 400, "INVALID_INPUT");
    }

    const user = userResult.getValue()!;
    
    // Save to Database
    const saveResult = await this.userRepository.save(user);
    if (saveResult.isFailure) {
      throw new AppError("Failed to register user", 500, "DB_ERROR");
    }

    // Generate Verification OTP
    const otp = this.otpGenerator.generate();
    await this.otpStore.save(email.getValue(), otp);

    // Send email
    await this.emailService.sendEmailVerificationOtp({
      to: email.getValue(),
      name: user.getName(),
      otp,
    });

    return {
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail().getValue(),
        role: user.getRole(),
        isEmailVerified: user.getIsEmailVerified(),
      },
      message: "Verification OTP sent to email",
    };
  }
}
