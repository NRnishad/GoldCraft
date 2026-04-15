import { Document, Model, Schema, model, models } from "mongoose";

export interface PosterTemplateDocument extends Document {
  name: string;
  category:
    | "traditional"
    | "festive"
    | "premium"
    | "minimal"
    | "wedding"
    | "daily";
  backgroundUrl: string;
  layoutPreset: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const posterTemplateSchema = new Schema<PosterTemplateDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      enum: ["traditional", "festive", "premium", "minimal", "wedding", "daily"],
      required: true,
    },
    backgroundUrl: {
      type: String,
      required: true,
      trim: true,
    },
    layoutPreset: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "posterTemplates",
    timestamps: true,
  },
);

posterTemplateSchema.index({ isActive: 1, category: 1, sortOrder: 1 });

export const PosterTemplateModel =
  (models.PosterTemplate as Model<PosterTemplateDocument> | undefined) ||
  model<PosterTemplateDocument>("PosterTemplate", posterTemplateSchema);

export default PosterTemplateModel;
