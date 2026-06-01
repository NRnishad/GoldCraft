import mongoose, { Document, Model, Schema } from "mongoose";

export interface IShopDocument extends Document<string> {
  _id: string;
  ownerUserId: string; // UUID string — matches User._id which is also a string UUID
  shopName: string;
  phone: string;
  city: string;
  address: string;
  tagline?: string;
  onboardingComplete: boolean;
  onboardingStep: number;
  createdAt: Date;
  updatedAt: Date;
  profilePhotoKey?: string;
  profilePhotoUrl?: string;
}

const ShopSchema = new Schema<IShopDocument>(
  {
    _id: {
      type: String,
      required: true,
    },
    ownerUserId: {
      type: String,   // was Schema.Types.ObjectId — changed to String to match User UUID _id
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    onboardingStep: {
      type: Number,
      default: 1,
    },
    profilePhotoKey: {
      type: String,
      trim: true,
    },
    profilePhotoUrl: {
      type: String,
      trim: true,
      default: "https://heerabhai.com/wp-content/uploads/2025/01/necklace.png",
    },
  },
  {
    timestamps: true,
    _id: false, // Disable auto ObjectId generation
  },
);

export const ShopModel =
  (mongoose.models.Shop as Model<IShopDocument> | undefined) ||
  mongoose.model<IShopDocument>("Shop", ShopSchema);
