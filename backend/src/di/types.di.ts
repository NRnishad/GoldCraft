export const TYPES = {
  // Database / Client
  MongooseConnection: Symbol.for("MongooseConnection"),

  // Infrastructure Services
  ILogger: Symbol.for("ILogger"),
  IEmailService: Symbol.for("IEmailService"),
  ITokenService: Symbol.for("ITokenService"),
  IEncryptionService: Symbol.for("IEncryptionService"),
  IOtpGenerator: Symbol.for("IOtpGenerator"),
  IS3Service: Symbol.for("IS3Service"),
  IEmailOtpStore: Symbol.for("IEmailOtpStore"),
  IPasswordResetOtpStore: Symbol.for("IPasswordResetOtpStore"),
  IGoogleOAuthService: Symbol.for("IGoogleOAuthService"),
  IRefreshSessionStore: Symbol.for("IRefreshSessionStore"),
  IMetalRatesApiService: Symbol.for("IMetalRatesApiService"),
  RateScheduler: Symbol.for("RateScheduler"),

  // Mappers
  UserMapper: Symbol.for("UserMapper"),
  ShopMapper: Symbol.for("ShopMapper"),
  GoldRateMapper: Symbol.for("GoldRateMapper"),
  JewellerRateOverrideMapper: Symbol.for("JewellerRateOverrideMapper"),

  // Repositories
  IUserRepository: Symbol.for("IUserRepository"),
  IShopRepository: Symbol.for("IShopRepository"),
  IGoldRateRepository: Symbol.for("IGoldRateRepository"),
  IJewellerRateOverrideRepository: Symbol.for("IJewellerRateOverrideRepository"),

  // Use Cases
  // Auth
  RegisterUserUseCase: Symbol.for("RegisterUserUseCase"),
  LoginUserUseCase: Symbol.for("LoginUserUseCase"),
  GoogleLoginUseCase: Symbol.for("GoogleLoginUseCase"),
  LogoutUseCase: Symbol.for("LogoutUseCase"),
  ResendEmailVerificationUseCase: Symbol.for("ResendEmailVerificationUseCase"),
  VerifyEmailUseCase: Symbol.for("VerifyEmailUseCase"),
  ForgotPasswordUseCase: Symbol.for("ForgotPasswordUseCase"),
  ResetPasswordUseCase: Symbol.for("ResetPasswordUseCase"),
  RefreshTokenUseCase: Symbol.for("RefreshTokenUseCase"),
  ChangePasswordUseCase: Symbol.for("ChangePasswordUseCase"),
  GetCurrentUserUseCase: Symbol.for("GetCurrentUserUseCase"),

  // Admin
  GetUserDetailsUseCase: Symbol.for("GetUserDetailsUseCase"),
  ListUsersUseCase: Symbol.for("ListUsersUseCase"),
  UpdateUserRoleUseCase: Symbol.for("UpdateUserRoleUseCase"),
  UpdateUserStatusUseCase: Symbol.for("UpdateUserStatusUseCase"),

  // Gold Rate
  GetRateHistoryUseCase: Symbol.for("GetRateHistoryUseCase"),
  TriggerManualRateFetchUseCase: Symbol.for("TriggerManualRateFetchUseCase"),
  UpdateTodayGlobalRateUseCase: Symbol.for("UpdateTodayGlobalRateUseCase"),
  GetShopTodayRateUseCase: Symbol.for("GetShopTodayRateUseCase"),
  UpdateShopRateOverrideUseCase: Symbol.for("UpdateShopRateOverrideUseCase"),

  // Shop
  SaveOnboardingUseCase: Symbol.for("SaveOnboardingUseCase"),
  GetOnboardingStateUseCase: Symbol.for("GetOnboardingStateUseCase"),
  GetShopProfileUseCase: Symbol.for("GetShopProfileUseCase"),
  UpdateShopProfileUseCase: Symbol.for("UpdateShopProfileUseCase"),
  CreateProfilePhotoUploadUrlUseCase: Symbol.for("CreateProfilePhotoUploadUrlUseCase"),
  UpdateShopProfilePhotoUseCase: Symbol.for("UpdateShopProfilePhotoUseCase"),

  // Presentation Middlewares
  AuthenticateMiddleware: Symbol.for("AuthenticateMiddleware"),
  AuthorizeMiddleware: Symbol.for("AuthorizeMiddleware"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  AdminController: Symbol.for("AdminController"),
  ShopController: Symbol.for("ShopController"),
  RateController: Symbol.for("RateController"),
};
