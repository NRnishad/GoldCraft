import { ContainerModule } from "inversify";
import { TYPES } from "../types.di";

// Auth Use Cases
import { RegisterUserUseCase } from "@application/usecases/auth/RegisterUserUseCase";
import { LoginUserUseCase } from "@application/usecases/auth/LoginUserUseCase";
import { GoogleLoginUseCase } from "@application/usecases/auth/GoogleLoginUseCase";
import { LogoutUseCase } from "@application/usecases/auth/LogoutUseCase";
import { ResendEmailVerificationUseCase } from "@application/usecases/auth/ResendEmailVerificationUseCase";
import { VerifyEmailUseCase } from "@application/usecases/auth/VerifyEmailUseCase";
import { ForgotPasswordUseCase } from "@application/usecases/auth/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "@application/usecases/auth/ResetPasswordUseCase";
import { RefreshTokenUseCase } from "@application/usecases/auth/RefreshTokenUseCase";
import { ChangePasswordUseCase } from "@application/usecases/auth/ChangePasswordUseCase";
import { GetCurrentUserUseCase } from "@application/usecases/auth/GetCurrentUserUseCase";

// Admin Use Cases
import { GetUserDetailsUseCase } from "@application/usecases/admin/GetUserDetailsUseCase";
import { ListUsersUseCase } from "@application/usecases/admin/ListUsersUseCase";
import { UpdateUserRoleUseCase } from "@application/usecases/admin/UpdateUserRoleUseCase";
import { UpdateUserStatusUseCase } from "@application/usecases/admin/UpdateUserStatusUseCase";

// Rates Use Cases
import { GetRateHistoryUseCase } from "@application/usecases/rates/GetRateHistoryUseCase";
import { TriggerManualRateFetchUseCase } from "@application/usecases/rates/TriggerManualRateFetchUseCase";
import { UpdateTodayGlobalRateUseCase } from "@application/usecases/rates/UpdateTodayGlobalRateUseCase";
import { GetShopTodayRateUseCase } from "@application/usecases/rates/GetShopTodayRateUseCase";
import { UpdateShopRateOverrideUseCase } from "@application/usecases/rates/UpdateShopRateOverrideUseCase";

// Shop Use Cases
import { SaveOnboardingUseCase } from "@application/usecases/shop/SaveOnboardingUseCase";
import { GetOnboardingStateUseCase } from "@application/usecases/shop/GetOnboardingStateUseCase";
import { GetShopProfileUseCase } from "@application/usecases/shop/GetShopProfileUseCase";
import { UpdateShopProfileUseCase } from "@application/usecases/shop/UpdateShopProfileUseCase";
import { CreateProfilePhotoUploadUrlUseCase } from "@application/usecases/shop/CreateProfilePhotoUploadUrlUseCase";
import { UpdateShopProfilePhotoUseCase } from "@application/usecases/shop/UpdateShopProfilePhotoUseCase";

export const useCasesContainer = new ContainerModule((options) => {
  // Auth
  options.bind<RegisterUserUseCase>(TYPES.RegisterUserUseCase).to(RegisterUserUseCase).inSingletonScope();
  options.bind<LoginUserUseCase>(TYPES.LoginUserUseCase).to(LoginUserUseCase).inSingletonScope();
  options.bind<GoogleLoginUseCase>(TYPES.GoogleLoginUseCase).to(GoogleLoginUseCase).inSingletonScope();
  options.bind<LogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase).inSingletonScope();
  options.bind<ResendEmailVerificationUseCase>(TYPES.ResendEmailVerificationUseCase).to(ResendEmailVerificationUseCase).inSingletonScope();
  options.bind<VerifyEmailUseCase>(TYPES.VerifyEmailUseCase).to(VerifyEmailUseCase).inSingletonScope();
  options.bind<ForgotPasswordUseCase>(TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase).inSingletonScope();
  options.bind<ResetPasswordUseCase>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase).inSingletonScope();
  options.bind<RefreshTokenUseCase>(TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase).inSingletonScope();
  options.bind<ChangePasswordUseCase>(TYPES.ChangePasswordUseCase).to(ChangePasswordUseCase).inSingletonScope();
  options.bind<GetCurrentUserUseCase>(TYPES.GetCurrentUserUseCase).to(GetCurrentUserUseCase).inSingletonScope();

  // Admin
  options.bind<GetUserDetailsUseCase>(TYPES.GetUserDetailsUseCase).to(GetUserDetailsUseCase).inSingletonScope();
  options.bind<ListUsersUseCase>(TYPES.ListUsersUseCase).to(ListUsersUseCase).inSingletonScope();
  options.bind<UpdateUserRoleUseCase>(TYPES.UpdateUserRoleUseCase).to(UpdateUserRoleUseCase).inSingletonScope();
  options.bind<UpdateUserStatusUseCase>(TYPES.UpdateUserStatusUseCase).to(UpdateUserStatusUseCase).inSingletonScope();

  // Rates
  options.bind<GetRateHistoryUseCase>(TYPES.GetRateHistoryUseCase).to(GetRateHistoryUseCase).inSingletonScope();
  options.bind<TriggerManualRateFetchUseCase>(TYPES.TriggerManualRateFetchUseCase).to(TriggerManualRateFetchUseCase).inSingletonScope();
  options.bind<UpdateTodayGlobalRateUseCase>(TYPES.UpdateTodayGlobalRateUseCase).to(UpdateTodayGlobalRateUseCase).inSingletonScope();
  options.bind<GetShopTodayRateUseCase>(TYPES.GetShopTodayRateUseCase).to(GetShopTodayRateUseCase).inSingletonScope();
  options.bind<UpdateShopRateOverrideUseCase>(TYPES.UpdateShopRateOverrideUseCase).to(UpdateShopRateOverrideUseCase).inSingletonScope();

  // Shop
  options.bind<SaveOnboardingUseCase>(TYPES.SaveOnboardingUseCase).to(SaveOnboardingUseCase).inSingletonScope();
  options.bind<GetOnboardingStateUseCase>(TYPES.GetOnboardingStateUseCase).to(GetOnboardingStateUseCase).inSingletonScope();
  options.bind<GetShopProfileUseCase>(TYPES.GetShopProfileUseCase).to(GetShopProfileUseCase).inSingletonScope();
  options.bind<UpdateShopProfileUseCase>(TYPES.UpdateShopProfileUseCase).to(UpdateShopProfileUseCase).inSingletonScope();
  options.bind<CreateProfilePhotoUploadUrlUseCase>(TYPES.CreateProfilePhotoUploadUrlUseCase).to(CreateProfilePhotoUploadUrlUseCase).inSingletonScope();
  options.bind<UpdateShopProfilePhotoUseCase>(TYPES.UpdateShopProfilePhotoUseCase).to(UpdateShopProfilePhotoUseCase).inSingletonScope();
});
