import { issueAccessToken } from "../../../frameworks-and-drivers/security/JwtService";
import { AppError } from "../../../interface-adapters/utils/AppError";
import type { LoginInput } from "../../../interface-adapters/validators/authValidators";
import type { IUserRepository } from "./IUserRepository";
import { BcryptPasswordHasher } from "../../../frameworks-and-drivers/security/BcryptPasswordHasher";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: BcryptPasswordHasher,
  ) {}

  async execute(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const passwordMatches = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    await this.userRepository.updateLastLogin(user.id, new Date());

    return {
      accessToken: issueAccessToken({
        userId: user.id,
        role: user.role,
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

