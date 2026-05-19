import mongoose, { Schema, Document } from 'mongoose';
import { IJewellerRateOverride } from '../../../entities/JewellerRateOverride';

export interface JewellerRateOverrideDocument extends Omit<IJewellerRateOverride, 'shopId' | 'createdByUserId'>, Document {
  shopId: mongoose.Types.ObjectId;
  createdByUserId: mongoose.Types.ObjectId;
}

const JewellerRateOverrideSchema: Schema = new Schema({
  shopId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
  date: { type: Date, required: true },
  rate22KPerGram: { type: Number, required: false },
  rate18KPerGram: { type: Number, required: false },
  silverPerGram: { type: Number, required: false },
  createdByUserId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true }
});

// A shop can only have one override per specific date
JewellerRateOverrideSchema.index({ shopId: 1, date: 1 }, { unique: true });

export const JewellerRateOverrideModel = mongoose.model<JewellerRateOverrideDocument>('JewellerRateOverride', JewellerRateOverrideSchema);