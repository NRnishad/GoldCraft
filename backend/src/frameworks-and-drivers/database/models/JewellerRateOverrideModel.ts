import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface JewellerRateOverrideDocument extends Document {
  shopId: Types.ObjectId;
  date: Date;
  rate22KPerGram?: number;
  rate18KPerGram?: number;
  silverPerGram?: number;
  createdByUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const jewellerRateOverrideSchema = new Schema<JewellerRateOverrideDocument>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    rate22KPerGram: {
      type: Number,
      min: 0,
    },
    rate18KPerGram: {
      type: Number,
      min: 0,
    },
    silverPerGram: {
      type: Number,
      min: 0,
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: "jewellerRateOverrides",
    timestamps: true,
  },
);

jewellerRateOverrideSchema.index({ shopId: 1, date: 1 }, { unique: true });

export const JewellerRateOverrideModel =
  (models.JewellerRateOverride as
    | Model<JewellerRateOverrideDocument>
    | undefined) ||
  model<JewellerRateOverrideDocument>(
    "JewellerRateOverride",
    jewellerRateOverrideSchema,
  );

export default JewellerRateOverrideModel;
