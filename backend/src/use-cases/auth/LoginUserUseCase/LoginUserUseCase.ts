import { ILoginUserRepository } from "./IUserRepository";
import { ILoginPasswordHasher } from "./IPasswordHasher";
import { ITokenService } from "./ITokenService";

interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: ILoginUserRepository,
    private readonly passwordHasher: ILoginPasswordHasher,
    private readonly tokenService: ITokenService,
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

    const accessToken = this.tokenService.signAccessToken({
      userId: user.id,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}