import { IRegisterUserRepository } from "./IUserRepository";
import { IRegisterPasswordHasher } from "./IPasswordHasher";
import { IRegisterEmailOtpStore } from "./IEmailOtpStore";
import { IRegisterEmailService } from "./IEmailService";
import { IRegisterOtpGenerator } from "./IOtpGenerator";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IRegisterUserRepository,
    private readonly passwordHasher: IRegisterPasswordHasher,
    private readonly otpStore: IRegisterEmailOtpStore,
    private readonly emailService: IRegisterEmailService,
    private readonly otpGenerator: IRegisterOtpGenerator,
  ) {}

  async execute(input: RegisterUserInput) {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
      role: "jeweller",
    });

    const otp = this.otpGenerator.generate();
    console.log("Register email verification OTP:", {
         email,
        otp,
        });
    await this.otpStore.save(email, otp);

    await this.emailService.sendEmailVerificationOtp({
      to: email,
      name,
      otp,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      message: "Verification OTP sent to email",
    };
  }
}