import { Document, Model, Schema, Types, model, models } from "mongoose";

interface PriceSnapshot {
  amountInr: number;
  compareAtAmountInr?: number;
  discountLabel?: string;
  stripePriceId?: string;
  currency: string;
}

interface FeatureSnapshot {
  posterEngineEnabled: boolean;
  aiPhotoshootEnabled: boolean;
  communityEnabled: boolean;
  publicProfileEnabled: boolean;
  widgetEnabled: boolean;
  referralsEnabled: boolean;
  whatsappIntegrationEnabled: boolean;
  instagramIntegrationEnabled: boolean;
  broadcastContactsEnabled: boolean;
  maxBroadcastContacts?: number;
  supportPriority?: string;
}

export interface SubscriptionDocument extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  billingCycle: "monthly" | "yearly";
  planCodeSnapshot: string;
  planNameSnapshot: string;
  planVersionSnapshot: number;
  priceSnapshot: PriceSnapshot;
  featureSnapshot: FeatureSnapshot;
  status: "trial" | "active" | "past_due" | "expired" | "cancelled";
  trialStartDate?: Date;
  trialEndDate?: Date;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  cancelAtPeriodEnd: boolean;
  pendingPlanId?: Types.ObjectId;
  pendingBillingCycle?: "monthly" | "yearly";
  pendingChangeAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const priceSnapshotSchema = new Schema<PriceSnapshot>(
  {
    amountInr: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtAmountInr: {
      type: Number,
      min: 0,
    },
    discountLabel: {
      type: String,
      trim: true,
    },
    stripePriceId: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
      default: "INR",
    },
  },
  { _id: false },
);

const featureSnapshotSchema = new Schema<FeatureSnapshot>(
  {
    posterEngineEnabled: { type: Boolean, required: true },
    aiPhotoshootEnabled: { type: Boolean, required: true },
    communityEnabled: { type: Boolean, required: true },
    publicProfileEnabled: { type: Boolean, required: true },
    widgetEnabled: { type: Boolean, required: true },
    referralsEnabled: { type: Boolean, required: true },
    whatsappIntegrationEnabled: { type: Boolean, required: true },
    instagramIntegrationEnabled: { type: Boolean, required: true },
    broadcastContactsEnabled: { type: Boolean, required: true },
    maxBroadcastContacts: { type: Number, min: 0 },
    supportPriority: { type: String, trim: true },
  },
  { _id: false },
);

const subscriptionSchema = new Schema<SubscriptionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    planCodeSnapshot: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    planNameSnapshot: {
      type: String,
      required: true,
      trim: true,
    },
    planVersionSnapshot: {
      type: Number,
      required: true,
      min: 1,
    },
    priceSnapshot: {
      type: priceSnapshotSchema,
      required: true,
    },
    featureSnapshot: {
      type: featureSnapshotSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["trial", "active", "past_due", "expired", "cancelled"],
      required: true,
      default: "trial",
    },
    trialStartDate: Date,
    trialEndDate: Date,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    stripeCustomerId: {
      type: String,
      trim: true,
    },
    stripeSubscriptionId: {
      type: String,
      trim: true,
    },
    stripePriceId: {
      type: String,
      trim: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    pendingPlanId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
    },
    pendingBillingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
    },
    pendingChangeAt: Date,
  },
  {
    collection: "subscriptions",
    timestamps: true,
  },
);

subscriptionSchema.index({ userId: 1 }, { unique: true });
subscriptionSchema.index({ planId: 1, billingCycle: 1, status: 1 });

export const SubscriptionModel =
  (models.Subscription as Model<SubscriptionDocument> | undefined) ||
  model<SubscriptionDocument>("Subscription", subscriptionSchema);

export default SubscriptionModel;
