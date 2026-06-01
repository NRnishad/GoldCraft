import mongoose, { Schema, Document, Model } from "mongoose";

export interface JewellerRateOverrideDocument extends Document<string> {
  _id: string;
  shopId: string;          // UUID string — matches Shop._id
  date: Date;
  rate22KPerGram?: number;
  rate18KPerGram?: number;
  silverPerGram?: number;
  createdByUserId: string; // UUID string — matches User._id
  createdAt: Date;
  updatedAt: Date;
}

const JewellerRateOverrideSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    shopId: {
      type: String,   // was Schema.Types.ObjectId — changed to String
      required: true,
      ref: "Shop",
    },
    date: { type: Date, required: true },
    rate22KPerGram: { type: Number, required: false },
    rate18KPerGram: { type: Number, required: false },
    silverPerGram: { type: Number, required: false },
    createdByUserId: {
      type: String,   // was Schema.Types.ObjectId — changed to String
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    _id: false, // Disable auto ObjectId generation
  },
);

// A shop can only have one override per specific date
JewellerRateOverrideSchema.index({ shopId: 1, date: 1 }, { unique: true });

export const JewellerRateOverrideModel =
  (mongoose.models.JewellerRateOverride as Model<JewellerRateOverrideDocument> | undefined) ||
  mongoose.model<JewellerRateOverrideDocument>(
    "JewellerRateOverride",
    JewellerRateOverrideSchema,
  );
