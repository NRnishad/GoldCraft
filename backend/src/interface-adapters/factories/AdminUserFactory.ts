import { MongoUserRepository } from "@drivers/database/repositories/MongoUserRepository";
import { ListUsersUseCase } from "@use-cases/admin/ListUsersUseCase/ListUsersUseCase";
import { GetUserDetailsUseCase } from "@use-cases/admin/GetUserDetailsUseCase/GetUserDetailsUseCase";
import { UpdateUserStatusUseCase } from "@use-cases/admin/UpdateUserStatusUseCase/UpdateUserStatusUseCase";
import { UpdateUserRoleUseCase } from "@use-cases/admin/UpdateUserRoleUseCase/UpdateUserRoleUseCase";

export function makeListUsersUseCase() {
  const userRepository = new MongoUserRepository();

  return new ListUsersUseCase(userRepository);
}

export function makeGetUserDetailsUseCase() {
  const userRepository = new MongoUserRepository();

  return new GetUserDetailsUseCase(userRepository);
}

export function makeUpdateUserStatusUseCase() {
  const userRepository = new MongoUserRepository();

  return new UpdateUserStatusUseCase(userRepository);
}

export function makeUpdateUserRoleUseCase() {
  const userRepository = new MongoUserRepository();

  return new UpdateUserRoleUseCase(userRepository);
}