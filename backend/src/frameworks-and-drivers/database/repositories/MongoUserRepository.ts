import UserModel, { type UserDocument } from "../models/UserModel";

type CreateUserData = Pick<
  UserDocument,
  "name" | "email" | "passwordHash" | "referralCode"
> &
  Partial<
    Pick<
      UserDocument,
      | "role"
      | "isActive"
      | "isEmailVerified"
      | "fcmToken"
      | "lastLoginAt"
      | "passwordChangedAt"
      | "authVersion"
    >
  >;

type UpdateUserData = Partial<
  Pick<
    UserDocument,
    | "name"
    | "email"
    | "passwordHash"
    | "role"
    | "isActive"
    | "isEmailVerified"
    | "fcmToken"
    | "lastLoginAt"
    | "passwordChangedAt"
    | "authVersion"
    | "referralCode"
  >
>;

const removeUndefinedValues = <T extends Record<string, unknown>>(data: T) =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<T>;

/**
 * Mongo-backed user repository used by auth and profile use cases.
 * It only performs persistence operations against the users collection.
 */
export class MongoUserRepository {
  async findByEmail(email: string) {
    return UserModel.findOne({
      email: email.trim().toLowerCase(),
    })
      .select("+passwordHash")
      .lean()
      .exec();
  }

  async findByReferralCode(referralCode: string) {
    return UserModel.findOne({
      referralCode: referralCode.trim().toUpperCase(),
    })
      .lean()
      .exec();
  }

  async findById(id: string) {
    return UserModel.findById(id).select("+passwordHash").lean().exec();
  }

  async create(data: CreateUserData) {
    const created = await UserModel.create({
      ...data,
      email: data.email.trim().toLowerCase(),
    });

    return UserModel.findById(created._id).lean().exec();
  }

  async updateById(id: string, data: UpdateUserData) {
    const update = removeUndefinedValues({
      ...data,
      email: data.email?.trim().toLowerCase(),
    });

    return UserModel.findByIdAndUpdate(id, { $set: update }, { new: true })
      .lean()
      .exec();
  }

  async markEmailVerified(email: string) {
    return UserModel.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { $set: { isEmailVerified: true } },
      { new: true },
    )
      .lean()
      .exec();
  }

  async updateLastLogin(userId: string, date: Date) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $set: { lastLoginAt: date } },
      { new: true },
    )
      .lean()
      .exec();
  }

  async updatePassword(
    userId: string,
    passwordHash: string,
    passwordChangedAt: Date,
  ) {
    return UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          passwordHash,
          passwordChangedAt,
        },
        $inc: {
          authVersion: 1,
        },
      },
      { new: true },
    )
      .select("+passwordHash")
      .lean()
      .exec();
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $set: { fcmToken: fcmToken.trim() } },
      { new: true },
    )
      .lean()
      .exec();
  }
}

export default MongoUserRepository;
