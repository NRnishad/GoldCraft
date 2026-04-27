import { MongoUserRepository } from "@drivers/database/repositories/MongoUserRepository";
import { BcryptPasswordHasher } from "@drivers/security/BcryptPasswordHasher";
import { JwtTokenService } from "@drivers/security/JwtTokenService";

import { RegisterUserUseCase } from "@use-cases/auth/RegisterUserUseCase/RegisterUserUseCase";
import { LoginUserUseCase } from "@use-cases/auth/LoginUserUseCase/LoginUserUseCase";
import { GetCurrentUserUseCase } from "@use-cases/auth/GetCurrentUserUseCase/GetCurrentUserUseCase";

export function makeRegisterUserUseCase() {
  const userRepository = new MongoUserRepository();
  const passwordHasher = new BcryptPasswordHasher();

  return new RegisterUserUseCase(userRepository, passwordHasher);
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