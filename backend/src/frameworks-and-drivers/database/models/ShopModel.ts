import { Document, Model, Schema, Types, model, models } from "mongoose";

type QrTargetType = "whatsapp" | "profile" | "custom";

export interface ShopDocument extends Document {
  ownerUserId: Types.ObjectId;
  shopName: string;
  logoUrl?: string;
  phone?: string;
  address?: string;
  city?: string;
  tagline?: string;
  gstin?: string;
  showGoldRate: boolean;
  showSilverRate: boolean;
  defaultTemplateId?: Types.ObjectId;
  qrCodeUrl?: string;
  showQrOnPoster: boolean;
  qrTargetType: QrTargetType;
  qrCustomUrl?: string;
  whatsappWabaId?: string;
  whatsappPhoneNumberId?: string;
  whatsappAccessToken?: string;
  whatsappAutoShare: boolean;
  whatsappCaptionTemplate?: string;
  whatsappIsConnected: boolean;
  whatsappLastConnectedAt?: Date;
  instagramIgUserId?: string;
  instagramAccessToken?: string;
  instagramTokenExpiresAt?: Date;
  instagramAutoPost: boolean;
  instagramCaptionTemplate?: string;
  instagramHashtagPresets: string[];
  instagramIsConnected: boolean;
  instagramLastConnectedAt?: Date;
  widgetToken: string;
  isPublicProfileEnabled: boolean;
  onboardingComplete: boolean;
  onboardingStep: number;
  createdAt: Date;
  updatedAt: Date;
}

const shopSchema = new Schema<ShopDocument>(
  {
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    gstin: {
      type: String,
      trim: true,
    },
    showGoldRate: {
      type: Boolean,
      default: true,
    },
    showSilverRate: {
      type: Boolean,
      default: true,
    },
    defaultTemplateId: {
      type: Schema.Types.ObjectId,
      ref: "PosterTemplate",
    },
    qrCodeUrl: {
      type: String,
      trim: true,
    },
    showQrOnPoster: {
      type: Boolean,
      default: false,
    },
    qrTargetType: {
      type: String,
      enum: ["whatsapp", "profile", "custom"],
      default: "profile",
    },
    qrCustomUrl: {
      type: String,
      trim: true,
    },
    whatsappWabaId: {
      type: String,
      trim: true,
    },
    whatsappPhoneNumberId: {
      type: String,
      trim: true,
    },
    whatsappAccessToken: {
      type: String,
      select: false,
    },
    whatsappAutoShare: {
      type: Boolean,
      default: false,
    },
    whatsappCaptionTemplate: {
      type: String,
      trim: true,
    },
    whatsappIsConnected: {
      type: Boolean,
      default: false,
    },
    whatsappLastConnectedAt: Date,
    instagramIgUserId: {
      type: String,
      trim: true,
    },
    instagramAccessToken: {
      type: String,
      select: false,
    },
    instagramTokenExpiresAt: Date,
    instagramAutoPost: {
      type: Boolean,
      default: false,
    },
    instagramCaptionTemplate: {
      type: String,
      trim: true,
    },
    instagramHashtagPresets: {
      type: [String],
      default: [],
    },
    instagramIsConnected: {
      type: Boolean,
      default: false,
    },
    instagramLastConnectedAt: Date,
    widgetToken: {
      type: String,
      required: true,
      trim: true,
    },
    isPublicProfileEnabled: {
      type: Boolean,
      default: true,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    onboardingStep: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    },
  },
  {
    collection: "shops",
    timestamps: true,
  },
);

shopSchema.index({ ownerUserId: 1 }, { unique: true });
shopSchema.index({ widgetToken: 1 }, { unique: true });

export const ShopModel =
  (models.Shop as Model<ShopDocument> | undefined) ||
  model<ShopDocument>("Shop", shopSchema);

export default ShopModel;
