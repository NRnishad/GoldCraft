import { Document, Model, Schema, model, models } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "jeweller";
  isActive: boolean;
  isEmailVerified: boolean;
  fcmToken?: string;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  authVersion: number;
  referralCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "jeweller"],
      required: true,
      default: "jeweller",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    fcmToken: {
      type: String,
      trim: true,
    },
    lastLoginAt: Date,
    passwordChangedAt: Date,
    authVersion: {
      type: Number,
      default: 0,
      min: 0,
    },
    referralCode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ referralCode: 1 }, { unique: true });

export const UserModel =
  (models.User as Model<UserDocument> | undefined) ||
  model<UserDocument>("User", userSchema);

export default UserModel;
