import { Document, Model, Schema, model, models } from "mongoose";

export interface GoldRateDocument extends Document {
  date: Date;
  rate22KPerGram: number;
  rate22KPer8Gram: number;
  rate18KPerGram: number;
  rate18KPer8Gram: number;
  silverPerGram: number;
  silverPer8Gram: number;
  source: "market" | "admin";
  isMarketHoliday: boolean;
  verifiedAt: Date;
  createdAt: Date;
}

const goldRateSchema = new Schema<GoldRateDocument>(
  {
    date: {
      type: Date,
      required: true,
    },
    rate22KPerGram: {
      type: Number,
      required: true,
      min: 0,
    },
    rate22KPer8Gram: {
      type: Number,
      required: true,
      min: 0,
    },
    rate18KPerGram: {
      type: Number,
      required: true,
      min: 0,
    },
    rate18KPer8Gram: {
      type: Number,
      required: true,
      min: 0,
    },
    silverPerGram: {
      type: Number,
      required: true,
      min: 0,
    },
    silverPer8Gram: {
      type: Number,
      required: true,
      min: 0,
    },
    source: {
      type: String,
      enum: ["market", "admin"],
      required: true,
    },
    isMarketHoliday: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "goldRates",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

goldRateSchema.index({ date: 1 }, { unique: true });

export const GoldRateModel =
  (models.GoldRate as Model<GoldRateDocument> | undefined) ||
  model<GoldRateDocument>("GoldRate", goldRateSchema);

export default GoldRateModel;
