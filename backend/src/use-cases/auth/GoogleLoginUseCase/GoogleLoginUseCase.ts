import { User } from "@entities/User";
import { IGoogleOAuthService } from "./IGoogleOAuthService";
import { IGoogleLoginUserRepository } from "./IUserRepository";
import { IGoogleLoginTokenService } from "./ITokenService";
import { IGoogleLoginRefreshSessionStore } from "./IRefreshSessionStore";
import { IGoogleLoginSessionIdGenerator } from "./ISessionIdGenerator";

export interface GetGoogleLoginUrlOutput {
  url: string;
}

export interface CompleteGoogleLoginInput {
  code: string;
}

export interface CompleteGoogleLoginOutput {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
}

export class GoogleLoginUseCase {
  constructor(
    private readonly googleOAuthService: IGoogleOAuthService,
    private readonly userRepository: IGoogleLoginUserRepository,
    private readonly tokenService: IGoogleLoginTokenService,
    private readonly refreshSessionStore: IGoogleLoginRefreshSessionStore,
    private readonly sessionIdGenerator: IGoogleLoginSessionIdGenerator,
  ) {}

  getLoginUrl(): GetGoogleLoginUrlOutput {
    return {
      url: this.googleOAuthService.getAuthorizationUrl(),
    };
  }

  async completeLogin(
    input: CompleteGoogleLoginInput,
  ): Promise<CompleteGoogleLoginOutput> {
    const profile = await this.googleOAuthService.getProfileFromCode(input.code);

    if (!profile.emailVerified) {
      throw new Error("GOOGLE_EMAIL_NOT_VERIFIED");
    }

    let user = await this.userRepository.findByEmail(profile.email);

    if (!user) {
      user = await this.userRepository.createGoogleUser({
        name: profile.name,
        email: profile.email,
        googleId: profile.googleId,
      });
    } else if (!user.googleId) {
      const attachedUser = await this.userRepository.attachGoogleAccount(
        user.id,
        profile.googleId,
      );

      if (!attachedUser) {
        throw new Error("GOOGLE_ACCOUNT_ATTACH_FAILED");
      }

      user = attachedUser;
    }

    if (!user.isActive) {
      throw new Error("USER_INACTIVE");
    }

    return this.createAuthResponse(user);
  }

  private async createAuthResponse(
    user: User,
  ): Promise<CompleteGoogleLoginOutput> {
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