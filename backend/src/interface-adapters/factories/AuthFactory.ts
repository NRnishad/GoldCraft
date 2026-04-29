import { MongoUserRepository } from "@drivers/database/repositories/MongoUserRepository";
import { BcryptPasswordHasher } from "@drivers/security/BcryptPasswordHasher";
import { JwtTokenService } from "@drivers/security/JwtTokenService";
import { UpstashEmailOtpStore } from "@drivers/otp/UpstashEmailOtpStore";
import { UpstashPasswordResetOtpStore } from "@drivers/otp/UpstashPasswordResetOtpStore";
import { OtpGenerator } from "@drivers/otp/OtpGenerator";
import { NodemailerEmailService } from "@drivers/email/NodemailerEmailService";

import { RegisterUserUseCase } from "@use-cases/auth/RegisterUserUseCase/RegisterUserUseCase";
import { LoginUserUseCase } from "@use-cases/auth/LoginUserUseCase/LoginUserUseCase";
import { GetCurrentUserUseCase } from "@use-cases/auth/GetCurrentUserUseCase/GetCurrentUserUseCase";
import { VerifyEmailUseCase } from "@use-cases/auth/VerifyEmailUseCase/VerifyEmailUseCase";
import { ResendEmailVerificationUseCase } from "@use-cases/auth/ResendEmailVerificationUseCase/ResendEmailVerificationUseCase";
import { ForgotPasswordUseCase } from "@use-cases/auth/ForgotPasswordUseCase/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "@use-cases/auth/ResetPasswordUseCase/ResetPasswordUseCase";

export function makeRegisterUserUseCase() {
  const userRepository = new MongoUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const otpStore = new UpstashEmailOtpStore();
  const emailService = new NodemailerEmailService();
  const otpGenerator = new OtpGenerator();

  return new RegisterUserUseCase(
    userRepository,
    passwordHasher,
    otpStore,
    emailService,
    otpGenerator,
  );
}

export function makeLoginUserUseCase() {
  const userRepository = new MongoUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService();

  return new LoginUserUseCase(userRepository, passwordHasher, tokenService);
}

export function makeGetCurrentUserUseCase() {
  const userRepository = new MongoUserRepository();

  return new GetCurrentUserUseCase(userRepository);
}

export function makeVerifyEmailUseCase() {
  const userRepository = new MongoUserRepository();
  const otpStore = new UpstashEmailOtpStore();

  return new VerifyEmailUseCase(userRepository, otpStore);
}

export function makeResendEmailVerificationUseCase() {
  const userRepository = new MongoUserRepository();
  const otpStore = new UpstashEmailOtpStore();
  const emailService = new NodemailerEmailService();
  const otpGenerator = new OtpGenerator();

  return new ResendEmailVerificationUseCase(
    userRepository,
    otpStore,
    emailService,
    otpGenerator,
  );
}

export function makeForgotPasswordUseCase() {
  const userRepository = new MongoUserRepository();
  const passwordResetOtpStore = new UpstashPasswordResetOtpStore();
  const emailService = new NodemailerEmailService();
  const otpGenerator = new OtpGenerator();

  return new ForgotPasswordUseCase(
    userRepository,
    passwordResetOtpStore,
    emailService,
    otpGenerator,
  );
}

export function makeResetPasswordUseCase() {
  const userRepository = new MongoUserRepository();
  const passwordResetOtpStore = new UpstashPasswordResetOtpStore();
  const passwordHasher = new BcryptPasswordHasher();

  return new ResetPasswordUseCase(
    userRepository,
    passwordResetOtpStore,
    passwordHasher,
  );
}