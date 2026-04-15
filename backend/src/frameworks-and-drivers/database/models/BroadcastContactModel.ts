import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface BroadcastContactDocument extends Document {
  shopId: Types.ObjectId;
  name: string;
  phone: string;
  isActive: boolean;
  addedAt: Date;
  updatedAt: Date;
}

const broadcastContactSchema = new Schema<BroadcastContactDocument>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "broadcastContacts",
    timestamps: { createdAt: "addedAt", updatedAt: true },
  },
);

broadcastContactSchema.index({ shopId: 1, isActive: 1 });
broadcastContactSchema.index({ shopId: 1, name: 1 });

export const BroadcastContactModel =
  (models.BroadcastContact as Model<BroadcastContactDocument> | undefined) ||
  model<BroadcastContactDocument>("BroadcastContact", broadcastContactSchema);

export default BroadcastContactModel;
