import mongoose, { Schema, Document } from 'mongoose';
import { IGoldRate } from '../../../entities/GoldRate';

export interface GoldRateDocument extends Omit<IGoldRate, 'date' | 'verifiedAt' | 'createdAt'>, Document {
  date: Date;
  verifiedAt?: Date;
  createdAt: Date;
}

const GoldRateSchema: Schema = new Schema({
  date: { type: Date, required: true, unique: true },
  rate22KPerGram: { type: Number, required: true },
  rate22KPer8Gram: { type: Number, required: true },
  rate18KPerGram: { type: Number, required: true },
  rate18KPer8Gram: { type: Number, required: true },
  silverPerGram: { type: Number, required: true },
  silverPer8Gram: { type: Number, required: true },
  source: { type: String, enum: ['market', 'admin'], required: true },
  isMarketHoliday: { type: Boolean, required: true, default: false },
  verifiedAt: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now, required: true }
});

export const GoldRateModel = mongoose.model<GoldRateDocument>('GoldRate', GoldRateSchema);