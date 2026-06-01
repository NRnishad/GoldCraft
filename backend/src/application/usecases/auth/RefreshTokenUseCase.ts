import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { ITokenService } from "@application/interfaces/ITokenService";
import { IRefreshSessionStore } from "@application/interfaces/IRefreshSessionStore";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { AppError } from "@application/errors/AppError";

interface RefreshTokenInput {
  refreshToken: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(TYPES.ITokenService)
    private readonly tokenService: ITokenService,
    @inject(TYPES.IRefreshSessionStore)
    private readonly refreshSessionStore: IRefreshSessionStore,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(input: RefreshTokenInput) {
    let payload: {
      userId: string;
      role: any;
      sessionId: string;
    };

    try {
      payload = this.tokenService.verifyRefreshToken(input.refreshToken);
    } catch {
      throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }

    const session = await this.refreshSessionStore.get(payload.sessionId);
    if (!session) {
      throw new AppError("Session expired or not found", 401, "SESSION_NOT_FOUND");
    }

    if (session.userId !== payload.userId) {
      throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }

    const userResult = await this.userRepository.findById(payload.userId);
    if (userResult.isFailure || !userResult.getValue()) {
      throw new AppError("User not found", 401, "USER_NOT_FOUND");
    }

    const user = userResult.getValue()!;
    if (!user.getIsActive()) {
      throw new AppError("Account is inactive or blocked", 403, "USER_INACTIVE");
    }

    const accessToken = this.tokenService.signAccessToken({
      userId: user.getId(),
      role: user.getRole(),
    });

    return {
      accessToken,
    };
  }
}
