import { UserModel } from "../models/UserModel";
import type {
  IUserRepository,
  LoginUser,
  PublicUser,
} from "../../../use-cases/auth/LoginUseCase/IUserRepository";

function toLoginUser(doc: any): LoginUser {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.role,
  };
}

function toPublicUser(doc: any): PublicUser {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
  };
}

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<LoginUser | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    return user ? toLoginUser(user) : null;
  }

  async findById(userId: string): Promise<PublicUser | null> {
    const user = await UserModel.findById(userId).lean();
    return user ? toPublicUser(user) : null;
  }

  async updateLastLogin(userId: string, date: Date): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { lastLoginAt: date });
  }
}

