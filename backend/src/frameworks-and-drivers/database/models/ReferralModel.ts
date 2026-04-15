import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface ReferralDocument extends Document {
  referrerId: Types.ObjectId;
  referredUserId: Types.ObjectId;
  code: string;
  status: "pending" | "converted" | "expired";
  rewardGranted: boolean;
  convertedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<ReferralDocument>(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "converted", "expired"],
      required: true,
      default: "pending",
    },
    rewardGranted: {
      type: Boolean,
      default: false,
    },
    convertedAt: Date,
  },
  {
    collection: "referrals",
    timestamps: true,
  },
);

referralSchema.index({ referrerId: 1, status: 1, createdAt: -1 });

export const ReferralModel =
  (models.Referral as Model<ReferralDocument> | undefined) ||
  model<ReferralDocument>("Referral", referralSchema);

export default ReferralModel;
