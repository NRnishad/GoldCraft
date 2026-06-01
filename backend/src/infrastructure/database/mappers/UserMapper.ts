import { injectable } from "inversify";
import { User, UserRole, AuthProvider } from "@domain/entities/User.entity";
import { Email } from "@domain/value-objects/Email.vo";
import { Result } from "@domain/shared/Result";
import { IDbMapper } from "@domain/mappers/IDbMapper";
import { IUserDocument } from "../models/UserModel";

@injectable()
export class UserMapper implements IDbMapper<User, IUserDocument> {
  public toDomain(doc: IUserDocument): Result<User> {
    const emailResult = Email.create(doc.email);
    if (emailResult.isFailure) {
      return Result.fail<User>(emailResult.getError());
    }

    return User.create({
      id: String(doc._id),
      name: doc.name,
      email: emailResult.getValue(),
      passwordHash: doc.passwordHash,
      role: doc.role as UserRole,
      authProvider: (doc.googleId ? AuthProvider.GOOGLE : (doc.authProvider as AuthProvider || AuthProvider.LOCAL)),
      googleId: doc.googleId,
      isActive: doc.isActive,
      isEmailVerified: doc.isEmailVerified,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public toPersistence(entity: User): any {
    return {
      _id: entity.getId(),
      name: entity.getName(),
      email: entity.getEmail().getValue(),
      passwordHash: entity.getPasswordHash(),
      role: entity.getRole(),
      authProvider: entity.getAuthProvider(),
      googleId: entity.getGoogleId(),
      isActive: entity.getIsActive(),
      isEmailVerified: entity.getIsEmailVerified(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
