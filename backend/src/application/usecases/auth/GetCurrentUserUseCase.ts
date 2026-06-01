import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { AppError } from "@application/errors/AppError";

interface GetCurrentUserInput {
  userId: string;
}

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(input: GetCurrentUserInput) {
    const userResult = await this.userRepository.findById(input.userId);
    if (userResult.isFailure || !userResult.getValue()) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const user = userResult.getValue()!;
    if (!user.getIsActive()) {
      throw new AppError("Account is inactive or blocked", 403, "USER_INACTIVE");
    }

    return {
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
