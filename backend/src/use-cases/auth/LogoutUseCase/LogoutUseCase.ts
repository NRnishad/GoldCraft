import { ILogoutTokenService } from "./ITokenService";
import { ILogoutRefreshSessionStore } from "./IRefreshSessionStore";

export interface LogoutInput {
  refreshToken: string;
}

export interface LogoutOutput {
  message: string;
}

export class LogoutUseCase {
  constructor(
    private readonly tokenService: ILogoutTokenService,
    private readonly refreshSessionStore: ILogoutRefreshSessionStore,
  ) {}

  async execute(input: LogoutInput): Promise<LogoutOutput> {
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

    await this.refreshSessionStore.delete(payload.sessionId);

    return {
      message: "Logged out successfully",
    };
  }
}