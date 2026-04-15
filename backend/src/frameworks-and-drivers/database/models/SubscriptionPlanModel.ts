import { Document, Model, Schema, Types, model, models } from "mongoose";

interface PlanFeatureFlags {
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

interface BillingOption {
  isActive: boolean;
  amountInr: number;
  compareAtAmountInr?: number;
  discountPercent?: number;
  discountLabel?: string;
  stripePriceId?: string;
}

export interface SubscriptionPlanDocument extends Document {
  code: string;
  name: string;
  description?: string;
  tier: "normal" | "pro" | "custom";
  isSeedPlan: boolean;
  isActive: boolean;
  isVisibleOnPricing: boolean;
  highlightOnPricing: boolean;
  sortOrder: number;
  featureFlags: PlanFeatureFlags;
  billingOptions: {
    monthly: BillingOption;
    yearly: BillingOption;
  };
  createdByUserId?: Types.ObjectId;
  updatedByUserId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const billingOptionSchema = new Schema<BillingOption>(
  {
    isActive: {
      type: Boolean,
      default: false,
    },
    amountInr: {
      type: Number,
      default: 0,
      min: 0,
    },
    compareAtAmountInr: {
      type: Number,
      min: 0,
    },
    discountPercent: {
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
  },
  { _id: false },
);

const featureFlagsSchema = new Schema<PlanFeatureFlags>(
  {
    posterEngineEnabled: { type: Boolean, default: true },
    aiPhotoshootEnabled: { type: Boolean, default: true },
    communityEnabled: { type: Boolean, default: true },
    publicProfileEnabled: { type: Boolean, default: true },
    widgetEnabled: { type: Boolean, default: true },
    referralsEnabled: { type: Boolean, default: true },
    whatsappIntegrationEnabled: { type: Boolean, default: false },
    instagramIntegrationEnabled: { type: Boolean, default: false },
    broadcastContactsEnabled: { type: Boolean, default: false },
    maxBroadcastContacts: { type: Number, min: 0 },
    supportPriority: { type: String, trim: true },
  },
  { _id: false },
);

const subscriptionPlanSchema = new Schema<SubscriptionPlanDocument>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
    },
    tier: {
      type: String,
      enum: ["normal", "pro", "custom"],
      required: true,
    },
    isSeedPlan: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVisibleOnPricing: {
      type: Boolean,
      default: true,
    },
    highlightOnPricing: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    featureFlags: {
      type: featureFlagsSchema,
      required: true,
      default: () => ({}),
    },
    billingOptions: {
      monthly: {
        type: billingOptionSchema,
        required: true,
        default: () => ({}),
      },
      yearly: {
        type: billingOptionSchema,
        required: true,
        default: () => ({}),
      },
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "subscriptionPlans",
    timestamps: true,
  },
);

subscriptionPlanSchema.index({ code: 1 }, { unique: true });
subscriptionPlanSchema.index({ isActive: 1, isVisibleOnPricing: 1, sortOrder: 1 });

export const SubscriptionPlanModel =
  (models.SubscriptionPlan as Model<SubscriptionPlanDocument> | undefined) ||
  model<SubscriptionPlanDocument>("SubscriptionPlan", subscriptionPlanSchema);

export default SubscriptionPlanModel;
