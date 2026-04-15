import { Document, Model, Schema, model, models } from "mongoose";

export interface CronJobRunDocument extends Document {
  jobName: string;
  scheduledFor: Date;
  startedAt?: Date;
  endedAt?: Date;
  status: "success" | "partial" | "failed" | "skipped";
  processedCount: number;
  failedCount: number;
  summary: string;
  errorSample?: string;
  createdAt: Date;
}

const cronJobRunSchema = new Schema<CronJobRunDocument>(
  {
    jobName: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledFor: {
      type: Date,
      required: true,
    },
    startedAt: Date,
    endedAt: Date,
    status: {
      type: String,
      enum: ["success", "partial", "failed", "skipped"],
      required: true,
    },
    processedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    errorSample: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "cronJobRuns",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

cronJobRunSchema.index({ jobName: 1, scheduledFor: -1, status: 1 });

export const CronJobRunModel =
  (models.CronJobRun as Model<CronJobRunDocument> | undefined) ||
  model<CronJobRunDocument>("CronJobRun", cronJobRunSchema);

export default CronJobRunModel;
