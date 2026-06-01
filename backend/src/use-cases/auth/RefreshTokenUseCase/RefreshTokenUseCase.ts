import { IRefreshTokenService } from "./ITokenService";
import { IRefreshTokenSessionStore } from "./IRefreshSessionStore";
import { IRefreshTokenUserRepository } from "./IUserRepository";

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenOutput {
  accessToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService: IRefreshTokenService,
    private readonly refreshSessionStore: IRefreshTokenSessionStore,
    private readonly userRepository: IRefreshTokenUserRepository,
  ) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    let payload: {
      userId: string;
      role: "jeweller" | "admin";
      sessionId: string;
    };

    try {
      payload = this.tokenService.verifyRefreshToken(input.refreshToken);
    } catch {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    const session = await this.refreshSessionStore.get(payload.sessionId);

    if (!session) {
      throw new Error("SESSION_NOT_FOUND");
    }

    if (session.userId !== payload.userId) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.isActive) {
      throw new Error("USER_INACTIVE");
    }

    const accessToken = this.tokenService.signAccessToken({
      userId: user.id,
      role: user.role,
    });

    return {
      accessToken,
    };
  }
}