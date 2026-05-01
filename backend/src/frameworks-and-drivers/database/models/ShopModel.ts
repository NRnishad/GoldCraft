import mongoose, { Document, Model, Schema } from "mongoose";

export interface IShopDocument extends Document {
  ownerUserId: mongoose.Types.ObjectId;
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
    ownerUserId: {
      type: Schema.Types.ObjectId,
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
      default: true,
    },
    onboardingStep: {
      type: Number,
      default: 3,
    },
    profilePhotoKey: {
  type: String,
  trim: true,
},
profilePhotoUrl: {
  type: String,
  trim: true,
},
  },
  {
    timestamps: true,
  },
);

export const ShopModel =
  (mongoose.models.Shop as Model<IShopDocument> | undefined) ||
  mongoose.model<IShopDocument>("Shop", ShopSchema);