import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface JewellerCampaignDocument extends Document {
  shopId: Types.ObjectId;
  createdByUserId: Types.ObjectId;
  title: string;
  offerText: string;
  badgeEmoji?: string;
  startDate: Date;
  endDate: Date;
  status: "scheduled" | "active" | "completed" | "cancelled";
  sourceAnnouncementId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const jewellerCampaignSchema = new Schema<JewellerCampaignDocument>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    offerText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    badgeEmoji: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      required: true,
      default: "scheduled",
    },
    sourceAnnouncementId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
    },
  },
  {
    collection: "jewellerCampaigns",
    timestamps: true,
  },
);

jewellerCampaignSchema.index({ shopId: 1, status: 1, startDate: 1, endDate: 1 });

export const JewellerCampaignModel =
  (models.JewellerCampaign as Model<JewellerCampaignDocument> | undefined) ||
  model<JewellerCampaignDocument>("JewellerCampaign", jewellerCampaignSchema);

export default JewellerCampaignModel;
