import { Document, Model, Schema, Types, model, models } from "mongoose";

interface RateSnapshot {
  rate22KPerGram: number;
  rate22KPer8Gram: number;
  rate18KPerGram: number;
  rate18KPer8Gram: number;
  silverPerGram: number;
  silverPer8Gram: number;
  source: "market" | "admin" | "override";
  isMarketHoliday?: boolean;
  disclaimer?: string;
}

interface CampaignSnapshot {
  campaignId?: Types.ObjectId;
  title: string;
  offerText: string;
  badgeEmoji?: string;
  startDate: Date;
  endDate: Date;
  sourceAnnouncementId?: Types.ObjectId;
}

interface ChannelShareStatus {
  status: string;
  updatedAt?: Date;
  detail?: string;
}

export interface PosterDocument extends Document {
  shopId: Types.ObjectId;
  ownerUserId: Types.ObjectId;
  date: Date;
  templateId: Types.ObjectId;
  posterImageUrl: string;
  printAssetUrl?: string;
  rateSnapshot: RateSnapshot;
  campaignSnapshot?: CampaignSnapshot;
  offerText?: string;
  shareStatus: {
    email?: ChannelShareStatus;
    whatsapp?: ChannelShareStatus;
    instagram?: ChannelShareStatus;
    push?: ChannelShareStatus;
  };
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const rateSnapshotSchema = new Schema<RateSnapshot>(
  {
    rate22KPerGram: { type: Number, required: true, min: 0 },
    rate22KPer8Gram: { type: Number, required: true, min: 0 },
    rate18KPerGram: { type: Number, required: true, min: 0 },
    rate18KPer8Gram: { type: Number, required: true, min: 0 },
    silverPerGram: { type: Number, required: true, min: 0 },
    silverPer8Gram: { type: Number, required: true, min: 0 },
    source: {
      type: String,
      enum: ["market", "admin", "override"],
      required: true,
    },
    isMarketHoliday: Boolean,
    disclaimer: String,
  },
  { _id: false },
);

const campaignSnapshotSchema = new Schema<CampaignSnapshot>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "JewellerCampaign",
    },
    title: {
      type: String,
      required: true,
      trim: true,
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
    sourceAnnouncementId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
    },
  },
  { _id: false },
);

const channelShareStatusSchema = new Schema<ChannelShareStatus>(
  {
    status: {
      type: String,
      required: true,
      trim: true,
    },
    updatedAt: Date,
    detail: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const posterSchema = new Schema<PosterDocument>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "PosterTemplate",
      required: true,
    },
    posterImageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    printAssetUrl: {
      type: String,
      trim: true,
    },
    rateSnapshot: {
      type: rateSnapshotSchema,
      required: true,
    },
    campaignSnapshot: {
      type: campaignSnapshotSchema,
    },
    offerText: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    shareStatus: {
      email: channelShareStatusSchema,
      whatsapp: channelShareStatusSchema,
      instagram: channelShareStatusSchema,
      push: channelShareStatusSchema,
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    collection: "posters",
    timestamps: true,
  },
);

posterSchema.index({ shopId: 1, date: 1 });
posterSchema.index({ shopId: 1, templateId: 1, date: 1 });

export const PosterModel =
  (models.Poster as Model<PosterDocument> | undefined) ||
  model<PosterDocument>("Poster", posterSchema);

export default PosterModel;
