import { Document, Model, Schema, Types, model, models } from "mongoose";

interface AiShot {
  shotType: "model" | "ecommerce" | "creative";
  imageUrl?: string;
  status?: "queued" | "running" | "completed" | "failed";
  errorMessage?: string;
}

interface ReplicateJobIds {
  model?: string;
  ecommerce?: string;
  creative?: string;
}

export interface AiPhotoSessionDocument extends Document {
  userId: Types.ObjectId;
  rawImageUrl: string;
  customPrompt?: string;
  jewelleryType: string;
  status: "queued" | "running" | "completed" | "failed";
  shots: AiShot[];
  replicateJobIds?: ReplicateJobIds;
  createdAt: Date;
  updatedAt: Date;
}

const aiShotSchema = new Schema<AiShot>(
  {
    shotType: {
      type: String,
      enum: ["model", "ecommerce", "creative"],
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
    },
    errorMessage: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const replicateJobIdsSchema = new Schema<ReplicateJobIds>(
  {
    model: String,
    ecommerce: String,
    creative: String,
  },
  { _id: false },
);

const aiPhotoSessionSchema = new Schema<AiPhotoSessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rawImageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    customPrompt: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    jewelleryType: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
      required: true,
      default: "queued",
    },
    shots: {
      type: [aiShotSchema],
      default: [],
    },
    replicateJobIds: {
      type: replicateJobIdsSchema,
    },
  },
  {
    collection: "aiPhotoSessions",
    timestamps: true,
  },
);

aiPhotoSessionSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const AiPhotoSessionModel =
  (models.AiPhotoSession as Model<AiPhotoSessionDocument> | undefined) ||
  model<AiPhotoSessionDocument>("AiPhotoSession", aiPhotoSessionSchema);

export default AiPhotoSessionModel;
