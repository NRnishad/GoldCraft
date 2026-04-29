import { ILoginUserRepository } from "./IUserRepository";
import { ILoginPasswordHasher } from "./IPasswordHasher";
import { ITokenService } from "./ITokenService";
import { ILoginRefreshSessionStore } from "./IRefreshSessionStore";
import { ILoginSessionIdGenerator } from "./ISessionIdGenerator";

interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: ILoginUserRepository,
    private readonly passwordHasher: ILoginPasswordHasher,
    private readonly tokenService: ITokenService,
    private readonly refreshSessionStore: ILoginRefreshSessionStore,
    private readonly sessionIdGenerator: ILoginSessionIdGenerator,
  ) {}

  async execute(input: LoginUserInput) {
    const email = input.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    if (!user.isActive) {
      throw new Error("USER_INACTIVE");
    }

    const isPasswordCorrect = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordCorrect) {
      throw new Error("INVALID_CREDENTIALS");
    }

    if (!user.isEmailVerified) {
      throw new Error("EMAIL_NOT_VERIFIED");
    }

    const sessionId = this.sessionIdGenerator.generate();

    await this.refreshSessionStore.save({
      sessionId,
      userId: user.id,
      role: user.role,
    });

    const accessToken = this.tokenService.signAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = this.tokenService.signRefreshToken({
      userId: user.id,
      role: user.role,
      sessionId,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }
}