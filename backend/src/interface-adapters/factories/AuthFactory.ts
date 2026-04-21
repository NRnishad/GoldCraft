import { MongoUserRepository } from "../../frameworks-and-drivers/database/repositories/MongoUserRepository";
import { BcryptPasswordHasher } from "../../frameworks-and-drivers/security/BcryptPasswordHasher";
import { LoginUseCase } from "../../use-cases/auth/LoginUseCase/LoginUseCase";

export function makeUserRepository() {
  return new MongoUserRepository();
}

export function makePasswordHasher() {
  return new BcryptPasswordHasher();
}

export function makeLoginUseCase() {
  return new LoginUseCase(makeUserRepository(), makePasswordHasher());
}

