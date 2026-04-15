import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface NotificationLogDocument extends Document {
  userId: Types.ObjectId;
  shopId?: Types.ObjectId;
  type: string;
  channel: "push" | "email" | "inapp";
  status: "sent" | "failed" | "suppressed";
  title: string;
  message: string;
  relatedPosterId?: Types.ObjectId;
  createdAt: Date;
}

const notificationLogSchema = new Schema<NotificationLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      enum: ["push", "email", "inapp"],
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "failed", "suppressed"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    relatedPosterId: {
      type: Schema.Types.ObjectId,
      ref: "Poster",
    },
  },
  {
    collection: "notificationLogs",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

notificationLogSchema.index({ userId: 1, type: 1, channel: 1, createdAt: -1 });

export const NotificationLogModel =
  (models.NotificationLog as Model<NotificationLogDocument> | undefined) ||
  model<NotificationLogDocument>("NotificationLog", notificationLogSchema);

export default NotificationLogModel;
