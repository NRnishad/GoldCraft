import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface CampaignDocument extends Document {
  title: string;
  message: string;
  suggestedOfferText?: string;
  startDate: Date;
  endDate: Date;
  status: "draft" | "active" | "ended";
  createdByUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<CampaignDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    suggestedOfferText: {
      type: String,
      trim: true,
      maxlength: 200,
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
      enum: ["draft", "active", "ended"],
      required: true,
      default: "draft",
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: "campaigns",
    timestamps: true,
  },
);

campaignSchema.index({ status: 1, startDate: 1, endDate: 1 });

export const CampaignModel =
  (models.Campaign as Model<CampaignDocument> | undefined) ||
  model<CampaignDocument>("Campaign", campaignSchema);

export default CampaignModel;
