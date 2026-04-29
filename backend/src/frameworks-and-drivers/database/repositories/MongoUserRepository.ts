import { User } from "@entities/User";
import { IRegisterUserRepository } from "@use-cases/auth/RegisterUserUseCase/IUserRepository";
import { ILoginUserRepository } from "@use-cases/auth/LoginUserUseCase/IUserRepository";
import { IGetCurrentUserRepository } from "@use-cases/auth/GetCurrentUserUseCase/IUserRepository";
import { IForgotPasswordUserRepository } from "@use-cases/auth/ForgotPasswordUseCase/IUserRepository";
import { IResetPasswordUserRepository } from "@use-cases/auth/ResetPasswordUseCase/IUserRepository";
import { IVerifyEmailUserRepository } from "../../../use-cases/auth/VerifyEmailUseCase/IUserRepository";
import { IResendEmailVerificationUserRepository } from "../../../use-cases/auth/ResendEmailVerificationUseCase/IUserRepository";
import { UserModel, IUserDocument } from "../models/UserModel";

export class MongoUserRepository
  implements
    IRegisterUserRepository,
    ILoginUserRepository,
    IGetCurrentUserRepository,
    IVerifyEmailUserRepository,
    IResendEmailVerificationUserRepository,
      IForgotPasswordUserRepository,
    IResetPasswordUserRepository
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