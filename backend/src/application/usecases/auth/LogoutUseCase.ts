import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { ITokenService } from "@application/interfaces/ITokenService";
import { IRefreshSessionStore } from "@application/interfaces/IRefreshSessionStore";
import { ILogger } from "@application/interfaces/ILogger";
import { AppError } from "@application/errors/AppError";

interface LogoutInput {
  refreshToken: string;
}

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(TYPES.ITokenService)
    private readonly tokenService: ITokenService,
    @inject(TYPES.IRefreshSessionStore)
    private readonly refreshSessionStore: IRefreshSessionStore,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {}

  public async execute(input: LogoutInput): Promise<void> {
    try {
      const payload = this.tokenService.verifyRefreshToken(input.refreshToken);
      if (payload && payload.sessionId) {
        await this.refreshSessionStore.delete(payload.sessionId);
        this.logger.info(`Session ${payload.sessionId} successfully logged out`);
      }
    } catch (err: any) {
      this.logger.warn(`Logout failed or session already expired: ${err.message}`);
      throw new AppError("Invalid or expired session token", 400, "INVALID_TOKEN");
    }
  }
}
