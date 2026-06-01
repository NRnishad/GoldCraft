import { injectable, inject } from "inversify";
import { BaseRepository } from "./base/BaseRepository";
import { User } from "@domain/entities/User.entity";
import { Email } from "@domain/value-objects/Email.vo";
import { IUserRepository, ListUsersFilters, CountUsersFilters } from "@domain/repositories/IUserRepository";
import { Result } from "@domain/shared/Result";
import { UserModel, IUserDocument } from "../database/models/UserModel";
import { IDbMapper } from "@domain/mappers/IDbMapper";
import { TYPES } from "@di/types.di";

@injectable()
export class UserRepository
  extends BaseRepository<User, IUserDocument, ListUsersFilters>
  implements IUserRepository
{
  constructor(
    @inject(TYPES.UserMapper)
    readonly mapper: IDbMapper<User, IUserDocument>,
  ) {
    super(UserModel, mapper);
  }

  public async findByEmail(email: Email): Promise<Result<User | null>> {
    try {
      const doc = await UserModel.findOne({ email: email.getValue() }).exec();
      if (!doc) {
        return Result.ok<null>(null);
      }
      const domainResult = this.mapper.toDomain(doc);
      if (domainResult.isFailure) {
        return Result.fail<User | null>(domainResult.getError());
      }
      return Result.ok<User | null>(domainResult.getValue());
    } catch (err: any) {
      return Result.fail<User | null>(`Failed to find user by email: ${err.message}`);
    }
  }

  public async countActiveAdmins(): Promise<Result<number>> {
    try {
      const count = await UserModel.countDocuments({ role: "admin", isActive: true }).exec();
      return Result.ok(count);
    } catch (err: any) {
      return Result.fail<number>(`Failed to count active admins: ${err.message}`);
    }
  }

  public async countUsers(filters: CountUsersFilters): Promise<Result<number>> {
    try {
      const query = this.buildFiltersQuery(filters);
      const count = await UserModel.countDocuments(query).exec();
      return Result.ok(count);
    } catch (err: any) {
      return Result.fail<number>(`Failed to count users: ${err.message}`);
    }
  }

  public async save(user: User): Promise<Result<User>> {
    try {
      const persistence = this.mapper.toPersistence(user);
      const docId = persistence._id;
      delete persistence._id;

      // Upsert document
      const doc = await UserModel.findByIdAndUpdate(
        docId,
        { $set: persistence },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).exec();

      return this.mapper.toDomain(doc);
    } catch (err: any) {
      return Result.fail<User>(`Failed to save user: ${err.message}`);
    }
  }

  // Override findAll to support custom search, pagination, and role filters
  public async findAll(filters: ListUsersFilters): Promise<Result<User[]>> {
    try {
      const query = this.buildFiltersQuery(filters);
      const docs = await UserModel.find(query)
        .sort({ createdAt: -1 })
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit)
        .exec();

      const entities: User[] = [];
      for (const doc of docs) {
        const domainResult = this.mapper.toDomain(doc);
        if (domainResult.isFailure) {
          console.warn(`[UserRepository] Skipping corrupted user document ${doc._id}: ${domainResult.getError()}`);
          continue;
        }
        entities.push(domainResult.getValue());
      }
      return Result.ok(entities);
    } catch (err: any) {
      return Result.fail<User[]>(`Failed to list users: ${err.message}`);
    }
  }

  private buildFiltersQuery(filters: CountUsersFilters) {
    const query: any = {};

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.role) {
      query.role = filters.role;
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.isEmailVerified !== undefined) {
      query.isEmailVerified = filters.isEmailVerified;
    }

    return query;
  }
}
