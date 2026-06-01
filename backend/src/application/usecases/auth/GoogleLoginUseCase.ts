import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IGoogleOAuthService } from "@application/interfaces/IGoogleOAuthService";
import { ITokenService } from "@application/interfaces/ITokenService";
import { IRefreshSessionStore } from "@application/interfaces/IRefreshSessionStore";
import { Email } from "@domain/value-objects/Email.vo";
import { User, UserRole, AuthProvider } from "@domain/entities/User.entity";
import { AppError } from "@application/errors/AppError";
import crypto from "crypto";

interface CompleteGoogleLoginInput {
  code: string;
}

@injectable()
export class GoogleLoginUseCase {
  constructor(
    @inject(TYPES.IGoogleOAuthService)
    private readonly googleOAuthService: IGoogleOAuthService,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.ITokenService)
    private readonly tokenService: ITokenService,
    @inject(TYPES.IRefreshSessionStore)
    private readonly refreshSessionStore: IRefreshSessionStore,
  ) {}

  public getLoginUrl() {
    return {
      url: this.googleOAuthService.getAuthorizationUrl(),
    };
  }

  public async completeLogin(input: CompleteGoogleLoginInput) {
    const profile = await this.googleOAuthService.getProfileFromCode(input.code);

    if (!profile.emailVerified) {
      throw new AppError("Google account email is not verified", 400, "GOOGLE_EMAIL_NOT_VERIFIED");
    }

    const emailResult = Email.create(profile.email);
    if (emailResult.isFailure) {
      throw new AppError(emailResult.getError(), 400, "INVALID_INPUT");
    }

    const email = emailResult.getValue();
    let userResult = await this.userRepository.findByEmail(email);
    let user: User;

    if (userResult.isFailure || !userResult.getValue()) {
      // Create new Google verified user
      const newUserResult = User.create({
        id: crypto.randomUUID(),
        name: profile.name,
        email,
        role: UserRole.JEWELLER,
        authProvider: AuthProvider.GOOGLE,
        googleId: profile.googleId,
        isActive: true,
        isEmailVerified: true,
      });

      if (newUserResult.isFailure) {
        throw new AppError(newUserResult.getError(), 400, "INVALID_INPUT");
      }

      user = newUserResult.getValue()!;
      const saveResult = await this.userRepository.save(user);
      if (saveResult.isFailure) {
        throw new AppError("Failed to create Google user", 500, "DB_ERROR");
      }
    } else {
      user = userResult.getValue()!;
      // Attach Google ID if not set
      if (!user.getGoogleId()) {
        // Enforce Google provider attachment
        user = User.create({
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          passwordHash: user.getPasswordHash(),
          role: user.getRole(),
          authProvider: AuthProvider.GOOGLE,
          googleId: profile.googleId,
          isActive: user.getIsActive(),
          isEmailVerified: true, // Verification is implicitly true with Google
          createdAt: user.getCreatedAt(),
          updatedAt: new Date(),
        }).getValue()!;

        const saveResult = await this.userRepository.save(user);
        if (saveResult.isFailure) {
          throw new AppError("Failed to link Google account", 500, "DB_ERROR");
        }
      }
    }

    if (!user.getIsActive()) {
      throw new AppError("Account is inactive or blocked", 403, "USER_INACTIVE");
    }

    // Generate Session ID
    const sessionId = crypto.randomUUID();

    await this.refreshSessionStore.save({
      sessionId,
      userId: user.getId(),
      role: user.getRole(),
    });

    const accessToken = this.tokenService.signAccessToken({
      userId: user.getId(),
      role: user.getRole(),
    });

    const refreshToken = this.tokenService.signRefreshToken({
      userId: user.getId(),
      role: user.getRole(),
      sessionId,
    });

    return {
      accessToken,
      refreshToken,
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
