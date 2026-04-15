import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface NotificationSettingsDocument extends Document {
  userId: Types.ObjectId;
  posterReady: boolean;
  rateUpdated: boolean;
  rateUpdatedEmail: boolean;
  campaignLaunched: boolean;
  trialExpiry: boolean;
  subscriptionRenewed: boolean;
  communityReplies: boolean;
  shareFailures: boolean;
  adminAnnouncements: boolean;
  referralConverted: boolean;
  updatedAt: Date;
}

const notificationSettingsSchema = new Schema<NotificationSettingsDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    posterReady: { type: Boolean, default: true },
    rateUpdated: { type: Boolean, default: true },
    rateUpdatedEmail: { type: Boolean, default: false },
    campaignLaunched: { type: Boolean, default: true },
    trialExpiry: { type: Boolean, default: true },
    subscriptionRenewed: { type: Boolean, default: true },
    communityReplies: { type: Boolean, default: true },
    shareFailures: { type: Boolean, default: true },
    adminAnnouncements: { type: Boolean, default: true },
    referralConverted: { type: Boolean, default: true },
  },
  {
    collection: "notificationSettings",
    timestamps: { createdAt: false, updatedAt: true },
  },
);

notificationSettingsSchema.index({ userId: 1 }, { unique: true });

export const NotificationSettingsModel =
  (models.NotificationSettings as
    | Model<NotificationSettingsDocument>
    | undefined) ||
  model<NotificationSettingsDocument>(
    "NotificationSettings",
    notificationSettingsSchema,
  );

export default NotificationSettingsModel;
