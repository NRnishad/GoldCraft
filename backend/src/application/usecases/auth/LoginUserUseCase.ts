import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IEncryptionService } from "@application/interfaces/IEncryptionService";
import { ITokenService } from "@application/interfaces/ITokenService";
import { IRefreshSessionStore } from "@application/interfaces/IRefreshSessionStore";
import { Email } from "@domain/value-objects/Email.vo";
import { AppError } from "@application/errors/AppError";
import crypto from "crypto";

interface LoginUserInput {
  email: string;
  password: string;
}

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IEncryptionService)
    private readonly encryptionService: IEncryptionService,
    @inject(TYPES.ITokenService)
    private readonly tokenService: ITokenService,
    @inject(TYPES.IRefreshSessionStore)
    private readonly refreshSessionStore: IRefreshSessionStore,
  ) {}

  public async execute(input: LoginUserInput) {
    const emailResult = Email.create(input.email);
    if (emailResult.isFailure) {
      throw new AppError(emailResult.getError(), 400, "INVALID_INPUT");
    }

    const email = emailResult.getValue();
    const userResult = await this.userRepository.findByEmail(email);

    if (userResult.isFailure || !userResult.getValue()) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const user = userResult.getValue()!;

    if (!user.getIsActive()) {
      throw new AppError("Account is inactive or blocked", 403, "USER_INACTIVE");
    }

    if (!user.getPasswordHash()) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const isPasswordCorrect = await this.encryptionService.compare(
      input.password,
      user.getPasswordHash()!,
    );

    if (!isPasswordCorrect) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    if (!user.getIsEmailVerified()) {
      throw new AppError("Email is not verified", 403, "EMAIL_NOT_VERIFIED");
    }

    // Generate Session ID
    const sessionId = crypto.randomUUID();

    await this.refreshSessionStore.save({
      sessionId,
      userId: user.getId(),
      role: user.getRole(),
    });

    const accessToken = this.tokenService.signAccessToken({
      userId: user.getId(),
      role: user.getRole(),
    });

    const refreshToken = this.tokenService.signRefreshToken({
      userId: user.getId(),
      role: user.getRole(),
      sessionId,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail().getValue(),
        role: user.getRole(),
        isEmailVerified: user.getIsEmailVerified(),
      },
    };
  }
}
