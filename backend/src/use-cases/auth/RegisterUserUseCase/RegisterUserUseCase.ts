import { IRegisterUserRepository } from "./IUserRepository";
import { IRegisterPasswordHasher } from "./IPasswordHasher";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IRegisterUserRepository,
    private readonly passwordHasher: IRegisterPasswordHasher,
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

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}