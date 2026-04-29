import { User } from "@entities/User";
import { IRegisterUserRepository } from "@use-cases/auth/RegisterUserUseCase/IUserRepository";
import { ILoginUserRepository } from "@use-cases/auth/LoginUserUseCase/IUserRepository";
import { IRefreshTokenUserRepository } from "@use-cases/auth/RefreshTokenUseCase/IUserRepository";
import { IGetCurrentUserRepository } from "@use-cases/auth/GetCurrentUserUseCase/IUserRepository";
import { IForgotPasswordUserRepository } from "@use-cases/auth/ForgotPasswordUseCase/IUserRepository";
import { IResetPasswordUserRepository } from "@use-cases/auth/ResetPasswordUseCase/IUserRepository";
import { IVerifyEmailUserRepository } from "../../../use-cases/auth/VerifyEmailUseCase/IUserRepository";
import { IResendEmailVerificationUserRepository } from "../../../use-cases/auth/ResendEmailVerificationUseCase/IUserRepository";
import { UserModel, IUserDocument } from "../models/UserModel";
import {
  CountUsersFilters,
  IListUsersRepository,
  ListUsersFilters,
} from "@use-cases/admin/ListUsersUseCase/IUserRepository";
import { IGetUserDetailsRepository } from "@use-cases/admin/GetUserDetailsUseCase/IUserRepository";
import { IUpdateUserStatusRepository } from "@use-cases/admin/UpdateUserStatusUseCase/IUserRepository";
import { IUpdateUserRoleRepository } from "@use-cases/admin/UpdateUserRoleUseCase/IUserRepository";
export class MongoUserRepository
  implements
    IRegisterUserRepository,
    ILoginUserRepository,
    IGetCurrentUserRepository,
    IVerifyEmailUserRepository,
    IResendEmailVerificationUserRepository,
      IForgotPasswordUserRepository,
    IResetPasswordUserRepository,
    IRefreshTokenUserRepository,IListUsersRepository,
IGetUserDetailsRepository,
IUpdateUserStatusRepository,
IUpdateUserRoleRepository
{
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).exec();

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).exec();

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: "jeweller";
  }): Promise<User> {
    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      isActive: true,
      isEmailVerified: false,
    });

    return this.toEntity(user);
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      isEmailVerified: true,
    }).exec();
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
  await UserModel.findByIdAndUpdate(userId, {
    passwordHash,
  }).exec();
}
async listUsers(filters: ListUsersFilters): Promise<User[]> {
  const query = this.buildUserListQuery(filters);

  const users = await UserModel.find(query)
    .sort({ createdAt: -1 })
    .skip((filters.page - 1) * filters.limit)
    .limit(filters.limit)
    .exec();

  return users.map((user) => this.toEntity(user));
}

async countUsers(filters: CountUsersFilters): Promise<number> {
  const query = this.buildUserListQuery(filters);

  return UserModel.countDocuments(query).exec();
}

async updateActiveStatus(
  userId: string,
  isActive: boolean,
): Promise<User | null> {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      isActive,
    },
    {
      new: true,
    },
  ).exec();

  if (!user) {
    return null;
  }

  return this.toEntity(user);
}

async updateRole(
  userId: string,
  role: "jeweller" | "admin",
): Promise<User | null> {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      role,
    },
    {
      new: true,
    },
  ).exec();

  if (!user) {
    return null;
  }

  return this.toEntity(user);
}

async countActiveAdmins(): Promise<number> {
  return UserModel.countDocuments({
    role: "admin",
    isActive: true,
  }).exec();
}

private buildUserListQuery(filters: CountUsersFilters) {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    query.$or = [
      {
        name: {
          $regex: filters.search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: filters.search,
          $options: "i",
        },
      },
    ];
  }

  if (filters.role) {
    query.role = filters.role;
  }

  if (typeof filters.isActive === "boolean") {
    query.isActive = filters.isActive;
  }

  if (typeof filters.isEmailVerified === "boolean") {
    query.isEmailVerified = filters.isEmailVerified;
  }

  return query;
}
  private toEntity(user: IUserDocument): User {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}