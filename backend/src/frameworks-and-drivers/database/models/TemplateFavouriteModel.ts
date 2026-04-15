import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface TemplateFavouriteDocument extends Document {
  shopId: Types.ObjectId;
  templateId: Types.ObjectId;
  createdAt: Date;
}

const templateFavouriteSchema = new Schema<TemplateFavouriteDocument>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "PosterTemplate",
      required: true,
    },
  },
  {
    collection: "templateFavourites",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

templateFavouriteSchema.index({ shopId: 1, templateId: 1 }, { unique: true });

export const TemplateFavouriteModel =
  (models.TemplateFavourite as Model<TemplateFavouriteDocument> | undefined) ||
  model<TemplateFavouriteDocument>("TemplateFavourite", templateFavouriteSchema);

export default TemplateFavouriteModel;
