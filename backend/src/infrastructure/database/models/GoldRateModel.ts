import mongoose, { Schema, Document, Model } from "mongoose";

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
  verifiedAt?: Date;
  createdAt: Date;
}

const GoldRateSchema: Schema = new Schema({
  date: { type: Date, required: true, unique: true, index: true },
  rate22KPerGram: { type: Number, required: true },
  rate22KPer8Gram: { type: Number, required: true },
  rate18KPerGram: { type: Number, required: true },
  rate18KPer8Gram: { type: Number, required: true },
  silverPerGram: { type: Number, required: true },
  silverPer8Gram: { type: Number, required: true },
  source: { type: String, enum: ["market", "admin"], required: true },
  isMarketHoliday: { type: Boolean, required: true, default: false },
  verifiedAt: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now, required: true },
});

export const GoldRateModel =
  (mongoose.models.GoldRate as Model<GoldRateDocument> | undefined) ||
  mongoose.model<GoldRateDocument>("GoldRate", GoldRateSchema);
