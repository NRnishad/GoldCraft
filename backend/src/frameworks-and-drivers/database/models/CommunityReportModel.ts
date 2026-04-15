import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface CommunityReportDocument extends Document {
  targetType: "post" | "comment";
  targetId: Types.ObjectId;
  reporterUserId: Types.ObjectId;
  reason: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  reviewedByUserId?: Types.ObjectId;
  resolutionNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const communityReportSchema = new Schema<CommunityReportDocument>(
  {
    targetType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reporterUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["open", "reviewing", "resolved", "dismissed"],
      required: true,
      default: "open",
    },
    reviewedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resolutionNote: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    collection: "communityReports",
    timestamps: true,
  },
);

communityReportSchema.index({ status: 1, targetType: 1, createdAt: -1 });

export const CommunityReportModel =
  (models.CommunityReport as Model<CommunityReportDocument> | undefined) ||
  model<CommunityReportDocument>("CommunityReport", communityReportSchema);

export default CommunityReportModel;
