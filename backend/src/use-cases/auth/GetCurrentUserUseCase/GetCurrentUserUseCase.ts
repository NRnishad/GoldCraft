import { IGetCurrentUserRepository } from "./IUserRepository";

interface GetCurrentUserInput {
  userId: string;
}

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IGetCurrentUserRepository) {}

  async execute(input: GetCurrentUserInput) {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.isActive) {
      throw new Error("USER_INACTIVE");
    }

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